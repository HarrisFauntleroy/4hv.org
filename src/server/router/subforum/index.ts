import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "../../createRouter";
import { prisma } from "../../prisma";

const defaultSubforumSelect = Prisma.validator<Prisma.SubforumSelect>()({
  id: true,
  title: true,
  description: true,
  threads: {
    include: {
      user: true,
      comments: {
        include: {
          user: true,
          comments: true,
        },
      },
    },
  },
  createdAt: true,
  updatedAt: true,
  archived: true,
  deleted: true,
  userId: true,
  user: true,
  forum: false,
  forumId: true,
});

export const subforumRouter = createRouter()
  .mutation("create", {
    input: z.object({
      userId: z.string(),
      title: z.string(),
      description: z.string(),
      forumId: z.string(),
    }),
    async resolve({ input }) {
      return prisma.subforum.create({
        data: input,
        select: defaultSubforumSelect,
      });
    },
  })
  .mutation("update", {
    input: z.object({
      id: z.string(),
      userId: z.string(),
      data: z.object({
        title: z.string(),
        description: z.string(),
      }),
    }),
    async resolve({ input }) {
      const { id, data } = input;
      return prisma.subforum.update({
        where: { id },
        data,
        select: defaultSubforumSelect,
      });
    },
  })
  .mutation("delete", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      await prisma.subforum.update({
        where: { id },
        data: { deleted: true },
      });
      return {
        id,
      };
    },
  })
  .mutation("unarchive", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      await prisma.subforum.update({
        where: { id },
        data: { archived: false },
      });
      return {
        id,
      };
    },
  })
  .mutation("archive", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      await prisma.subforum.update({
        where: { id },
        data: { archived: true },
      });
      return {
        id,
      };
    },
  })
  .query("all", {
    async resolve() {
      return prisma.subforum.findMany({
        where: {
          deleted: {
            equals: false,
          },
        },
        select: defaultSubforumSelect,
      });
    },
  })
  .query("byId", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      const subforum = await prisma.subforum.findUnique({
        where: {
          id,
        },
        select: defaultSubforumSelect,
      });
      if (!subforum) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No subforum with id '${id}'`,
        });
      }
      return subforum;
    },
  })
  .query("byUser", {
    input: z.object({
      userId: z.string(),
    }),
    async resolve({ input }) {
      const { userId } = input;
      const subforum = await prisma.subforum.findMany({
        where: {
          userId,
          deleted: {
            equals: false,
          },
        },
        select: defaultSubforumSelect,
      });
      if (!subforum) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No subforum with userId '${userId}'`,
        });
      }
      return subforum;
    },
  });
