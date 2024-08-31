const express = require("express");
const {
  createProduct,
  getProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/productController");
const router = express.Router();

const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");

router.post("/",authMiddleware, isAdmin, createProduct);
router.get("/:id", getProduct);
router.put("/:id",authMiddleware, isAdmin, updateProduct);
router.get("/", getAllProduct);
router.delete("/:id",authMiddleware, isAdmin, deleteProduct);

module.exports = router;
