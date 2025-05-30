import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import Sidebar from '../Sidebar';

const ViewNutrition = () => {
  const [nutritionData, setNutritionData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [id, setId] = useState(null);

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user_data"));
    if (loggedUser?.id) setId(loggedUser.id);
  }, []);

  useEffect(() => {
    if (!id) return;
    fetchData();
  }, [id]);

  useEffect(() => {
    if (id !== null) {
      const timeout = setTimeout(fetchData, 400);
      return () => clearTimeout(timeout);
    }
  }, [searchTerm, startDate, endDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3009/api/nutrition/n`, {
        params: {
          userId: id,
          search: searchTerm,
          startDate,
          endDate
        }
      });
      setNutritionData(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (nutritionId) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;

    try {
      await axios.delete(`http://localhost:3009/api/nutrition/n/${nutritionId}`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete.");
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4" style={{ marginLeft: '250px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <div className="container my-5">
          <h3 className="mb-4 text-center fw-bold text-primary">🍽 Your Nutrition Records</h3>

          <div className="text-center mb-4">
            <Link to="/nutrition" className="btn btn-primary fw-semibold rounded-pill px-4">
              ➕ Add Record
            </Link>
          </div>

          <div className="d-flex gap-2 mb-4 flex-wrap justify-content-center">
            <input
              type="text"
              className="form-control w-auto"
              placeholder="Search food..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <input
              type="date"
              className="form-control w-auto"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              className="form-control w-auto"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {loading ? (
            <p className="text-center">Loading...</p>
          ) : error ? (
            <p className="text-danger text-center">{error}</p>
          ) : nutritionData.length === 0 ? (
            <p className="text-center fs-5 text-muted">No records found.</p>
          ) : (
            <div className="row g-4">
              {nutritionData.map((item, idx) => (
                <div key={idx} className="col-md-6 col-lg-4">
                  <div className="card shadow-sm rounded-4 h-100 border-0">
                    <div className="card-body">
                      <h5 className="card-title fw-bold text-success">
                        {item.foodName}
                      </h5>
                      <p className="card-text mb-1">
                        <strong>Calories:</strong> {item.calories}
                      </p>
                      <p className="card-text mb-1">
                        <strong>Protein:</strong> {item.protein}
                      </p>
                      <p className="card-text mb-1">
                        <strong>Carbs:</strong> {item.carbs}
                      </p>
                      <p className="card-text mb-1">
                        <strong>Fats:</strong> {item.fats}
                      </p>
                      <p className="card-text">
                        <strong>Date:</strong>{" "}
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                      <div className="text-end mt-3">
                        <button
                          className="btn btn-danger btn-sm rounded-pill px-3 fw-semibold"
                          onClick={() => handleDelete(item._id)}
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

export default ViewNutrition;
