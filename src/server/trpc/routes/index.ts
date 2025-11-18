import { extractAuth } from "../middleware/auth-middleware";
import { publicProcedure, router } from "../trpc-config";

export const appRouter = router({
  test: publicProcedure.query(async () => "Hi from the server!"),

  getUser: publicProcedure
    .use(extractAuth)
    .query(({ ctx }) => ctx.user ?? null),
});

// Export type router type signature,
// NOT the router itself.
export type TRPCRouter = typeof appRouter;
