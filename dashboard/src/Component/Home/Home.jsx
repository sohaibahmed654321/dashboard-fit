import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../Sidebar";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const SetCounterChart = () => {
  const [chartData, setChartData] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [nutritionData, setNutritionData] = useState([]);
  const [id, setId] = useState(null);
useEffect(() => {
  const fetchData = async () => {
    try {
      // Get the user from localStorage
      const user = JSON.parse(localStorage.getItem("user_data"));
      const userId = user?.id;

      if (!userId) {
        console.warn("No user ID found in localStorage");
        return;
      }

      // Fetch workout data
      const workoutRes = await axios.get("http://localhost:3009/api/setcounter");
      setChartData(workoutRes.data);
      groupByWorkoutType(workoutRes.data);

      // Fetch nutrition data using userId
      const nutritionRes = await axios.get(`http://localhost:3009/api/nutrition/n/${userId}`);
      groupNutritionData(nutritionRes.data);
    } catch (err) {
      console.error("Data fetch error:", err);
    }
  };

  fetchData();
}, []);

  // Group workout sets
  const groupByWorkoutType = (data) => {
    const grouped = data.reduce((acc, curr) => {
      const name = curr.workoutName;
      const steps = parseInt(curr.totalSets, 10);
      acc[name] = (acc[name] || 0) + steps;
      return acc;
    }, {});
    const groupedArray = Object.entries(grouped).map(([name, total]) => ({
      workoutName: name,
      totalSets: total,
    }));
    setGroupedData(groupedArray);
  };

  // Group nutrition data by foodName
  const groupNutritionData = (data) => {
    const grouped = data.reduce((acc, curr) => {
      const name = curr.foodName;
      const cal = parseInt(curr.calories, 10);
      acc[name] = (acc[name] || 0) + cal;
      return acc;
    }, {});
    const nutritionArray = Object.entries(grouped).map(([name, calories]) => ({
      foodName: name,
      calories: calories,
    }));
    setNutritionData(nutritionArray);
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div
        className="flex-grow-1 p-4"
        style={{
          marginLeft: "250px",
          padding: "20px",
          minHeight: "100vh",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div className="container my-5">
          {/* 📊 Raw Workout Data */}
          <div className="card shadow-lg p-4 mx-auto mb-5" style={{ maxWidth: "800px", borderRadius: "15px" }}>
            <h4 className="text-center text-secondary fw-bold mb-4">📊 Walking Activity Log</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="workoutName" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalSets" fill="#007bff" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 🏃 Grouped Workout Chart */}
          <div className="card shadow-lg p-4 mx-auto mb-5" style={{ maxWidth: "800px", borderRadius: "15px" }}>
            <h4 className="text-center text-secondary fw-bold mb-4">🏃 Total Steps per Workout Type</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={groupedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="workoutName" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalSets" fill="#28a745" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 🥗 Nutrition Chart */}
          <div className="card shadow-lg p-4 mx-auto" style={{ maxWidth: "800px", borderRadius: "15px" }}>
            <h4 className="text-center text-secondary fw-bold mb-4">🥗 Calories per Food Item</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={nutritionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="foodName" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calories" fill="#ff9800" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetCounterChart;