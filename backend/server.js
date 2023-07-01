const express = require("express");
const cors = require("cors");
const { config } = require("dotenv");
const { readFileSync, readdirSync } = require("fs");
const connectDb = require("./config/db");

config({
  path: "./.env",
});
const app = express();

app.use(cors());
app.use(express.json());

// db
connectDb();

// routes

readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("App is running on PORT => ", PORT);
});
