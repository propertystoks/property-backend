const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());


// =============================
// MONGODB CONNECTION
// =============================

mongoose.connect(
  "mongodb+srv://piyushagrawal101994_db_user:admin123@cluster0.zx3iucb.mongodb.net/propertyDB?retryWrites=true&w=majority"
)

.then(() => {

  console.log("MongoDB Connected");

})

.catch((err) => {

  console.log("MongoDB Error:", err);

});


// =============================
// ROOT ROUTE
// =============================

app.get("/", (req, res) => {

  res.send("✅ EstateQuant AI Backend Running");

});


// =============================
// AREA SCHEMA
// =============================

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


// =============================
// GET ALL AREAS
// =============================

app.get("/api/area", async (req, res) => {

  try {

    const areas = await Area.find();

    res.json(areas);

  } catch (err) {

    console.error(err);

    res.status(500).json({

      message: "Server error"

    });
  }
});


// =============================
// ADD AREA
// =============================

app.post("/api/add-area", async (req, res) => {

  try {

    // DUPLICATE CHECK

    const existing = await Area.findOne({

      name: req.body.name,

      city: req.body.city

    });

    if (existing) {

      return res.status(400).json({

        message: "Area already exists"

      });
    }


    // CREATE NEW AREA

    const newArea = new Area(req.body);

    await newArea.save();


    res.json({

      message: "Area added successfully"

    });

  } catch (err) {

    console.error(err);

    res.status(500).json({

      message: "Server error"

    });
  }
});


// =============================
// DELETE AREA
// =============================

app.delete("/api/delete-area/:id", async (req, res) => {

  try {

    await Area.findByIdAndDelete(req.params.id);

    res.json({

      message: "Area deleted successfully"

    });

  } catch (err) {

    console.error(err);

    res.status(500).json({

      message: "Server error"

    });
  }
});


// =============================
// START SERVER
// =============================

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);

});
