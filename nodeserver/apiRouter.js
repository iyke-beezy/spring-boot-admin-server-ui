const express = require("express");
const axios = require("axios");
const apiRouter = express.Router();
const debug = require("debug");
debug("dev");

apiRouter.get("/", async (req, res) => {
	const { que } = req.query;
	const newPath = `http://localhost:8080${que}`;
	try {
		const response = await axios.get(newPath, {
			Headers: { Accept: "application/json" },
			withCredentials: true,
			auth: {
				username: "user",
				password: "password",
			},
		});
		const { data } = response;
		res.status(201).send(data);
	} catch (err) {
		res.status(401).send(err.message);
	}
	// const response = await axios.get()
});

module.exports = apiRouter;
