import { likeService } from '../services/like.service.js';

export const likeController = {
  likePost: async (req, res, next) => {
    try {
      const { id } = req.params;
      const like = await likeService.likePost(id, req.user.id);
      res.status(201).json({
        success: true,
        data: like,
      });
    } catch (error) {
      next(error);
    }
  },

  unlikePost: async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await likeService.unlikePost(id, req.user.id);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  getPostLikes: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { page, limit } = req.query;
      const result = await likeService.getPostLikes(id, page, limit);
      res.status(200).json({
        success: true,
        data: result.likes,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  },

  getUserLikes: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { page, limit } = req.query;
      const result = await likeService.getUserLikes(id, page, limit);
      res.status(200).json({
        success: true,
        data: result.likes,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  },
};

