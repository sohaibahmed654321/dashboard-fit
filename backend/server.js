// server.js
const express = require('express');
require("dotenv").config();
const mongoose = require('mongoose');
const connectDB = require("./database");
const cors = require('cors');
const workoutRoutes = require('./Routes/Route'); // ✅ Corrected path
const setCounterRoutes = require('./Routes/Setroute');
const nutritionroute = require('./Routes/nutrionroute');
const userroute = require('./Routes/Routes');


const app = express();
const PORT = process.env.PORT || 3009;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/workouts/', workoutRoutes);
app.use('/api/users/', userroute);
app.use('/api/setcounter/', setCounterRoutes);
app.use('/api/nutrition/', nutritionroute);


// MongoDB Connection


connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server is running at http://localhost:${PORT}/web`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err.message);
  });
