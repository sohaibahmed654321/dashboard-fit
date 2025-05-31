import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../Sidebar";

function Progress() {
  const user = JSON.parse(localStorage.getItem("user_data"));
  const userId = user?.id;

  const [data, setData] = useState({
    height: "",
    weight: "",
    bmi: "",
    fitnessGoal: ""
  });

  // Load existing profile data
  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:3009/api/users/users/profile/${userId}`)
        .then((res) => {
          setData(res.data);
          console.log(userId)
        })
        .catch((err) => {
          toast.error("Error fetching profile");
        });
    }
  }, [userId]);

  // Calculate BMI on height/weight change
  useEffect(() => {
    if (data.height && data.weight) {
      const heightInMeters = data.height / 100;
      const bmi = +(data.weight / (heightInMeters * heightInMeters)).toFixed(2);
      setData(prev => ({ ...prev, bmi }));
    }
  }, [data.height, data.weight]);

  const handleChange = (e) => {
    setData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3009/api/users/users/profile/${userId}`, data);
      toast.success("✅ Profile updated successfully");
    } catch (error) {
      toast.error("❌ Error updating profile");
    }
  };

  if (!user) return <h4 className="text-center mt-5">User not logged in</h4>;

  return (
    <div className="d-flex">
          <Sidebar />
          <div className="flex-grow-1 p-4" style={{ marginLeft: '250px', padding: '20px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h3 className="text-center mb-4">📈 Progress & BMI Tracker</h3>
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label fw-semibold">Height (cm)</label>
          <input
            type="number"
            className="form-control"
            name="height"
            value={data.height}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold">Weight (kg)</label>
          <input
            type="number"
            className="form-control"
            name="weight"
            value={data.weight}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold">Fitness Goal</label>
          <input
            type="text"
            className="form-control"
            name="fitnessGoal"
            value={data.fitnessGoal}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold">BMI</label>
          <input
            type="text"
            className="form-control"
            value={data.bmi}
            disabled
          />
        </div>
        <button type="submit" className="btn btn-dark w-100 fw-bold">
          🔄 Update Profile
        </button>
      </form>
      <ToastContainer />
    </div>
    </div>
    </div>
  );
}

export default Progress;
