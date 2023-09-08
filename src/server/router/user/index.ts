import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "../../createRouter";
import { prisma } from "../../prisma";

const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  email: true,
  emailVerified: true,
  image: true,
  role: true,
  accounts: false,
  forums: false,
  subforums: false,
  threads: false,
  comments: false,
  sessions: {
    select: {
      expires: true,
    },
  },
});

export const userRouter = createRouter()
  // create
  .mutation("add", {
    input: z.object({
      userId: z.string(),
      title: z.string(),
      content: z.string(),
    }),
    async resolve({ input }) {
      return prisma.user.create({
        data: input,
        include: defaultUserSelect,
      });
    },
  })
  // read
  .query("all", {
    async resolve() {
      /**
       * For pagination you can have a look at this docs site
       * @link https://trpc.io/docs/useInfiniteQuery
       */

      return prisma.user.findMany({
        select: {
          id: true,
        },
      });
    },
  })
  .query("online", {
    async resolve() {
      /**
       * For pagination you can have a look at this docs site
       * @link https://trpc.io/docs/useInfiniteQuery
       */

      return prisma.user.findMany({
        select: {
          id: true,
          name: true,
          sessions: {
            select: {
              expires: true,
            },
          },
        },
      });
    },
  })
  .query("byId", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
        select: defaultUserSelect,
      });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No user with id '${id}'`,
        });
      }
      return user;
    },
  })
  .query("byUser", {
    input: z.object({
      userId: z.string(),
    }),
    async resolve({ input }) {
      const { userId } = input;
      const user = await prisma.user.findMany({
        where: {
          id: userId,
        },
        include: defaultUserSelect,
      });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No user with userId '${userId}'`,
        });
      }
      return user;
    },
  })
  // update
  .mutation("edit", {
    input: z.object({
      id: z.string(),
      userId: z.string(),
      data: z.object({
        content: z.string(),
      }),
    }),
    async resolve({ input }) {
      const { id, data } = input;
      return prisma.user.update({
        where: { id },
        data,
        include: defaultUserSelect,
      });
    },
  })
  // delete
  .mutation("delete", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      await prisma.user.delete({
        where: { id },
      });
      return {
        id,
      };
    },
  });
