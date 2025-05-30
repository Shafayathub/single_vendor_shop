
import { Router } from 'express';
import * as authController from './auth.controller';
import { registerUserSchema, loginUserSchema } from './auth.validation';
import { validate } from '../../middlewares/validateResource';
import { asyncHandler } from '../../utils/asyncHandler';
import { protect } from '../../middlewares/authMiddleware';

const router = Router();

router.post(
  '/register',
  validate(registerUserSchema),
  asyncHandler(authController.registerUserHandler),
);

router.post(
  '/login',
  validate(loginUserSchema),
  asyncHandler(authController.loginUserHandler),
);

router.get(
  '/me',
  protect, // This route is protected
  asyncHandler(authController.getMeHandler),
);

// (Optional) Logout route
// router.post('/logout', protect, asyncHandler(authController.logoutHandler));

// (Optional) Refresh token route
// router.post('/refresh-token', asyncHandler(authController.refreshTokenHandler));

export { router as authRoutes };