// ViewWorkout.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";

const ViewWorkout = () => {
  const [workouts, setWorkouts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const res = await axios.get("http://localhost:3009/api/workouts");
      setWorkouts(res.data);
    } catch (error) {
      alert("Error fetching workouts: " + error.message);
    }
  };

const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This will delete the workout permanently!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    try {
      // ✅ Corrected DELETE route
      await axios.delete(`http://localhost:3009/api/workouts/${id}`);
      Swal.fire("Deleted!", "Workout has been deleted.", "success");
      fetchWorkouts(); // refresh list
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  }
};


  const handleEdit = (workout) => {
    navigate("/work", { state: { workout } });
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4" style={{ marginLeft: '250px', padding: '20px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
    <div className="container my-5">
      <h3 className="mb-4 text-center fw-bold text-primary">📋 All Workouts</h3>
      {workouts.length === 0 ? (
        <p className="text-center fs-5 text-muted">No workouts found.</p>
      ) : (
        <div className="row g-4">
          {workouts.map((workout) => (
            <div key={workout._id} className="col-md-6 col-lg-4">
              <div className="card shadow-sm rounded-4 h-100 border-0">
                <div className="card-body">
                  <h5 className="card-title fw-bold text-primary">{workout.name}</h5>
                  <p className="card-text mb-1"><strong>Type:</strong> {workout.type}</p>
                  <p className="card-text mb-1"><strong>Sets:</strong> {workout.sets}</p>
                  <p className="card-text mb-1"><strong>Reps:</strong> {workout.reps}</p>
                  <p className="card-text mb-1"><strong>Weight:</strong> {workout.weight || "N/A"} kg</p>
                  <p className="card-text"><strong>Date:</strong> {new Date(workout.date).toLocaleDateString()}</p>
                  <div className="d-flex justify-content-between mt-3">
                    <button
                      className="btn btn-warning btn-sm rounded-pill px-3 fw-semibold"
                      onClick={() => handleEdit(workout)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm rounded-pill px-3 fw-semibold"
                      onClick={() => handleDelete(workout._id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
    </div>
  );
};

export default ViewWorkout;
