import express from 'express';
import { likeController } from '../controllers/like.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { likePostSchema } from '../validators/like.validator.js';
import { getUserSchema } from '../validators/user.validator.js';

const router = express.Router();

router.post('/post/:id', authenticate, validate(likePostSchema), likeController.likePost);
router.delete('/post/:id', authenticate, validate(likePostSchema), likeController.unlikePost);
router.get('/post/:id', authenticate, validate(likePostSchema), likeController.getPostLikes);
router.get('/user/:id', authenticate, validate(getUserSchema), likeController.getUserLikes);

export default router;

