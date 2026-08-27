import {
  bountiesToPersons,
  bounty,
  bountyCreateSchema,
  person,
  season,
  pickemPool,
  pickemMatchup,
  matchupOptions,
  pickemEntry,
  pickemPick,
  totpSettings,
  session,
} from "@/server/db/schema";
import { authedProcedure, extractAuth } from "../middleware/auth-middleware";
import { publicProcedure, router } from "../trpc-config";
import {
  asc,
  count,
  desc,
  eq,
  inArray,
  isNotNull,
  and,
  gte,
  lt,
} from "drizzle-orm";
import { z } from "zod";
import { Buffer } from "buffer";
import { TRPCError } from "@trpc/server";
import { uploadObject } from "@/lib/r2";
import { createZstdCompress } from "zlib";
import { validateToken } from "@/lib/auth-client";

export const appRouter = router({
  test: publicProcedure.query(async () => "Hi from the server!"),

  getUser: publicProcedure
    .use(extractAuth)
    .query(({ ctx }) => ctx.user ?? null),

  getTOTPStatus: authedProcedure.query(async ({ ctx }) => {
    if (!ctx.session) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const [currentSession] = await ctx.db
      .select({ totpVerified: session.totpVerified })
      .from(session)
      .where(eq(session.token, ctx.session.token))
      .limit(1);

    return currentSession?.totpVerified ?? false;
  }),

  getOffenders: authedProcedure.query(({ ctx }) => {
    return ctx.db.select().from(person);
  }),

  getSeasons: authedProcedure.query(({ ctx }) => {
    return ctx.db.select().from(season).orderBy(desc(season.startDate));
  }),

  getTOTP: authedProcedure
    .input(
      z.object({
        userToken: z.string().regex(/^\d{6}$/, "TOTP must be six digits"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const keys = await ctx.db
        .select({ key: totpSettings.totpSecret })
        .from(totpSettings)
        .limit(1);
      const theKey = keys[0]?.key;

      if (!theKey) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "TOTP secret is not configured.",
        });
      }

      const validated = await validateToken(theKey, input.userToken);

      if (validated && ctx.session) {
        await ctx.db
          .update(session)
          .set({ totpVerified: true })
          .where(eq(session.token, ctx.session.token));
      }

      return validated;
    }),
  getBounties: authedProcedure
    .input(
      z.object({
        seasonId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const seasons = input.seasonId
        ? await ctx.db
            .select()
            .from(season)
            .where(eq(season.id, input.seasonId))
        : [];

      const selectedSeason = seasons[0];

      let query = ctx.db
        .select()
        .from(bounty)
        .leftJoin(bountiesToPersons, eq(bounty.id, bountiesToPersons.bountyId))
        .leftJoin(person, eq(person.id, bountiesToPersons.personId));

      if (selectedSeason) {
        query = query.where(
          and(
            gte(bounty.date, selectedSeason.startDate),
            lt(bounty.date, selectedSeason.endDate),
          ),
        );
      }

      const data = await query.orderBy(desc(bounty.date));

      type bountyType = {
        id: string;
        image: string;
        date: Date;
        msg: string;
        persons: string[];
      };
      const groupedData: Record<string, bountyType> = {};

      data.forEach(({ bounty, person }) => {
        if (!groupedData[bounty.id]) {
          groupedData[bounty.id] = {
            id: bounty.id,
            image: bounty.image,
            date: bounty.date,
            msg: bounty.msg ?? "",
            persons: [],
          };
        }
        if (person) {
          groupedData[bounty.id].persons.push(person.name);
        }
      });

      return Object.values(groupedData);
    }),

  getPersons: authedProcedure.query(({ ctx }) => {
    return ctx.db.select().from(person);
  }),

  getPickemPools: authedProcedure.query(({ ctx }) => {
    return ctx.db.select().from(pickemPool).orderBy(desc(pickemPool.startsAt));
  }),

  getPickemMatchups: authedProcedure
    .input(
      z.object({
        poolId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const rows = await ctx.db
        .select({ matchup: pickemMatchup, option: matchupOptions })
        .from(pickemMatchup)
        .leftJoin(
          matchupOptions,
          eq(pickemMatchup.id, matchupOptions.matchupId),
        )
        .where(eq(pickemMatchup.poolId, input.poolId))
        .orderBy(asc(pickemMatchup.startsAt), asc(matchupOptions.optionText));

      const grouped: Record<
        string,
        {
          id: string;
          poolId: string;
          question: string;
          teamA: string;
          teamB: string;
          startsAt: Date;
          options: string[];
        }
      > = {};

      rows.forEach(({ matchup, option }) => {
        if (!grouped[matchup.id]) {
          grouped[matchup.id] = {
            id: matchup.id,
            poolId: matchup.poolId,
            question: matchup.question,
            teamA: matchup.teamA,
            teamB: matchup.teamB,
            startsAt: matchup.startsAt,
            options: [],
          };
        }
        if (option) {
          grouped[matchup.id].options.push(option.optionText);
        }
      });

      return Object.values(grouped);
    }),

  getMyPickemEntry: authedProcedure
    .input(
      z.object({
        poolId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const [entry] = await ctx.db
        .select()
        .from(pickemEntry)
        .where(
          and(
            eq(pickemEntry.poolId, input.poolId),
            eq(pickemEntry.userId, ctx.user!.id),
          ),
        );

      if (!entry) {
        return null;
      }

      const picks = await ctx.db
        .select()
        .from(pickemPick)
        .where(eq(pickemPick.entryId, entry.id));

      return {
        entry,
        picks,
      };
    }),

  submitPick: authedProcedure
    .input(
      z.object({
        poolId: z.string(),
        matchupId: z.string(),
        selectedOption: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        const [existingEntry] = await tx
          .select()
          .from(pickemEntry)
          .where(
            and(
              eq(pickemEntry.poolId, input.poolId),
              eq(pickemEntry.userId, ctx.user!.id),
            ),
          );

        const now = new Date();

        const entry = existingEntry
          ? existingEntry
          : (
              await tx
                .insert(pickemEntry)
                .values({
                  poolId: input.poolId,
                  userId: ctx.user!.id,
                  submittedAt: now,
                })
                .returning()
            )[0];

        if (entry.isLocked) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Pickset is locked for this entry.",
          });
        }

        await tx
          .delete(pickemPick)
          .where(
            and(
              eq(pickemPick.entryId, entry.id),
              eq(pickemPick.matchupId, input.matchupId),
            ),
          );

        await tx.insert(pickemPick).values({
          entryId: entry.id,
          matchupId: input.matchupId,
          selectedOption: input.selectedOption,
        });

        await tx
          .update(pickemEntry)
          .set({ submittedAt: now })
          .where(eq(pickemEntry.id, entry.id));

        return entry;
      });
    }),

  createOffender: authedProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return (
        await ctx.db
          .insert(person)
          .values(input)
          .onConflictDoNothing()
          .returning()
      )[0];
    }),

  uploadImage: authedProcedure
    .input(
      z.object({
        name: z.string(),
        data: z.string(), // base64
        type: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      // convert base64 to Blob and upload to R2
      const buffer = Buffer.from(input.data, "base64");
      const blob = new Blob([buffer], { type: input.type });
      const key = `${Date.now()}-${input.name}`;
      const res = await uploadObject(key, blob);
      return res; // { url }
    }),

  createBounty: authedProcedure
    .input(bountyCreateSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.db.transaction(async (tx) => {
        await tx.insert(person).values(input.offenders).onConflictDoNothing();
        const peoples = await tx
          .select()
          .from(person)
          .where(
            inArray(
              person.name,
              input.offenders.map((o) => o.name),
            ),
          );
        const bountyResult = await tx
          .insert(bounty)
          .values({
            date: input.created,
            image: input.image,
            msg: input.message,
          })
          .returning();
        const bountyId = bountyResult[0].id;
        await tx.insert(bountiesToPersons).values(
          peoples.map((p) => {
            return {
              bountyId,
              personId: p.id,
            };
          }),
        );
      });
    }),

  getLeaderboard: authedProcedure
    .input(
      z.object({
        seasonId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const seasons = input.seasonId
        ? await ctx.db
            .select()
            .from(season)
            .where(eq(season.id, input.seasonId))
        : [];

      const selectedSeason = seasons[0];

      let query = ctx.db
        .select({
          name: person.name,
          count: count(bountiesToPersons.bountyId),
        })
        .from(person)
        .leftJoin(bountiesToPersons, eq(person.id, bountiesToPersons.personId))
        .leftJoin(bounty, eq(bountiesToPersons.bountyId, bounty.id))
        .where(isNotNull(bountiesToPersons.bountyId))
        .groupBy(person.id)
        .orderBy(desc(count(bountiesToPersons.bountyId)), asc(person.name));

      if (selectedSeason) {
        query = query.where(
          and(
            gte(bounty.date, selectedSeason.startDate),
            lt(bounty.date, selectedSeason.endDate),
          ),
        );
      }

      return query;
    }),

  createSeason: authedProcedure
    .input(
      z.object({
        name: z.string(),
        startDate: z.date(),
        endDate: z.date(),
        isActive: z.boolean().optional().default(false),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return (
        await ctx.db
          .insert(season)
          .values({
            name: input.name,
            startDate: input.startDate,
            endDate: input.endDate,
            isActive: input.isActive,
            createdAt: new Date(),
          })
          .returning()
      )[0];
    }),
});

// Export type router type signature,
// NOT the router itself.
export type TRPCRouter = typeof appRouter;
