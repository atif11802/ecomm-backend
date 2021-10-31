require("dotenv").config();
const User = require("../models/user");
const { signUpValidate, loginValidate } = require("../validator/index");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { errorHandler } = require("../helpers/handleError");

exports.signUp = async (req, res) => {
	const { error } = signUpValidate(req.body);
	// console.log(error);
	if (error)
		return res.status(400).json({ err: error.details[0].message });

	const exist = await User.findOne({ email: req.body.email });

	if (exist) return res.status(400).json({ err: "email already exists" });

	const user = new User(req.body);

	try {
		const newUser = await user.save();
		return res.json({ data: newUser });
	} catch (err) {
		return res.status(400).json({ err: errorHandler(err) });
	}
};

exports.login = async (req, res) => {
	try {
		const { error } = loginValidate(req.body);
		// console.log(error);
		if (error)
			return res
				.status(400)
				.json({ err: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });

		// console.log(user);
		if (!user)
			return res.status(400).json({ err: "User not found" });

		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);

		console.log(validPassword);

		if (!validPassword)
			return res
				.status(400)
				.json({ err: "Invalid password" });

		const token = jwt.sign(
			{ user_id: user._id },
			process.env.SECRET_KEY,
			{
				expiresIn: "2h",
			}
		);
		res.cookie("token", token);
		user.password = undefined;

		return res.json({
			token: token,
			user: user,
		});
	} catch (err) {
		res.status(400).json({ err: "auth failed" });
	}
};

exports.logout = (req, res) => {
	res.clearCookie("t");
	res.json({ message: "signout success" });
};

exports.isAuth = async (req, res, next) => {
	try {
		const user = req.profile;
		const token = req.headers.authorization;

		var verifyUser = await jwt.verify(
			token.replace("Bearer", "").trim(),
			process.env.SECRET_KEY
		);

		if (verifyUser.user_id != user._id) {
			return res
				.status(400)
				.json({ message: "Invalid user" });
		}
	} catch (err) {
		return res.status(400).json({ error: "access denied" });
	}
	next();
};

exports.isAdmin = async (req, res, next) => {
	try {
		const user = req.profile;

		if (user.role === 0) {
			return res
				.status(400)
				.json({ admin: "admin access denied" });
		}
		console.log("admin access granted");
	} catch (err) {
		return res.status(400).json({ admin: "access denied" });
	}
	next();
};
