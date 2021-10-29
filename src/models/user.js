const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			maxLength: 32,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		phoneNumber: {
			type: String,
			maxLength: 12,
			minLength: 11,
			message: "phone number must be at least 11 characters",
		},
		password: { type: String, required: true, trim: true },
		role: { type: Number, default: 0 },
		history: { type: Array, default: [] },
	},
	{ timestamps: true }
);

userSchema.pre("save", async function (next) {
	if (this.isModified("password")) {
		this.password = await bcrypt.hash(this.password, 12);
	}
	next();
});

module.exports = mongoose.model("User", userSchema);
