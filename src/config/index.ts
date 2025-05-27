import dotenv from 'dotenv';
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL,
//   auth0: {
//     audience: process.env.AUTH0_AUDIENCE,
//     domain: process.env.AUTH0_DOMAIN,
//   },
//   cloudinary: {
//     cloudName: process.env.CLOUDINARY_CLOUD_NAME,
//     apiKey: process.env.CLOUDINARY_API_KEY,
//     apiSecret: process.env.CLOUDINARY_API_SECRET,
//   },
  // Add other configurations like frontend URL for CORS
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
};

// Ensure required variables are present (simple check)
// if (!config.databaseUrl || !config.auth0.audience || !config.auth0.domain) {
//   console.error("FATAL ERROR: Missing critical environment variables.");
//   process.exit(1);
// }