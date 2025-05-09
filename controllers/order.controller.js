const Order = require("../models/order.model");
const User = require("../models/user.model");

//create an order
const createOrder = async (req, res) => {
  try {
    const { products, seller, customer } = req.body;

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

    if (!customer || !customer.phone || !customer.name) {
      return res
        .status(400)
        .json({ message: "Customer information is required." });
    }

    //save the order with the req.body data without adding date it will be added on the schema by default
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();

    // Find the user by seller.id and push the new order's ID into their orders array
    const user = await User.findById(seller.id);
    if (!user) {
      return res.status(404).json({ message: "Seller not found" });
    }

    user.orders.push(savedOrder._id); // Push the new order ID into the user's orders array
    await user.save(); // Save the updated user document

    res.status(201).json(savedOrder);
    console.log("Order created successfully: ");
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Errro creating order: ", error);
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
    const { orderedAt, orderedAt_gte, orderedAt_lte, sellerName } = req.query;
    const query = {};

    // Filter by seller name
    if (sellerName) {
      query["seller.name"] = { $regex: sellerName, $options: "i" }; // Case-insensitive partial match
    }

    // Filter by specific date
    if (orderedAt) {
      query.orderedAt = {
        $eq: new Date(orderedAt), // Match the exact date
      };
    }

    // Filter by date range (start date)
    if (orderedAt_gte) {
      query.orderedAt = {
        ...query.orderedAt,
        $gte: new Date(orderedAt_gte), // Greater than or equal to the start date
      };
    }

    // Filter by date range (end date)
    if (orderedAt_lte) {
      query.orderedAt = {
        ...query.orderedAt,
        $lte: new Date(orderedAt_lte), // Less than or equal to the end date
      };
    }

    const orders = await Order.find(query).sort({ orderedAt: -1 });
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
