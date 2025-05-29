import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
      const res = await axios.post('http://localhost:3009/api/users/users/login', formData);
      toast.success('✅ Login successful!');
      localStorage.setItem("user_data",JSON.stringify(res.data.user))
    } catch (error) {
      toast.error("❌ Login failed: " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1571019613914-85f342c53b1d')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="card shadow-lg p-5" style={{
        width: '100%',
        maxWidth: '450px',
        borderRadius: '1rem',
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(8px)',
        animation: 'fadeIn 1s ease-in-out'
      }}>
        <div className="text-center mb-4">
          <img src="https://cdn-icons-png.flaticon.com/512/1048/1048953.png" alt="dumbbell icon" width="60" />
          <h2 className="mt-2 fw-bold" style={{ color: '#2c3e50' }}>Welcome Back, Champ!</h2>
          <p className="text-muted">Log in to track your fitness journey</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control shadow-sm"
              name="email"
              id="emailInput"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="emailInput">Email address</label>
          </div>
          <div className="form-floating mb-4">
            <input
              type="password"
              className="form-control shadow-sm"
              name="password"
              id="passwordInput"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label htmlFor="passwordInput">Password</label>
          </div>
          <button type="submit" className="btn btn-dark w-100 fw-bold shadow-sm">
            🔓 Login
          </button>
        </form>

        <div className="text-center mt-3">
          <p className="mb-1">New to FitLife?</p>
          <Link to="/register" className="text-decoration-none fw-semibold text-dark">
            Create an Account
          </Link>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Link to="/fp" className="text-decoration-none fw-semibold text-dark">Forgot Your Password</Link>
        </div>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>

      {/* Animation keyframes */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}

export default Login;
