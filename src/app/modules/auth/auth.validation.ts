import { z } from 'zod';

export const registerUserSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    // role: z.nativeEnum(UserRole).optional(), // If you allow role selection during registration
  }),
});
export type RegisterUserInput = z.infer<typeof registerUserSchema>['body'];

export const loginUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});
export type LoginUserInput = z.infer<typeof loginUserSchema>['body'];