import React, { useState, useEffect } from 'react';
import { contactService } from '../services/contactService';
import { useAuth } from '../context/AuthContext';

const NotificationBadge = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { isOwner } = useAuth();

  useEffect(() => {
    if (isOwner) {
      fetchUnreadCount();
      // Poll for new messages every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isOwner]);

  const fetchUnreadCount = async () => {
    try {
      const response = await contactService.getUnreadCount();
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      // Silently fail - don't show error for this background operation
    }
  };

  return (
    <div className="notification-wrapper">
      {children}
      {unreadCount > 0 && (
        <span className="notification-badge">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </div>
  );
};

export default NotificationBadge;