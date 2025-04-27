const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  createProduct,
  getOneProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

router.get("/", getAllProducts);

router.post("/create", createProduct);

router.get("/findOne/:id", getOneProduct);

router.put("/update/:id", updateProduct);

router.delete("/delete/:id", deleteProduct);

module.exports = router;
