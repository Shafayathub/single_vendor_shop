import { User as PrismaUser } from "@prisma/client"; // Assuming your Prisma User model is named User

// Extend Express Request type to include 'user'
declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: string;
        email: string;
        role: Role; // Add other properties you put in JWT payload
      };
    }
  }
}
