const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "mysecretkey";

// MongoDB
mongoose.connect("mongodb+srv://admin:admin123@cluster0.zx3iucb.mongodb.net/propertyDB?retryWrites=true&w=majority")
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// Schema
const PropertySchema = new mongoose.Schema({
  area: String,
  price: Number,
  trend: String
});

const Property = mongoose.model("Property", PropertySchema);

// 🔐 LOGIN API
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "admin123") {
    const token = jwt.sign({ username }, SECRET);
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// 🔐 Middleware (protect routes)
function verifyToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) return res.status(403).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

// ✅ PROTECTED ADD API
app.post("/add", verifyToken, async (req, res) => {
  try {
    const newData = new Property(req.body);
    await newData.save();
    res.json({ message: "Data saved" });
  } catch {
    res.status(500).json({ message: "Error" });
  }
});

// PUBLIC DATA API
app.get("/data", async (req, res) => {
  const data = await Property.find();
  res.json(data);
});

// TEST
app.get("/", (req, res) => {
  res.send("Secure Backend Running 🚀");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Server running"));
