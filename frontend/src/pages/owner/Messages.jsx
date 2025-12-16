import React, { useState, useEffect } from 'react';
import { contactService } from '../../services/contactService';
import { toast } from 'react-toastify';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchMessages();
    fetchUnreadCount();
  }, [filter]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter === 'unread') params.isRead = false;
      if (filter === 'read') params.isRead = true;
      
      const response = await contactService.getContactMessages(params);
      setMessages(response.data);
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await contactService.getUnreadCount();
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Failed to fetch unread count');
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await contactService.markAsRead(id);
      toast.success('Message marked as read');
      fetchMessages();
      fetchUnreadCount();
    } catch (error) {
      toast.error('Failed to mark message as read');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await contactService.deleteContact(id);
        toast.success('Message deleted successfully');
        fetchMessages();
        fetchUnreadCount();
      } catch (error) {
        toast.error('Failed to delete message');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="messages-page">
      <div className="page-header">
        <h1>Contact Messages</h1>
        {unreadCount > 0 && (
          <div className="unread-badge">
            {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      <div className="message-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Messages
        </button>
        <button 
          className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread ({unreadCount})
        </button>
        <button 
          className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
          onClick={() => setFilter('read')}
        >
          Read
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading messages...</div>
      ) : messages.length > 0 ? (
        <div className="messages-list">
          {messages.map((message) => (
            <div key={message._id} className={`message-card ${!message.isRead ? 'unread' : ''}`}>
              <div className="message-header">
                <div className="sender-info">
                  <h3>{message.name}</h3>
                  <p className="sender-email">{message.email}</p>
                </div>
                <div className="message-meta">
                  <span className="message-date">{formatDate(message.createdAt)}</span>
                  {!message.isRead && <span className="unread-indicator">New</span>}
                </div>
              </div>
              
              {message.subject && (
                <div className="message-subject">
                  <strong>Subject:</strong> {message.subject}
                </div>
              )}
              
              <div className="message-content">
                {message.message}
              </div>
              
              <div className="message-actions">
                {!message.isRead && (
                  <button 
                    className="btn-secondary"
                    onClick={() => handleMarkAsRead(message._id)}
                  >
                    Mark as Read
                  </button>
                )}
                <a 
                  href={`mailto:${message.email}?subject=Re: ${message.subject || 'Your message'}`}
                  className="btn-primary"
                >
                  Reply
                </a>
                <button 
                  className="btn-remove"
                  onClick={() => handleDelete(message._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-messages">
          <p>No messages found.</p>
        </div>
      )}
    </div>
  );
};

export default Messages;