const express = require('express');
const app = express();
app.use(express.json());

let data = [
  { area: "Vaishali Nagar", price: 5200, trend: "up" },
  { area: "Mansarovar", price: 4800, trend: "up" }
];

// Get all data
app.get('/data', (req, res) => {
  res.json(data);
});

// Add new data
app.post('/add', (req, res) => {
  const newItem = req.body;
  data.push(newItem);
  res.json({ message: "Added successfully" });
});

app.listen(3000, () => console.log("Server running"));
