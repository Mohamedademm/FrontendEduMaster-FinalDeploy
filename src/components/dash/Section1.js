import React, { useState, useMemo, useEffect } from 'react';
import Badge from '@mui/material/Badge';
import Popover from '@mui/material/Popover';
import { FaUser, FaBell, FaSearch, FaUsers, FaBook, FaChartLine } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import '../../Css/dash/Section1.css';

function Section1({
  totalStudents,
  totalCourses,
  totalTeachers,
  completionRate,
  revenue,
  notifications = [],
  onNotifClick,
  notifAnchorEl,
  notifId,
  openNotif,
  onNotifClose
}) {
  const { t } = useTranslation();
  const [profileImage, setProfileImage] = useState(null);
  const [loadingProfileImage, setLoadingProfileImage] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));
      const userId = userData?._id;

      if (token && userId) {
        try {
          const response = await axios.get(`http://localhost:3000/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setProfileImage(response.data.profileImage);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        } finally {
          setLoadingProfileImage(false);
        }
      } else {
        setLoadingProfileImage(false);
      }
    };

    fetchUserProfile();
  }, []);

  const stats = useMemo(() => {
    const allStats = [
      {
        label: t('total_students'),
        value: totalStudents ?? 'N/A',
        icon: <FaUsers />,
        color: '#3b82f6'
      },
      {
        label: t('total_teachers'),
        value: totalTeachers ?? 'N/A',
        icon: <FaUser />,
        color: '#10b981'
      },
      {
        label: t('total_courses'),
        value: totalCourses ?? 'N/A',
        icon: <FaBook />,
        color: '#f59e0b'
      },
      {
        label: t('completion_rate'),
        value: (typeof completionRate === 'number' && !isNaN(completionRate)) 
               ? `${completionRate.toFixed(1)}%` 
               : 'N/A',
        icon: <FaChartLine />,
        color: '#ef4444'
      }
    ];

    if (!searchTerm.trim()) return allStats;

    return allStats.filter((stat) =>
      stat.label.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
  }, [totalStudents, totalTeachers, totalCourses, completionRate, searchTerm, t]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  return (
    <section className="section1">
      <header className="header1">
        <div className="searchContainer">
          <FaSearch className="searchIcon" />
          <input
            type="text"
            placeholder={t('search_stats_placeholder')}
            className="searchInput"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="header-actions">
          <Badge 
            badgeContent={notifications.length > 0 ? notifications.length : null} 
            color="error" 
            onClick={onNotifClick} 
            sx={{ cursor: 'pointer' }}
          >
            <FaBell size={24} />
          </Badge>

          <div className="profile-container">
            {loadingProfileImage ? (
              <div className="loading-spinner"></div>
            ) : profileImage ? (
              <img
                src={profileImage}
                alt={t('Profile Image')}
                className="profile-image-loaded"
              />
            ) : (
              <FaUser className="profile-icon" />
            )}
          </div>
        </div>

        <Popover
          id={notifId}
          open={openNotif}
          anchorEl={notifAnchorEl}
          onClose={onNotifClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{ style: { width: 300, maxHeight: 400, overflowY: 'auto' } }}
        >
          <div style={{ padding: 16 }}>
            <h4>{t('notifications')}</h4>
            {notifications.length === 0 && <p>{t('no_notifications')}</p>}
            {notifications.map((notif) => (
              <div
                key={notif._id}
                style={{
                  borderBottom: '1px solid #eee',
                  padding: '8px 0',
                  fontSize: 14,
                  cursor: 'pointer',
                }}
                onClick={() => alert(notif.message || 'Notification clicked')}
              >
                {notif.message}
              </div>
            ))}
          </div>
        </Popover>
      </header>

      <div className="statsContainer">
        {stats.length === 0 ? (
          <p className="no-stats-found">{t('no_matching_stats')}</p>
        ) : (
          stats.map((stat, index) => (
            <div key={index} className="statCard">
              <div className="statHeader">
                <div className="statIcon" style={{ color: stat.color }}>
                  {stat.icon}
                </div>
              </div>
              <h3 className="statLabel">{stat.label}</h3>
              <div className="statValue">{stat.value}</div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default Section1;
