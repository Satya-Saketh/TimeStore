import mongoose from "mongoose";

export const connectDB = async()=>{

    try {

        await mongoose.connect('mongodb+srv://satyasaketh2003_db_user:satyasaketh2003_db_user@cluster0.rebdfos.mongodb.net/?appName=Cluster0');
        console.log("Connected to DB")
        
    } catch (error) {

        console.log("Error While Connecting to DB", error);
        
    }

}