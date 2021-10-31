const express = require("express");
const router = express.Router();
const { isAuth, isAdmin } = require("../controllers/auth");
const { userById, addOrderToUserHistory } = require("../controllers/user");
const {
	create,
	listOrders,
	getStausValues,
	OrderById,
	updateOrderStatus,
} = require("../controllers/order");
const { decreaseQuantity } = require("../controllers/product");

router.post(
	"/order/create/:userId",
	isAuth,
	addOrderToUserHistory,
	decreaseQuantity,
	create
);

router.put(
	"/order/:orderId/status/:userId",
	isAuth,
	isAdmin,
	updateOrderStatus
);

router.get("/order/list/:userId", isAuth, isAdmin, listOrders);
router.get("/order/status-values/:userId", isAuth, isAdmin, getStausValues);

router.param("userId", userById);
router.param("orderId", OrderById);

module.exports = router;
