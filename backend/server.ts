import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Scheme from "./models/scheme";
import cors from "cors" ;

dotenv.config({ path: "../.env" });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "SchemeSetu backend is running 🚀",
  });
});
// Get all schemes
app.get("/api/schemes", async (req, res) => {
  try {
    const schemes = await Scheme.find();

    res.json({
      success: true,
      count: schemes.length,
      data: schemes,
    });
  } catch (error) {
    console.error("Failed to fetch schemes:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch schemes",
    });
  }
});

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed ❌", error);
  });