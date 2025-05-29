import { Router } from 'express';
import * as productController from './product.controller';
import { CreateProductSchema, UpdateProductSchema, ProductIdParamSchema } from './product.validation';
import { asyncHandler } from '../../utils/asyncHandler';
import { validate } from '../../middlewares/validateResource';
// import { checkJwt } from '../../middlewares/checkJwt';
import { upload } from '../../middlewares/uploadMiddleware';

const router = Router();

// POST /api/v1/products - Create a new product
router.post(
  '/',
//   checkJwt, // Protect route: only authenticated users
  // isAdmin, // Optional: only admins can create
  upload.array('productImages', 5), // Handle up to 5 images for field 'productImages'
  validate(CreateProductSchema),
  asyncHandler(productController.createProductHandler),
);

// GET /api/v1/products - Get all products (public)
router.get('/', asyncHandler(productController.getAllProductsHandler));

// GET /api/v1/products/:id - Get a single product by ID (public)
router.get(
  '/:id',
  validate(ProductIdParamSchema), // Validate that :id is a CUID
//   productController.getProductByIdHandler(id),
);

// PUT /api/v1/products/:id - Update a product
router.put(
  '/:id',
//   checkJwt,
  // isAdmin,
  upload.array('productImages', 5), // Allow image updates
  validate(UpdateProductSchema), // Use ProductIdParamSchema as part of this or combine
//   asyncHandler(productController.updateProductHandler),
);

// DELETE /api/v1/products/:id - Delete a product
router.delete(
  '/:id',
//   checkJwt,
  // isAdmin,
  validate(ProductIdParamSchema),
  asyncHandler(productController.deleteProductHandler),
);

export { router as productRoutes };