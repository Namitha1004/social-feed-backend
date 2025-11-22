import { postRepository } from '../repositories/post.repository.js';
import { activityRepository } from '../repositories/activity.repository.js';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination.util.js';

export const postService = {
  createPost: async (content, authorId) => {
    const post = await postRepository.create({
      content,
      authorId,
    });

    // Log activity
    await activityRepository.create({
      userId: authorId,
      type: 'POST_CREATED',
      metadata: JSON.stringify({ postId: post.id }),
    });

    return post;
  },

  getPost: async (id) => {
    const post = await postRepository.findById(id);
    if (!post) {
      throw new Error('Post not found');
    }
    return post;
  },

  updatePost: async (id, content, userId) => {
    const post = await postRepository.findById(id);
    if (!post) {
      throw new Error('Post not found');
    }

    if (post.authorId !== userId) {
      throw new Error('Not authorized to update this post');
    }

    return postRepository.update(id, { content });
  },

  deletePost: async (id, userId, userRole) => {
    const post = await postRepository.findById(id);
    if (!post) {
      throw new Error('Post not found');
    }

    if (post.authorId !== userId && userRole !== 'ADMIN' && userRole !== 'OWNER') {
      throw new Error('Not authorized to delete this post');
    }

    await postRepository.delete(id);
    return { message: 'Post deleted successfully' };
  },

  getAllPosts: async (page, limit, authorId = null) => {
    const { skip, limit: limitNum, page: pageNum } = getPaginationParams(page, limit);
    const where = authorId ? { authorId } : {};
    const { posts, total } = await postRepository.findAll(skip, limitNum, where);
    const meta = getPaginationMeta(total, pageNum, limitNum);

    return {
      posts,
      meta,
    };
  },

  getUserPosts: async (userId, page, limit) => {
    return postService.getAllPosts(page, limit, userId);
  },
};

