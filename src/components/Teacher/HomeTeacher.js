import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import "../../Css/Teacher/HomeTeacher.css";
import {
  FaChalkboardTeacher, FaBook, FaCalendarAlt, FaBell, FaUserGraduate,
  FaTools, FaBars, FaMoon, FaSun, FaUniversity, FaTicketAlt, FaCreditCard
} from "react-icons/fa"; // Added some more icons
import { CircularProgress } from "@mui/material";
import axios from "axios";

// Custom Hook for localStorage backed state
function useLocalStorageState(key, defaultValue) {
  const [state, setState] = useState(() => {
    let storedValue;
    try {
      storedValue = localStorage.getItem(key);
      return storedValue !== null ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
      console.error(`Error parsing localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
}

// Hook to detect clicks outside an element
function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

const HomeTeacher = () => {
  const [courses, setCourses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({ students: 0, exams: 0 });
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [markingAsReadId, setMarkingAsReadId] = useState(null);
  const [markingAllAsRead, setMarkingAllAsRead] = useState(false);
  const [isNotificationPanelOpen, setNotificationPanelOpen] = useState(false);

  const [sidebarHomeTeacherOpen, setsidebarHomeTeacherOpen] = useLocalStorageState("teachersidebarHomeTeacherOpen", true);
  const [darkMode, setDarkMode] = useLocalStorageState("teacherDarkMode", false);

  const navigate = useNavigate();
  const { t } = useTranslation();
  const teacherId = localStorage.getItem("teacherId");

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode-active");
    } else {
      document.body.classList.remove("dark-mode-active");
    }
    // Optional: Cleanup on component unmount
    return () => document.body.classList.remove("dark-mode-active");
  }, [darkMode]);

  const fetchData = useCallback(async () => {
    if (!teacherId) {
      console.error("teacherId is missing in localStorage.");
      setApiError(t('error_missing_teacher_id'));
      setLoading(false);
      return;
    }

    setLoading(true);
    setApiError(null); // Reset error on new fetch

    try {
      const [coursesResponse, notificationsResponse] = await Promise.all([
        axios.get(`http://localhost:3000/api/courses?teacherId=${teacherId}`), // Assuming API can filter by teacherId
        axios.get(`http://localhost:3000/api/notifications/${teacherId}`)
      ]);

      // Process Courses
      const teacherCourses = coursesResponse.data; // No client-side filter needed if API filters
      setCourses(teacherCourses);
      const totalStudents = teacherCourses.reduce((acc, course) => acc + (course.studentsCount || 0), 0);
      const upcomingExams = teacherCourses.reduce((acc, course) => acc + (course.upcomingExamsCount || 0), 0);
      setStats({ students: totalStudents, exams: upcomingExams });

      // Process Notifications
      setNotifications(notificationsResponse.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))); // Sort newest first

    } catch (error) {
      console.error(t('error_loading_data'), error);
      setApiError(t('error_loading_data_message')); // User-friendly message
    } finally {
      setLoading(false);
    }
  }, [t, teacherId]); // Add all stable dependencies

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  const markAsRead = async (notificationId) => {
    const originalNotifications = [...notifications];
    setMarkingAsReadId(notificationId);
    setApiError(null);

    setNotifications((prev) =>
      prev.map((notif) =>
        notif._id === notificationId ? { ...notif, isRead: true } : notif
      )
    );

    try {
      await axios.put(`http://localhost:3000/api/notifications/${notificationId}/read`);
      // Optional: Show success toast
    } catch (error) {
      console.error(t('error_marking_notification_read'), error);
      setNotifications(originalNotifications); // Rollback
      setApiError(t('error_marking_notification_read_message'));
    } finally {
      setMarkingAsReadId(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!notifications.some(n => !n.isRead)) return; // No unread notifications

    const originalNotifications = JSON.parse(JSON.stringify(notifications)); // Deep copy
    setMarkingAllAsRead(true);
    setApiError(null);

    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));

    try {
      // Backend should handle marking all notifications for the teacher as read
      await axios.put(`http://localhost:3000/api/notifications/teacher/${teacherId}/mark-all-read`);
      // Optional: Success toast
    } catch (error) {
      console.error(t('error_marking_all_read'), error);
      setNotifications(originalNotifications); // Rollback
      setApiError(t('error_marking_all_read_message'));
    } finally {
      setMarkingAllAsRead(false);
    }
  };

  const togglesidebarHomeTeacher = () => {
    setsidebarHomeTeacherOpen(prevOpen => !prevOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const navigateToCourseDetails = (courseId) => {
    localStorage.setItem("courseId", courseId);
    navigate(`/MicroCours`);
  };

  // sidebarHomeTeacher navigation items
  
  const sidebarHomeTeacherNavItems = [
    { path: "/CoursTeacher", icon: <FaChalkboardTeacher />, labelKey: 'manage_courses' },
    { path: "/RoadmapIndex", icon: <FaUniversity />, labelKey: 'RoadmapIndex' },
    { path: "/MeetingJoin", icon: <FaCalendarAlt />, labelKey: 'Meeting' },
    { path: "/OnlineClasses", icon: <FaCalendarAlt />, labelKey: 'Online Class' },
    { path: "/PaiementsT", icon: <FaCreditCard />, labelKey: 'Paiements' },
    { path: "/BankAccount", icon: <FaUniversity />, labelKey: 'BankAccount' },
    { path: "/SupportTicketSystem", icon: <FaTicketAlt />, labelKey: 'SupportTicketSystem' },
    { path: "/NotificationManagement", icon: <FaTools />, labelKey: 'technical_support' }, // Example: settings
  ];

  if (!teacherId && !apiError) { // Handle case where teacherId is not yet loaded or missing
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-primary)' }}>
            <CircularProgress />
        </div>
    );
  }


  return (
    <div className={`home-teacher ${darkMode ? "dark-mode-active" : ""}`}>
      <aside className={`sidebarHomeTeacher ${sidebarHomeTeacherOpen ? "open" : "closed"}`}>
        <div className="sidebarHomeTeacher-header">
          <h2>{sidebarHomeTeacherOpen ? t('HomeTeacher') : ''}</h2>
          <button className="sidebarHomeTeacher-toggle" onClick={togglesidebarHomeTeacher} aria-label={sidebarHomeTeacherOpen ? t('close_sidebarHomeTeacher') : t('open_sidebarHomeTeacher')}>
            <FaBars />
          </button>
        </div>
        <nav className="sidebarHomeTeacher-nav" role="navigation" aria-label="Main navigation">
          <ul>
            {sidebarHomeTeacherNavItems.map(item => (
              <li key={item.path} onClick={() => navigate(item.path)} tabIndex={0} role="button"
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(item.path); }}
                  aria-pressed="false" /* For NavLink, use className={({isActive}) => isActive ? 'active-link' : ''} */
              >
                {item.icon} <span className="sidebarHomeTeacher-item-text">{t(item.labelKey)}</span>
              </li>
            ))}
          </ul>
        </nav>
        <div className="dark-mode-toggle">
          <button onClick={toggleDarkMode} aria-label={darkMode ? t('activate_light_mode') : t('activate_dark_mode')}>
            {darkMode ? <FaSun /> : <FaMoon />}
            <span className="dark-mode-text">{darkMode ? t('Light Mode') : t('Dark Mode')}</span>
          </button>
        </div>
      </aside>

      <main className="main-content" role="main">
        <div className="main-content-header"> {/* Optional: for mobile toggle or breadcrumbs */}
            <header className="headerHomeTeacher">
                <h1>{t('HomeTeacher')}</h1>
                <p>{t('welcome_message')}</p>
            </header>
            {/* Ajout du bouton de notification comme dans HtmlCours.js */}
            <div className="header-actions" style={{ position: 'relative' }}>
                <button className="notification-bell-btn" onClick={() => setNotificationPanelOpen(p => !p)}>
                    <FaBell />
                    {notifications.filter(n => !n.isRead).length > 0 && (
                        <span className="notification-badge">{notifications.filter(n => !n.isRead).length}</span>
                    )}
                </button>
                {isNotificationPanelOpen && (
                    <div className="notification-popover">
                        <section className="notificationsHomeTeacher" aria-label={t('notifications')}>
                            <div className="notification-header">
                                <h2>{t('notifications')}</h2>
                                {notifications.some(n => !n.isRead) && (
                                    <button className="mark-all-read-btn" onClick={handleMarkAllAsRead} disabled={markingAllAsRead}>
                                        {markingAllAsRead ? <CircularProgress size="1em" color="inherit"/> : t('mark_all_as_read')}
                                    </button>
                                )}
                            </div>
                            {notifications.length > 0 ? (
                                <ul className="notificationList">
                                    {notifications.map((notif) => (
                                        <li key={notif._id} className={`notificationItem ${notif.isRead ? "read" : "unread"}`}>
                                            <FaBell className="notif-icon" />
                                            <div className="notif-content">
                                                <span className="notif-message">{notif.message}</span>
                                                <span className="notif-timestamp">{new Date(notif.createdAt).toLocaleString()}</span>
                                            </div>
                                            {!notif.isRead && (
                                                <button className="mark-read-btn" onClick={() => markAsRead(notif._id)} disabled={markingAsReadId === notif._id} aria-label={`${t('mark_as_read_for')} "${notif.message}"`}>
                                                    {markingAsReadId === notif._id ? <CircularProgress size="1em" color="inherit"/> : t('mark_as_read')}
                                                </button>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="empty-state-text">{t('no_notifications')}</p>
                            )}
                        </section>
                    </div>
                )}
            </div>
        </div>


        {apiError && <div className="api-error-message">{apiError}</div>}

        {loading && !courses.length ? ( /* Show main loader only if no courses yet and loading */
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}><CircularProgress /></div>
        ) : (
          <>
            <section className="evaluations" aria-label={t('teacher_statistics')}>
              <div className="cardHomeTeacher">
                <FaUserGraduate className="icon" />
                <div className="cardHomeTeacher-content">
                  <h2>{t('students')}</h2>
                  <p>{stats.students} <span className="enrolled-text">{t('enrolled')}</span></p>
                </div>
              </div>
              <div className="cardHomeTeacher">
                <FaCalendarAlt className="icon" />
                <div className="cardHomeTeacher-content">
                  <h2>{t('evaluations')}</h2>
                  <p>{stats.exams} <span className="enrolled-text">{t('upcoming')}</span></p>
                </div>
              </div>
            </section>

            <section className="courses" aria-label={t('courses_list')}>
              <h2>{t('your_courses')}</h2>
              <div className="course-list">
                {courses.length === 0 && !loading ? (
                  <p>{t('no_courses')}</p>
                ) : (
                  courses.map((course) => (
                    <div key={course._id} className="course-cardHomeTeacherHomeTeacher" tabIndex={0}
                         onClick={() => navigateToCourseDetails(course._id)}
                         onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigateToCourseDetails(course._id); }}>
                      <FaBook className="course-icon" />
                      <h3>{course.name}</h3>
                      <p className="course-meta">{t('progress')}: {course.NbMicroCour || 0}%</p>
                      <div className="progress-bar" aria-label={`${t('progress_for')} ${course.name} ${course.NbMicroCour || 0}%`}>
                        <div className="progress" style={{ width: `${course.NbMicroCour || 0}%` }}></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default HomeTeacher;