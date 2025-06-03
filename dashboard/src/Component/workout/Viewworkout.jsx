import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";

const ViewWorkout = () => {
  const [workouts, setWorkouts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const workoutsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        Swal.fire("Error", "User not logged in", "error");
        return;
      }

      const res = await axios.get(`http://localhost:3009/api/workouts/getworkout/${userId}`);
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
        await axios.delete(`http://localhost:3009/api/workouts/${id}`);
        Swal.fire("Deleted!", "Workout has been deleted.", "success");
        fetchWorkouts();
      } catch (error) {
        Swal.fire("Error!", "Failed to delete workout.", "error");
      }
    }
  };

  const handleEdit = (workout) => {
    navigate("/add", { state: { workout } });
  };

  // Pagination logic
  const filteredWorkouts = workouts.filter((workout) =>
    workout.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const indexOfLastWorkout = currentPage * workoutsPerPage;
  const indexOfFirstWorkout = indexOfLastWorkout - workoutsPerPage;
  const currentWorkouts = filteredWorkouts.slice(indexOfFirstWorkout, indexOfLastWorkout);
  const totalPages = Math.ceil(filteredWorkouts.length / workoutsPerPage);

  return (
    <div className="d-flex">
      <Sidebar />
      <div
        className="flex-grow-1 p-4"
        style={{ marginLeft: "250px", padding: "20px", minHeight: "100vh", backgroundColor: "#f8f9fa" }}
      >
        <div className="container my-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="text-primary fw-bold">🏋️‍♂️ Your Workouts</h2>
            <br />
            <br />
            <input
              type="search"
              className="form-control w-50 rounded-pill"
              placeholder="Search by exercise name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {currentWorkouts.length === 0 ? (
            <p className="text-muted text-center">No workouts found.</p>
          ) : (
            <div className="row">
              {currentWorkouts.map((workout) => (
                <div className="col-md-4 mb-4" key={workout._id}>
                  <div className="card shadow-sm h-100">
                    <div className="card-body">
                      <h5 className="card-title fw-bold">{workout.name}</h5>
                      <p className="card-text">
                        <strong>Type:</strong> {workout.type}
                        <br />
                        <strong>Sets:</strong> {workout.sets}
                        <br />
                        <strong>Reps:</strong> {workout.reps}
                        <br />
                        <strong>Weight:</strong> {workout.weight} kg
                        <br />
                        <strong>Date:</strong>{" "}
                        {new Date(workout.date).toLocaleDateString()}
                      </p>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(workout)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(workout._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav>
              <ul className="pagination justify-content-center">
                {[...Array(totalPages)].map((_, idx) => (
                  <li
                    key={idx}
                    className={`page-item ${
                      currentPage === idx + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(idx + 1)}
                    >
                      {idx + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewWorkout;
