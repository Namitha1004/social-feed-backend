import prisma from '../config/database.js';

export const likeRepository = {
  findById: async (id) => {
    return prisma.like.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        post: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });
  },

  findByUserAndPost: async (userId, postId) => {
    return prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
  },

  create: async (data) => {
    return prisma.like.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        post: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });
  },

  delete: async (userId, postId) => {
    return prisma.like.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
  },

  findByPost: async (postId, skip, limit) => {
    const [likes, total] = await Promise.all([
      prisma.like.findMany({
        where: { postId },
        skip,
        take: limit,
        include: {
          user: {
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
      prisma.like.count({ where: { postId } }),
    ]);

    return { likes, total };
  },

  findByUser: async (userId, skip, limit) => {
    const [likes, total] = await Promise.all([
      prisma.like.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          post: {
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.like.count({ where: { userId } }),
    ]);

    return { likes, total };
  },
};

