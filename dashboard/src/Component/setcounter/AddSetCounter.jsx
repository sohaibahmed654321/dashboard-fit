import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";

const AddSetCounter = () => {
  const [formData, setFormData] = useState({
    workoutName: "",
    totalSets: "",
  });

  const workoutRef = useRef(null);
  const navigate = useNavigate();

  const walkingTypes = [
    "Brisk Walking",
    "Normal Walking",
    "Slow Walking",
    "Treadmill Walking",
    "Outdoor Walk",
    "Hill Walk",
  ];

  useEffect(() => {
    if (workoutRef.current) {
      workoutRef.current.focus();
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3009/api/setcounter/add", formData);

      Swal.fire({
        icon: "success",
        title: "Set Added!",
        text: "✅ Your set counter has been saved successfully.",
        showConfirmButton: false,
        timer: 1500,
      });

      setFormData({
        workoutName: "",
        totalSets: "",
      });

      setTimeout(() => {
        navigate("/viewset");
      }, 1600);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "❌ " + (error.response?.data?.message || error.message),
      });
    }
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
          <div
            className="card shadow-lg p-4 mx-auto"
            style={{ maxWidth: "600px", borderRadius: "15px" }}
          >
            <h2 className="text-center mb-4 fw-bold text-primary">
              🚶‍♂️ Add Your Walking Activity
              <div className="fs-6 text-secondary mt-2">
                Track your steps and stay consistent! 🏃‍♀️
              </div>
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Walking Type</label>
                <select
                  name="workoutName"
                  value={formData.workoutName}
                  onChange={handleChange}
                  className="form-control rounded-pill"
                  ref={workoutRef}
                  required
                >
                  <option value="">-- Select Walking Type --</option>
                  {walkingTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Total Steps</label>
                <input
                  type="number"
                  name="totalSets"
                  value={formData.totalSets}
                  onChange={handleChange}
                  className="form-control rounded-pill"
                  placeholder="e.g., 4"
                  required
                  min="1"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 rounded-pill fw-bold"
              >
                ➕ Add Walking Step
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSetCounter;
