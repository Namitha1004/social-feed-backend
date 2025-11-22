import { activityService } from '../services/activity.service.js';

export const activityController = {
  getUserActivities: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { page, limit } = req.query;
      const result = await activityService.getUserActivities(id, page, limit);
      res.status(200).json({
        success: true,
        data: result.activities,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  },

  getAllActivities: async (req, res, next) => {
    try {
      const { page, limit, userId } = req.query;
      const result = await activityService.getAllActivities(page, limit, userId);
      res.status(200).json({
        success: true,
        data: result.activities,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  },
};

