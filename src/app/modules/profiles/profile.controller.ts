import { Request, Response } from 'express';
import * as profileService from './profile.service';
import { UpdateProfileInput } from './profile.validation';
import { ApiError } from '../../utils/apiError';

// Get the current authenticated user's profile (uses auth.service.getMe which includes profile)
export const getMyProfileHandler = async (req: Request, res: Response) => {
  if (!req.user?.id) {
    throw new ApiError(401, 'User not authenticated'); // Should be caught by 'protect'
  }
  // The getMe service from auth module now fetches user with profile
  // If you prefer a dedicated profile service call:
  // const profile = await profileService.getProfileByUserId(req.user.id);
  // For now, we rely on authService.getMe which is called by authController.getMeHandler
  // So, this endpoint might be redundant if /api/v1/auth/me already returns the profile.
  // Let's assume you want a dedicated /profile/me endpoint handled by profile module.
  const profile = await profileService.getProfileByUserId(req.user.id);
  res.status(200).json({ success: true, data: profile });
};

export const updateMyProfileHandler = async (
  req: Request<{}, {}, UpdateProfileInput>,
  res: Response,
) => {
  if (!req.user?.id) {
    throw new ApiError(401, 'User not authenticated');
  }
  const updatedProfile = await profileService.updateProfile(req.user.id, req.body);
  res.status(200).json({ success: true, data: updatedProfile });
};