import React, { useState, useEffect } from 'react';
import '../Css/NotificationManagement.css';

const NotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [history, setHistory] = useState([]);
  const [userSegment, setUserSegment] = useState('all');
  
  useEffect(() => {
    // Simulate fetching notifications history
    setHistory([
      { id: 1, message: 'System update scheduled', date: '2025-02-18', status: 'Sent' },
      { id: 2, message: 'New feature available', date: '2025-02-16', status: 'Pending' }
    ]);
  }, []);

  const handleSendNotification = () => {
    const notification = {
      id: notifications.length + 1,
      message: newNotification,
      urgent: isUrgent,
      segment: userSegment,
      date: new Date().toLocaleDateString(),
      status: 'Pending'
    };
    setNotifications([...notifications, notification]);
    setHistory([...history, notification]);
    setNewNotification('');
    setIsUrgent(false);
  };

  const handleChange = (e) => {
    setNewNotification(e.target.value);
  };

  const handleSegmentChange = (e) => {
    setUserSegment(e.target.value);
  };

  return (
    <div className="notification-management">
      <h1>Gestion des Notifications</h1>
      
      {/* Create Notification Form */}
      <div className="notification-form">
        <textarea
          value={newNotification}
          onChange={handleChange}
          placeholder="Entrez votre message"
        />
        <div className="form-controls">
          <label>
            Urgent:
            <input
              type="checkbox"
              checked={isUrgent}
              onChange={() => setIsUrgent(!isUrgent)}
            />
          </label>
          <label>
            Segment:
            <select onChange={handleSegmentChange} value={userSegment}>
              <option value="all">Tous les utilisateurs</option>
              <option value="active">Utilisateurs actifs</option>
              <option value="inactive">Utilisateurs inactifs</option>
            </select>
          </label>
          <button onClick={handleSendNotification}>Envoyer</button>
        </div>
      </div>

      {/* Notification History */}
      <div className="notification-history">
        <h2>Historique des Notifications</h2>
        <table>
          <thead>
            <tr>
              <th>Message</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((notif) => (
              <tr key={notif.id}>
                <td>{notif.message}</td>
                <td>{notif.date}</td>
                <td className={notif.status.toLowerCase()}>{notif.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Notifications List */}
      <div className="notifications-list">
        <h2>Notifications en attente</h2>
        <ul>
          {notifications.map((notif) => (
            <li key={notif.id} className={notif.urgent ? 'urgent' : ''}>
              <p>{notif.message}</p>
              <span>{notif.date}</span>
              <span className="status">{notif.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NotificationManagement;
