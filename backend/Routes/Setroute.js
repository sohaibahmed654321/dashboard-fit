const express = require("express");
const router = express.Router();
const setLogic = require("../Controller/setLogic");
let step = require("../Models/Setuser")

// Add a new SetCounter
router.post("/add", setLogic.addSetCounter);

// Get all SetCounters

router.get("/", async (req, res) => {
  try {
    // Get userId from query params, e.g., /api/setcounter?userId=123
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const setCounters = await step.find({ userId });
    res.status(200).json(setCounters);
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
