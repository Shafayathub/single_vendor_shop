import { z } from 'zod';

export const CreateProductSchema = z.object({
  body: z.object({ // Assuming data is in req.body
    name: z.string().min(3, 'Product name must be at least 3 characters long'),
    description: z.string().min(10, 'Description must be at least 10 characters long'),
    price: z.coerce.number().positive('Price must be a positive number'), // coerce converts string from form-data
    stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
    categoryId: z.string().cuid({ message: 'Invalid category ID format' }),
    // images field will be handled by Multer, not directly validated here for file type
    // but you might add validation for number of images or metadata if needed
  }),
  // You can also validate params or query here if needed for other routes
  // params: z.object({ productId: z.string().cuid() })
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>['body'];

export const UpdateProductSchema = CreateProductSchema.deepPartial(); // Allows all fields to be optional
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>['body'];

export const ProductIdParamSchema = z.object({
  params: z.object({
    id: z.string().cuid({ message: 'Invalid product ID format' }),
  }),
});
export type ProductIdParamInput = z.infer<typeof ProductIdParamSchema>['params'];