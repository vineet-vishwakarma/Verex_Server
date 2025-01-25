import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    googleId: String,
    email: String,
    accessToken: String,
    refreshToken: String
});

export const User = mongoose.model('User',userSchema);