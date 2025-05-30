// src/modules/auth/auth.service.ts
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { RegisterUserInput, LoginUserInput } from './auth.validation';
import { User, Role } from '@prisma/client'; // Import UserRole if you use it
import { config } from '../../../config';
import prisma from '../../../lib/prisma';
import { ApiError } from '../../utils/apiError';

// Generate JWT token
const generateToken = (userId: string, role: Role): string => {
  return jwt.sign({ userId, role }, config.jwt.secret as string, {
    expiresIn: config.jwt.accessTokenExpiresIn,
  } as SignOptions);
};

// (Optional) Generate Refresh Token
const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, config.jwt.secret, { // Could use a different secret for refresh tokens
    expiresIn: config.jwt.refreshTokenExpiresIn,
  }as SignOptions);
};

export const registerUser = async (input: RegisterUserInput): Promise<Omit<User, 'password'>> => {
  const { email, password } = input;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ApiError(409, 'User with this email already exists.');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, config.bcryptSaltRounds);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: Role.USER, // Default role
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const loginUser = async (
  input: LoginUserInput
): Promise<{ user: Omit<User, 'password'>; accessToken: string /*; refreshToken?: string */ }> => {
  const { email, password } = input;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const accessToken = generateToken(user.id, user.role);
  // const refreshToken = generateRefreshToken(user.id); // If using refresh tokens

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    accessToken,
    // refreshToken,
  };
};

export const getMe = async (userId: string): Promise<Omit<User, 'password'> | null> => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { // Explicitly select fields to exclude password
            id: true,
            email: true,
            // name: true,
            role: true,
            createdAt: true,
            updatedAt: true
        }
    });
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    return user;
};