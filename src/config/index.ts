import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join((process.cwd(), ".env")) });

export const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL,
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET!,
    accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || "5m", // e.g., 5 minutes
    refreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || "30d", // e.g., 30 days
    // For HttpOnly cookies
    // accessTokenCookieName: 'accessToken',
    // refreshTokenCookieName: 'refreshToken',
  },
  bcryptSaltRounds:process.env.BCRYPT_SALT_ROUNDS || "10",
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  // Add other configurations like frontend URL for CORS
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
};

// Ensure required variables are present (simple check)
if (!config.databaseUrl || !config.jwt.secret) {
  console.error("FATAL ERROR: Missing critical environment variables.");
  process.exit(1);
}
