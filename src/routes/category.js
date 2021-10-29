const express = require("express");
const router = express.Router();
const { isAuth, isAdmin } = require("../controllers/auth");
const {
	create,
	categoryById,
	update,
	remove,
	read,
	list,
} = require("../controllers/category");
const { userById } = require("../controllers/user");

router.post("/category/create/:userId", isAuth, isAdmin, create);
router.patch("/category/:categoryId/:userId", isAuth, isAdmin, update);
router.delete("/category/:categoryId/:userId", isAuth, isAdmin, remove);
router.get("/category/:categoryId", read);
router.get("/categories", list);

router.param("userId", userById);
router.param("categoryId", categoryById);
module.exports = router;
