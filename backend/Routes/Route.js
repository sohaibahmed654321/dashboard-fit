const express = require('express');
const router = express.Router();
const {
  addWorkout,
  getAllWorkouts,
  deleteWorkout,
  updateWorkout
} = require('../Controller/Logic');

// Add new workout
router.post('/add', addWorkout);

// Get all workouts
router.get('/', getAllWorkouts);

// Delete workout by ID
router.delete('/:id', deleteWorkout);

// Update workout by ID
router.put('/:id', updateWorkout);

module.exports = router;
