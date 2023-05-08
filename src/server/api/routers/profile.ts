import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  privateProcedure,
} from "~/server/api/trpc";

const profileRouter = createTRPCRouter({
  setProfile: privateProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
      if (userId) {
        const profile = await ctx.prisma.profile.create({
          data: {
            userId: userId,
            username: input.username,
          },
        });

        return profile;
      }
    }),
  getProfileById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findUnique({
        where: {
          id: input.id,
        },
      });

      return profile;
    }),
});

export default profileRouter;
