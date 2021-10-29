const express = require("express");
const router = express.Router();
const { isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const {
	create,
	read,
	productById,
	remove,
	update,
	list,
	listRelated,
	listCategories,
	listBySearch,
	listSearch,
} = require("../controllers/product");

const upload = require("../multer");

router.post(
	"/product/create/:userId",
	isAuth,
	isAdmin,
	upload.single("image"),

	create
);
router.get("/product/:productId", read);
router.delete(
	"/product/:productId/:userId",

	isAuth,
	isAdmin,
	remove
);

router.patch(
	"/product/:productId/:userId",

	isAuth,
	isAdmin,
	upload.single("image"),
	update
);
router.get("/products", list);
router.get("/products/related/:productId", listRelated);
router.get("/products/categories", listCategories);
router.post("/products/by/search", listBySearch);
router.post("/products/by/search", listBySearch);
router.get("/products/search", listSearch);
// router.get("/product/photo/:productId", photo);

router.param("userId", userById);
router.param("productId", productById);
module.exports = router;
