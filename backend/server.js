const express = require("express");
const cors = require("cors");
const { config } = require("dotenv");
const { readFileSync, readdirSync } = require("fs");
const connectDb = require("./config/db");
const bodyParser = require("body-parser");

config({
  path: "./.env",
});
const app = express();

app.use(cors());

// only for stripe
app.use("/api/stripe-webhook", bodyParser.raw({ type: "*/*" }));

app.use(express.json());

// db
connectDb();

// routes

readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("App is running on PORT => ", PORT);
});
