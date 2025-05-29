import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function Showdata() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get('http://localhost:3008/web/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error('Error fetching users:', err));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios.delete(`http://localhost:3008/web/users/${id}`)
        .then(() => fetchUsers())
        .catch(err => console.error('Error deleting user:', err));
    }
  };
  

  const filteredUsers = users.filter(user => {
    return (
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterGender === '' || user.gender === filterGender)
    );
  });

  return (
    <div className="showdata-wrapper py-5">
      <div className="container">
        <div className="card p-4 shadow-lg data-card">
          <h2 className="text-center text-white mb-4">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2331/2331966.png"
              alt="icon"
              width="40"
              className="me-2"
            />
            Registered Gym Users
          </h2>

          {/* Search and Filter */}
          <div className="row mb-4">
            <div className="col-md-6 mb-2">
              <input
                type="text"
                placeholder="🔍 Search by name or email"
                className="form-control bg-dark text-white border-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <select
                className="form-select bg-dark text-white border-0"
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value)}
              >
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-dark table-striped rounded">
              <thead className="table-light text-dark">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Height</th>
                  <th>Weight</th>
                  <th>BMI</th>
                  <th>Goal</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? filteredUsers.map((user, index) => (
                  <tr key={index}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.age}</td>
                    <td>{user.gender}</td>
                    <td>{user.height}</td>
                    <td>{user.weight}</td>
                    <td>
                      <span className="badge bg-warning text-dark">
                        {user.bmi?.toFixed(2)}
                      </span>
                    </td>
                    <td>{user.fitnessGoal}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(user._id)}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="9" className="text-center text-light">No users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        body {
          background-color: #000 !important;
        }
        .showdata-wrapper {
          background-color: #000000;
          min-height: 100vh;
        }
        .data-card {
          background-color: #111111;
          border-radius: 1rem;
          color: white;
        }
        .form-control,
        .form-select {
          background-color: #1a1a1a;
          color: white;
        }
        .form-control::placeholder {
          color: #aaa;
        }
      `}</style>
    </div>
  );
}

export default Showdata;
