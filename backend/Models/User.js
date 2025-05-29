// User.js
const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  type: { type: String, required: true },  // 👈 New field added
  name: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
  weight: { type: Number },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Workout', workoutSchema);
