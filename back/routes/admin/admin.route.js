import express from "express";
import {
    addExistingProduct,
  addNewProduct,
  analyticsForSoledItems,
  editProduct,
  getEmployeeBranches,
  getProducts,
  lowStockProducts,
} from "../../controller/admin/admin.controller.js";
import multer from "multer";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/addNewProduct", upload.single("image"), addNewProduct);

router.post("/editProduct/:id", upload.single("image"), editProduct);

router.get("/getEmployeeBranches", getEmployeeBranches);
router.get("/getProducts", getProducts);
router.post("/addExistingProduct", addExistingProduct);
router.get("/LowStockProducts", lowStockProducts);
router.get("/analyticsForSoldItems", analyticsForSoledItems);
export default router;