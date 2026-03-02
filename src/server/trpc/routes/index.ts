import { bountiesToPersons, bounty, person } from "@/server/db/schema";
import { authedProcedure, extractAuth } from "../middleware/auth-middleware";
import { publicProcedure, router } from "../trpc-config";
import { count, desc, eq, inArray } from "drizzle-orm";
import { CreateBounty } from "@/components/create-bounty";
import { z } from "zod";
import { r2Client, uploadObject } from "@/lib/r2";

export const appRouter = router({
  test: publicProcedure.query(async () => "Hi from the server!"),

  getUser: publicProcedure
    .use(extractAuth)
    .query(({ ctx }) => ctx.user ?? null),

  getBounties: authedProcedure.query(async ({ ctx }) => {
    const data = await ctx.db
      .select()
      .from(bounty)
      .leftJoin(bountiesToPersons, eq(bounty.id, bountiesToPersons.bountyId))
      .leftJoin(person, eq(person.id, bountiesToPersons.personId))
      .orderBy(desc(bounty.date));

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

  createBounty: authedProcedure
    .input(z.instanceof(FormData))
    .mutation(async ({ input, ctx }) => {
      console.log("create boundtyyy");
      console.log(input);
      const offender = input.get("offender") as string;
      const image = input.get("image") as File;
      const timestamp = new Date(input.get("timestamp") as string);
      const message = input.get("message") as string;
      if (!offender || !image || !timestamp) return null;
      await ctx.db.transaction(async (tx) => {
        await tx
          .insert(person)
          .values(
            offender.split(",").map((name) => {
              return {
                name,
              };
            }),
          )
          .onConflictDoNothing()
          .returning();

        const peoples = await tx
          .select()
          .from(person)
          .where(inArray(person.name, offender.split(",")));

        const imageUrl = await uploadObject(
          `${Date.now()}-${image.name}`,
          image,
        );

        const bountyResult = await tx
          .insert(bounty)
          .values({
            date: timestamp,
            image: imageUrl.url,
            msg: message,
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

  getLeaderboard: authedProcedure.query(({ ctx }) => {
    return ctx.db
      .select({
        name: person.name,
        count: count(bountiesToPersons.bountyId),
      })
      .from(person)
      .leftJoin(bountiesToPersons, eq(person.id, bountiesToPersons.personId))
      .groupBy(person.id)
      .orderBy(desc(count(bountiesToPersons.bountyId)));
  }),
});

// Export type router type signature,
// NOT the router itself.
export type TRPCRouter = typeof appRouter;
