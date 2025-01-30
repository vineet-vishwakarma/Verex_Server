import { config } from "./config.js";
import connectDB from "./db/db.js";
import { app } from "./app.js";
import { google } from "googleapis";

export const oauth2Client = new google.auth.OAuth2(
    config.google.clientId,
    config.google.clientSecret,
    config.google.redirectUri
);

connectDB()
    .then(() => {
        app.listen(config.port || 5000, () => {
            console.log(`Server is running at ${config.port || 5000}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB Connection Failed ⚠️ !!!", error);
    });
