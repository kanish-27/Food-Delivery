import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import userModel from "./models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/food-del');
        console.log("DB Connected");

        const adminEmail = "admin@example.com";
        const adminPassword = "adminpassword123";

        // Check if admin already exists
        const existingAdmin = await userModel.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log("Admin user already exists");
            // Optionally update role if needed
            if (existingAdmin.role !== 'admin') {
                existingAdmin.role = 'admin';
                await existingAdmin.save();
                console.log("Updated existing user to admin role");
            }
        } else {
            // Create new admin
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminPassword, salt);

            const newAdmin = new userModel({
                name: "Admin User",
                email: adminEmail,
                password: hashedPassword,
                role: "admin"
            });

            await newAdmin.save();
            console.log("Admin user created successfully");
        }

        mongoose.connection.close();
    } catch (error) {
        console.error("Error creating admin:", error);
        process.exit(1);
    }
};

createAdmin();
