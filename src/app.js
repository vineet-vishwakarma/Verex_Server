import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import { config } from "./config.js";

const app = express();

app.use(
    cors({
        origin: config.corsOrigin,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    session({
        secret: config.sessionSecret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: config.nodeEnv === "production",
            httpOnly: true,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        },
    })
);

import emailRouter from "../src/routes/email.route.js";
import authRouter from "../src/routes/auth.route.js";

app.use("/email", emailRouter);
app.use("/auth", authRouter);

export { app };