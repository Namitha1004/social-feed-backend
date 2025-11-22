import express from 'express';
import { followController } from '../controllers/follow.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { checkBlocked } from '../middlewares/block.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { followUserSchema } from '../validators/follow.validator.js';

const router = express.Router();

router.post('/:id', authenticate, checkBlocked, validate(followUserSchema), followController.followUser);
router.delete('/:id', authenticate, validate(followUserSchema), followController.unfollowUser);

export default router;

