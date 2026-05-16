import express from "express";
import {  getScanedProducts, verifyCheckout, verifyTotal } from "../../controller/cashier/cashier.contriller.js";

const router = express.Router();


router.post("/scan", getScanedProducts);
router.post("/verify-total", verifyTotal);
router.post("/confirm", verifyCheckout);


// Example protected route

export default router;