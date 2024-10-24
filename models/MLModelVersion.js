const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema({
	name: { type: String, required: true },
	filename: { type: String, required: true },
	model: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "MLModel",
		required: true,
	},
});

module.exports = mongoose.model("MLModelVersion", modelSchema);
