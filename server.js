const express = require('express');
const cors = require('cors');

const app = express();

// ✅ Fix CORS (VERY IMPORTANT)
app.use(cors({
  origin: "*"
}));

app.use(express.json());

// ✅ Temporary database (in memory)
let properties = [];

// ✅ Test route
app.get('/', (req, res) => {
  res.send("Backend is working 🚀");
});

// ✅ Get all data
app.get('/data', (req, res) => {
  res.json(properties);
});

// ✅ Add new property (THIS FIXES YOUR BUTTON)
app.post('/add', (req, res) => {
  const { area, price, trend } = req.body;

  if (!area || !price) {
    return res.status(400).json({ message: "Missing data" });
  }

  const newProperty = {
    area,
    price,
    trend
  };

  properties.push(newProperty);

  console.log("Added:", newProperty);

  res.json({ message: "Data added successfully" });
});

// ✅ Start server
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
