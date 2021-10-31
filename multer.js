const multer = require("multer");
const path = require("path");

// Multer config
module.exports = multer({
	storage: multer.diskStorage({}),
	// fileFilter: (req, file, cb) => {
	// 	let ext = path.extname(file.originalname);
	// 	if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
	// 		cb(new Error("File type is not supported"), false);
	// 		return;
	// 	}
	// 	cb(null, true);
	// },
	fileFilter: (req, file, cb) => {
		if (
			file.mimetype == "image/png" ||
			file.mimetype == "image/jpg" ||
			file.mimetype == "image/jpeg"
		) {
			cb(null, true);
		} else {
			cb(null, false);
			return cb(
				new Error(
					"Only .png, .jpg and .jpeg format allowed!"
				)
			);
		}
	},
});

// // var multer = require("multer");

// var storage = multer.diskStorage({
// 	destination: function (req, file, cb) {
// 		cb(null, "uploads/");
// 	},
// 	filename: function (req, file, cb) {
// 		cb(null, Date.now() + file.originalname);
// 	},
// });

// var upload = multer({ storage: storage });

// module.exports = { upload };
