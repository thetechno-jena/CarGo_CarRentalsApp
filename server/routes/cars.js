const express = require("express");
const mongoose = require("mongoose");
const Car = require("../models/car");
const authMiddleware = require("../middleware/authMiddleware");

const carsRouter = express.Router();

carsRouter.get("/api/cars", authMiddleware, async (req, res) => {
  try {
    const cars = await Car.find({ available: { $ne: false } }).sort({ brand: 1, name: 1 });
    res.json({ cars });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

carsRouter.get("/api/cars/:id", authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: "Invalid car id" });
    }

    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ msg: "Car not found" });
    }

    res.json({ car });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = carsRouter;
