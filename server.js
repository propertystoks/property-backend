const express = require('express');
const app = express();

app.use(express.json());

// IMPORTANT for Render
const PORT = process.env.PORT || 3000;

let data = [
  { area: "Vaishali Nagar", price: 5200, trend: "up" },
  { area: "Mansarovar", price: 4800, trend: "up" }
];

// Test route
app.get('/', (req, res) => {
  res.send("Backend is working");
});

// Get data
app.get('/data', (req, res) => {
  res.json(data);
});

// Add data
app.post('/add', (req, res) => {
  const newItem = req.body;
  data.push(newItem);
  res.json({ message: "Added successfully" });
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
