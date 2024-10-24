const pool = require("../connect");

const createModell = tryCatchWrapper(async function (req, res, next) {
	const { title, contents } = req.body;

	if (!title || !contents)
		return next(createCustomError("All fields are required", 400));

	let sql = "INSERT INTO notes (title, contents) VALUES (?, ?)";
	await pool.query(sql, [title, contents]);

	return res.status(201).json({ message: "note has been created" });
});
const createModel = async (req, res, next) => {
	try {
		const { user_id, title, description, authors } = req.body;

		if (!(!title || !description || !user_id)) {
			let sql =
				"INSERT INTO model (user_id, title, description, authors) VALUES (?, ?, ?, ?)";
			await pool.query(sql, [user_id, title, description, authors]);
			return res.status(201).json({ message: "model has been created" });
		}
	} catch (err) {
		console.log(err);
	}
};

async function getModel(id) {
	let sql = "SELECT * FROM model WHERE id = ?";
	const [rows] = await pool.query(sql, [id]);
	return rows[0];
}

const getAllModels = async (req, res) => {
	try {
		let sql = "SELECT * from notes";
		const [rows] = await pool.query(sql);

		return res.status(200).json({ notes: rows });
	} catch (err) {
		console.error(err);
	}
};

const getSingleModel = async (req, res) => {
	try {
		const { id } = req.params;

		const note = await getModel(id);
		if (!note) return next(createCustomError("note not found", 404));

		return res.status(200).json(note);
	} catch (err) {
		console.error(err);
	}
};

const updateModel = tryCatchWrapper(async function (req, res, next) {
	const { id } = req.params;
	const { title, contents } = req.body;

	if (!id || !title || !contents)
		return next(createCustomError("All fields are required", 400));

	const note = await getModel(id);
	if (!note) return next(createCustomError("note not found", 404));

	let sql = "UPDATE notes SET title = ? , contents = ? WHERE id = ?";
	await pool.query(sql, [title, contents, id]);

	return res.status(201).json({ message: "note has been updated" });
});

const deleteModel = tryCatchWrapper(async function (req, res, next) {
	const { id } = req.params;

	if (!id) return next(createCustomError("Id is required", 400));

	const note = await getModel(id);
	if (!note) return next(createCustomError("note not found", 404));

	let sql = "DELETE FROM notes WHERE id = ?";
	await pool.query(sql, [id]);

	return res.status(200).json({ message: "note has been deleted" });
});

export const Models = {
	createModel,
	getAllModels,
	getSingleModel,
	updateModel,
	deleteModel,
};
