import 'dotenv/config'
import mongoose from "mongoose";
import foodModel from "./models/foodModel.js";
import { connectDB } from "./config/db.js";

const addChickenRoll = async () => {
    await connectDB();

    try {
        // Remove existing Chicken Roll(s) to avoid duplicates or broken ones
        const deleteResult = await foodModel.deleteMany({
            name: { $in: ["Chicken Roll", "Chicken Rolls"] }
        });
        console.log(`Deleted ${deleteResult.deletedCount} existing Chicken Roll items.`);

        // Add correct Chicken Roll
        const newRoll = new foodModel({
            name: "Chicken Roll",
            description: "Delicious spicy chicken filling wrapped in a soft paratha",
            price: 100, // Matches user's screenshot price
            category: "Rolls",
            image: "chicken_roll_item.png"
        });

        await newRoll.save();
        console.log("Successfully added Chicken Roll to the menu.");

    } catch (error) {
        console.error("Error adding Chicken Roll:", error);
    } finally {
        mongoose.disconnect();
        console.log("Disconnected from DB.");
    }
}

addChickenRoll();
