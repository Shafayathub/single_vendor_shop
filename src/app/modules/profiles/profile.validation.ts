import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
    avatarUrl: z.string().url("Invalid URL for avatar").optional().nullable(),
    phoneNumber: z
      .string()
      .regex(
        /^\+880(1[3-9]\d{8}|[0-9]\d{8,9})$/,
        "Invalid Bangladeshi phone number format (e.g., +8801712345678)"
      )
      .optional()
      .nullable(),
    // Add validation for other profile fields
  }),
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>["body"];
