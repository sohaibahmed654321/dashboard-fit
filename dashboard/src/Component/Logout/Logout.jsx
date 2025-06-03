import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Logout = () => {
  // Clear localStorage on component mount
  useEffect(() => {
    localStorage.removeItem('userId');
    // Or to clear everything:
    // localStorage.clear();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img 
          src="https://cdn-icons-png.flaticon.com/512/1828/1828490.png" 
          alt="Logout Icon"
          style={styles.icon}
        />
        <h2 style={styles.title}>You've been logged out!</h2>
        <p style={styles.text}>Thank you for visiting FitLife. We hope to see you again soon.</p>
        <Link to="/" style={styles.button}>Login Again</Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f2f4f7',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '40px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center',
    width: '350px',
  },
  icon: {
    width: '80px',
    marginBottom: '20px',
  },
  title: {
    fontSize: '24px',
    color: '#333',
    marginBottom: '10px',
  },
  text: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '20px',
  },
  button: {
    display: 'inline-block',
    textDecoration: 'none',
    backgroundColor: '#000',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: 'bold',
  }
};

export default Logout;
