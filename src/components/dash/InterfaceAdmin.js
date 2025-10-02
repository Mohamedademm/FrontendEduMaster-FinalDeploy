import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import { useTranslation } from 'react-i18next';

import DHeader from './D_Header';
import DSidebar from './D_Sidebar';

import '../../Css/dash/InterfaceAdmin.css';

const InterfaceAdmin = () => {
  const { t } = useTranslation();
  const [openSidebar, setOpenSidebar] = useState(false);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };

  const closeSidebar = () => {
    setOpenSidebar(false);
  };

  // State for managers
  const [managers, setManagers] = useState([
    { id: 1, name: 'Manager 1' },
    { id: 2, name: 'Manager 2' },
  ]);

  // State for institutes
  const [institutes, setInstitutes] = useState([]);

  // Fetch institutes from API
  useEffect(() => {
    const fetchInstitutes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/677079d59ea7c91fdfe0349e/listInstitutions');
        setInstitutes(response.data); // Update state with fetched data
      } catch (error) {
        console.error('Error fetching institutes:', error);
      }
    };

    fetchInstitutes();
  }, []); // Run once when the component is mounted

  // Function to accept a manager request
  const handleAcceptManager = (id) => {
    setManagers(managers.filter(manager => manager.id !== id));
    alert(`Request from Manager ${id} accepted.`);
  };

  // Function to delete an institute via API
  const handleDeleteInstitute = async (institutionId) => {
    try {
      const userId = "677079d59ea7c91fdfe0349e"; // User ID (replace as needed)
      await axios.delete(`http://localhost:3000/api/${userId}/institutions/${institutionId}`);
      
      // Update institutes list after deletion
      setInstitutes(institutes.filter(institute => institute.id !== institutionId));
      
      alert(`Institute ${institutionId} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting institute:', error);
      alert('Unable to delete this institute.');
    }
  };

  return (
    <div className="admin-interface">
      <DSidebar openSidebar={openSidebar} closeSidebar={closeSidebar} />

      <div className="admin-content">
        <DHeader adminName="Admin Name" onToggleSidebar={toggleSidebar} avatarUrl="/static/images/avatar/1.jpg" />

        <h2 className="admin-title">{t('admin_interface')}</h2>
        <p>{t('admin_interface_description')}</p>

        <div className="admin-form-container">
          {/* Managers Requests */}
          <div className="admin-card">
            <h3>{t('manager_requests')}</h3>
            <ul className="admin-manager-list">
              {managers.map(manager => (
                <li key={manager.id} className="admin-list-item">
                  {manager.name}
                  <button onClick={() => handleAcceptManager(manager.id)} className="admin-action-btn">{t('accept')}</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Institutes */}
          <div className="admin-card">
            <h3>{t('current_institutes')}</h3>
            <ul className="admin-institute-list">
              {institutes.map(institute => (
                <li key={institute.id} className="admin-list-item">
                  {institute.name}
                  <button
                    onClick={() => handleDeleteInstitute(institute.id)}
                    className="admin-action-btn admin-delete-btn"
                  >
                    {t('delete')}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterfaceAdmin;
