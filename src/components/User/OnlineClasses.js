import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreateOnlineClass from '../Teacher/CreateOnlineClass';
import '../../Css/User/OnlineClasses.css';

const OnlineClasses = () => {
  const [classes, setClasses] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user._id : null;
  const isTeacher = user && user.role === 'teacher';
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/online-classes/${userId}`).then((response) => {
      setClasses(response.data);
    }).catch(error => {
      console.error('Error fetching online classes:', error);
    });
  }, [userId]);

  const handleJoinClass = (onlineClass) => {
    navigate(`/meeting/${onlineClass._id}`);
  };

  const openCreateModal = () => {
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
  };

  return (
    <div className="online-classes">
      <h2>Online Classes</h2>
      {isTeacher && (
        <button className="btn-create-class" onClick={openCreateModal}>
          Create Online Class
        </button>
      )}
      {classes.length === 0 ? (
        <p>No online classes available.</p>
      ) : (
        <ul>
          {classes.map((onlineClass) => (
            <li key={onlineClass._id}>
              <h3>{onlineClass.title}</h3>
              <p>{onlineClass.domaine}</p>
              <p>Date: {new Date(onlineClass.date).toLocaleString()}</p>
              <button onClick={() => handleJoinClass(onlineClass)}>Join Class</button>
            </li>
          ))}
        </ul>
      )}

      {showCreateModal && (
        <div className="modal-overlay" onClick={closeCreateModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeCreateModal}>X</button>
            <CreateOnlineClass />
          </div>
        </div>
      )}
    </div>
  );
};

export default OnlineClasses;
