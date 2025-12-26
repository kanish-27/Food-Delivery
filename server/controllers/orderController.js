import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import paypal from 'paypal-rest-sdk';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

paypal.configure({
    'mode': 'sandbox',
    'client_id': process.env.PAYPAL_CLIENT_ID || 'sb',
    'client_secret': process.env.PAYPAL_CLIENT_SECRET || 'sb'
});

// placing user order for frontend
const placeOrder = async (req, res) => {

    const frontend_url = "http://localhost:5173";
    const { userId, items, amount, address, paymentMethod } = req.body;

    try {
        const newOrder = new orderModel({
            userId: userId,
            items: items,
            amount: amount,
            address: address,
            paymentMethod: paymentMethod || "Stripe",
            status: paymentMethod === "cod" ? "Food Processing" : "Payment Pending",
            payment: false
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        if (paymentMethod === "stripe") {
            const stripeKey = process.env.STRIPE_SECRET_KEY;
            if (!stripeKey || stripeKey === 'sk_test_12345') {
                console.log("Stripe credentials missing/dummy. Redirecting to Mock Page.");
                res.json({ success: true, session_url: `${frontend_url}/mock-payment?method=stripe&orderId=${newOrder._id}&amount=${amount}` });
                return;
            }

            const line_items = items.map((item) => ({
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: item.name
                    },
                    unit_amount: item.price * 100 * 80
                },
                quantity: item.quantity
            }))

            line_items.push({
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: "Delivery Charges"
                    },
                    unit_amount: 2 * 100 * 80
                },
                quantity: 1
            })

            const session = await stripe.checkout.sessions.create({
                line_items: line_items,
                mode: 'payment',
                success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
                cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
            })

            res.json({ success: true, session_url: session.url })

        } else if (paymentMethod === "paypal") {

            // Check if PayPal credentials are actually set
            const clientId = process.env.PAYPAL_CLIENT_ID;
            const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

            if (!clientId || !clientSecret || clientId === 'sb' || clientSecret === 'sb') {
                // FALLBACK: Valid PayPal keys missing. Redirect to internal "Mock" payment page
                // to simulate the redirection experience the user requested.
                console.log("PayPal credentials missing. Redirecting to Mock Page.");
                res.json({ success: true, session_url: `${frontend_url}/mock-payment?method=paypal&orderId=${newOrder._id}&amount=${amount}` });
                return;
            }

            const subTotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            const deliveryCharge = amount - subTotal;

            const paypalItems = items.map(item => ({
                "name": item.name,
                "sku": item._id,
                "price": item.price.toFixed(2),
                "currency": "USD",
                "quantity": item.quantity
            }));

            if (deliveryCharge > 0) {
                paypalItems.push({
                    "name": "Delivery & Handling",
                    "sku": "DELIVERY",
                    "price": deliveryCharge.toFixed(2),
                    "currency": "USD",
                    "quantity": 1
                });
            }

            const create_payment_json = {
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
                    "cancel_url": `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
                },
                "transactions": [{
                    "item_list": {
                        "items": paypalItems
                    },
                    "amount": {
                        "currency": "USD",
                        "total": amount.toFixed(2)
                    },
                    "description": "Order for FastFood"
                }]
            };

            paypal.payment.create(create_payment_json, function (error, payment) {
                if (error) {
                    console.log(error.response); // Log detailed error
                    res.json({ success: false, message: "PayPal Error: " + (error.response?.message || error.message) });
                } else {
                    for (let i = 0; i < payment.links.length; i++) {
                        if (payment.links[i].rel === 'approval_url') {
                            res.json({ success: true, session_url: payment.links[i].href });
                            return;
                        }
                    }
                }
            });

        } else if (paymentMethod === "cod") {
            res.json({ success: true, message: "Order Placed" });
        } else {
            // For Apple Pay (and others if added), redirect to Mock Page for consistent experience
            res.json({ success: true, session_url: `${frontend_url}/mock-payment?method=${paymentMethod}&orderId=${newOrder._id}&amount=${amount}` })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success == "true") {
            // Check order payment method before confirming
            const order = await orderModel.findById(orderId);
            if (order && order.paymentMethod === "cod") {
                // COD orders go directly to processing
                await orderModel.findByIdAndUpdate(orderId, { payment: false });
                res.json({ success: true, message: "Order Placed" });
            } else {
                // All online payments must be verified by Admin
                await orderModel.findByIdAndUpdate(orderId, { payment: false, status: "Payment Pending" });
                res.json({ success: true, message: "Payment Pending Admin Approval" });
            }
        }
        else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Not Paid" })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// user orders for frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId, userDeleted: { $ne: true } });
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// Listing orders for admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// api for updating order status
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        // If Admin moves status to "Food Processing" (or further), assume Payment is verified.
        // Or if we specifically add a "Money Received" status. 
        // User asked: "order should be confirmed only when the admin make the status as the money received"
        // I will treat "Food Processing" as the confirmation of money received, as it enables the tracking flow.
        if (req.body.status === "Food Processing" || req.body.status === "Out for delivery") {
            await orderModel.findByIdAndUpdate(req.body.orderId, { payment: true });
        }
        res.json({ success: true, message: "Status Updated" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// user delete order
const deleteOrder = async (req, res) => {
    try {
        // We trust authMiddleware to provide the correct userId in req.body.userId
        // However, we must ensure we are deleting ONLY the order belonging to this user
        const order = await orderModel.findOne({ _id: req.body.orderId });

        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        // Strict check: Ensure the order's userId matches the token's userId
        if (order.userId.toString() !== req.body.userId) {
            return res.json({ success: false, message: "Unauthorized action" });
        }

        // Soft delete: Mark as deleted for user, but keep in DB for admin
        await orderModel.findByIdAndUpdate(req.body.orderId, { userDeleted: true });
        res.json({ success: true, message: "Order Removed from History" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus, deleteOrder }
