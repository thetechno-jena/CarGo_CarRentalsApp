const mongoose = require("mongoose");

const carSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    registrationNo: { type: String, required: true, trim: true, unique: true },
    brand: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    seats: { type: Number, required: true },
    transmission: { type: String, required: true, trim: true },
    fuel: { type: String, required: true, trim: true },
    pricePerDay: { type: Number, required: true },
    image: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    available: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Car", carSchema, "cars");
