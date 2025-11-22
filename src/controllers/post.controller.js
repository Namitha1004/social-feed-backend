import { postService } from '../services/post.service.js';

export const postController = {
  createPost: async (req, res, next) => {
    try {
      const { content } = req.validated.body;
      const post = await postService.createPost(content, req.user.id);
      res.status(201).json({
        success: true,
        data: post,
      });
    } catch (error) {
      next(error);
    }
  },

  getPost: async (req, res, next) => {
    try {
      const { id } = req.params;
      const post = await postService.getPost(id);
      res.status(200).json({
        success: true,
        data: post,
      });
    } catch (error) {
      next(error);
    }
  },

  updatePost: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { content } = req.validated.body;
      const post = await postService.updatePost(id, content, req.user.id);
      res.status(200).json({
        success: true,
        data: post,
      });
    } catch (error) {
      next(error);
    }
  },

  deletePost: async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await postService.deletePost(id, req.user.id, req.user.role);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  getAllPosts: async (req, res, next) => {
    try {
      const { page, limit } = req.query;
      const result = await postService.getAllPosts(page, limit);
      res.status(200).json({
        success: true,
        data: result.posts,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  },

  getUserPosts: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { page, limit } = req.query;
      const result = await postService.getUserPosts(id, page, limit);
      res.status(200).json({
        success: true,
        data: result.posts,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  },
};

