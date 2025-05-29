import { CreateProductInput, UpdateProductInput } from "./product.validation";
import { uploadToCloudinary, deleteFromCloudinaryByUrl } from '../../../config/cloudinary'; // Adjust path
import { Product } from "@prisma/client";
import slugify from "slugify"; // npm install slugify @types/slugify --save-dev
import prisma from "../../../lib/prisma";
import { ApiError } from "../../utils/apiError";


// Helper function to generate a unique slug
async function generateUniqueSlug(
  name: string,
  productIdToExclude?: string
): Promise<string> {
  let baseSlug = slugify(name, { lower: true, strict: true });
  let uniqueSlug = baseSlug;
  let counter = 1;
  while (true) {
    const existingProduct = await prisma.product.findFirst({
      where: {
        slug: uniqueSlug,
        NOT: productIdToExclude ? { id: productIdToExclude } : undefined,
      },
      select: { id: true },
    });
    if (!existingProduct) {
      break;
    }
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }
  return uniqueSlug;
}

export async function createProduct(
  data: CreateProductInput,
  files?: Express.Multer.File[]
): Promise<Product> {
  const imageUrls: string[] = [];
  if (files && files.length > 0) {
    for (const file of files) {
      // If using memoryStorage, file.buffer is available. You might need to convert buffer to data URI string for Cloudinary
      // Example: const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      // const result = await uploadToCloudinary(dataUri, 'products');
      // If using diskStorage, file.path is available
      const result = await uploadToCloudinary(file.path, "products"); // 'products' is the folder in Cloudinary
      imageUrls.push(result.secure_url);
      // If using diskStorage, fs.unlinkSync(file.path); // Clean up temp file
    }
  }

  const slug = await generateUniqueSlug(data.name);

  return prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      slug,
      images: imageUrls,
      price: Number(data.price), // Ensure price and stock are numbers
      stock: Number(data.stock),
      category: {
        connect: { id: data.categoryId },
      },
    },
    include: { category: true },
  });
}

export async function getAllProducts(): Promise<Product[]> {
  return prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProductById(id: string): Promise<Product | null> {
  return prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
}

export async function updateProduct(
  id: string,
  data: UpdateProductInput,
  files?: Express.Multer.File[]
): Promise<Product | null> {
  const existingProduct = await prisma.product.findUnique({ where: { id } });
  if (!existingProduct) {
    return null; // Or throw ApiError(404, 'Product not found')
  }

  const newImageUrls: string[] = [];
  // This example replaces all images. You might want more complex logic
  // (e.g., keep existing, add new, delete specific old ones).
  if (files && files.length > 0) {
    // Optional: Delete old images from Cloudinary if they are being replaced
    // for (const oldImageUrl of existingProduct.images) {
    //   await deleteFromCloudinaryByUrl(oldImageUrl);
    // }
    for (const file of files) {
      const result = await uploadToCloudinary(file.path, "products");
      newImageUrls.push(result.secure_url);
      // fs.unlinkSync(file.path); // Clean up temp file if using diskStorage
    }
  }

  let slug = existingProduct.slug;
  if (data && data.name && data.name !== existingProduct.name) {
    slug = await generateUniqueSlug(data.name, id);
  }

  return prisma.product.update({
    where: { id },
    data: {
      // Only include fields that are valid for update
      ...(data?.name && { name: data.name }),
      ...(data?.description && { description: data.description }),
      slug,
      ...(newImageUrls.length > 0 && { images: newImageUrls }),
      ...(data?.price && { price: Number(data.price) }),
      ...(data?.stock && { stock: Number(data.stock) }),
      ...(data?.categoryId && {
        category: { connect: { id: data.categoryId } },
      }),
    },
    include: { category: true },
  });
}

export async function deleteProduct(id: string): Promise<Product | null> {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    throw new ApiError(404, "Product not found for deletion");
  }
  // Optional: Delete images from Cloudinary
  // for (const imageUrl of product.images) {
  //   await deleteFromCloudinaryByUrl(imageUrl);
  // }
  return prisma.product.delete({
    where: { id },
  });
}
