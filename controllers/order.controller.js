const Order = require("../models/order.model");

//create an order
const createOrder = async (req, res) => {
  try {
    const { products, seller } = req.body;

    // Validate that products exist and are not empty
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ message: "Products are required to create an order." });
    }

    // Validate seller info
    if (!seller || !seller.id || !seller.name) {
      return res
        .status(400)
        .json({ message: "Seller information is required." });
    }

    //clean the products before saving
    const cleanedProducts = products.map((product) => {
      if (
        !product.productId ||
        !product.productName ||
        !product.unitPrice ||
        !product.quantity
      ) {
        throw new Error(
          "Each product must have productId, productName, unitPrice, and quantity."
        );
      }

      return {
        productId: product.productId,
        productName: product.productName.trim(),
        quantity: product.quantity,
        unitPrice: product.unitPrice,
        // No totalPrice here, it will be auto-calculated
      };
    });

    // Create a new order instance
    const newOrder = new Order({
      products: cleanedProducts,
      seller: {
        id: seller.id,
        name: seller.name.trim(),
      },
      // No totalAmount here, it will be auto-calculated in middleware
    });

    const savedOrder = await newOrder.save();

    //to add the order to the seller's orders array
    // await User.findByIdAndUpdate(savedOrder.seller.id, {
    //   $push: { orders: savedOrder._id }
    // });

    res.status(201).json({
      message: "Order created successfully!",
      order: savedOrder,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//update an order
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const allUpdates = {
      ...req.body,
      lastUpdated: Date.now(),
    };
    const updatedOrder = await Order.findByIdAndUpdate(id, allUpdates);
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found !!!!" });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//delete an order
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found !!!!" });
    }

    res.status(200).json(deletedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get all orders
const getAllOrders = async (req, res) => {
  try {
    const { waiter, table, orderStatus, paymentStatus } = req.query;
    const query = {};

    //filter by name
    if (table) {
      query.table = { $regex: table, $options: "i" };
    }

    //by waiter id
    if (waiter) {
      query.waiter = { $regex: waiter, $options: "i" }; // Use regex for partial matching
    }

    //by order status
    if (orderStatus) {
      query.orderStatus = { $regex: orderStatus, $options: "i" };
    }

    //by payment status
    if (paymentStatus) {
      query.paymentStatus = { $regex: paymentStatus, $options: "i" };
    }

    const orders = await Order.find(query).sort({ dateCreated: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get one by id
const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const oneGot = await Order.findById(id);

    if (!oneGot) {
      return res.status(404).json({ message: "Order could not be found!!!" });
    }

    res.status(200).json(oneGot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  updateOrder,
  deleteOrder,
  getAllOrders,
  getOne,
};
