import mongoose from "mongoose";
import dotenv from 'dotenv'
export const connectDB = async () => {

    try {

        const DB_URL = process.env.DB_URL

        await mongoose.connect(DB_URL);
        console.log("Connected to DB")

    } catch (error) {

        console.log("Error While Connecting to DB", error);

    }

}