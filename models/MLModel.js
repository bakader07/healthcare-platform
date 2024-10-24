const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema({
	name: { type: String, required: true },
	team: { type: String },
	description: { type: String, required: true },
});

module.exports = mongoose.model("MLModel", modelSchema);
