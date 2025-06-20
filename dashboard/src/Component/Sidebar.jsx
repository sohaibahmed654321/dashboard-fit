import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaDumbbell,
  FaUtensils,
  FaPlus,
  FaList,
  FaChevronDown,
  FaChevronRight,
  FaChartLine,
  FaSignOutAlt,
} from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);

  // ✅ Redirect to login if userId is not in localStorage
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/'); // redirect to login
    }
  }, [navigate]);

  const handleToggle = (label) => {
    setOpenMenu((prev) => (prev === label ? null : label));
  };

  const menuItems = [
    {
      label: 'Home',
      icon: <FaHome />,
      path: '/h',
    },
    {
      label: 'Workouts',
      icon: <FaDumbbell />,
      subItems: [
        { label: 'Add Workout', path: '/work' },
        { label: 'Show Workouts', path: '/view' },
      ],
    },
    {
      label: 'Nutrition',
      icon: <FaUtensils />,
      subItems: [
        { label: 'Add Meal Plan', path: '/nutrition' },
        { label: 'Show Meals', path: '/v' },
      ],
    },
    {
      label: 'Step Counter',
      icon: <FaUtensils />,
      subItems: [
        { label: 'Add Step Count', path: '/set' },
        { label: 'Show Steps', path: '/viewset' },
      ],
    },
    {
      label: 'Progress',
      icon: <FaChartLine />,
      subItems: [{ label: 'Add Progress', path: '/p' }],
    },
    {
      label: 'Logout',
      icon: <FaSignOutAlt />,
      subItems: [{ label: 'Logout', path: '/logout' }],
    },
  ];

  return (
    <div
      className="bg-dark text-white d-flex flex-column p-4"
      style={{
        width: '250px',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        overflowY: 'auto',
        boxShadow: '2px 0 5px rgba(0,0,0,0.5)',
      }}
    >
      <img
        src="/Fitness (3).png"
        alt="Admin Dashboard"
        className="mx-auto mb-4"
        style={{ maxWidth: '130px' }}
      />

      <ul className="nav flex-column">
        {menuItems.map((item, index) => {
          const isOpen = openMenu === item.label;
          const isActive = location.pathname === item.path;

          return (
            <li className="nav-item mb-2" key={index}>
              {item.path ? (
                <Link
                  to={item.path}
                  className={`nav-link d-flex align-items-center justify-content-between rounded ${isActive ? 'bg-primary text-white' : 'text-white'
                    }`}
                  style={{ transition: 'all 0.3s', padding: '10px 15px' }}
                >
                  <span className="d-flex align-items-center gap-2">
                    {item.icon}
                    {item.label}
                  </span>
                </Link>
              ) : (
                <>
                  <div
                    onClick={() => handleToggle(item.label)}
                    className="nav-link d-flex align-items-center justify-content-between text-white rounded"
                    style={{
                      cursor: 'pointer',
                      transition: 'background 0.3s',
                      padding: '10px 15px',
                      backgroundColor: isOpen ? '#0d6efd' : 'transparent',
                    }}
                  >
                    <span className="d-flex align-items-center gap-2">
                      {item.icon}
                      {item.label}
                    </span>
                    {isOpen ? <FaChevronDown /> : <FaChevronRight />}
                  </div>
                  {isOpen && item.subItems && (
                    <ul className="nav flex-column ms-3 mt-1">
                      {item.subItems.map((sub, subIndex) => {
                        const isSubActive = location.pathname === sub.path;
                        return (
                          <li key={subIndex} className="nav-item mb-1">
                            <Link
                              to={sub.path}
                              className={`nav-link d-flex align-items-center text-white small rounded ${isSubActive ? 'bg-secondary' : ''
                                }`}
                              style={{
                                transition: 'all 0.2s',
                                padding: '8px 12px',
                              }}
                            >
                              {sub.label.includes('Add') ? (
                                <FaPlus className="me-2" />
                              ) : (
                                <FaList className="me-2" />
                              )}
                              {sub.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
