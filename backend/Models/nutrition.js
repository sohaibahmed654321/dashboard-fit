const mongoose = require('mongoose');

const nutritionSchema = new mongoose.Schema({
  foodName: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fats: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // 👈 Add this line
}, { timestamps: true });

module.exports = mongoose.model('Nutrition', nutritionSchema);
