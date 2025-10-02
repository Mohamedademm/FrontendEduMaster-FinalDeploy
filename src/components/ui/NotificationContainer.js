import React from 'react';
import Notification from './Notification';

const NotificationContainer = ({ notifications, onRemove }) => {
  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          isVisible={notification.isVisible}
          onClose={() => onRemove(notification.id)}
          duration={0} // We handle duration in the hook
        />
      ))}
    </div>
  );
};

export default NotificationContainer;
