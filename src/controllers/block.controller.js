import { blockService } from '../services/block.service.js';

export const blockController = {
  blockUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      const block = await blockService.blockUser(req.user.id, id);
      res.status(201).json({
        success: true,
        data: block,
      });
    } catch (error) {
      next(error);
    }
  },

  unblockUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await blockService.unblockUser(req.user.id, id);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  getBlockedUsers: async (req, res, next) => {
    try {
      const { page, limit } = req.query;
      const result = await blockService.getBlockedUsers(req.user.id, page, limit);
      res.status(200).json({
        success: true,
        data: result.blockedUsers,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  },
};

