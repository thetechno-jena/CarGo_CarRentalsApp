const mongoose = require("mongoose");

const carSchema = mongoose.Schema({
  registrationNo: {
    type: String,
    required: true,
    unique: true
  },
  name: { type: String, required: true },
  brand: { type: String, required: true },
  type: { type: String, required: true },
  seats: { type: Number, required: true },
  transmission: { type: String, required: true },
  fuel: { type: String, required: true },
  pricePerDay: { type: Number, required: true },
  image: { type: String },
  description: { type: String }
});

module.exports = mongoose.model("Car", carSchema);