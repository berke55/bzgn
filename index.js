const express = require("express");
const monk = require("monk");
const path = require("path");
const favicon = require("serve-favicon");
const hsts = require("hsts");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(hsts());
app.use(express.static(path.join(__dirname, "u")));
app.use(express.json({limit: "1kb"}));
app.use(favicon(path.join(__dirname, "u", "favicon.ico")));

const port =  process.env.PORT || 3000;
const server = app.listen(port, () => {
	console.log("listening at " + port);
});

const db = monk(process.env.MONGO);
const urlDB = db.get("url");

const urlshortener = require(path.join(__dirname, "urlshortener.js"))(app, urlDB);

app.get("/file/:file", (req, res) => {
	res.redirect(`https://bzgn.azurewebsites.net/${req.params.file}`);
});

app.get("/folder/:folder", (req, res) => {
	res.redirect(`https://bzgn.azurewebsites.net/files/${req.params.folder}`);
});

const notFound = path.join(__dirname, "u", "404.html");
app.use((req, res, next) => {
	res.status(404).sendFile(notFound);
});

app.use((err, req, res, next) => {
	if (err.status) {
		res.status(err.status);
	} else {
		res.status(500);
	}
	res.json({
		message: err.message
	});
});
