// backend/models/setUser.js
const mongoose = require("mongoose");

const setCounterSchema = new mongoose.Schema({
  workoutName: { type: String, required: true },
  totalSets: { type: Number, required: true },
  
}, { timestamps: true });

module.exports = mongoose.model("SetCounter", setCounterSchema);
