import React from 'react';
import { AuthContext } from '../../context/AuthContext/AuthContext';
import { useContext } from 'react';
import DashboardComponent from '../../components/DashboardComponent/DashboardComponent';
const Dashboard = () => {
  const auth = useContext(AuthContext);
  if (!auth) return null;
  return (
    <>
      <DashboardComponent />
      <button onClick={auth.logout} className="logout-btn">
        Logout
      </button>
    </>
  );
};

export default Dashboard;
