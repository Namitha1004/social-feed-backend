import express from 'express';
import { activityController } from '../controllers/activity.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/roles.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { getUserSchema } from '../validators/user.validator.js';

const router = express.Router();

router.get('/user/:id', authenticate, validate(getUserSchema), activityController.getUserActivities);
router.get('/', authenticate, isAdmin, activityController.getAllActivities);

export default router;

