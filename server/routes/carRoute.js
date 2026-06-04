const express = require("express");
const Car = require("../models/cars");

const carRouter = express.Router();

// CREATE CAR
carRouter.post("/api/saveCars", async (req, res) => {
  try {
    const car = new Car(req.body);
    await car.save();

    res.status(201).json({
      msg: "Car saved successfully",
      car
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET ALL CARS
carRouter.get("/api/getCars", async (req, res) => {
  try {
    const cars = await Car.find();

    res.json({
      cars
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = carRouter;