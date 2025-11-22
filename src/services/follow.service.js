import { followRepository } from '../repositories/follow.repository.js';
import { userRepository } from '../repositories/user.repository.js';
import { activityRepository } from '../repositories/activity.repository.js';
import prisma from '../config/database.js';

export const followService = {
  followUser: async (followerId, followingId) => {
    if (followerId === followingId) {
      throw new Error('Cannot follow yourself');
    }

    // Check if user exists
    const user = await userRepository.findById(followingId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if already following
    const existingFollow = await followRepository.findByFollowerAndFollowing(followerId, followingId);
    if (existingFollow) {
      throw new Error('Already following this user');
    }

    // Check if blocked
    const block = await prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: followingId, blockedId: followerId },
          { blockerId: followerId, blockedId: followingId },
        ],
      },
    });

    if (block) {
      throw new Error('Cannot follow: user is blocked');
    }

    const follow = await followRepository.create({
      followerId,
      followingId,
    });

    // Log activity
    await activityRepository.create({
      userId: followerId,
      type: 'USER_FOLLOWED',
      metadata: JSON.stringify({ followingId }),
    });

    return follow;
  },

  unfollowUser: async (followerId, followingId) => {
    const existingFollow = await followRepository.findByFollowerAndFollowing(followerId, followingId);
    if (!existingFollow) {
      throw new Error('Not following this user');
    }

    await followRepository.delete(followerId, followingId);

    // Log activity
    await activityRepository.create({
      userId: followerId,
      type: 'USER_UNFOLLOWED',
      metadata: JSON.stringify({ followingId }),
    });

    return { message: 'Unfollowed successfully' };
  },
};

