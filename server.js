const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Razorpay = require("razorpay");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "mysecretkey";

// 🔐 Replace with NEW keys (DO NOT SHARE)
const razorpay = new Razorpay({
  key_id: "YOUR_NEW_KEY_ID",
  key_secret: "YOUR_NEW_KEY_SECRET"
});

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

// LOGIN
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "admin123") {
    const token = jwt.sign({ username }, SECRET);
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// AUTH
function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "No token" });

  try {
    jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

// ADD DATA (PROTECTED)
app.post("/add", verifyToken, async (req, res) => {
  try {
    const newData = new Property(req.body);
    await newData.save();
    res.json({ message: "Saved" });
  } catch {
    res.status(500).json({ message: "Error" });
  }
});

// GET DATA
app.get("/data", async (req, res) => {
  const data = await Property.find();
  res.json(data);
});

// 💳 CREATE ORDER
app.post("/create-order", async (req, res) => {
  try {
    const options = {
      amount: 9900,
      currency: "INR",
      receipt: "receipt_" + Date.now()
    };

    const order = await razorpay.orders.create(options);
    res.json(order);

  } catch (err) {
    res.status(500).json({ error: "Order failed" });
  }
});

// TEST
app.get("/", (req, res) => {
  res.send("Backend with Razorpay running 🚀");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Server running"));
