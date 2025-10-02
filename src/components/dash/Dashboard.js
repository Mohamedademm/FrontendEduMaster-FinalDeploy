import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { 
  FaChartLine, 
  FaUsers, 
  FaGraduationCap, 
  FaCalendarAlt,
  FaFilter,
  FaDownload,
  FaRedo,
  FaBell,
  FaCog,
  FaUserShield,
  FaChartBar,
  FaGlobe,
  FaLifeRing
} from 'react-icons/fa';
import Sidebar from './Sidebar';
import Section1 from './Section1';
import Section2 from './Section2';
import Section3 from './Section3';
import '../../Css/dash/Dashboard.css';

function Dashboard() {
  const { t } = useTranslation();
  const [dashboardData, setDashboardData] = useState(null);
  const [totalStudents, setTotalStudents] = useState(null);
  const [totalCourses, setTotalCourses] = useState(null);
  const [totalTeachers, setTotalTeachers] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d, 1y
  const [workPlan, setWorkPlan] = useState([]);
  const [quickActions, setQuickActions] = useState([]);
  const navigate = useNavigate();

  const fetchDashboardData = useCallback(async () => {
    // Données pour le plan de travail de l'admin
    const adminWorkPlan = [
      {
        id: 1,
        title: t('dashboard_review_reports'),
        description: t('dashboard_review_reports_desc'),
        priority: 'high',
        dueDate: '2025-06-18',
        status: 'pending',
        icon: <FaChartBar />
      },
      {
        id: 2,
        title: t('dashboard_approve_courses'),
        description: t('dashboard_approve_courses_desc'),
        priority: 'medium',
        dueDate: '2025-06-19',
        status: 'in_progress',
        icon: <FaGraduationCap />
      },
      {
        id: 3,
        title: t('dashboard_user_management'),
        description: t('dashboard_user_management_desc'),
        priority: 'low',
        dueDate: '2025-06-20',
        status: 'completed',
        icon: <FaUserShield />
      },
      {
        id: 4,
        title: t('dashboard_schedule_maintenance'),
        description: t('dashboard_schedule_maintenance_desc'),
        priority: 'high',
        dueDate: '2025-06-21',
        status: 'pending',
        icon: <FaCog />
      },
      {
        id: 5,
        title: t('dashboard_support_tickets'),
        description: t('dashboard_support_tickets_desc'),
        priority: 'medium',
        dueDate: '2025-06-22',
        status: 'in_progress',
        icon: <FaLifeRing />
      }
    ];

    // Actions rapides pour l'admin
    const adminQuickActions = [
      {
        title: t('dashboard_manage_users'),
        description: t('dashboard_manage_users_desc'),
        icon: <FaUsers />,
        route: '/AdminUser',
        color: '#3B82F6'
      },
      {
        title: t('dashboard_manage_courses'),
        description: t('dashboard_manage_courses_desc'),
        icon: <FaGraduationCap />,
        route: '/AdminCours',
        color: '#10B981'
      },
      {
        title: t('dashboard_view_reports'),
        description: t('dashboard_view_reports_desc'),
        icon: <FaChartBar />,
        route: '/Reports',
        color: '#F59E0B'
      },
      {
        title: t('dashboard_system_settings'),
        description: t('dashboard_system_settings_desc'),
        icon: <FaCog />,
        route: '/Settings',
        color: '#8B5CF6'
      },
      {
        title: t('dashboard_help_support'),
        description: t('dashboard_help_support_desc'),
        icon: <FaLifeRing />,
        route: '/Support',
        color: '#EF4444'
      },
      {
        title: t('dashboard_global_settings'),
        description: t('dashboard_global_settings_desc'),
        icon: <FaGlobe />,
        route: '/GlobalSettings',
        color: '#06B6D4'
      }
    ];
    const token = localStorage.getItem('token');
    if (!token) {
      setError(t('no_token_found'));
      navigate('/login');
      return;
    }

    try {
      setIsLoading(true);
      
      // Fetch main dashboard data
      const dashboardResponse = await axios.get('http://localhost:3000/api/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
        params: { timeRange }
      });
      setDashboardData(dashboardResponse.data);

      // Fetch total students
      const studentsResponse = await axios.get('http://localhost:3000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTotalStudents(studentsResponse.data.filter(user => user.role === 'user').length);

      // Fetch total courses
      const coursesResponse = await axios.get('http://localhost:3000/api/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTotalCourses(coursesResponse.data.length);

      // Fetch total teachers
      const teachersResponse = await axios.get('http://localhost:3000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTotalTeachers(teachersResponse.data.filter(user => user.role === 'teacher').length);

      // Fetch notifications for the logged-in user
      const userId = JSON.parse(atob(token.split('.')[1])).userId;
      if (userId) {
        const notificationsResponse = await axios.get(`http://localhost:3000/api/notifications/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(notificationsResponse.data);
      } else {
        setNotifications([]);
      }

      // Set work plan and quick actions
      setWorkPlan(adminWorkPlan);
      setQuickActions(adminQuickActions);

    } catch (err) {
      console.error('Dashboard error:', err);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError(t('error_loading_dashboard'));
      }
    } finally {
      setIsLoading(false);
    }
  }, [timeRange, navigate, t]);

  const refreshData = useCallback(async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  }, [fetchDashboardData]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleNotifClick = (event) => {
    setNotifAnchorEl(event.currentTarget);
  };

  const handleNotifClose = () => {
    setNotifAnchorEl(null);
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  const handleQuickAction = (route) => {
    navigate(route);
  };

  const exportData = () => {
    // Fonction pour exporter les données du dashboard
    const dataToExport = {
      totalStudents,
      totalCourses,
      totalTeachers,
      dashboardData,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const openNotif = Boolean(notifAnchorEl);
  const notifId = openNotif ? 'notification-popover' : undefined;

  if (isLoading && !refreshing) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>{t('loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h3>{t('error_occurred')}</h3>
        <p>{error}</p>
        <button onClick={fetchDashboardData} className="retry-btn">
          <FaRedo /> {t('retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="mainContent" style={{ width: "80%" }}>
        {/* Header avec contrôles avancés */}
        <div className="dashboard-header">
          <div className="header-left">
            <h1 className="dashboard-title">
              <FaChartLine className="title-icon" />
              {t('admin_dashboard')}
            </h1>
            <p className="dashboard-subtitle">{t('dashboard_welcome_message')}</p>
          </div>
          
          <div className="header-controls">
            <div className="time-range-selector">
              <button 
                className={timeRange === '7d' ? 'active' : ''} 
                onClick={() => handleTimeRangeChange('7d')}
              >
                {t('last_7_days')}
              </button>
              <button 
                className={timeRange === '30d' ? 'active' : ''} 
                onClick={() => handleTimeRangeChange('30d')}
              >
                {t('last_30_days')}
              </button>
              <button 
                className={timeRange === '90d' ? 'active' : ''} 
                onClick={() => handleTimeRangeChange('90d')}
              >
                {t('last_90_days')}
              </button>
            </div>
            
            <div className="header-actions">
              <button 
                className="refresh-btn" 
                onClick={refreshData}
                disabled={refreshing}
                title={t('refresh_data')}
              >
                <FaRedo className={refreshing ? 'spinning' : ''} />
              </button>
              
              <button 
                className="export-btn" 
                onClick={exportData}
                title={t('export_data')}
              >
                <FaDownload />
              </button>
              
              <button 
                className="notifications-btn" 
                onClick={handleNotifClick}
                title={t('notifications')}
              >
                <FaBell />
                {notifications.length > 0 && (
                  <span className="notification-badge">{notifications.length}</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Plan de travail de l'admin */}
        <div className="admin-work-plan">
          <h2 className="section-title">
            <FaCalendarAlt className="section-icon" />
            {t('admin_work_plan')}
          </h2>
          <div className="work-plan-grid">
            {workPlan.map(task => (
              <div key={task.id} className={`work-plan-card ${task.priority} ${task.status}`}>
                <div className="task-header">
                  {task.icon}
                  <span className={`task-status ${task.status}`}>
                    {t(`task_status_${task.status}`)}
                  </span>
                </div>
                <h3 className="task-title">{task.title}</h3>
                <p className="task-description">{task.description}</p>
                <div className="task-footer">
                  <span className="task-due-date">
                    {t('due_date')}: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                  <span className={`task-priority ${task.priority}`}>
                    {t(`priority_${task.priority}`)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions rapides */}
        <div className="quick-actions-section">
          <h2 className="section-title">
            <FaFilter className="section-icon" />
            {t('quick_actions')}
          </h2>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <div 
                key={index} 
                className="quick-action-card"
                onClick={() => handleQuickAction(action.route)}
                style={{ borderLeftColor: action.color }}
              >
                <div className="action-icon" style={{ color: action.color }}>
                  {action.icon}
                </div>
                <div className="action-content">
                  <h3 className="action-title">{action.title}</h3>
                  <p className="action-description">{action.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section1 - Statistiques principales */}
        <Section1
          totalStudents={totalStudents}
          totalCourses={totalCourses}
          totalTeachers={totalTeachers}
          completionRate={dashboardData?.completionRate}
          revenue={dashboardData?.revenue}
          notifications={notifications}
          onNotifClick={handleNotifClick}
          notifAnchorEl={notifAnchorEl}
          notifId={notifId}
          openNotif={openNotif}
          onNotifClose={handleNotifClose}
          timeRange={timeRange}
          refreshing={refreshing}
        />

        {/* Section2 - Graphiques et tendances */}
        <Section2
          enrollmentTrends={dashboardData?.enrollmentTrends}
          popularCourses={dashboardData?.popularCourses}
          timeRange={timeRange}
          totalStudents={totalStudents}
          totalCourses={totalCourses}
        />

        {/* Section3 - Informations détaillées */}
        <Section3
          recentStudents={dashboardData?.recentStudents}
          instructorInfo={dashboardData?.instructorInfo}
          workPlan={workPlan}
          quickActions={quickActions}
        />
      </main>
    </div>
  );
}

export default Dashboard;
