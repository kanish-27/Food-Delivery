import 'dotenv/config'
import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import adminRouter from "./routes/adminRoute.js"

// app config
const app = express()
const port = 4000

// middleware
app.use(express.json())
app.use(cors())

// db connection
connectDB();

import contactRouter from "./routes/contactRoute.js"

// ... 

// api endpoints
app.use("/api/food", foodRouter)
app.use("/images", express.static('uploads'))
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)
app.use("/api/contact", contactRouter)
app.use("/api/admin", adminRouter)

app.get("/", (req, res) => {
    res.send("API Working")
})



// Ensure uploads directory exists
import fs from 'fs';
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

// Only listen if not running on Vercel
if (!process.env.VERCEL) {
    app.listen(port, () => {
        console.log(`Server Started on http://localhost:${port}`)
    })
}

export default app;
