import express from "express";
import { sendFeedback } from "../controllers/contactController.js";

const contactRouter = express.Router();

contactRouter.post("/send", sendFeedback);

export default contactRouter;
