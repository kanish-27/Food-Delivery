import 'dotenv/config'
import mongoose from "mongoose";
import orderModel from "./models/orderModel.js";
import { connectDB } from "./config/db.js";

const fixOrderImages = async () => {
    await connectDB();

    try {
        const orders = await orderModel.find({});
        console.log(`Found ${orders.length} orders. Checking for broken Chicken Roll images...`);

        let updatedCount = 0;

        for (const order of orders) {
            let orderUpdated = false;
            const newItems = order.items.map(item => {
                if (item.name === "Chicken Rolls" || item.name === "Chicken Roll") {
                    // Update image to the known valid one
                    if (item.image !== "chicken_roll_item.png") {
                        console.log(`Fixing image for order ${order._id}, item: ${item.name}`);
                        item.image = "chicken_roll_item.png";
                        orderUpdated = true;
                    }
                }
                return item;
            });

            if (orderUpdated) {
                // We need to verify if we can just save the doc or if we need to update via query
                // Mongoose documents are objects. Modifying nested array might require marking as modified.
                // order.items = newItems; // (Already modified in place if map returns same objects, but safety first)
                // order.markModified('items'); 

                // Let's use findByIdAndUpdate to be safe and direct
                await orderModel.findByIdAndUpdate(order._id, { items: newItems });
                updatedCount++;
            }
        }

        console.log(`Successfully updated ${updatedCount} orders to use the correct Chicken Roll image.`);

    } catch (error) {
        console.error("Error fixing order images:", error);
    } finally {
        mongoose.disconnect();
        console.log("Disconnected from DB.");
    }
}

fixOrderImages();
