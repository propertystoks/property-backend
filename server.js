const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// ================= MONGO DB CONNECT =================
mongoose.connect("mongodb+srv://piyushagrawal101994_db_user:admin123@cluster0.2x3iucb.mongodb.net/propertyDB?retryWrites=true&w=majority")
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log("MongoDB Error:", err));

// ================= PAYMENT SCHEMA =================
const paymentSchema = new mongoose.Schema({
  paymentId: String,
  userId: String,
  amount: Number,
  status: String,
  plan: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  validTill: Date
});

const Payment = mongoose.model("Payment", paymentSchema);

// ================= AREA SCHEMA =================
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

// ================= AI LOGIC =================
function calculateScore(area) {
  const total =
    area.connectivityScore +
    area.infrastructureScore +
    area.demandScore +
    area.developmentScore +
    area.livabilityScore;

  return total / 100;
}

function generateReport(area) {
  const score = calculateScore(area) * 100;

  let decision = "HOLD";
  let risk = "MEDIUM";

  if (score >= 75) {
    decision = "BUY";
    risk = "LOW";
  } else if (score < 50) {
    decision = "AVOID";
    risk = "HIGH";
  }

  const finalPrice = area.basePrice * (0.7 + score / 100);

  return {
    area: area.name,
    city: area.city,
    score: Math.round(score),
    decision,
    risk,
    finalPrice: Math.round(finalPrice),
    growth: score >= 75 ? "12-18%" : "5-10%"
  };
}

// ================= PAYMENT API =================
app.post("/api/payment", async (req, res) => {
  try {
    const { paymentId, userId, amount } = req.body;

    const payment = new Payment({
      paymentId,
      userId,
      amount,
      status: "SUCCESS",
      plan: "PREMIUM",
      validTill: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    await payment.save();

    res.json({
      success: true,
      message: "Payment Saved Successfully",
      data: payment
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ================= CREATE AREA (ADMIN) =================
app.post("/api/area", async (req, res) => {
  try {
    const area = new Area(req.body);
    await area.save();
    res.json({ success: true, area });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= GET AI REPORT =================
app.get("/api/report/:id", async (req, res) => {
  try {
    const area = await Area.findById(req.params.id);

    if (!area) {
      return res.status(404).json({ message: "Area not found" });
    }

    const report = generateReport(area);

    res.json(report);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
