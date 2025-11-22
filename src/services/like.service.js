import { likeRepository } from '../repositories/like.repository.js';
import { postRepository } from '../repositories/post.repository.js';
import { activityRepository } from '../repositories/activity.repository.js';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination.util.js';

export const likeService = {
  likePost: async (postId, userId) => {
    // Check if post exists
    const post = await postRepository.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    // Check if already liked
    const existingLike = await likeRepository.findByUserAndPost(userId, postId);
    if (existingLike) {
      throw new Error('Post already liked');
    }

    const like = await likeRepository.create({
      userId,
      postId,
    });

    // Log activity
    await activityRepository.create({
      userId,
      type: 'POST_LIKED',
      metadata: JSON.stringify({ postId }),
    });

    return like;
  },

  unlikePost: async (postId, userId) => {
    const existingLike = await likeRepository.findByUserAndPost(userId, postId);
    if (!existingLike) {
      throw new Error('Post not liked');
    }

    await likeRepository.delete(userId, postId);

    // Log activity
    await activityRepository.create({
      userId,
      type: 'POST_UNLIKED',
      metadata: JSON.stringify({ postId }),
    });

    return { message: 'Post unliked successfully' };
  },

  getPostLikes: async (postId, page, limit) => {
    const { skip, limit: limitNum, page: pageNum } = getPaginationParams(page, limit);
    const { likes, total } = await likeRepository.findByPost(postId, skip, limitNum);
    const meta = getPaginationMeta(total, pageNum, limitNum);

    return {
      likes,
      meta,
    };
  },

  getUserLikes: async (userId, page, limit) => {
    const { skip, limit: limitNum, page: pageNum } = getPaginationParams(page, limit);
    const { likes, total } = await likeRepository.findByUser(userId, skip, limitNum);
    const meta = getPaginationMeta(total, pageNum, limitNum);

    return {
      likes,
      meta,
    };
  },
};

