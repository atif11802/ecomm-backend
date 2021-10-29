const mongoose = require("mongoose");

//mongodb server
mongoose.connect(process.env.DATABASE)
	.then(() => console.log("db connected"))
	.catch((err) => console.log(err));
