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
        await axios.delete(`http://localhost:3009/api/workouts/${id}`);
        Swal.fire("Deleted!", "Workout has been deleted.", "success");
        fetchWorkouts();
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      }
    }
  };

  const handleEdit = (workout) => {
    navigate("/work", { state: { workout } });
  };

  const filteredWorkouts = workouts.filter((workout) =>
    Object.values(workout).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastWorkout = currentPage * workoutsPerPage;
  const indexOfFirstWorkout = indexOfLastWorkout - workoutsPerPage;
  const currentWorkouts = filteredWorkouts.slice(
    indexOfFirstWorkout,
    indexOfLastWorkout
  );
  const totalPages = Math.ceil(filteredWorkouts.length / workoutsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div
        className="flex-grow-1 p-4"
        style={{
          marginLeft: "250px",
          padding: "20px",
          minHeight: "100vh",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div className="container my-5">
          <h3 className="mb-4 text-center fw-bold text-primary">
            📋 All Workouts
          </h3>

          <div className="mb-4 text-center">
            <input
              type="text"
              className="form-control w-50 mx-auto mb-4"
              placeholder="Search workouts..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={{ boxShadow: "none", outline: "none" }}
            />
          </div>

          {filteredWorkouts.length === 0 ? (
            <p className="text-center fs-5 text-muted">No workouts found.</p>
          ) : (
            <>
              <div className="row g-4">
                {currentWorkouts.map((workout) => (
                  <div key={workout._id} className="col-md-6 col-lg-4">
                    <div className="card shadow-sm rounded-4 h-100 border-0">
                      <div className="card-body">
                        <h5 className="card-title fw-bold text-primary">
                          {workout.name}
                        </h5>
                        <p className="card-text mb-1">
                          <strong>Type:</strong> {workout.type}
                        </p>
                        <p className="card-text mb-1">
                          <strong>Sets:</strong> {workout.sets}
                        </p>
                        <p className="card-text mb-1">
                          <strong>Reps:</strong> {workout.reps}
                        </p>
                        <p className="card-text mb-1">
                          <strong>Weight:</strong> {workout.weight || "N/A"} kg
                        </p>
                        <p className="card-text">
                          <strong>Date:</strong>{" "}
                          {new Date(workout.date).toLocaleDateString()}
                        </p>
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

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <nav>
                    <ul className="pagination">
                      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button
                          className="page-link"
                          style={{ boxShadow: "none", outline: "none" }}
                          onClick={() => goToPage(currentPage - 1)}
                        >
                          ◀ Previous
                        </button>
                      </li>

                      {[...Array(totalPages)].map((_, index) => (
                        <li
                          key={index}
                          className={`page-item ${
                            currentPage === index + 1 ? "active" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            style={{ boxShadow: "none", outline: "none" }}
                            onClick={() => goToPage(index + 1)}
                          >
                            {index + 1}
                          </button>
                        </li>
                      ))}

                      <li
                        className={`page-item ${
                          currentPage === totalPages ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          style={{ boxShadow: "none", outline: "none" }}
                          onClick={() => goToPage(currentPage + 1)}
                        >
                          Next ▶
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewWorkout;
