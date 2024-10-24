const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/", async (req, res) => {
	// res.json({ message: "ok" })
	try {
		const models = await MLModel.find();
		console.log("models:", models);
		res.render("list", { models: models });
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
});
router.get("/:id", async (req, res) => {
	try {
		console.log(req.params.id);
		const model = await MLModel.findById(req.params.id);
		console.log(model);
		if (!model) {
			return res.status(404).json({ error: "Model not found" });
		}
		res.render("photo", { model: model });
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
});
router.post("/:id", upload.single("image"), async (req, res) => {
	try {
		console.log(req.params.id);
		const model = await MLModel.findById(req.params.id);
		console.log(model);
		console.log(req.file);

		const form = new FormData();
		form.append("model", model.filename);
		form.append("image", req.file.filename);
		const response = await fetch("http://localhost:5000/predict", {
			method: "POST",
			body: form,
		});

		res.render("photo", { result: response });
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
});

module.exports = router;
