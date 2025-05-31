import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    fitnessGoal: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3009/api/users/register', formData);
      toast.success("✅ Registered successfully!");
      setFormData({
        name: '', email: '', password: '', age: '',
        gender: '', height: '', weight: '', fitnessGoal: ''
      });
    } catch (error) {
      toast.error("❌ Registration failed: " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="register-wrapper">
      {/* Background Video or fallback image */}
      <video autoPlay muted loop className="bg-video">
        <source src="https://assets.mixkit.co/videos/preview/mixkit-people-working-out-in-a-gym-3553-large.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="overlay" />

      <div className="container d-flex justify-content-center align-items-center py-5 min-vh-100">
        <div className="card shadow-lg p-5 register-card w-100" style={{ maxWidth: '800px' }}>
          <div className="text-center mb-4">
            <img src="https://cdn-icons-png.flaticon.com/512/1048/1048953.png" alt="icon" width="70" />
            <h2 className="mt-2 fw-bold text-dark">Create Your FitLife Account</h2>
            <p className="text-muted">Start your transformation today!</p>
          </div>

          <form onSubmit={handleSubmit} className="fade-in">
            <div className="row g-3">
              {[
                { label: "Full Name", name: "name" },
                { label: "Email", name: "email", type: "email" },
                { label: "Password", name: "password", type: "password" },
                { label: "Age", name: "age" },
                { label: "Height (cm)", name: "height" },
                { label: "Weight (kg)", name: "weight" },
                { label: "Fitness Goal", name: "fitnessGoal" },
              ].map(({ label, name, type = "text" }, index) => (
                <div className="col-md-6" key={index}>
                  <div className="form-floating">
                    <input
                      type={type}
                      className="form-control shadow-sm"
                      name={name}
                      id={name}
                      placeholder={label}
                      value={formData[name]}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor={name}>{label}</label>
                  </div>
                </div>
              ))}

              <div className="col-md-6">
                <div className="form-floating">
                  <select
                    className="form-select shadow-sm"
                    name="gender"
                    id="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <label htmlFor="gender">Gender</label>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <button type="submit" className="btn btn-dark w-100 fw-bold shadow-sm">
                🏋️ Register
              </button>
              <div className="text-center mt-3">
                <p className="mb-0">Already have an account?</p>
                <Link to="/" className="text-decoration-none fw-semibold text-dark">
                  Login Your Account
                </Link>
              </div>
            </div>
          </form>

          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        .bg-video {
          position: fixed;
          top: 0; left: 0;
          width: 100vw;
          height: 100vh;
          object-fit: cover;
          z-index: -2;
        }
        .overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.6);
          z-index: -1;
        }
        .register-card {
          border-radius: 1rem;
          background-color: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          animation: fadeIn 0.6s ease-in-out;
        }
        .fade-in {
          animation: fadeIn 1s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default Register;
