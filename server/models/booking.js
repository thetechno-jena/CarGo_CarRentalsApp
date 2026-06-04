const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Signup_User", required: true },
    carId: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
    carName: { type: String, required: true, trim: true },
    pickupDate: { type: String, required: true },
    returnDate: { type: String, required: true },
    pickupLocation: { type: String, required: true, trim: true },
    status: { type: String, enum: ["Booked", "Cancelled"], default: "Booked" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema, "bookings");
