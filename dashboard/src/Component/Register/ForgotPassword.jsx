import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      return toast.warning("Please enter your email");
    }

    try {
      const res = await axios.post('http://localhost:3009/api/users/users/forgot', { email });
      toast.success('📧 Password reset link sent to your email!');
    } catch (error) {
      toast.error("❌ Error: " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1600185365483-26d7a4cc7516')",
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
          <img src="https://cdn-icons-png.flaticon.com/512/595/595067.png" alt="lock icon" width="60" />
          <h2 className="mt-2 fw-bold" style={{ color: '#2c3e50' }}>Forgot Password?</h2>
          <p className="text-muted">Enter your email to receive reset instructions</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-4">
            <input
              type="email"
              className="form-control shadow-sm"
              id="forgotEmail"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="forgotEmail">Email address</label>
          </div>
          <button type="submit" className="btn btn-primary w-100 fw-bold shadow-sm">
            📩 Send Reset Link
          </button>
        </form>

        <div className="text-center mt-3">
          <Link to="/" className="text-decoration-none fw-semibold text-dark">
            🔙 Back to Login
          </Link>
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

export default ForgotPassword;