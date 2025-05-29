const express = require('express');
const {
  addNutritionData,
  getAllNutritionData,
  getNutritionByUserId,
  updateNutritionData,
  deleteNutritionData
} = require('../Controller/nutrition');

const router = express.Router();

// 👇 CREATE: Add new nutrition entry
router.post('/n', addNutritionData);

// 👇 READ ALL: Get all entries for a user (query param `?userId=...`)
router.get('/n', getAllNutritionData);

// 👇 READ ONE: Get single entry by ID
router.get('/n/:id', getNutritionByUserId);

// 👇 UPDATE: Update entry by ID
router.put('/n/:id', updateNutritionData);

// 👇 DELETE: Delete entry by ID
router.delete('/n/:id', deleteNutritionData);

module.exports = router;
