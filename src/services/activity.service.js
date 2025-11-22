import { activityRepository } from '../repositories/activity.repository.js';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination.util.js';

export const activityService = {
  getUserActivities: async (userId, page, limit) => {
    const { skip, limit: limitNum, page: pageNum } = getPaginationParams(page, limit);
    const { activities, total } = await activityRepository.findByUser(userId, skip, limitNum);
    const meta = getPaginationMeta(total, pageNum, limitNum);

    return {
      activities,
      meta,
    };
  },

  getAllActivities: async (page, limit, userId = null) => {
    const { skip, limit: limitNum, page: pageNum } = getPaginationParams(page, limit);
    const where = userId ? { userId } : {};
    const { activities, total } = await activityRepository.findAll(skip, limitNum, where);
    const meta = getPaginationMeta(total, pageNum, limitNum);

    return {
      activities,
      meta,
    };
  },
};

