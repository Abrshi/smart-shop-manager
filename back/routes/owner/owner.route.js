import express from "express";
import { createBranch, createShop, getShops } from "../../controller/owner/owner.controller.js";

const router = express.Router();


router.post("/createShop", createShop);
router.post("/createBranch", createBranch);
router.post("/getShops", getShops);
// Example protected route

export default router;