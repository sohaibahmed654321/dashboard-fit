import React, { useEffect, useState } from 'react'; 
import axios from 'axios';
import {Link} from "react-router-dom"
import "./buttoncss.css"
import Sidebar from '../Sidebar';

const ViewNutrition = () => {
  const [nutritionData, setNutritionData] = useState([]);
  const [formData, setFormData] = useState({
    foodName: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: ''
  });
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
      <div className="flex-grow-1 p-4" style={{ marginLeft: '250px', padding: '20px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.heading}>🍽 Your Nutrition Records</h2>

<Link to="/nutrition" className="add-record-button">Add Record</Link>
       

        {/* Filters */}
        <div style={styles.filterRow}>
          <input
            type="text"
            placeholder="Search food..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.input}
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={styles.input}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={styles.input}
          />
        </div>

        {/* Data Display */}
        {loading ? <p>Loading...</p> : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Food</th>
                <th>Calories</th>
                <th>Protein</th>
                <th>Carbs</th>
                <th>Fats</th>
                <th>Date</th>
                <th>❌</th>
              </tr>
            </thead>
            <tbody>
              {nutritionData.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.foodName}</td>
                  <td>{item.calories}</td>
                  <td>{item.protein}</td>
                  <td>{item.carbs}</td>
                  <td>{item.fats}</td>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleDelete(item._id)} style={styles.deleteButton}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
        </div>
    </div>


  );
};

const styles = {
  page: {
    backgroundColor: '#000',
    minHeight: '100vh',
    padding: '40px 20px',
    display: 'flex',
    justifyContent: 'center',
  },
  container: {
    maxWidth: 1000,
    width: '100%',
    padding: 30,
    background: '#1a1a1a',
    color: '#fff',
    borderRadius: 10,
  },
  heading: {
    textAlign: 'center',
    color: '#2ecc71',
    marginBottom: 20,
  },
  form: {
    display: 'flex',
    gap: 10,
    marginBottom: 30,
    flexWrap: 'wrap',
  },
  filterRow: {
    display: 'flex',
    gap: 10,
    marginBottom: 20,
  },
  input: {
    padding: 10,
    borderRadius: 5,
    border: '1px solid #ccc',
    backgroundColor: '#333',
    color: '#fff',
    flex: 1,
    minWidth: 150,
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#2ecc71',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
    color: '#fff',
    flexShrink: 0,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    border: 'none',
    borderRadius: 5,
    padding: '5px 10px',
    color: '#fff',
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#222',
  },
  th: {
    backgroundColor: '#2ecc71',
    color: '#fff',
    padding: 10,
  },
  td: {
    padding: 10,
    borderBottom: '1px solid #444',
    color: '#eee',
  },
  

};

export default ViewNutrition;
