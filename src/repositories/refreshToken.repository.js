import prisma from '../config/database.js';

export const refreshTokenRepository = {
  create: async (data) => {
    return prisma.refreshToken.create({
      data,
    });
  },

  findByToken: async (token) => {
    return prisma.refreshToken.findUnique({
      where: { token },
      include: {
        user: true,
      },
    });
  },

  revoke: async (token) => {
    return prisma.refreshToken.update({
      where: { token },
      data: { revokedAt: new Date() },
    });
  },

  revokeAllForUser: async (userId) => {
    return prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  },

  deleteExpired: async () => {
    return prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  },
};

