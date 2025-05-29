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
      <div className="flex-grow-1 p-4" style={{ marginLeft: '250px', padding: '20px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
    <div className="container my-5">
      <div
        className="card shadow-lg border-0 text-white"
        style={{ backgroundColor: "#1c1c1e", borderRadius: "1rem" }}
      >
        <div
          className="card-header text-center"
          style={{
            background: "linear-gradient(to right, #00c6ff, #0072ff)",
            borderTopLeftRadius: "1rem",
            borderTopRightRadius: "1rem",
          }}
        >
          <h2 className="mb-0 py-2">📋 Step Counter History</h2>
        </div>
        <div className="card-body">
          {sets.length === 0 ? (
            <p className="text-center text-secondary">No Step Counters Added Yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-borderless align-middle">
                <thead>
                  <tr style={{ borderBottom: "2px solid #444" }}>
                    <th>🏋️‍♀️ Exercise</th>
                    <th>🔢 Step Count</th>
                    <th>⏱️ Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {sets.map((set) => (
                    <tr
                      key={set._id}
                      className="rounded-3"
                      style={{
                        backgroundColor: "#2c2c2e",
                        borderRadius: "10px",
                        transition: "background 0.3s",
                      }}
                    >
                      <td className="fw-semibold text-info">{set.workoutName}</td>
                      <td>
                        <span className="badge bg-success fs-6 px-3 py-2">
                          {set.totalSets}
                        </span>
                      </td>
                     
                      <td className="text-secondary small">
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
    </div>
    </div>
  );
};

export default ViewSetCounter;
