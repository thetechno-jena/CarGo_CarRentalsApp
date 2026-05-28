const mongoose = require("mongoose");

const tripSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Signup_User",
    required: true
  },
  tripName: String,
  location: String,
  description: String,
  accommodation: String,
  activities: String,
  photoUrl: String,
  startDate: String,
  endDate: String
},
{
  timestamps: true
});

module.exports = mongoose.model("Trip", tripSchema, "trips");