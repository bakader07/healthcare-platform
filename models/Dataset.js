const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema({
	name: { type: String, required: true },
	description: { type: String, required: true },
	filename: { type: String, required: true },
});

module.exports = mongoose.model("Dataset", modelSchema);
