import { followService } from '../services/follow.service.js';

export const followController = {
  followUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      const follow = await followService.followUser(req.user.id, id);
      res.status(201).json({
        success: true,
        data: follow,
      });
    } catch (error) {
      next(error);
    }
  },

  unfollowUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await followService.unfollowUser(req.user.id, id);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};

