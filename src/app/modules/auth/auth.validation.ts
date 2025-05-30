// src/modules/auth/auth.validation.ts
import { z } from 'zod';

export const registerUserSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(), // Name is now for the profile
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
  }),
});
export type RegisterUserInput = z.infer<typeof registerUserSchema>['body'];

// loginUserSchema remains the same
export const loginUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});
export type LoginUserInput = z.infer<typeof loginUserSchema>['body'];