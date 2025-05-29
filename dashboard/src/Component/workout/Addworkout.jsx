// AddWorkout.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../Sidebar";

const AddWorkout = () => {
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    sets: "",
    reps: "",
    weight: "",
    date: "",
  });

  const [exercises, setExercises] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const editingWorkout = location.state?.workout || null;

  const workoutOptions = {
    Cardio: ["Running", "Cycling", "Jump Rope"],
    Strength: ["Bench Press", "Squats", "Deadlift"],
    Yoga: ["Sun Salutation", "Warrior Pose", "Tree Pose"],
  };

  useEffect(() => {
    if (formData.type) {
      setExercises(workoutOptions[formData.type]);
    } else {
      setExercises([]);
    }
  }, [formData.type]);

  useEffect(() => {
    if (editingWorkout) {
      setFormData({
        type: editingWorkout.type,
        name: editingWorkout.name,
        sets: editingWorkout.sets,
        reps: editingWorkout.reps,
        weight: editingWorkout.weight,
        date: editingWorkout.date.split("T")[0],
      });
    }
  }, [editingWorkout]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingWorkout) {
        console.log("Updating workout with ID:", editingWorkout._id);
        await axios.put(
          `http://localhost:3009/api/workouts/${editingWorkout._id}`,
          formData
        );
        Swal.fire("Updated!", "Workout updated successfully.", "success");
      } else {
        await axios.post("http://localhost:3009/api/workouts/add", formData);
        Swal.fire("Added!", "Workout added successfully.", "success");
      }

      setTimeout(() => navigate("/view"), 1500);
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
     <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4" style={{ marginLeft: '250px', padding: '20px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
    <div className="container my-5">
      <div className="card shadow-lg p-4 mx-auto" style={{ maxWidth: "600px", borderRadius: "15px" }}>
        <h2 className="text-center mb-4 fw-bold text-primary">
          {editingWorkout ? "✏️ Update Workout" : "💪 Add New Workout"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Workout Type</label>
            <select
              name="type"
              className="form-control rounded-pill"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Type --</option>
              {Object.keys(workoutOptions).map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Exercise Name</label>
            <select
              name="name"
              className="form-control rounded-pill"
              value={formData.name}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Exercise --</option>
              {exercises.map((exercise) => (
                <option key={exercise} value={exercise}>{exercise}</option>
              ))}
            </select>
          </div>

          <div className="row mb-3">
            <div className="col">
              <label className="form-label fw-semibold">Sets</label>
              <input
                type="number"
                name="sets"
                className="form-control rounded-pill"
                value={formData.sets}
                onChange={handleChange}
                required
                min="1"
              />
            </div>
            <div className="col">
              <label className="form-label fw-semibold">Reps</label>
              <input
                type="number"
                name="reps"
                className="form-control rounded-pill"
                value={formData.reps}
                onChange={handleChange}
                required
                min="1"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              className="form-control rounded-pill"
              value={formData.weight}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Date</label>
            <input
              type="date"
              name="date"
              className="form-control rounded-pill"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 rounded-pill fw-bold">
            {editingWorkout ? "✅ Update Workout" : "➕ Add Workout"}
          </button>
        </form>
      </div>
    </div>
    </div>
    </div>

    
  );
};

export default AddWorkout;
