import { User as PrismaUser } from "@prisma/client"; // Assuming your Prisma User model is named User

declare global {
  namespace Express {
    export interface Request {
      user?: PrismaUser; // Or a subset of user properties you need
    }
  }
}
