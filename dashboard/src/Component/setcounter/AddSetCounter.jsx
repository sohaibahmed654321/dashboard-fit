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

  // Walking-specific types only
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
      <div className="flex-grow-1 p-4" style={{ marginLeft: '250px', padding: '20px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
    <div className="container mt-5">
      <div className="card shadow-lg p-4 rounded-4 bg-dark text-white">
        <h2 className="text-center mb-4">🚶 Add Walking Step</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Walking Type</label>
            <select
              name="workoutName"
              value={formData.workoutName}
              onChange={handleChange}
              className="form-select"
              ref={workoutRef}
              required
            >
              <option value="">Select Walking Type</option>
              {walkingTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Total Steps</label>
            <input
              type="number"
              name="totalSets"
              value={formData.totalSets}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g., 4"
              required
            />
          </div>

         

       

          <button type="submit" className="btn btn-success w-100">
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
