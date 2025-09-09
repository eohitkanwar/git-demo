const express = require("express");
const dotenv = require("dotenv");
const path = require("path")
const cors = require("cors");
const router = require("../LoginPage/routes/user");
const databaseConnection = require("./config/database");
dotenv.config();

const app = express();
let port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors({ origin: "http://localhost:3001" }));

databaseConnection();
app.use("/api", router);
app.get("/test", (req,res) => {
  return res.send("Server is running...")
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
