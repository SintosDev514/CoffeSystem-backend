import mongoose from 'mongoose';



export const connectDB = async () => {
    console.log("Mongo URL:", process.env.MONGO_URL);
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB Status : ${conn.connection.host} `);
    }catch(error){
        console.error(`MongoDB Error status : ${error}`);
        process.exit(1); 
    }
}