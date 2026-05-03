const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ MongoDB Connection
mongoose.connect("mongodb+srv://piyushagrawal101994_db_user:admin123@cluster0.zx3iucb.mongodb.net/propertyDB?retryWrites=true&w=majority")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("MongoDB Error:", err));

// ✅ Root route (for testing)
app.get("/", (req, res) => {
  res.send("✅ AI Property Backend is Running");
});

// ✅ Area Schema
const areaSchema = new mongoose.Schema({
  name: String,
  city: String,
  basePrice: Number,
  connectivityScore: Number,
  infrastructureScore: Number,
  demandScore: Number,
  developmentScore: Number,
  livabilityScore: Number
});

const Area = mongoose.model("Area", areaSchema);

// ✅ GET all areas
app.get("/api/area", async (req, res) => {
  try {
    const areas = await Area.find();
    res.json(areas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ ADD new area (admin use)
app.post("/api/add-area", async (req, res) => {
  try {
    const newArea = new Area(req.body);
    await newArea.save();
    res.json({ message: "Area added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
