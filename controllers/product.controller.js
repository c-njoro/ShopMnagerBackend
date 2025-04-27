const Product = require("../models/product.model");

// Get all Product items
const getAllProducts = async (req, res) => {
  try {
    const { name, category, quantity, unit } = req.query;
    const query = {};

    // Filter by name
    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    // Filter by category
    if (category) {
      query.category = { $regex: category, $options: "i" };
    }

    // Filter by minimum quantity
    if (quantity) {
      query.quantity = { $gte: Number(quantity) };
    }

    // Filter by unit
    if (unit) {
      query.unit = { $regex: unit, $options: "i" };
    }

    const products = await Product.find(query);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single Product item by ID
const getOneProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productItem = await Product.findById(id);

    if (!productItem) {
      return res.status(404).json({ message: "Product item not found!" });
    }

    res.status(200).json(productItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new Product item
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a Product item
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product item not found!" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a Product item
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product item not found!" });
    }

    res.status(200).json(deletedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getOneProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
