import express from "express";
import { addEmployee, createBranch, createShop, getEmployees, getOwnerSalesData, getOwnerShopsBranchesProducts, getShops } from "../../controller/owner/owner.controller.js";

const router = express.Router();


router.post("/createShop", createShop);
router.post("/createBranch", createBranch);
router.get("/getShops", getShops);
router.post("/addEmployee", addEmployee);
router.get("/getEmployees", getEmployees);
router.get("/getOwnerShopsBranchesProducts", getOwnerShopsBranchesProducts);
router.get("/getOwnerSalesData", getOwnerSalesData);
// Example protected route

export default router;