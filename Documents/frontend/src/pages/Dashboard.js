import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaHome, 
  FaUsers, 
  FaUser, 
  FaCog, 
  FaSignOutAlt,
  FaUserShield
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Show loading for navigation
  const showLoadingForAction = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(`/dashboard`);
    }, 3000); // 3 seconds for dashboard
  };

  // Show loading for sidebar navigation
  const handleNavigation = (path) => {
    setLoading(true);
    const loadingTime = path === '/dashboard' ? 3000 : 2000; // Dashboard 3 sec, others 2 sec
    setTimeout(() => {
      setLoading(false);
      navigate(path);
    }, loadingTime);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Successfully logged out', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => navigate('/login')
      });
    } catch (error) {
      console.error('Failed to log out', error);
      toast.error('Failed to log out. Please try again.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Show welcome message on component mount
  useEffect(() => {
    if (currentUser) {
      toast.success(`login Successfully,${currentUser.name || 'User'}!`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, [currentUser]);

  // Check if current route is active
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="dashboard-container">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>Admin Panel</h3>
        </div>

        <nav className="sidebar-nav">
          <Link 
            to="/dashboard" 
            className={`nav-link ${isActive('/dashboard')}`}
            onClick={() => handleNavigation('/dashboard')}
          >
            <FaHome className="nav-icon" /> Dashboard
          </Link>

          <Link 
            to="/dashboard/users" 
            className={`nav-link ${isActive('/dashboard/users')}`}
            onClick={() => handleNavigation('/dashboard/users')}
          >
            <FaUsers className="nav-icon" /> Users Management
          </Link>

          <Link 
            to="/dashboard/profile" 
            className={`nav-link ${isActive('/dashboard/profile')}`}
            onClick={() => handleNavigation('/dashboard/profile')}
          >
            <FaUser className="nav-icon" /> My Profile
          </Link>

          <Link 
            to="/dashboard/settings" 
            className={`nav-link ${isActive('/dashboard/settings')}`}
            onClick={() => handleNavigation('/dashboard/settings')}
          >
            <FaCog className="nav-icon" /> System Settings
          </Link>

          <button 
            onClick={() => setShowLogoutModal(true)} 
            className="logout-btn"
          >
            <FaSignOutAlt className="nav-icon" /> Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="top-bar">
          <h2>
            {location.pathname === '/dashboard' && 'Dashboard'}
            {location.pathname === '/dashboard/users' && 'Users Management'}
            {location.pathname === '/dashboard/profile' && 'My Profile'}
            {location.pathname === '/dashboard/settings' && 'System Settings'}
          </h2>
          <div className="user-info">
            <div className="user-avatar">
              {currentUser?.username?.charAt(0).toUpperCase() || currentUser?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="user-details">
              <span className="user-name">{currentUser?.username || currentUser?.name || 'Admin'}</span>
              <span className="user-role admin-badge">Administrator</span>
            </div>
          </div>
        </div>

        <div className="content">
          <Outlet />
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">
              <FaSignOutAlt />
            </div>
            <h1>Confirm Logout</h1>
            <p>Are you sure you want to log out?</p>
            
            <div className="modal-actions">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger" 
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
