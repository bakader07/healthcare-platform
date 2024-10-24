const fs = require("fs");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");

require("./db");
const MLModel = require("./models/MLModel");
const MLModelVersion = require("./models/MLModelVersion");
const Dataset = require("./models/Dataset");

const modelsRouter = require("./routes/models");
const { models } = require("mongoose");

const upload = multer({ dest: "uploads/" });

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true,
		keepExtensions: true,
		uploadDir: "uploads",
	})
);

const dir = path.join(__dirname, "public");
app.use(express.static(dir));

app.set("view engine", "ejs");

app.get("/main", (req, res) => {
	// res.json({ message: "ok" });
	res.render("home");
});

app.use("/models", modelsRouter);

app.get("/test", (req, res) => {
	// res.json({ message: "ok" });
	res.render("photo");
});

app.get("/upload", (req, res) => {
	// res.json({ message: "ok" });
	res.render("upload");
});
app.post("/upload", upload.single("model"), async (req, res) => {
	try {
		console.log(req.body.name);
		console.log(req.file.filename);
		const model = new MLModel({
			name: req.body.name,
			filename: req.file.filename,
		});
		await model.save();
		console.log(model);
		res.redirect("/models");
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
});

//*******************************************************************/

app.get("/", (req, res) => {
	try {
		res.render("index");
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
});

app.get("/apps", async (req, res) => {
	try {
		const models = await MLModel.find();
		res.render("apps", { models });
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
});

app.get("/add-app", (req, res) => {
	try {
		res.render("add-app");
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
});
app.post("/add-app", upload.single("model"), async (req, res) => {
	try {
		console.log(req.body.name);
		console.log(req.file.filename);
		const filename = req.file.filename;
		await fs.rename(
			`${__dirname}/uploads/${filename}`,
			`${__dirname}/uploads/${filename}.h5`,
			function (err) {
				if (err) console.log("ERROR: " + err);
			}
		);
		const model = new MLModel({
			name: req.body.name,
			filename: `${filename}.h5`,
			description: req.body.description,
			team: req.body.members,
		});
		await model.save();
		const modelVersion = new MLModelVersion({
			name: req.body.version,
			filename: `${filename}.h5`,
			model: model._id,
		});
		await modelVersion.save();
		console.log("model:", model);
		console.log("model version:", modelVersion);
		res.redirect("/apps");
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
});

app.get("/apps/:id", async (req, res) => {
	try {
		console.log(req.params.id);
		const model = await MLModel.findById(req.params.id);
		console.log("Model:", model);
		if (!model) {
			return res.status(404).json({ error: "Model not found" });
		}
		console.log("here");
		const versions = await MLModelVersion.find({ model: model._id });
		console.log("Versions:", versions);
		res.render("app", { model, versions });
		console.log("now here");
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
});
app.post("/apps/:id", upload.single("image"), async (req, res) => {
	try {
		console.log(req.params.id);
		console.log(req.body.version);
		const modelVersion = await MLModelVersion.findById(req.body.version);
		const model = await MLModel.findById(req.params.id);
		console.log(model);
		console.log(modelVersion);
		console.log(req.file);

		const versions = await MLModelVersion.find({ model: model._id });
		console.log("Versions:", versions);

		const form = new FormData();
		form.append("model", modelVersion.filename);
		form.append("image", req.file.filename);
		const result = await fetch("http://localhost:5000/predict", {
			method: "POST",
			body: form,
		}).then((response) => response.json());

		const prediction = result[0] > 0.5 ? "Positive" : "Negative";
		res.render("app", { model, versions, prediction });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// app.get("/add-app-version", (req, res) => {
// 	try {
// 		res.render("add-app-version");
// 	} catch (error) {
// 		res.status(500).json({ error: "Internal server error" });
// 	}
// });
app.get("/add-app-version/:id", async (req, res) => {
	try {
		console.log(req.params.id);
		const model = await MLModel.findById(req.params.id);
		console.log("Model:", model);
		if (!model) {
			return res.status(404).json({ error: "Model not found" });
		}
		res.render("add-app-version", { model });
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
});
app.post("/add-app-version/:id", upload.single("model"), async (req, res) => {
	try {
		console.log(req.params.id);
		const model = await MLModel.findById(req.params.id);
		console.log("Model:", model);
		if (!model) {
			return res.status(404).json({ error: "Model not found" });
		}

		console.log(req.file.filename);
		const filename = req.file.filename;
		await fs.rename(
			`${__dirname}/uploads/${filename}`,
			`${__dirname}/uploads/${filename}.h5`,
			function (err) {
				if (err) console.log("ERROR: " + err);
			}
		);
		const modelVersion = new MLModelVersion({
			name: req.body.version,
			filename: `${filename}.h5`,
			model: model._id,
		});
		await modelVersion.save();
		console.log("Version:", modelVersion);
		const versions = await MLModelVersion.find({ model: model._id });
		console.log("Versions:", versions);
		res.redirect(`/apps/${model._id}`);
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
});

app.get("/datasets", async (req, res) => {
	try {
		const datasets = await Dataset.find();
		res.render("datasets", { datasets });
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
});

// app.get("/add-dataset", (req, res) => {
// 	try {
// 		res.render("add-dataset");
// 	} catch (error) {
// 		res.status(500).json({ error: "Internal server error" });
// 	}
// });
app.get("/add-dataset", (req, res) => {
	try {
		res.render("add-dataset");
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
});
app.post("/add-dataset", upload.single("dataset"), async (req, res) => {
	try {
		console.log(req.body.name);
		console.log(req.file.filename);
		const filename = req.file.filename;
		const dataset = new Dataset({
			name: req.body.name,
			filename: filename,
			description: req.body.description,
		});
		await dataset.save();
		console.log("dataset:", dataset);
		res.redirect("/datasets");
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
});

app.get("/datasets/:id", async (req, res) => {
	try {
		console.log(req.params.id);
		const dataset = await Dataset.findById(req.params.id);
		console.log(dataset);
		if (!dataset) {
			return res.status(404).json({ error: "Dataset not found" });
		}
		res.render("dataset", { dataset });
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
});

app.get("/paludism", (req, res) => {
	try {
		res.render("dataset");
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
});

app.get("/about", (req, res) => {
	try {
		res.render("about");
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
});

app.get("/scientific-manifestations", (req, res) => {
	try {
		res.render("sci-man");
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
});

app.get("/publications", (req, res) => {
	try {
		res.render("pubs");
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
});

app.get("/contact", (req, res) => {
	try {
		res.render("contact");
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
});

app.get("/login", (req, res) => {
	try {
		res.render("login");
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
});

app.get("/404", (req, res) => {
	try {
		res.render("404");
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
});

app.get("/achouak", (req, res) => {
	try {
		res.render("achouak");
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
});
app.post("/achouak", upload.single("image"), async (req, res) => {
	try {
		console.log(req.params.id);
		// const model = await MLModel.findById(req.params.id);
		// console.log(model);
		console.log(req.file);

		const modelFilename = "achouak_model.h5";
		// const modelFilename = model.filename;
		const imageFilename = req.file.filename;

		const form = new FormData();
		form.append("model", modelFilename);
		form.append("image", imageFilename);
		const result = await fetch("http://localhost:5000/predict", {
			method: "POST",
			body: form,
		}).then((response) => response.json());

		console.log(result);
		res.render("achouak", { result: result });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

app.get("/ibrahim", (req, res) => {
	try {
		res.render("ibrahim");
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
});
app.post("/ibrahim", upload.single("image"), async (req, res) => {
	try {
		console.log(req.params.id);
		// const model = await MLModel.findById(req.params.id);
		// console.log(model);
		console.log(req.file);

		const modelFilename = "ibrahim_model.h5";
		// const modelFilename = model.filename;
		const imageFilename = req.file.filename;

		const form = new FormData();
		form.append("model", modelFilename);
		form.append("image", imageFilename);
		const result = await fetch("http://localhost:5000/predict", {
			method: "POST",
			body: form,
		}).then((response) => response.json());

		console.log(result);
		res.render("ibrahim", { result: result });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

app.get("/download", function (req, res) {
	const file = `${__dirname}/test/cell_images.zip`;
	res.download(file); // Set disposition and send it.
});

app.get("/download/:id", async function (req, res) {
	const dataset = await Dataset.findById(req.params.id);
	console.log(dataset.filename);
	const file = `${__dirname}/uploads/${dataset.filename}`;
	res.download(file, `${dataset.name}.zip`); // Set disposition and send it.
});

app.listen(port, () => {
	console.log(`listening at http://localhost:${port}`);
});
