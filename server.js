const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB connection (PASTE YOUR LINK HERE)
mongoose.connect("mongodb+srv://admin:admin123@cluster0.zx3iucb.mongodb.net/propertyDB?retryWrites=true&w=majority")
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// ✅ Schema
const PropertySchema = new mongoose.Schema({
  area: String,
  price: Number,
  trend: String
});

const Property = mongoose.model("Property", PropertySchema);

// ✅ Add data
app.post("/add", async (req, res) => {
  try {
    const newData = new Property(req.body);
    await newData.save();
    res.json({ message: "Data saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error saving data" });
  }
});

// ✅ Get data
app.get("/data", async (req, res) => {
  const data = await Property.find();
  res.json(data);
});

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Backend running with DB 🚀");
});

// ✅ Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
