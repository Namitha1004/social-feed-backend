import express from 'express';
import { postController } from '../controllers/post.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/roles.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { createPostSchema, updatePostSchema, getPostSchema } from '../validators/post.validator.js';
import { getUserSchema } from '../validators/user.validator.js';

const router = express.Router();

router.post('/', authenticate, validate(createPostSchema), postController.createPost);
router.get('/', authenticate, postController.getAllPosts);
router.get('/:id', authenticate, validate(getPostSchema), postController.getPost);
router.put('/:id', authenticate, validate(updatePostSchema), postController.updatePost);
router.delete('/:id', authenticate, validate(getPostSchema), postController.deletePost);
router.get('/user/:id', authenticate, validate(getUserSchema), postController.getUserPosts);

export default router;

