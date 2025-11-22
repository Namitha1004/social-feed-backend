import { hashPassword } from '../utils/password.util.js';
import { userRepository } from '../repositories/user.repository.js';
import { activityRepository } from '../repositories/activity.repository.js';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination.util.js';

export const userService = {
  getProfile: async (id) => {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },

  updateProfile: async (id, data, currentUserId) => {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if username is being changed and if it's available
    if (data.username && data.username !== user.username) {
      const existingUser = await userRepository.findByUsername(data.username);
      if (existingUser) {
        throw new Error('Username already taken');
      }
    }

    const updatedUser = await userRepository.update(id, data);

    // Log activity
    await activityRepository.create({
      userId: id,
      type: 'PROFILE_UPDATED',
      metadata: JSON.stringify({ updatedBy: currentUserId }),
    });

    return updatedUser;
  },

  deleteProfile: async (id) => {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    await userRepository.delete(id);
    return { message: 'User deleted successfully' };
  },

  getAllUsers: async (page, limit) => {
    const { skip, limit: limitNum, page: pageNum } = getPaginationParams(page, limit);
    const { users, total } = await userRepository.findAll(skip, limitNum);
    const meta = getPaginationMeta(total, pageNum, limitNum);

    return {
      users,
      meta,
    };
  },

  getFollowers: async (userId, page, limit) => {
    const { skip, limit: limitNum, page: pageNum } = getPaginationParams(page, limit);
    const { followers, total } = await userRepository.getFollowers(userId, skip, limitNum);
    const meta = getPaginationMeta(total, pageNum, limitNum);

    return {
      followers: followers.map((f) => f.follower),
      meta,
    };
  },

  getFollowing: async (userId, page, limit) => {
    const { skip, limit: limitNum, page: pageNum } = getPaginationParams(page, limit);
    const { following, total } = await userRepository.getFollowing(userId, skip, limitNum);
    const meta = getPaginationMeta(total, pageNum, limitNum);

    return {
      following: following.map((f) => f.following),
      meta,
    };
  },
};

