import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserPlus, FaCalendarAlt, FaDollarSign, FaChalkboardTeacher, FaUsers } from 'react-icons/fa';
import '../../Css/Teacher/CreateOnlineClass.css';

const CreateOnlineClass = () => {
  const [title, setTitle] = useState('');
  const [domaine, setDomaine] = useState('');
  const [date, setDate] = useState('');
  const [invitedUsers, setInvitedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    // Fetch all users to invite
    axios.get('http://localhost:3000/api/users').then((response) => {
      setUsers(response.data);
    }).catch(error => {
      console.error('Error fetching users:', error);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const teacherId = localStorage.getItem('teacherId');
    try {
      await axios.post('http://localhost:3000/api/online-classes', { title, domaine, date, teacherId, invitedUsers, isPremium, price });
      alert('Online class created successfully!');
    } catch (error) {
      console.error('Error creating online class:', error);
      alert('Error creating online class');
    }
  };

  const handleUserSelect = (userId) => {
    setInvitedUsers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="create-online-class">
      <h2><FaChalkboardTeacher /> Create Online Class</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label><FaChalkboardTeacher /> Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label><FaChalkboardTeacher /> Domaine</label>
          <textarea value={domaine} onChange={(e) => setDomaine(e.target.value)} required />
        </div>
        <div className="form-group">
          <label><FaCalendarAlt /> Date</label>
          <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div className="form-group">
          <label><FaUsers /> Invite Users</label>
          <input
            type="text"
            placeholder="Search users by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar"
          />
          <div className="user-list">
            {filteredUsers.map(user => (
              <div key={user._id} className={`user-item ${invitedUsers.includes(user._id) ? 'selected' : ''}`} onClick={() => handleUserSelect(user._id)}>
                <FaUserPlus /> {user.firstName} {user.lastName}
              </div>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label><FaDollarSign /> Premium Class</label>
          <input type="checkbox" checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)} />
        </div>
        {isPremium && (
          <div className="form-group">
            <label><FaDollarSign /> Price</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </div>
        )}
        <button type="submit">Create Class</button>
      </form>
    </div>
  );
};

export default CreateOnlineClass;
