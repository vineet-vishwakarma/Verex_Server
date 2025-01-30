import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config({ path: './.env' });

// Export configuration object
export const config = {
  port: process.env.PORT || 5000,
  corsOrigin: process.env.CORS_ORIGIN,
  sessionSecret: process.env.SESSION_SECRET || "your-secret-key",
  nodeEnv: process.env.NODE_ENV,
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI
  }
};