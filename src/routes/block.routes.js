import express from 'express';
import { blockController } from '../controllers/block.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { blockUserSchema } from '../validators/block.validator.js';

const router = express.Router();

router.post('/:id', authenticate, validate(blockUserSchema), blockController.blockUser);
router.delete('/:id', authenticate, validate(blockUserSchema), blockController.unblockUser);
router.get('/', authenticate, blockController.getBlockedUsers);

export default router;

