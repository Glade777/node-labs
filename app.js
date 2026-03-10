require("dotenv").config();
const express = require("express");
const app = express();
const router = require("./routers/router");
const errorHandler = require("./middlewares/errorHandler");
const path = require("path");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const PORT = 5050;

app.use("/", router);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
});
