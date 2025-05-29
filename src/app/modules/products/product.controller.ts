
import { Request, Response } from 'express';
import * as productService from './product.service';
import { CreateProductInput, UpdateProductInput, ProductIdParamInput } from './product.validation';
import { ApiError } from '../../utils/apiError';

export async function createProductHandler(
  req: Request<{}, {}, CreateProductInput>, // More specific typing if validate only parses body
  res: Response,
) {
  const files = req.files as Express.Multer.File[] | undefined;
  const product = await productService.createProduct(req.body, files);
  res.status(201).json({ success: true, data: product });
}

export async function getAllProductsHandler(req: Request, res: Response) {
  // Add query params for pagination, filtering, sorting later
  const products = await productService.getAllProducts();
  res.status(200).json({ success: true, data: products });
}

export async function getProductByIdHandler(
  req: Request,
  res: Response,
) {
  const product = await productService.getProductById(req.params.id);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }
  res.status(200).json({ success: true, data: product });
}

export async function updateProductHandler(
  req: Request<ProductIdParamInput, {}, UpdateProductInput>,
  res: Response,
) {
  const files = req.files as Express.Multer.File[] | undefined;
  const updatedProduct = await productService.updateProduct(req.params.id, req.body, files);
  if (!updatedProduct) {
    throw new ApiError(404, 'Product not found for update');
  }
  res.status(200).json({ success: true, data: updatedProduct });
}

export async function deleteProductHandler(
  req: Request,
  res: Response,
) {
  await productService.deleteProduct(req.params.id);
  res.status(204).send(); // No content
}