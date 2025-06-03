const express = require('express');
const router = express.Router();
let Workout = require('../Models/User');
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
router.get('/getworkout/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const workouts = await Workout.find({ userId: userId });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ error: err.message});
  }
});
module.exports = router;
