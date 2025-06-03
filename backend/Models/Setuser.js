const mongoose = require("mongoose");

const setCounterSchema = new mongoose.Schema({
  workoutName: { type: String, required: true },
  totalSets: { type: Number, required: true },

  // Add userId as ObjectId reference
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

}, { timestamps: true });

module.exports = mongoose.model("SetCounter", setCounterSchema);
