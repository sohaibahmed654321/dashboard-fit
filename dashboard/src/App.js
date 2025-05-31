import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import AddWorkout from "./Component/workout/Addworkout";
import ViewWorkout from "./Component/workout/Viewworkout";
import ViewSetCounter from "./Component/setcounter/ViewSetCounter";
import AddSetCounter from "./Component/setcounter/AddSetCounter";
import Viewnutrition from "./Component/Nutrition/Viewnutrition";


import AddNutritionForm from "./Component/Nutrition/nutrition";
import Register from "./Component/Register/Register";
import Showdata from "./Component/Register/Showdata";
import Login from "./Component/Register/Login";
import ForgotPassword from "./Component/Register/ForgotPassword";
import Progress from "./Component/Progress/Progres";
import Home from "./Component/Home/Home"






function App() {
  return (
   <Router>
      <div className="main-content">
        {/* <h1 className="text-center mb-4">Fitness Tracker</h1> */}
        <Routes>
            <Route path="/register" element={<Register />} />
          <Route path="/show" element={<Showdata />} />
          <Route path="/login" element={<Login />} />
          <Route path="/fp" element={<ForgotPassword />} />
          <Route path="/work" element={<AddWorkout />} />
          <Route path="/view" element={<ViewWorkout />} />
          <Route path="/set" element={<AddSetCounter />} />
          <Route path="/viewset" element={<ViewSetCounter />} />
          <Route path="/nutrition" element={<AddNutritionForm />} />
          <Route path="/v" element={<Viewnutrition/>} />
          <Route path="/p" element={<Progress/>} />
          <Route path="/" element={<Home/>} />

          


          
        
        </Routes>
      </div>
    </Router>
  );
}

export default App;
