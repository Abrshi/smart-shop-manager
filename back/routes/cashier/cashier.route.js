import express from "express";
import {  getSaleItems, getScanedProducts, recent, verifyCheckout, verifyTotal } from "../../controller/cashier/cashier.contriller.js";

const router = express.Router();


router.post("/scan", getScanedProducts);
router.post("/verify-total", verifyTotal);
router.post("/confirm", verifyCheckout);
router.get("/sale-items/:saleId", getSaleItems);
router.get("/recent", recent);


// Example protected route

export default router;