import prisma from '../config/database.js';

export const blockRepository = {
  findById: async (id) => {
    return prisma.block.findUnique({
      where: { id },
      include: {
        blocker: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        blocked: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });
  },

  findByBlockerAndBlocked: async (blockerId, blockedId) => {
    return prisma.block.findUnique({
      where: {
        blockerId_blockedId: {
          blockerId,
          blockedId,
        },
      },
    });
  },

  create: async (data) => {
    return prisma.block.create({
      data,
      include: {
        blocker: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        blocked: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });
  },

  delete: async (blockerId, blockedId) => {
    return prisma.block.delete({
      where: {
        blockerId_blockedId: {
          blockerId,
          blockedId,
        },
      },
    });
  },

  findByBlocker: async (blockerId, skip, limit) => {
    const [blocks, total] = await Promise.all([
      prisma.block.findMany({
        where: { blockerId },
        skip,
        take: limit,
        include: {
          blocked: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.block.count({ where: { blockerId } }),
    ]);

    return { blocks, total };
  },
};

