const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();
const authRouter = require("./routes/api/auth");
const flossRouter = require("./routes/api/floss");
const userFlossesRouter = require("./routes/api/userFlosses");
const userSchemasRouter = require("./routes/api/userSchemas");
const userWishListRouter = require("./routes/api/userWishList");
const profileRouter = require("./routes/api/userProfile")
const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/FlossCollection", flossRouter);
app.use("/users", authRouter);
app.use("/flosses", userFlossesRouter);
app.use("/schemas",  userSchemasRouter);
app.use("/wishList",  userWishListRouter);
app.use("/profile",  profileRouter);




app.get("/", (req, res) => {
  res.status(200).send("<h2>Homepage</h2>");
});

app.use((req, res) => {
  res.status(404).json({ message: "Not found 404" });
});

app.use((err, req, res, next) => {
  if(err.status){res.status(err.status).json({ message: err.message })}
else
  res.status(500).json({ message: err.message });
});

module.exports = app;
