const User = require("../models/user");
const { Order } = require("../models/order");
const { signUpValidate, loginValidate } = require("../validator/index");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

exports.userById = async (req, res, next, id) => {
	try {
		const user = await User.findById(id);
		// res.json({ user });
		req.profile = user;
	} catch (err) {
		res.json({ error: "user not found" });
	}
	next();
};

exports.read = async (req, res) => {
	// console.log(req.profile);
	req.profile.password = undefined;
	req.profile._id = undefined;
	req.profile.role = undefined;

	return res.json(req.profile);
};

exports.update = async (req, res) => {
	try {
		let password = req.body.password;

		password = await bcrypt.hash(password, 12);

		req.body.password = password;

		const updateUser = await User.findByIdAndUpdate(
			{ _id: req.profile._id },
			{
				$set: req.body,
			},
			{ new: true }
		);

		res.json({ updateUser });
	} catch (err) {
		res.status(400).json({ message: "not updated" });
	}
};

exports.addOrderToUserHistory = (req, res, next) => {
	let history = [];

	req.body.order.products.forEach((product) => {
		history.push({
			_id: product._id,
			name: product.name,
			description: product.description,
			category: product.category,
			quantity: product.count,
			transactions: req.body.order.transaction_id,
			amount: req.body.order.amount,
		});
	});

	User.findOneAndUpdate(
		{ _id: req.profile._id },
		{ $push: { history: history } },
		{ new: true },
		(err, data) => {
			if (err)
				return res.status(400).json({
					error: "could not update user history",
				});
			next();
			// return res.json(data);
		}
	);
};

exports.purchaseHistory = (req, res) => {
	Order.find({ user: req.profile._id })
		.populate("user", "_id name")
		.sort("-created")
		.exec((err, orders) => {
			if (err) return res.status(400).json(err);
			res.status(200).json(orders);
		});
};
