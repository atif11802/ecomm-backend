const Product = require("../models/product");
const cloudinary = require("../cloudinary");

exports.create = async (req, res) => {
	try {
		// console.log(req.file);
		// console.log("sdasd", req.file);

		const {
			name,
			price,
			description,
			category,
			quantity,
			shipping,
		} = req.body;
		if (
			(!name,
			!price,
			!description,
			!category,
			!quantity,
			!shipping)
		) {
			return res
				.status(400)
				.json({ error: "fill all the field,kindly" });
		}

		// let name = req.body.name;
		const exist = await Product.findOne({ name });
		if (exist)
			return res
				.status(400)
				.json({ error: "product already exist" });
		const result = await cloudinary.uploader.upload(req.file.path);
		// res.json({result})
		const product = new Product({
			name,
			price,
			description,
			category,
			quantity,
			shipping,
			photo: result.secure_url,
			cloudinary_id: result.public_id,
		});

		await product.save();
		res.json(product);
	} catch (err) {
		console.log(err);
	}
};

exports.productById = (req, res, next, id) => {
	Product.findById(id)
		.populate("category")
		.exec((err, product) => {
			if (err || !product)
				return res.status(400).json({
					error: "product not found",
				});

			req.product = product;
			// console.log(product);
			next();
		});
};

exports.read = (req, res) => {
	// req.product.photo = undefined;
	res.json(req.product);
};

exports.remove = async (req, res) => {
	try {
		let id = req.product._id;
		// console.log(req.product.cloudinary_id);
		await cloudinary.uploader.destroy(req.product.cloudinary_id);
		const deletedProduct = await Product.findByIdAndDelete(id);
		res.json({ deletedProduct: deletedProduct });
	} catch (err) {
		res.json({ err });
	}
};

exports.update = async (req, res) => {
	try {
		const {
			_id,
			name,
			description,
			price,
			category,
			quantity,
			sold,
			photo,
			cloudinary_id,
			shipping,
		} = req.product;

		// console.log(req.file);
		let result;
		if (req.file) {
			await cloudinary.uploader.destroy(cloudinary_id);
			result = await cloudinary.uploader.upload(
				req.file.path
			);
		}

		const product = {
			name: req.body.name,
			price: req.body.price,
			description: req.body.description,

			quantity: req.body.quantity,
			shipping: req.body.shipping,
			category: req.body.category,
			photo: result.secure_url,
			cloudinary_id: result.public_id,
		};

		// console.log(_id, product);

		const updateProduct = await Product.findByIdAndUpdate(
			_id,
			product,
			{ new: true }
		);

		res.json({ updateProduct });
	} catch (err) {
		res.status(400).json({ err });
	}
};

exports.list = async (req, res) => {
	let order = req.query.order ? req.query.order : "asc";
	let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
	let limit = req.query.limit ? parseInt(req.query.limit) : 12;

	await Product.find()
		.populate("category")
		.sort([[sortBy, order]])
		.limit(limit)
		.exec((err, product) => {
			if (err) return res.status(500).json({ err });

			res.json(product);
		});
};

exports.listRelated = async (req, res) => {
	Product.find({
		_id: { $ne: req.product },
		category: req.product.category,
	})
		.populate("category", "_id name")
		.limit(4)
		.exec((err, products) => {
			if (err)
				return res.status(400).json({
					error: "Product not found",
				});

			res.json(products);
		});
};

exports.listCategories = async (req, res) => {
	Product.distinct("category", {}, (err, categories) => {
		if (err)
			return res.status(400).json({
				error: "Product not found",
			});
		res.json(categories);
	});
};

exports.listBySearch = (req, res) => {
	let order = req.body.order ? req.body.order : "desc";
	let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
	let limit = req.body.limit ? parseInt(req.body.limit) : 100;
	let skip = parseInt(req.body.skip);
	let findArgs = {};

	// console.log(order, sortBy, limit, skip, req.body.filters);
	// console.log("findArgs", findArgs);

	for (let key in req.body.filters) {
		if (req.body.filters[key].length > 0) {
			if (key === "price") {
				// gte -  greater than price [0-10]
				// lte - less than
				findArgs[key] = {
					$gte: req.body.filters[key][0],
					$lte: req.body.filters[key][1],
				};
			} else {
				findArgs[key] = req.body.filters[key];
			}
		}
	}

	Product.find(findArgs)
		.select("-photo")
		.populate("category")
		.sort([[sortBy, order]])
		.skip(skip)
		.limit(limit)
		.exec((err, data) => {
			console.log(err);
			if (err) {
				return res.status(400).json({
					error: "Products not found",
				});
			}
			res.json({
				size: data.length,
				data,
			});
		});
};

exports.photo = (req, res, next) => {
	if (req.product.photo.data) {
		// console.log(req.product.photo.data);
		res.set("Content-Type", req.product.photo.contentType);
		return res.send(req.product.photo.data);
	}
	next();
};

exports.listSearch = (req, res) => {
	//create query obj to hold search value and cate value
	const query = {};
	//assign search val to query.name
	if (req.query.search) {
		query.name = { $regex: req.query.search, $options: "i" };
		//assign cat val to query.category
		if (req.query.category && req.query.category !== "All") {
			query.category = req.query.category;
		}
		//find the product based on query obj with 2 properties
		//search and category
		Product.find(query, (err, products) => {
			if (err)
				return res.status(400).json({
					error: errorHandler(err),
				});

			res.json(products);
		}).select("-photo");
	}
};

exports.decreaseQuantity = (req, res, next) => {
	console.log("bulky", req.body.order.products);
	let bulkOps = req.body.order.products.map((item) => {
		return {
			updateOne: {
				filter: { _id: item._id },
				update: {
					$inc: {
						quantity: -item.count,
						sold: +item.count,
					},
				},
			},
		};
	});

	Product.bulkWrite(bulkOps, {}, (err, data) => {
		if (err)
			return res.status(400).json({
				error: "could not update product",
			});

		next();
	});
};
