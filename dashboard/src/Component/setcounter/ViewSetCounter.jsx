import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import Sidebar from "../Sidebar";

const ViewSetCounter = () => {
  const [sets, setSets] = useState([]);
  const [filteredSets, setFilteredSets] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchSetCounters = async () => {
      try {
        const res = await axios.get("http://localhost:3009/api/setcounter");
        setSets(res.data);
        setFilteredSets(res.data);
      } catch (error) {
        alert("❌ Error fetching sets: " + error.message);
      }
    };
    fetchSetCounters();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const filtered = sets.filter((set) => {
        const setDate = new Date(set.createdAt);
        return setDate.toDateString() === selectedDate.toDateString();
      });
      setFilteredSets(filtered);
    } else {
      setFilteredSets(sets);
    }
  }, [selectedDate, sets]);

  // Calculate total steps
  const totalSteps = filteredSets.reduce((sum, set) => sum + (set.totalSets || 0), 0);

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

          <div className="d-flex justify-content-center mb-4">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              placeholderText="📅 Select a Date"
              className="form-control w-25"
            />
            <button 
              className="btn btn-outline-secondary ms-2"
              onClick={() => setSelectedDate(null)}
            >
              Reset
            </button>
          </div>

          <div className="mb-4 text-center">
            <h5 className="fw-bold text-success">
              🌟 Total Steps: {totalSteps}
            </h5>
          </div>

          {filteredSets.length === 0 ? (
            <p className="text-center fs-5 text-muted">
              {selectedDate ? "No Step Counters for selected date." : "No Step Counters Added Yet."}
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
                  {filteredSets.map((set) => (
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
