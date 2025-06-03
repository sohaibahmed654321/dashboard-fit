import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Sidebar from '../Sidebar';

const NUTRITIONIX_APP_ID = '87bee410';
const NUTRITIONIX_API_KEY = '8b97cad7517a7997e43e8390fdcbd37a';

const AddNutritionForm = () => {
  const [formData, setFormData] = useState({
    foodName: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    userid: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setFormData(prev => ({
        ...prev,
        userid: userId
      }));
    }
  }, []);

  const fetchNutritionData = async (foodName) => {
    if (!foodName) return;
    setLoading(true);

    try {
      const res = await axios.post(
        'https://trackapi.nutritionix.com/v2/natural/nutrients',
        { query: foodName },
        {
          headers: {
            'x-app-id': NUTRITIONIX_APP_ID,
            'x-app-key': NUTRITIONIX_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.data.foods && res.data.foods.length > 0) {
        const food = res.data.foods[0];
        setFormData(prev => ({
          ...prev,
          foodName: food.food_name,
          calories: food.nf_calories || '',
          protein: food.nf_protein || '',
          carbs: food.nf_total_carbohydrate || '',
          fats: food.nf_total_fat || '',
        }));
        Swal.fire('Fetched!', 'Nutrition data fetched successfully.', 'success');
      } else {
        Swal.fire('Warning', 'No data found for this food.', 'warning');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to fetch nutrition data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
    await axios.post('http://localhost:3009/api/nutrition/n', {
  foodName: formData.foodName, // ✅ fix here
  calories: Number(formData.calories),
  protein: Number(formData.protein),
  carbs: Number(formData.carbs),
  fats: Number(formData.fats),
  user: formData.userid,
});


      Swal.fire('Added!', 'Nutrition data saved successfully.', 'success');
      setFormData({
        foodName: '',
        calories: '',
        protein: '',
        carbs: '',
        fats: '',
        userid: formData.userid,
      });
    } catch (err) {
      console.error(err);
      Swal.fire(err.response.data.msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4" style={{ marginLeft: '250px', padding: '20px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <div className="container my-5">
          <div className="card shadow-lg p-4 mx-auto" style={{ maxWidth: "600px", borderRadius: "15px" }}>
            <h2 className="text-center mb-4 fw-bold text-primary">🥗 Add Nutrition Data</h2>
            <form onSubmit={handleSubmit}>
              {['foodName', 'calories', 'protein', 'carbs', 'fats'].map((field, idx) => (
                <div className="mb-3" key={idx}>
                  <label className="form-label fw-semibold">
                    {field.charAt(0).toUpperCase() + field.slice(1)} {field !== 'foodName' && '(g)'}
                  </label>
                  <input
                    type={field === 'foodName' ? 'text' : 'number'}
                    name={field}
                    className="form-control rounded-pill"
                    value={formData[field]}
                    onChange={handleChange}
                    onBlur={field === 'foodName' ? () => fetchNutritionData(formData.foodName.trim()) : undefined}
                    onKeyDown={field === 'foodName' ? (e) => e.key === 'Enter' && fetchNutritionData(formData.foodName.trim()) : undefined}
                    required
                    disabled={loading}
                  />
                </div>
              ))}

              <button type="submit" className="btn btn-primary w-100 rounded-pill fw-bold" disabled={loading}>
                {loading ? 'Saving...' : '➕ Add Nutrition'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNutritionForm;
