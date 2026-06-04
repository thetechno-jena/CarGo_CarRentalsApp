const express = require("express");
const mongoose = require("mongoose");
const Booking = require("../models/booking");
const Car = require("../models/car");
const authMiddleware = require("../middleware/authMiddleware");

// Bookings API routes added by Gabriel Balbuena (12292617).
const bookingsRouter = express.Router();

bookingsRouter.post("/api/bookings", authMiddleware, async (req, res) => {
  try {
    const { carId, pickupDate, returnDate, pickupLocation } = req.body;

    if (!carId || !pickupDate || !returnDate || !pickupLocation) {
      return res.status(400).json({ msg: "Car, pickup date, return date, and pickup location are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(carId)) {
      return res.status(400).json({ msg: "Invalid car id" });
    }

    if (returnDate < pickupDate) {
      return res.status(400).json({ msg: "Return date must be after pickup date" });
    }

    const car = await Car.findById(carId);
    if (!car || !car.available) {
      return res.status(404).json({ msg: "Car not found or unavailable" });
    }

    const booking = await Booking.create({
      userId: req.user.id,
      carId,
      carName: car.name,
      pickupDate,
      returnDate,
      pickupLocation
    });

    res.status(201).json({ msg: "Booking created successfully", booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

bookingsRouter.get("/api/bookings", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

bookingsRouter.put("/api/bookings/:id", authMiddleware, async (req, res) => {
  try {
    const { pickupDate, returnDate, pickupLocation } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: "Invalid booking id" });
    }

    if (!pickupDate || !returnDate || !pickupLocation) {
      return res.status(400).json({ msg: "Pickup date, return date, and pickup location are required" });
    }

    if (returnDate < pickupDate) {
      return res.status(400).json({ msg: "Return date must be after pickup date" });
    }

    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { pickupDate, returnDate, pickupLocation },
      { returnDocument: "after", runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    res.json({ msg: "Booking updated successfully", booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

bookingsRouter.delete("/api/bookings/:id", authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: "Invalid booking id" });
    }

    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { status: "Cancelled" },
      { returnDocument: "after" }
    );

    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    res.json({ msg: "Booking cancelled successfully", booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = bookingsRouter;
