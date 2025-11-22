import prisma from '../config/database.js';

export const activityRepository = {
  create: async (data) => {
    return prisma.activity.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  },

  findByUser: async (userId, skip, limit) => {
    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      }),
      prisma.activity.count({ where: { userId } }),
    ]);

    return { activities, total };
  },

  findAll: async (skip, limit, where = {}) => {
    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      }),
      prisma.activity.count({ where }),
    ]);

    return { activities, total };
  },
};

