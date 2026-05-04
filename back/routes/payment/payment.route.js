import express from "express";
import { payment, verifyPayment } from "../../controller/payment/payment.controller.js";


const router = express.Router();


router.post("/pay", payment);
router.get("/verify", verifyPayment);   


// Example protected route

export default router;