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
  const [data, setData] = useState({
    height: "",
    weight: "",
    bmi: "",
    fitnessGoal: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.warn("No user ID found in localStorage");
          return;
        }

        // Fetch user profile
        const profileRes = await axios.get(
          `http://localhost:3009/api/users/users/profile/${userId}`
        );
        setData(profileRes.data);

        // Fetch setcounter data for this user
        const setRes = await axios.get(
          `http://localhost:3009/api/setcounter?userId=${userId}`
        );
        setChartData(setRes.data);
        groupByWorkoutType(setRes.data);

        // Fetch nutrition data for this user
        const nutritionRes = await axios.get(
          `http://localhost:3009/api/nutrition/n/${userId}`
        );
        groupNutritionData(nutritionRes.data);
      } catch (err) {
        console.error("Data fetch error:", err);
      }
    };

    fetchData();
  }, []);

  const groupByWorkoutType = (data) => {
    const grouped = data.reduce((acc, curr) => {
      const name = curr.workoutName;
      const sets = parseInt(curr.totalSets, 10) || 0;
      acc[name] = (acc[name] || 0) + sets;
      return acc;
    }, {});

    const groupedArray = Object.entries(grouped).map(([name, total]) => ({
      workoutName: name,
      totalSets: total,
    }));

    setGroupedData(groupedArray);
  };

  const groupNutritionData = (data) => {
    const grouped = data.reduce((acc, curr) => {
      const name = curr.foodName;
      const cal = parseInt(curr.calories, 10) || 0;
      acc[name] = (acc[name] || 0) + cal;
      return acc;
    }, {});

    const nutritionArray = Object.entries(grouped).map(([name, calories]) => ({
      foodName: name,
      calories,
    }));

    setNutritionData(nutritionArray);
  };

  const calculateBMI = (height, weight) => {
    if (!height || !weight) return "--";
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  const getBMICategory = (height, weight) => {
    if (!height || !weight) return "";
    const bmi = weight / ((height / 100) ** 2);
    if (bmi < 18.5) return "Underweight";
    if (bmi < 24.9) return "Normal";
    if (bmi < 29.9) return "Overweight";
    return "Obese";
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
          {/* 🧍 Health Overview */}
          <div
            className="card mx-auto mb-5"
            style={{
              maxWidth: "700px",
              borderRadius: "18px",
              padding: "30px",
              background: "#ffffff",
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h4 className="text-center fw-bold text-dark mb-4">
              🩺 Health Overview
            </h4>

            <div className="row text-center">
              {/* Height */}
              <div className="col-md-4 mb-3 mb-md-0">
                <div
                  className="border rounded p-3"
                  style={{ backgroundColor: "#f1f8ff", borderColor: "#d0e8ff" }}
                >
                  <h6 className="text-muted">Height</h6>
                  <p className="fs-4 fw-semibold text-dark mb-0">
                    {data.height || "--"}{" "}
                    <small className="text-secondary">cm</small>
                  </p>
                </div>
              </div>

              {/* Weight */}
              <div className="col-md-4 mb-3 mb-md-0">
                <div
                  className="border rounded p-3"
                  style={{ backgroundColor: "#f1f8ff", borderColor: "#d0e8ff" }}
                >
                  <h6 className="text-muted">Weight</h6>
                  <p className="fs-4 fw-semibold text-dark mb-0">
                    {data.weight || "--"}{" "}
                    <small className="text-secondary">kg</small>
                  </p>
                </div>
              </div>

              {/* BMI */}
              <div className="col-md-4">
                <div
                  className="border rounded p-3"
                  style={{ backgroundColor: "#f1f8ff", borderColor: "#d0e8ff" }}
                >
                  <h6 className="text-muted">BMI</h6>
                  <p className="fs-4 fw-semibold text-dark mb-1">
                    {calculateBMI(data.height, data.weight)}
                  </p>
                  <span
                    className="badge rounded-pill"
                    style={{
                      fontSize: "0.9rem",
                      backgroundColor:
                        getBMICategory(data.height, data.weight) === "Normal"
                          ? "#c8e6c9"
                          : getBMICategory(data.height, data.weight) === "Underweight"
                          ? "#ffe0b2"
                          : getBMICategory(data.height, data.weight) === "Overweight"
                          ? "#fff59d"
                          : "#ef9a9a",
                      color:
                        getBMICategory(data.height, data.weight) === "Normal"
                          ? "#2e7d32"
                          : getBMICategory(data.height, data.weight) === "Underweight"
                          ? "#ef6c00"
                          : getBMICategory(data.height, data.weight) === "Overweight"
                          ? "#fbc02d"
                          : "#c62828",
                    }}
                  >
                    {getBMICategory(data.height, data.weight)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 📊 Workout Log */}
          <div
            className="card shadow-lg p-4 mx-auto mb-5"
            style={{ maxWidth: "800px", borderRadius: "15px" }}
          >
            <h4 className="text-center text-secondary fw-bold mb-4">
              📊 Walking Activity Log
            </h4>
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

          {/* 🏃 Total Steps per Workout Type */}
          <div
            className="card shadow-lg p-4 mx-auto mb-5"
            style={{ maxWidth: "800px", borderRadius: "15px" }}
          >
            <h4 className="text-center text-secondary fw-bold mb-4">
              🏃 Total Steps per Workout Type
            </h4>
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

          {/* 🥗 Calories per Food Item */}
          <div
            className="card shadow-lg p-4 mx-auto"
            style={{ maxWidth: "800px", borderRadius: "15px" }}
          >
            <h4 className="text-center text-secondary fw-bold mb-4">
              🥗 Calories per Food Item
            </h4>
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
