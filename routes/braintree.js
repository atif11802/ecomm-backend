const express = require("express");
const router = express.Router();
const { isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const { generateToken, processPayment } = require("../controllers/braintree");

router.get("/braintree/getToken/:userId", isAuth, generateToken);
router.post("/braintree/payment/:userId", isAuth, processPayment);

router.param("userId", userById);

module.exports = router;
