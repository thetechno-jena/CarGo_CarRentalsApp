const express = require("express");
const Booking = require("../models/booking");
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

// GET ALL CARS WITH AVAILABILITY
carRouter.get("/api/getCars", async (req, res) => {
  try {
    const cars = await Car.find();

    const bookedCars = await Booking.find({
      status: "Booked"
    });

    const bookedCarIds = bookedCars.map(function (booking) {
      return booking.carId;
    });

    const carsWithAvailability = cars.map(function (car) {
      const carObject = car.toObject();

      carObject.available = !bookedCarIds.includes(car._id.toString());

      return carObject;
    });

    res.json({
      cars: carsWithAvailability
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = carRouter;