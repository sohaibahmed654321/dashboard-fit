import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../Sidebar";

const ViewSetCounter = () => {
  const [sets, setSets] = useState([]);

  useEffect(() => {
    const fetchSetCounters = async () => {
      try {
        const res = await axios.get("http://localhost:3009/api/setcounter");
        setSets(res.data);
      } catch (error) {
        alert("❌ Error fetching sets: " + error.message);
      }
    };
    fetchSetCounters();
  }, []);

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
            📋 Walking Steps History
            <div className="fs-6 text-secondary mt-1">
              A quick glance at your walking progress 🏃‍♂️📈
            </div>
          </h3>

          {sets.length === 0 ? (
            <p className="text-center fs-5 text-muted">
              No Step Counters Added Yet.
            </p>
          ) : (
            <div className="table-responsive shadow-sm rounded-4 border bg-white">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>🏋️‍♀️ Exercise</th>
                    <th>🔢 Step Count</th>
                    <th>⏱️ Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {sets.map((set) => (
                    <tr key={set._id}>
                      <td className="fw-semibold text-primary">{set.workoutName}</td>
                      <td>
                        <span className="badge bg-success fs-6 px-3 py-2">
                          {set.totalSets}
                        </span>
                      </td>
                      <td className="text-muted small">
                        {new Date(set.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewSetCounter;
