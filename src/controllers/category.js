const Category = require("../models/category");

exports.create = async (req, res) => {
	try {
		const exist = await Category.findOne({ name: req.body.name });

		if (exist)
			return res
				.status(404)
				.json({ error: "category already exist" });

		console.log(req.body);
		const category = new Category(req.body);
		const savedCategory = await category.save();

		res.json({ category: savedCategory });
	} catch (err) {
		return res
			.status(400)
			.json({ error: "could not save category" });
	}
};

exports.categoryById = async (req, res, next, id) => {
	try {
		const category = await Category.findById(id);
		// res.json({ user });
		req.category = category;
	} catch (err) {
		res.json({ error: "category not found" });
	}
	next();
};

exports.update = async (req, res, next) => {
	try {
		const category = req.category;
		// console.log(category._id, req.body.name);
		const updateCategory = await Category.findByIdAndUpdate(
			{ _id: category._id },
			{
				$set: req.body,
			},
			{ new: true }
		);

		res.json({ updateCategory });
	} catch (err) {
		res.status(400).json({
			error: "category could not be updated",
		});
	}
};

exports.remove = async (req, res, next) => {
	try {
		const category = req.category;
		// console.log(category._id, req.body.name);
		const deletedCategory = await Category.findByIdAndDelete(
			category._id
		);

		res.json({ deletedCategory });
	} catch (err) {
		res.status(400).json({
			error: "category could not be deleted",
		});
	}
};

exports.read = async (req, res, next) => {
	try {
		const category = req.category;
		res.json({ category });
	} catch (err) {
		res.status(400).json({
			error: "category not found",
		});
	}
};

exports.list = async (req, res, next) => {
	try {
		const categories = await Category.find();
		res.json({ categories: categories });
	} catch (err) {
		res.status(400).json({
			error: "category not found",
		});
	}
};
