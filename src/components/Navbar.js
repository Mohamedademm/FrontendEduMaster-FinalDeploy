import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { FaUser, FaSun, FaMoon, FaSignOutAlt, FaCog, FaGlobe } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import '../Css/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isAuthenticated = localStorage.getItem('token');

  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');
  const [profileImage, setProfileImage] = useState(null);
  const [loadingProfileImage, setLoadingProfileImage] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const profileIconRef = useRef(null);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
  }, [language, i18n]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));
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

  const handleLogout = () => {
    localStorage.clear(); // Clear all localStorage data
    navigate('/login');
    setMenuVisible(false); // Close the menu
  };

  const toggleMenu = () => {
    if (profileIconRef.current) {
      const rect = profileIconRef.current.getBoundingClientRect();
      setMenuPosition({ top: rect.bottom + 10, left: rect.left });
    }
    setMenuVisible(prev => !prev);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setMenuVisible(false); // Close the menu
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
    setMenuVisible(false); // Close the menu
  };

  return (
    <div>
      <header className="header">
        <nav className="navContainer">
          <div className="navWrapper">
            {/* Logo */}
            <NavLink to="/" className="navButtonEduMaster" data-text="Awesome">
              <span className="navActualText">&nbsp;EduMaster&nbsp;</span>
              <span aria-hidden="true" className="navHoverText">&nbsp;EduMaster&nbsp;</span>
            </NavLink>

            {/* Navigation Links */}
            <div className="navLinks">
              <NavLink to="/" className={({ isActive }) => (isActive ? 'activeNavLink' : 'navLink')}>
                {t('Home')}
              </NavLink>
              <NavLink to="/courses" className={({ isActive }) => (isActive ? 'activeNavLink' : 'navLink')}>
                {t('Courses')}
              </NavLink>
              <span
                className="navLink"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  const token = localStorage.getItem('token');
                  if (token) {
                    navigate('/careers');
                  } else {
                    navigate('/login');
                  }
                }}
              >
                {t('Careers')}
              </span>
              <NavLink to="/JobOffers" className={({ isActive }) => (isActive ? 'activeNavLink' : 'navLink')}>
                {t('JobOffers')}
              </NavLink>
              <NavLink to="/blog" className={({ isActive }) => (isActive ? 'activeNavLink' : 'navLink')}>
                {t('Blog')}
              </NavLink>
              <NavLink to="/podcasts" className={({ isActive }) => (isActive ? 'activeNavLink' : 'navLink')}>
                {t('Podcasts')}
              </NavLink>
              <NavLink to="/books" className={({ isActive }) => (isActive ? 'activeNavLink' : 'navLink')}>
                {t('Books')}
              </NavLink>
              <NavLink to="/contact" className={({ isActive }) => (isActive ? 'activeNavLink' : 'navLink')}>
                {t('Contact')}
              </NavLink>
            </div>

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
                      style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                    />
                  ) : (
                    <FaUser className="profile-icon" title={t('DefaultProfileIcon')} />
                  )}
                </div>
              ) : (
                <button className="signupButton" onClick={() => navigate('/login')}>
                  {t('Login')}
                </button>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Dropdown menu */}
      {menuVisible && (
        <div
          className="language-menu"
          style={{
            position: 'fixed',
            top: menuPosition.top,
            left: menuPosition.left - 120,
            width: '130px',
            backgroundColor: '#fff', // Set background to white
            color: '#000', // Set text color to black
            
          }}
        >
          <ul className="sidebar-menu" style={{ listStyle: 'none', padding: '10px' }}>
            <li
              onClick={() => navigate('/GestionProfil')}
              style={{
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
                width: '110%',
              }}
              
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#f0f0f0')} // Hover effect
              onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
            >
              <FaCog /> {t('ManageProfile')}
            </li>
            <li
              onClick={() => handleLanguageChange('en')}
              style={{
                padding: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#f0f0f0')} // Hover effect
              onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
            >
              <FaGlobe /> {t('English')}
            </li>
            <li
              onClick={() => handleLanguageChange('fr')}
              style={{
                padding: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#f0f0f0')} // Hover effect
              onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
            >
              <FaGlobe /> {t('French')}
            </li>
            <li
              onClick={toggleDarkMode}
              style={{
                padding: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#f0f0f0')} // Hover effect
              onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
            >
              {darkMode ? <FaSun /> : <FaMoon />} {darkMode ? t('LightMode') : t('DarkMode')}
            </li>
            <li
              onClick={handleLogout}
              style={{
                padding: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#f0f0f0')} // Hover effect
              onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
            >
              <FaSignOutAlt /> {t('Logout')}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
