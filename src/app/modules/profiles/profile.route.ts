
import { Router } from 'express';
import * as profileController from './profile.controller';
import { updateProfileSchema } from './profile.validation';
import { protect } from '../../middlewares/authMiddleware';
import { asyncHandler } from '../../utils/asyncHandler';
import { validate } from '../../middlewares/validateResource';

const router = Router();

// All routes in this module are for the authenticated user acting on their own profile
router.use(protect); // Apply 'protect' middleware to all routes in this file

router.get(
  '/me', //  GET /api/v1/profiles/me
  asyncHandler(profileController.getMyProfileHandler)
);

router.put(
  '/me', // PUT /api/v1/profiles/me
  validate(updateProfileSchema),
  asyncHandler(profileController.updateMyProfileHandler)
);

export { router as profileRoutes };