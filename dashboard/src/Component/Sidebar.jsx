import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaDumbbell,
  FaUtensils,
  FaUserCog,
  FaPlus,
  FaList,
  FaChevronDown,
  FaChevronRight,
} from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null); // Accordion behavior

  const handleToggle = (label) => {
    setOpenMenu((prev) => (prev === label ? null : label));
  };

  const menuItems = [
    {
      label: 'Home',
      icon: <FaHome />,
      path: '/',
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
      icon: <FaUtensils />,
      subItems: [
        { label: 'Add Progress', path: '/p' },
       
      ],
    },
    {
      label: 'Settings',
      icon: <FaUserCog />,
      subItems: [
        { label: 'Add Setting', path: '/settings/add' },
        { label: 'Show Settings', path: '/settings/show' },
      ],
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
      <h2 className="text-center text-primary mb-4">Admin Dashboard</h2>
      <ul className="nav flex-column">
        {menuItems.map((item, index) => {
          const isOpen = openMenu === item.label;
          const isActive = location.pathname === item.path;

          return (
            <li className="nav-item mb-2" key={index}>
              {item.path ? (
                <Link
                  to={item.path}
                  className={`nav-link d-flex align-items-center justify-content-between rounded ${
                    isActive ? 'bg-primary text-white' : 'text-white'
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
                              className={`nav-link d-flex align-items-center text-white small rounded ${
                                isSubActive ? 'bg-secondary' : ''
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
