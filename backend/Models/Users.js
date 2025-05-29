const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  height: {
    type: Number,
    required: true // in centimeters
  },
  weight: {
    type: Number,
    required: true // in kilograms
  },
  fitnessGoal: {
    type: String,
    required: true
  },
  bmi: {
    type: Number
  }
});

// Calculate BMI before saving
userSchema.pre("save", function (next) {
  if (this.height && this.weight) {
    const heightInMeters = this.height / 100; // convert cm to meters
    this.bmi = +(this.weight / (heightInMeters ** 2)).toFixed(2); // round to 2 decimal places
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
