const Workout = require('../Models/User');

// POST: Add workout
const addWorkout = async (req, res) => {
   try {
    const { userId, type, name, sets, reps, weight, date } = req.body;
    if (!userId) return res.status(400).json({ message: "UserId is required" });

    const newWorkout = new Workout({
      userId,
      type,
      name,
      sets,
      reps,
      weight,
      date,
    });

    const savedWorkout = await newWorkout.save();
    res.status(201).json(savedWorkout);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET: Fetch all workouts
const getAllWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find().sort({ date: -1 });
    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workouts', error: error.message });
  }
};

// DELETE: Remove workout by ID
const deleteWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    await Workout.findByIdAndDelete(id);
    res.status(200).json({ message: 'Workout deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting workout', error: error.message });
  }
};

// PUT: Update workout by ID
const updateWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedWorkout = await Workout.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ message: 'Workout updated successfully', workout: updatedWorkout });
  } catch (error) {
    res.status(500).json({ message: 'Error updating workout', error: error.message });
  }
};

module.exports = {
  addWorkout,
  getAllWorkouts,
  deleteWorkout,
  updateWorkout
};
