import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../utils/apiError'; // Adjust path as needed
import { config } from '../../config'; // Adjust path as needed

export const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error('------------------ ERROR ------------------');
  console.error(`Error occurred on path: ${req.path}`);
  console.error(err); // Log the full error for debugging
  console.error('-----------------------------------------');

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err // If you add a cause property to ApiError
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.flatten().fieldErrors,
    });
    return;
  }

  // Handle errors from express-oauth2-jwt-bearer (or express-jwt)
  if (err.name === 'UnauthorizedError' || err.status === 401) {
    res.status(401).json({
      success: false,
      message: err.message || 'Unauthorized: Invalid or missing token.',
    });
    return;
  }
  if (err.name === 'ForbiddenError' || err.status === 403) {
    res.status(403).json({
        success: false,
        message: err.message || 'Forbidden: You do not have permission to access this resource.',
    });
    return;
  }


  // Default to 500 server error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    // Optionally include stack in development
    ...(config.env === 'development' && { stack: err.stack }),
  });
  return;
};