const express = require("express");
const app = express();
const router = require("./routers/router");
const path = require("path");
const db = require("./db/db");
const session = require("express-session");

app.set("db", db);

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
app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const PORT = 5050;

app.use("/", router);

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
