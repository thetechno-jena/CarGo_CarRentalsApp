const express = require("express");
const Booking = require("../models/booking");

const bookingRouter = express.Router();

// SAVE BOOKING
bookingRouter.post("/api/saveBooking", async (req, res) => {
  try {
    const existingBooking = await Booking.findOne({
      carId: req.body.carId,
      status: "Booked",
      pickupDate: { $lte: req.body.returnDate },
      returnDate: { $gte: req.body.pickupDate }
    });

    if (existingBooking) {
      return res.status(400).json({
        msg: "This car is already booked for the selected dates."
      });
    }

    const booking = new Booking(req.body);
    await booking.save();

    res.status(201).json({
      msg: "Booking saved successfully",
      booking
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET BOOKINGS
bookingRouter.get("/api/getBookings", async (req, res) => {
  try {
    const { userId } = req.query;

    const bookings = userId
      ? await Booking.find({ userId })
      : await Booking.find();

    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE BOOKING
bookingRouter.put("/api/updateBooking/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      msg: "Booking updated successfully",
      booking
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE BOOKING
bookingRouter.delete("/api/deleteBooking/:id", async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);

    res.json({
      msg: "Booking deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = bookingRouter;