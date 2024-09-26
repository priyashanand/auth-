import React from 'react';
import './Dashboard.css';
import AuthNavbar from '../Authorized-Navbar/AuthorizedNav';

const Dashboard = () => {
  return (
    <>
    <AuthNavbar />
    <div className="dashboard-layout">
      {/* Sidebar for navigation */}
      <div className="sidebar">
        
        <ul className="sidebar-menu">
          <li className="sidebar-item active">Dashboard</li>
          <li className="sidebar-item">Devices</li>
          <li className="sidebar-item">Data</li>
          <li className="sidebar-item">Alert</li>
          <li className="sidebar-item">Analytics</li>
          <li className="sidebar-item">Logs</li>
          <li className="sidebar-item">Integrations</li>
        </ul>
      </div>

      {/* Main content area */}
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
        </div>

        <div className="dashboard-cards">
          <div className="card">
            <h3>Device Status:</h3>
            <p>Status: Active</p>
            <p>Last Active: 5 mins ago</p>
          </div>
          <div className="card">
            <h3>Device Stats:</h3>
            <p>Created: One month ago</p>
            <p>Entries: 100</p>
          </div>
          <div className="card">
            <h3>Recent Alerts:</h3>
            <p>Temperature limit exceeded - 5 mins ago</p>
          </div>
        </div>

        <div className="dashboard-chart">
          <h3>Device Data</h3>
          <img src="graph.png" alt="Device Chart" />
        </div>
      </div>
    </div>
    </>
  );
};

export default Dashboard;
