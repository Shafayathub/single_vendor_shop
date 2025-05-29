import dotenv from "dotenv";
import path from 'path';


dotenv.config({ path: path.join((process.cwd(), '.env')) });

export const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL,
  auth0: {
    secret: process.env.AUTH0_SECRET as string,
    baseURL: process.env.AUTH0_BASE_URL as string,
    clientID: process.env.AUTH0_CLIENT_ID as string,
    clientSecret: process.env.AUTH0_CLIENT_SECRET as string, // Important for session integrity and some flows
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL as string,
    callbackPath: "/callback", // Default, can be customized
    loginPath: "/login", // Default
    logoutPath: "/logout", // Default
  },
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET,
    },
  // Add other configurations like frontend URL for CORS
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
};

// Ensure required variables are present (simple check)
// if (!config.databaseUrl || !config.auth0.audience || !config.auth0.domain) {
//   console.error("FATAL ERROR: Missing critical environment variables.");
//   process.exit(1);
// }
