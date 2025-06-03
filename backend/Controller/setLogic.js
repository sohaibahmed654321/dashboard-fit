const SetCounter = require("../Models/Setuser");

exports.addSetCounter = async (req, res) => {
  const { workoutName, totalSets, userId } = req.body;

  if (!workoutName || totalSets == null || !userId) {
    return res.status(400).json({ message: "Please fill all required fields including userId." });
  }

  try {
    const newSetCounter = new SetCounter({
      workoutName,
      totalSets,
      userId,  // store userId reference
    });

    await newSetCounter.save();
    res.status(201).json({ message: "SetCounter added successfully", data: newSetCounter });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
