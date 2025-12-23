import foodModel from "../models/foodModel.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";

// API to get dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        // 1. Total Users
        const totalUsers = await userModel.countDocuments({});

        // 2. Total Food Items
        const totalFoodItems = await foodModel.countDocuments({});

        // 3. Total Orders
        const totalOrders = await orderModel.countDocuments({});

        // 4. Total Revenue (Calculate from paid orders)
        // Assuming orders with status other than 'Cancelled' and payment=true count towards revenue
        // Or just summing all for now as a simple metric, but filtering by payment=true is better
        const revenueResult = await orderModel.aggregate([
            { $match: { payment: true } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        // 5. Order Status Distribution (for charts/breakdown)
        const orderStatus = await orderModel.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        // 6. Recent Orders (limit 5)
        const recentOrders = await orderModel.find({})
            .sort({ date: -1 })
            .limit(5);

        res.json({
            success: true,
            data: {
                totalUsers,
                totalFoodItems,
                totalOrders,
                totalRevenue,
                orderStatus,
                recentOrders
            }
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error Fetching Stats" });
    }
}

export { getDashboardStats };
