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
    const today = new Date().toISOString().split("T")[0];

    const cars = await Car.find();

    const activeBookings = await Booking.find({
      status: "Booked",
      returnDate: { $gte: today }
    });

    const carsWithAvailability = cars.map(function (car) {
      const carObject = car.toObject();

      const booking = activeBookings.find(function (booking) {
        return booking.carId === car._id.toString();
      });

      if (booking) {
        carObject.available = false;
        carObject.unavailableUntil = booking.returnDate;
      } else {
        carObject.available = true;
        carObject.unavailableUntil = "";
      }

      return carObject;
    });

    console.log(carsWithAvailability);
    res.json({ cars: carsWithAvailability });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = carRouter;