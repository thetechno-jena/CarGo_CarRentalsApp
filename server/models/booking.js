const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  carId: {
    type: String
  },
  carName: {
    type: String,
    required: true
  },
  pickupDate: {
    type: String,
    required: true
  },
  returnDate: {
    type: String,
    required: true
  },
  pickupLocation: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "Booked"
  }
});

module.exports = mongoose.model("Booking", bookingSchema);