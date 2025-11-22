import express from 'express';
import { userController } from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { isAdmin, isSelfOrAdmin } from '../middlewares/roles.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { updateUserSchema, getUserSchema } from '../validators/user.validator.js';

const router = express.Router();

router.get('/', authenticate, isAdmin, userController.getAllUsers);
router.get('/:id', authenticate, validate(getUserSchema), userController.getProfile);
router.put('/:id', authenticate, isSelfOrAdmin, validate(updateUserSchema), userController.updateProfile);
router.delete('/:id', authenticate, isSelfOrAdmin, validate(getUserSchema), userController.deleteProfile);
router.get('/:id/followers', authenticate, validate(getUserSchema), userController.getFollowers);
router.get('/:id/following', authenticate, validate(getUserSchema), userController.getFollowing);

export default router;

