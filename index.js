import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import connectDb from "./utils/db.js";
import bcrypt from "bcryptjs";
import router from "./routes/route.js";

dotenv.config({});
const app=express();
app.use(express.json());
app.use('/api/v4/',router);
const port=8080
app.listen(port,()=>{
    console.log(`connected to port ${port}`);
})
connectDb();