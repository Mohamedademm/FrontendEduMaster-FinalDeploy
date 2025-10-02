import React, { useState, useMemo, useEffect, useRef } from 'react';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import Badge from '@mui/material/Badge';
import Popover from '@mui/material/Popover';
import { FaUser, FaBell, FaSearch, FaUsers, FaBook, FaChartLine, FaDollarSign } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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
  onNotifClose,
  timeRange,
  refreshing
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isAuthenticated = localStorage.getItem('token');
  const profileIconRef = useRef(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loadingProfileImage, setLoadingProfileImage] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const toggleMenu = () => {
    if (profileIconRef.current) {
      const rect = profileIconRef.current.getBoundingClientRect();
      setMenuPosition({ top: rect.bottom + 10, left: rect.left });
    }
    setMenuVisible(prev => !prev);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user')); // Make sure 'user' is the correct key
      const userId = userData?._id;

      if (token && userId) {
        try {
          const response = await axios.get(`http://localhost:3000/api/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.data.profileImage) {
            setProfileImage(`http://localhost:3000${response.data.profileImage}`);
          }
        } catch (err) {
          console.error("Error fetching profile image:", err);
        } finally {
          setLoadingProfileImage(false);
        }
      } else {
        setLoadingProfileImage(false);
      }
    };

    fetchUserProfile();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [loadingSearch, setLoadingSearch] = useState(false);

  const prevData = {
    students: totalStudents ? Math.round(totalStudents * 0.9) : 0,
    courses: totalCourses ? Math.round(totalCourses * 0.95) : 0,
    completion: completionRate ? completionRate - 1.2 : 0,
    revenue: revenue ? revenue * 0.85 : 0,
  };

  function calcGrowth(current, previous) {
    if (!current || !previous || previous === 0) return 0;
    const numCurrent = typeof current === 'string' ? parseFloat(current) : current;
    const result = (((numCurrent - previous) / previous) * 100).toFixed(1);
    return isNaN(result) ? 0 : result;
  }

  const stats = useMemo(() => {
    const allStats = [
      {
        label: t('total_students'), // Using t function for labels
        value: totalStudents ?? 'N/A',
        prev: prevData.students,
        icon: <FaUsers />, // React Icon
        tooltip: t('tooltip_total_students'),
      },
      {
        label: t('total_courses'),
        value: totalCourses ?? 'N/A',
        prev: prevData.courses,
        icon: <FaBook />, // React Icon
        tooltip: t('tooltip_total_courses'),
      },
      {
        label: t('completion_rate'),
        value: (typeof completionRate === 'number' && !isNaN(completionRate)) 
               ? `${completionRate.toFixed(1)}%` 
               : 'N/A', // Check if completionRate is a valid number
        prev: prevData.completion,
        icon: <FaChartLine />, // React Icon
        tooltip: t('tooltip_completion_rate'),
      },
      {
        label: t('revenue'),
        value: revenue ? `$${Number(revenue).toLocaleString()}` : 'N/A', // Ensure revenue is a number and format
        prev: prevData.revenue,
        icon: <FaDollarSign />, // React Icon
        tooltip: t('tooltip_revenue'),
      },
    ];

    if (!searchTerm.trim()) return allStats;

    return allStats.filter((stat) =>
      stat.label.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
  }, [totalStudents, totalCourses, completionRate, revenue, prevData, searchTerm, t]); // Added t to dependencies

  useEffect(() => {
    setLoadingSearch(true);
    const timeout = setTimeout(() => setLoadingSearch(false), 300);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const renderGrowth = (growth) => {
    const growthValue = parseFloat(growth);
    if (isNaN(growthValue)) return <span className="growth-na">N/A</span>;
    const isPositive = growthValue >= 0;
    const arrow = isPositive ? '▲' : '▼';
    const colorClass = isPositive ? 'growth-positive' : 'growth-negative';
    return (
      <span className={`statGrowth ${colorClass}`}>
        {arrow} {Math.abs(growthValue)}%
      </span>
    );
  };

  return (
    <section className="section1">
      <header className="header1">
        <div className="searchContainer">
          <FaSearch className="searchIcon" />
          <input
            type="text"
            placeholder={t('search_stats_placeholder')}
            className="searchInput"
            aria-label="Search for statistics"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {loadingSearch && <CircularProgress size={20} sx={{ ml: 1 }} />}
        </div>

        <div className="header-actions">
          <Badge badgeContent={notifications.length > 0 ? notifications.length : null} color="error" onClick={onNotifClick} sx={{ cursor: 'pointer', color: 'var(--text-color)' }}>
            <FaBell size={24} />
          </Badge>

          {/* Profile Section */}
          <div className="authButtons">
            {isAuthenticated ? (
              <div
                className="profile-container"
                onClick={toggleMenu}
                title={t('Profile')}
                ref={profileIconRef}
              >
                {loadingProfileImage ? (
                  <div className="loading-spinner"></div>
                ) : profileImage ? (
                  <img
                    src={profileImage}
                    alt={t('Profile Image')}
                    className="profile-image-loaded"
                  />
                ) : (
                  <FaUser className="profile-icon" title={t('Default Profile Icon')} />
                )}
              </div>
            ) : (
              <button className="signupButton" onClick={() => navigate('/login')}>
                {t('Login')}
              </button>
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
            <h4>Notifications</h4>
            {notifications.length === 0 && <p>No notifications</p>}
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
          stats.map(({ label, value, prev, icon, tooltip }) => {
            const growth = calcGrowth(value, prev);
            return (
              <div className="statCard" key={label}>
                <div className="statHeader">
                  <Tooltip title={tooltip} arrow placement="top">
                    <span className="statIconWrapper">{icon}</span>
                  </Tooltip>
                  {renderGrowth(growth)}
                </div>
                <h2 className="statValue">{value}</h2>
                <p className="statLabel">{label}</p>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

export default Section1;
