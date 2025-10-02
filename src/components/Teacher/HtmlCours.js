import React, { useState, useEffect, useCallback, useRef } from "react"; // --- MODIFIÉ : ajout de useRef ---
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import "../../Css/Teacher/HtmlCours.css";
import {
  FaChalkboardTeacher, FaBook, FaCalendarAlt, FaBell, FaUserGraduate,
  FaTools, FaBars, FaMoon, FaSun, FaUniversity, FaTicketAlt, FaCreditCard
} from "react-icons/fa";
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

// --- NOUVEAU : Hook pour détecter les clics en dehors d'un élément ---
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

  // --- NOUVEAU : État pour le panneau de notifications ---
  const [isNotificationPanelOpen, setNotificationPanelOpen] = useState(false);

  const [sidebarHomeTeacherOpen, setsidebarHomeTeacherOpen] = useLocalStorageState("teachersidebarHomeTeacherOpen", true);
  const [darkMode, setDarkMode] = useLocalStorageState("teacherDarkMode", false);

  const navigate = useNavigate();
  const { t } = useTranslation();
  const teacherId = localStorage.getItem("teacherId");

  // --- NOUVEAU : Référence pour le panneau de notifications ---
  const notificationPanelRef = useRef(null);
  useClickOutside(notificationPanelRef, () => setNotificationPanelOpen(false));

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode-active");
    } else {
      document.body.classList.remove("dark-mode-active");
    }
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
    setApiError(null);

    try {
      const [coursesResponse, notificationsResponse] = await Promise.all([
        axios.get(`http://localhost:3000/api/courses?teacherId=${teacherId}`),
        axios.get(`http://localhost:3000/api/notifications/${teacherId}`)
      ]);

      const teacherCourses = coursesResponse.data;
      setCourses(teacherCourses);
      const totalStudents = teacherCourses.reduce((acc, course) => acc + (course.studentsCount || 0), 0);
      const upcomingExams = teacherCourses.reduce((acc, course) => acc + (course.upcomingExamsCount || 0), 0);
      setStats({ students: totalStudents, exams: upcomingExams });

      setNotifications(notificationsResponse.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

    } catch (error) {
      console.error(t('error_loading_data'), error);
      setApiError(t('error_loading_data_message'));
    } finally {
      setLoading(false);
    }
  }, [t, teacherId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  const markAsRead = async (notificationId) => {
    // ... (code original inchangé)
  };

  const handleMarkAllAsRead = async () => {
    // ... (code original inchangé)
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

  const sidebarHomeTeacherNavItems = [
    { path: "/CoursTeacher", icon: <FaChalkboardTeacher />, labelKey: 'manage_courses' },
    { path: "/CreateOnlineClass", icon: <FaCalendarAlt />, labelKey: 'Create Online Class' },
    { path: "/PaiementsT", icon: <FaCreditCard />, labelKey: 'Paiements' },
    { path: "/BankAccount", icon: <FaUniversity />, labelKey: 'BankAccount' },
    { path: "/SupportTicketSystem", icon: <FaTicketAlt />, labelKey: 'SupportTicketSystem' },
    { path: "/NotificationManagement", icon: <FaTools />, labelKey: 'technical_support' },
  ];

  if (!teacherId && !apiError) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-primary)' }}>
            <CircularProgress />
        </div>
    );
  }

  // --- NOUVEAU : Calcul du nombre de notifications non lues ---
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className={`home-teacher ${darkMode ? "dark-mode-active" : ""}`}>
      <aside className={`sidebarHomeTeacher ${sidebarHomeTeacherOpen ? "open" : "closed"}`}>
        {/* ... (code de la sidebar original inchangé) ... */}
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
                  aria-pressed="false"
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
        {/* --- MODIFIÉ : Ajout du bouton de notification --- */}
        <div className="main-content-header">
            <header className="headerHomeTeacher">
                <h1>{t('HomeTeacher')}</h1>
                <p>{t('welcome_message')}</p>
            </header>
            
            {/* --- NOUVEAU : Section des actions de l'en-tête --- */}
            <div className="header-actions" ref={notificationPanelRef}>
                <button className="notification-bell-btn" onClick={() => setNotificationPanelOpen(p => !p)}>
                    <FaBell />
                    {unreadNotificationsCount > 0 && (
                        <span className="notification-badge">{unreadNotificationsCount}</span>
                    )}
                </button>

                {/* --- NOUVEAU : Panneau de notifications (pop-over) --- */}
                {isNotificationPanelOpen && (
                    <div className="notification-popover">
                        {/* Le contenu de la section de notifications est déplacé ici */}
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
                                <p style={{textAlign: 'center', padding: '20px'}}>{t('no_notifications')}</p>
                            )}
                        </section>
                    </div>
                )}
            </div>
        </div>

        {apiError && <div className="api-error-message">{apiError}</div>}

        {loading && !courses.length ? (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}><CircularProgress /></div>
        ) : (
            <>
                <section className="evaluations" aria-label={t('teacher_statistics')}>
                  {/* ... (code des cartes de stats original inchangé) ... */}
                </section>

                <section className="courses" aria-label={t('courses_list')}>
                  {/* ... (code de la liste de cours original inchangé) ... */}
                </section>

                {/* --- SUPPRIMÉ : La section des notifications a été déplacée dans le pop-over --- */}
            </>
        )}
      </main>
    </div>
  );
};

export default HomeTeacher;