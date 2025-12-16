import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBadge from './NotificationBadge';

const Navbar = () => {
  const { user, logout, isOwner } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/dashboard" className="nav-logo">
          Quiz Builder
        </Link>
        
        {user && (
          <div className="nav-menu">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/quizzes" className="nav-link">Quizzes</Link>
            <Link to="/progress" className="nav-link">Progress</Link>
            <Link to="/analysis" className="nav-link">Analysis</Link>
            <Link to="/about" className="nav-link">About Us</Link>
            
            {isOwner && (
              <>
                <Link to="/owner/quizzes" className="nav-link">My Quizzes</Link>
                <Link to="/owner/create" className="nav-link">Create Quiz</Link>
                <NotificationBadge>
                  <Link to="/owner/messages" className="nav-link">Messages</Link>
                </NotificationBadge>
              </>
            )}
            
            <div className="nav-user">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.role}</span>
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
