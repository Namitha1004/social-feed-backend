import prisma from '../config/database.js';

export const checkBlocked = async (req, res, next) => {
  try {
    if (!req.user) {
      return next();
    }

    const userId = req.params.id || req.params.userId || req.body.userId;
    if (!userId) {
      return next();
    }

    // Check if current user is blocked by target user
    const blocked = await prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: userId, blockedId: req.user.id },
          { blockerId: req.user.id, blockedId: userId },
        ],
      },
    });

    if (blocked) {
      return res.status(403).json({
        success: false,
        message: 'Action not allowed due to blocking',
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

