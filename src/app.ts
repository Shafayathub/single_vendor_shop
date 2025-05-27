// src/app.ts
import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config";
// import { errorHandler } from './core/middlewares/errorHandler';
// import { requestLogger } from './core/middlewares/requestLogger'; // If you add one
// import { authRoutes } from './modules/auth/auth.routes';
// import { productRoutes } from './modules/products/product.routes';
// import { categoryRoutes } from './modules/categories/category.routes';
// ... import other module routes

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({ origin: config.clientUrl, credentials: true /* if needed */ }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(requestLogger); // Example: morgan

// API Routes
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "API is running..." });
}); // Health check
// app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/products', productRoutes);
// app.use('/api/v1/categories', categoryRoutes);
// ... mount other routes (users, orders, cart)

// Global Error Handler (must be last)
// app.use(errorHandler);

export default app;
