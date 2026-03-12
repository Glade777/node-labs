const express = require("express");
const path = require("path");
const session = require("express-session");

const sequelize = require("./db/db");
require("./models");

const router = require("./routers/router");

const app = express();
const PORT = 5050;

app.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        },
    }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/", router);

async function startApp() {
    try {
        await sequelize.authenticate();
        console.log("Database connected successfully");

        app.listen(PORT, () => {
            console.log(`Server is running on ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start application:", error);
    }
}

startApp();