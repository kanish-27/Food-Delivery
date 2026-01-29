import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/food-del');
        console.log("DB Connected");
    } catch (error) {
        console.error("DB Connection Error: ", error);
    }
}
