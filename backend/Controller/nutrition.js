const express = require('express');
const Nutrition = require('../Models/nutrition');
const router = express.Router();
let mongoose = require("mongoose")

// CREATE
const addNutritionData = async (req, res) => {
  const { foodName, calories, protein, carbs, fats, user } = req.body;

  try {
    const newNutrition = new Nutrition({
      foodName,
      calories,
      protein,
      carbs,
      fats,
      user: user // 👈 associate with user
    })

    await newNutrition.save();
    res.status(201).json({ message: 'Nutrition data added', data: newNutrition });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Failed to add nutrition data', error });
  }
};

// GET ALL (user-specific)
const getAllNutritionData = async (req, res) => {
  const { userId, search, startDate, endDate } = req.query;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  const filter = { user: userId };

  if (search) {
    filter.foodName = { $regex: search, $options: 'i' }; // case-insensitive search
  }

  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  try {
    const data = await Nutrition.find(filter).sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch data', error });
  }
};


// GET ONE
const getNutritionByUserId = async (req, res) => {
  const userId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID format' });
  }

  try {
    const data = await Nutrition.find({ user: userId });

    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'No nutrition records found for this user' });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error });
  }
};

// UPDATE
const updateNutritionData = async (req, res) => {
  try {
    const updated = await Nutrition.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Data not found' });
    res.status(200).json({ message: 'Updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error });
  }
};

// DELETE
const deleteNutritionData = async (req, res) => {
  try {
    const deleted = await Nutrition.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Data not found' });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error });
  }
};

module.exports={addNutritionData,getAllNutritionData,getNutritionByUserId,updateNutritionData,deleteNutritionData}