import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';

import { RegisterUserInput, LoginUserInput } from './auth.validation';
import { User, Role, Profile } from '@prisma/client';
import { config } from '../../../config';
import prisma from '../../../lib/prisma';
import { ApiError } from '../../utils/apiError';

// Generate JWT token (remains the same)
const generateToken = (userId: string, role: Role): string => {
  return jwt.sign({ userId, role }, config.jwt.secret, {
    expiresIn: config.jwt.accessTokenExpiresIn,
  }as SignOptions);
};

// Type for user with profile
export type UserWithProfile = User & { profile: Profile | null };


export const registerUser = async (
  input: RegisterUserInput
): Promise<Omit<UserWithProfile, 'password'>> => {
  const { email, password, name } = input; // name now comes from input for profile

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ApiError(409, 'User with this email already exists.');
  }

  const hashedPassword = await bcrypt.hash(password, config.bcryptSaltRounds);

  // Create user and profile in a transaction
  const createdUserWithProfile = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        // role: input.role || UserRole.USER, // If role is part of input
      },
    });

    const profile = await tx.profile.create({
      data: {
        userId: user.id,
        name: name || null, // Use provided name or null
        // Initialize other profile fields as needed
      },
    });

    return { ...user, profile };
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = createdUserWithProfile;
  return userWithoutPassword;
};

export const loginUser = async (
  input: LoginUserInput
): Promise<{ user: Omit<UserWithProfile, 'password'>; accessToken: string }> => {
  const { email, password } = input;

  const userWithProfile = await prisma.user.findUnique({
    where: { email },
    include: {
      profile: true, // Include profile on login
    },
  });

  if (!userWithProfile) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const isPasswordMatch = await bcrypt.compare(password, userWithProfile.password);
  if (!isPasswordMatch) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const accessToken = generateToken(userWithProfile.id, userWithProfile.role);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = userWithProfile;

  return {
    user: userWithoutPassword,
    accessToken,
  };
};

export const getMe = async (userId: string): Promise<Omit<UserWithProfile, 'password'> | null> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true, // Always include profile for 'getMe'
    },
  });

  if (!user) {
    // This should ideally not happen if called after 'protect' middleware
    throw new ApiError(404, 'User not found');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};