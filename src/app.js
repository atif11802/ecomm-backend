require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");

require("./db/connection");
const bodyParser = require("body-parser");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const categoryRouter = require("./routes/category");
const productRouter = require("./routes/product");
const braintreeRoutes = require("./routes/braintree");
const orderRoutes = require("./routes/order");

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
	res.send("helo");
});

app.use(cookieParser());
app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", categoryRouter);
app.use("/api", productRouter);
app.use("/api", braintreeRoutes);
app.use("/api", orderRoutes);

app.listen(port, () => {
	console.log(`server running on port ${port}`);
});
