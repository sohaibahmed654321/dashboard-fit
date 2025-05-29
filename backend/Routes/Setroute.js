const express = require("express");
const router = express.Router();
const setLogic = require("../Controller/setLogic");

// Add a new SetCounter
router.post("/add", setLogic.addSetCounter);

// Get all SetCounters
router.get("/", async (req, res) => {
  try {
    const setCounters = await require("../Models/Setuser").find();
    res.status(200).json(setCounters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
