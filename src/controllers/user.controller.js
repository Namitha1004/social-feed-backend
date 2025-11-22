import { userService } from '../services/user.service.js';

export const userController = {
  getProfile: async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await userService.getProfile(id);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  updateProfile: async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await userService.updateProfile(id, req.validated.body, req.user.id);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  deleteProfile: async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await userService.deleteProfile(id);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  getAllUsers: async (req, res, next) => {
    try {
      const { page, limit } = req.query;
      const result = await userService.getAllUsers(page, limit);
      res.status(200).json({
        success: true,
        data: result.users,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  },

  getFollowers: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { page, limit } = req.query;
      const result = await userService.getFollowers(id, page, limit);
      res.status(200).json({
        success: true,
        data: result.followers,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  },

  getFollowing: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { page, limit } = req.query;
      const result = await userService.getFollowing(id, page, limit);
      res.status(200).json({
        success: true,
        data: result.following,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  },
};

