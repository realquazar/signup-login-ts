import mongoose, { connection } from "mongoose";

export async function connect() {
    try {
        mongoose.connect(process.env.MONGO_URI!);
        const connection = mongoose.connection;

        connection.on("connected", () => {
            console.log("Connected to MongoDB successfully");            
        })

        connection.on("error", (err) => {
            console.log("Error connecting to MongoDB", err);
            process.exit();
            
        })

    } catch (error) {
        console.log("SOmething went wrong");
        console.log(error);
        
        

    }
}