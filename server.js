const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

//routes
const userRouter = require("./routes/user.route");
const orderRouter = require("./routes/order.route");
const productRouter = require("./routes/product.route");

const app = express();

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    exposedHeaders: ["Content-Range"],
  })
);
app.use(cors());
app.use(express.urlencoded({ extended: false }));

//routers of models
app.use("/api/orders", orderRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);

mongoose
  .connect(`${process.env.LOCAL_KEY}`)
  .then(() => {
    console.log("Connected to the database");
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to the database: ", error);
  });
