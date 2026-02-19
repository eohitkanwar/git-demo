// src/pages/dashboard/Home.js

import React, { useState, useEffect } from 'react';
import { getDashboardStats, getRecentActiveUsers } from '../../services/userServices';
import '../../styles/dashboard.css';

const Home = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdminUsers: 0,
    totalNonAdminUsers: 0,
    recentlyActiveUsers: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all users to calculate statistics
      const usersResponse = await fetch('http://localhost:5000/api/auth/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const usersData = await usersResponse.json();
      
      // Calculate statistics from users data
      const users = Array.isArray(usersData) ? usersData : usersData.users || [];
      const totalUsers = users.length;
      const totalAdminUsers = users.filter(user => user.role === 'admin').length;
      const totalNonAdminUsers = totalUsers - totalAdminUsers;
      
      // Get recently active users (last 24 hours or based on lastLogin)
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentlyActiveUsers = users.filter(user => {
        if (user.lastLogin) {
          return new Date(user.lastLogin) > twentyFourHoursAgo;
        }
        return false;
      }).length;
      
      // Get recent users for activity list
      const recentActivityUsers = users
        .filter(user => user.createdAt)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setStats({
        totalUsers,
        totalAdminUsers,
        totalNonAdminUsers,
        recentlyActiveUsers
      });
      
      setRecentUsers(recentActivityUsers);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  if (loading) {
    return (
      <div className="dashboard-home">
        <div className="loading-spinner">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-home">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-home">
      <div className="cards-container">
        <div className="card">
          <div className="card-icon">
            <i className="fas fa-users"></i>
          </div>
          <h3>Total Logged-in Users</h3>
          <p className="card-value">{formatNumber(stats.totalUsers)}</p>
        </div>
        
        <div className="card">
          <div className="card-icon">
            <i className="fas fa-user-shield"></i>
          </div>
          <h3>Total Admin Users</h3>
          <p className="card-value">{formatNumber(stats.totalAdminUsers)}</p>
        </div>
        
        <div className="card">
          <div className="card-icon">
            <i className="fas fa-user"></i>
          </div>
          <h3>Total Non-Admin Users</h3>
          <p className="card-value">{formatNumber(stats.totalNonAdminUsers)}</p>
        </div>
        
        <div className="card">
          <div className="card-icon">
            <i className="fas fa-clock"></i>
          </div>
          <h3>Recently Active Users</h3>
          <p className="card-value">{formatNumber(stats.recentlyActiveUsers)}</p>
        </div>
      </div>
      
      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          {recentUsers.length > 0 ? (
            recentUsers.map((user, index) => (
              <div key={user._id || index} className="activity-item">
                <div className="activity-icon">
                  <i className="fas fa-user-plus"></i>
                </div>
                <div className="activity-details">
                  <p>New user registered: {user.name || user.email}</p>
                  <span className="activity-time">
                    {user.createdAt ? formatTime(user.createdAt) : 'Unknown time'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="activity-item">
              <div className="activity-details">
                <p>No recent activity</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;