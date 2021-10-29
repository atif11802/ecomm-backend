const express = require("express");
const router = express.Router();
const { isAuth, isAdmin } = require("../controllers/auth");
const {
	userById,
	read,
	update,
	purchaseHistory,
} = require("../controllers/user");

router.get("/secret/:userId", isAuth, isAdmin, (req, res) => {
	res.json({
		message: "okk",
		user: req.profile,
	});
});

router.get("/user/:userId", isAuth, read);
router.put("/user/:userId", isAuth, update);
router.get("/orders/by/user/:userId", isAuth, purchaseHistory);

router.param("userId", userById);
module.exports = router;
