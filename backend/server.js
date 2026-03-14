require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const journalRoutes = require("./routes/journalRoutes");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET","POST","PUT","DELETE"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// routes
app.use("/api/journal", journalRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});