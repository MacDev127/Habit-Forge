import React from 'react';
import { AuthContext } from '../../context/AuthContext/AuthContext';
import { useContext } from 'react';

const Dashboard = () => {
  const auth = useContext(AuthContext);
  if (!auth) return null;
  return (
    <>
      <h1>Dashboard</h1>
      <button onClick={auth.logout} className="logout-btn">
        Logout
      </button>
    </>
  );
};

export default Dashboard;
