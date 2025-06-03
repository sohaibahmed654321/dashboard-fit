import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";

const AddSetCounter = () => {
  const [workoutName, setWorkoutName] = useState("");
  const [totalSets, setTotalSets] = useState("");
  const [message, setMessage] = useState("");
  const userId = localStorage.getItem("userId"); // Assumed saved at login

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!workoutName || !totalSets) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3009/api/setcounter/add", {
        workoutName,
        totalSets: Number(totalSets),
        userId,
      });

      setMessage(response.data.message);
      setWorkoutName("");
      setTotalSets("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Error adding set counter");
    }
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div style={{ width: "250px", position: "fixed", height: "100vh", zIndex: 1, backgroundColor: "#343a40" }}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-5" style={{ marginLeft: "250px", minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
        <div className="container" style={{ maxWidth: "500px", background: "#fff", padding: "30px", borderRadius: "10px", boxShadow: "0 0 15px rgba(0,0,0,0.1)" }}>
          <h2 className="mb-4 text-center text-primary fw-bold">Add Set Counter</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="workoutName" className="form-label fw-semibold">
                Workout Name
              </label>
              <select
                id="workoutName"
                className="form-select form-select-lg"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select workout type
                </option>
                <option value="Walking">Walking</option>
                <option value="Running">Running</option>
                <option value="Cycling">Cycling</option>
                <option value="Swimming">Swimming</option>
                <option value="Yoga">Yoga</option>
                <option value="Gym">Gym</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="totalSets" className="form-label fw-semibold">
                Total Sets
              </label>
              <input
                type="number"
                id="totalSets"
                className="form-control form-control-lg"
                placeholder="Enter total sets"
                min="1"
                value={totalSets}
                onChange={(e) => setTotalSets(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-100">
              Add Set Counter
            </button>
          </form>

          {message && (
            <p className={`mt-4 text-center ${message.toLowerCase().includes("error") ? "text-danger" : "text-success"}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddSetCounter;
