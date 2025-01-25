import dotenv from "dotenv";
import connectDB from "./db/db.js";
import { app } from "./app.js";

dotenv.config({
    path: './.env'
});

connectDB()
.then( () => {
    app.on("Server Initiation Failed ⚠️ !!!", (error) => {
        console.log("Error",error);
        throw error;
    });
    app.get("/",(req,res)=>{
        res.send("Server is running");
    })
    server.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at ${process.env.PORT || 8000}`);
    })
})
.catch((error) => {
    console.error("MongoDB Connection Failed ⚠️ !!!",error);
});