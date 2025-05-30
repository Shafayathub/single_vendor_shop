import { Profile } from '@prisma/client';
import { UpdateProfileInput } from './profile.validation';
import prisma from '../../../lib/prisma';
import { ApiError } from '../../utils/apiError';

export const getProfileByUserId = async (userId: string): Promise<Profile | null> => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });
  if (!profile) {
    // This might happen if somehow a user exists without a profile (should be rare with transactional registration)
    throw new ApiError(404, 'Profile not found for this user.');
  }
  return profile;
};

export const updateProfile = async (
  userId: string,
  data: UpdateProfileInput
): Promise<Profile> => {
  try {
    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data,
    });
    return updatedProfile;
  } catch (error: any) {
    if (error.code === 'P2025') { // Prisma error code for record not found during update
      throw new ApiError(404, 'Profile not found for update.');
    }
    throw error; // Re-throw other errors
  }
};