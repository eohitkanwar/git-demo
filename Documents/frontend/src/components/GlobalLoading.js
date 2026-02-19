import React from 'react';
import '../styles/GlobalLoading.css';

const GlobalLoading = () => {
  return (
    <div className="global-loading-overlay">
      <div className="global-loading-spinner">
        <div className="spinner"></div>
        <div className="loading-text">Loading...</div>
      </div>
    </div>
  );
};

export default GlobalLoading;
