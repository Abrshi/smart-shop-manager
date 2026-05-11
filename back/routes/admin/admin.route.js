import express from "express";
import {
    addExistingProduct,
  addNewProduct,
  editProduct,
  getEmployeeBranches,
  getProducts,
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
export default router;