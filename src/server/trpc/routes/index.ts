import {
  bountiesToPersons,
  bounty,
  bountyCreateSchema,
  person,
  season,
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
import { uploadObject } from "@/lib/r2";

export const appRouter = router({
  test: publicProcedure.query(async () => "Hi from the server!"),

  getUser: publicProcedure
    .use(extractAuth)
    .query(({ ctx }) => ctx.user ?? null),

  getOffenders: authedProcedure.query(({ ctx }) => {
    return ctx.db.select().from(person);
  }),

  getSeasons: authedProcedure.query(({ ctx }) => {
    return ctx.db.select().from(season).orderBy(desc(season.startDate));
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
