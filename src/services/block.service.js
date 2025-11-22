import { blockRepository } from '../repositories/block.repository.js';
import { userRepository } from '../repositories/user.repository.js';
import { activityRepository } from '../repositories/activity.repository.js';
import { followRepository } from '../repositories/follow.repository.js';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination.util.js';

export const blockService = {
  blockUser: async (blockerId, blockedId) => {
    if (blockerId === blockedId) {
      throw new Error('Cannot block yourself');
    }

    // Check if user exists
    const user = await userRepository.findById(blockedId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if already blocked
    const existingBlock = await blockRepository.findByBlockerAndBlocked(blockerId, blockedId);
    if (existingBlock) {
      throw new Error('User already blocked');
    }

    // Remove follow relationships if they exist
    const follow = await followRepository.findByFollowerAndFollowing(blockerId, blockedId);
    if (follow) {
      await followRepository.delete(blockerId, blockedId);
    }

    const reverseFollow = await followRepository.findByFollowerAndFollowing(blockedId, blockerId);
    if (reverseFollow) {
      await followRepository.delete(blockedId, blockerId);
    }

    const block = await blockRepository.create({
      blockerId,
      blockedId,
    });

    // Log activity
    await activityRepository.create({
      userId: blockerId,
      type: 'USER_BLOCKED',
      metadata: JSON.stringify({ blockedId }),
    });

    return block;
  },

  unblockUser: async (blockerId, blockedId) => {
    const existingBlock = await blockRepository.findByBlockerAndBlocked(blockerId, blockedId);
    if (!existingBlock) {
      throw new Error('User not blocked');
    }

    await blockRepository.delete(blockerId, blockedId);

    // Log activity
    await activityRepository.create({
      userId: blockerId,
      type: 'USER_UNBLOCKED',
      metadata: JSON.stringify({ blockedId }),
    });

    return { message: 'User unblocked successfully' };
  },

  getBlockedUsers: async (blockerId, page, limit) => {
    const { skip, limit: limitNum, page: pageNum } = getPaginationParams(page, limit);
    const { blocks, total } = await blockRepository.findByBlocker(blockerId, skip, limitNum);
    const meta = getPaginationMeta(total, pageNum, limitNum);

    return {
      blockedUsers: blocks.map((b) => b.blocked),
      meta,
    };
  },
};

