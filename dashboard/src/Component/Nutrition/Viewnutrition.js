import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import Swal from "sweetalert2";

const ViewNutrition = () => {
  const [nutritionData, setNutritionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    foodName: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
  });

  // Assuming userId stored as string in localStorage, not JSON
  const userId = localStorage.getItem("userId") || "";

  // Fetch user nutrition data
  const fetchNutritionData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3009/api/nutrition/n?userId=${userId}`);
      setNutritionData(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchNutritionData();
    } else {
      setError("User not logged in");
      setLoading(false);
    }
  }, [userId]);

  // Filter data based on search & date range
  const filteredData = nutritionData.filter((item) => {
    const matchesFood = item.foodName.toLowerCase().includes(searchTerm.toLowerCase());

    const itemDate = new Date(item.date);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    const matchesDate = (!from || itemDate >= from) && (!to || itemDate <= to);

    return matchesFood && matchesDate;
  });

  // Handle Delete
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the nutrition record.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3009/api/nutrition/n/${id}`);
        Swal.fire("Deleted!", "Nutrition data deleted.", "success");
        fetchNutritionData();
      } catch (err) {
        Swal.fire("Error", "Failed to delete nutrition data.", "error");
      }
    }
  };

  // Handle Edit start
  const startEdit = (item) => {
    setEditId(item._id);
    setEditData({
      foodName: item.foodName,
      calories: item.calories,
      protein: item.protein,
      carbs: item.carbs,
      fats: item.fats,
    });
  };

  // Handle edit input change
  const handleEditChange = (e) => {
    setEditData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle Edit submit
  const handleEditSubmit = async (id) => {
    try {
      await axios.put(`http://localhost:3009/api/nutrition/n/${id}`, {
        ...editData,
        calories: Number(editData.calories),
        protein: Number(editData.protein),
        carbs: Number(editData.carbs),
        fats: Number(editData.fats),
      });
      Swal.fire("Updated!", "Nutrition data updated.", "success");
      setEditId(null);
      fetchNutritionData();
    } catch (err) {
      Swal.fire("Error", "Failed to update nutrition data.", "error");
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger text-center mt-5">{error}</div>;

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div style={{ width: "250px", position: "fixed", height: "100vh", zIndex: 1 }}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div
        className="flex-grow-1 p-4"
        style={{ marginLeft: "250px", minHeight: "100vh", backgroundColor: "#f8f9fa" }}
      >
        <div className="container my-4">
          <h2 className="mb-4 text-primary fw-bold text-center">🥗 Your Nutrition Records</h2>

          {/* Search and Filter */}
          <div className="mb-4 row justify-content-center">
            <div className="col-md-4 mb-2">
              <input
                type="text"
                placeholder="Search by food name..."
                className="form-control rounded-pill"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-2 mb-2">
              <input
                type="date"
                className="form-control rounded-pill"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="col-md-2 mb-2">
              <input
                type="date"
                className="form-control rounded-pill"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>

          {/* Nutrition Cards */}
          <div className="row">
            {filteredData.length === 0 && (
              <p className="text-center text-muted">No matching records found.</p>
            )}

            {filteredData.map((item) => (
              <div className="col-md-4 mb-4" key={item._id}>
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    {editId === item._id ? (
                      <>
                        {/* Edit mode inputs */}
                        <input
                          type="text"
                          name="foodName"
                          className="form-control mb-2"
                          value={editData.foodName}
                          onChange={handleEditChange}
                        />
                        <input
                          type="number"
                          name="calories"
                          className="form-control mb-2"
                          value={editData.calories}
                          onChange={handleEditChange}
                        />
                        <input
                          type="number"
                          name="protein"
                          className="form-control mb-2"
                          value={editData.protein}
                          onChange={handleEditChange}
                        />
                        <input
                          type="number"
                          name="carbs"
                          className="form-control mb-2"
                          value={editData.carbs}
                          onChange={handleEditChange}
                        />
                        <input
                          type="number"
                          name="fats"
                          className="form-control mb-2"
                          value={editData.fats}
                          onChange={handleEditChange}
                        />
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => handleEditSubmit(item._id)}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setEditId(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <h5 className="card-title fw-bold">{item.foodName}</h5>
                        <p className="card-text mb-2">
                          <strong>Calories:</strong> {item.calories} kcal<br />
                          <strong>Protein:</strong> {item.protein} g<br />
                          <strong>Carbs:</strong> {item.carbs} g<br />
                          <strong>Fats:</strong> {item.fats} g<br />
                          <strong>Date:</strong> {new Date(item.date).toLocaleDateString("en-GB")}
                        </p>
                        <button
                          className="btn btn-primary btn-sm me-2"
                          onClick={() => startEdit(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewNutrition;
