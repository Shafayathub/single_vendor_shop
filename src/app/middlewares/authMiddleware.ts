// src/core/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { config } from '../../config'; // Adjust path
import prisma from '../../lib/prisma'; // Adjust path
import { ApiError } from '../utils/apiError'; // Adjust path
import { Role } from '@prisma/client';



export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

      // Attach user to request object
      // You might want to fetch the fresh user from DB to ensure they still exist/are active
      const currentUser = await prisma.user.findUnique({
        where: { id: decoded.userId as string },
        select: { id: true, email: true, role: true /* add other fields if needed */ }
      });

      if (!currentUser) {
        return next(new ApiError(401, 'User belonging to this token no longer exists.'));
      }

      req.user = {
        id: currentUser.id,
        email: currentUser.email,
        role: currentUser.role,
      };

      next();
    } catch (error) {
      console.error(error);
      if (error instanceof jwt.TokenExpiredError) {
        return next(new ApiError(401, 'Token expired. Please log in again.'));
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return next(new ApiError(401, 'Invalid token. Please log in again.'));
      }
      return next(new ApiError(401, 'Not authorized, token failed.'));
    }
  }

  if (!token) {
    return next(new ApiError(401, 'Not authorized, no token.'));
  }
};

// Optional: Middleware to authorize based on roles
export const authorize = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ApiError(403, `User role ${req.user?.role} is not authorized to access this route.`)
      );
    }
    next();
  };
};