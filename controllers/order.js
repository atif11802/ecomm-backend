const { Order, CartItem } = require("../models/order");

exports.create = (req, res) => {
	// console.log("create order", req.body);
	req.body.order.user = req.profile;

	// console.log(req.body);/
	const order = new Order(req.body.order);
	order.save((error, data) => {
		if (error) return res.status(400).json(error);
		res.json(data);
		// console.log(data, "data saved");
	});
};

exports.listOrders = (req, res) => {
	Order.find()
		.populate("user")
		.sort("-created")
		.exec((error, orders) => {
			if (error)
				return res.status(400).json({
					error:
						"sorry products couldnt be listed",
				});
			res.json(orders);
		});
};

exports.getStausValues = (req, res) => {
	res.json(Order.schema.path("status").enumValues);
};

exports.OrderById = async (req, res, next, id) => {
	await Order.findById(id)
		.populate("products.product", "name price")
		.exec((err, order) => {
			if (err || !order)
				return res.status(400).json({
					error: "sorry products not found",
				});
			req.product = order;
			next();
		});
};

exports.updateOrderStatus = (req, res) => {
	Order.update(
		{ _id: req.body.orderId },
		{
			$set: {
				status: req.body.status,
			},
		},
		{ new: true },
		(error, order) => {
			if (error || !order)
				return res.status(400).json({
					error: errorHandler(error),
				});

			res.json(order);
		}
	);
};
