import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FaUsers, 
  FaBookReader, 
  FaStar, 
  FaEllipsisH, 
  FaExternalLinkAlt, 
  FaUserCircle, 
  FaGraduationCap, 
  FaEye,
  FaFilter,
  FaSort,
  FaCalendarAlt,
  FaChartLine,
  FaCheckCircle,
  FaClock,
  FaMapMarkerAlt
} from 'react-icons/fa';
import '../../Css/dash/Section3.css';

function Section3({ recentStudents, instructorInfo, workPlan, quickActions }) {
  const { t } = useTranslation();
  const [sortBy, setSortBy] = useState('recent');
  const [filterStatus, setFilterStatus] = useState('all');
  const defaultProfileImage = "https://via.placeholder.com/150/CCCCCC/808080?Text=User";

  // Enhanced recent students with better formatting
  const getFilteredStudents = () => {
    if (!recentStudents) return [];
    
    let filtered = [...recentStudents];
    
    // Apply sorting
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));
        break;
      case 'progress':
        filtered.sort((a, b) => (b.progress || 0) - (a.progress || 0));
        break;
      case 'recent':
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }
    
    return filtered;
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return '#10b981'; // Green
    if (progress >= 60) return '#f59e0b'; // Yellow
    if (progress >= 40) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const getTaskStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FaCheckCircle className="status-icon completed" />;
      case 'in_progress':
        return <FaClock className="status-icon in-progress" />;
      case 'pending':
      default:
        return <FaClock className="status-icon pending" />;
    }
  };

  const getPriorityClass = (priority) => {
    return `priority-${priority}`;
  };

  return (
    <section className="section3">
      {/* Enhanced Recent Students Card */}
      <div className="card recentStudentsCard">
        <div className="sectionHeader">
          <h2>
            <FaUsers className="header-iconSection2" /> 
            {t('recent_students')}
          </h2>
          <div className="header-controls">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="recent">{t('sort_by_recent')}</option>
              <option value="name">{t('sort_by_name')}</option>
              <option value="progress">{t('sort_by_progress')}</option>
            </select>
            <button className="viewAllButton">
              {t('view_all')} <FaEllipsisH style={{ marginLeft: '5px' }}/>
            </button>
          </div>
        </div>
        
        {getFilteredStudents().length > 0 ? (
          <div className="table-responsive">
            <table className="studentsTable">
              <thead>
                <tr>
                  <th>{t('student')}</th>
                  <th>{t('email')}</th>
                  <th>{t('course')}</th>
                  <th>{t('progress')}</th>
                  <th>{t('joined_date')}</th>
                  <th>{t('action')}</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredStudents().map((student, index) => (
                  <tr key={student._id || index} className="student-row">
                    <td>
                      <div className="studentInfo">
                        <img
                          src={student.profileImage || defaultProfileImage}
                          alt={`${student.firstName} ${student.lastName}`}
                          className="studentAvatar"
                        />
                        <div className="student-details">
                          <span className="student-name">
                            {student.firstName} {student.lastName}
                          </span>
                          <span className="student-status">
                            {student.isActive ? t('active') : t('inactive')}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="student-email">{student.email}</td>
                    <td className="course-name">{student.courseName}</td>
                    <td>
                      <div className="progressBarContainer">
                        <div
                          className="progressFill"
                          style={{ 
                            width: `${student.progress || 0}%`,
                            backgroundColor: getProgressColor(student.progress || 0)
                          }}
                          aria-label={`Progress: ${student.progress || 0}%`}
                          role="progressbar"
                          aria-valuenow={student.progress || 0}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          <span className="progressText">{student.progress || 0}%</span>
                        </div>
                      </div>
                    </td>
                    <td className="join-date">
                      {new Date(student.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="actionButton viewDetailsButton" title={t('view_details')}>
                          <FaEye />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-data-message">
            <FaUsers size={48} color="#e5e7eb" />
            <p>{t('no_recent_students_data')}</p>
            <small>{t('students_will_appear_here')}</small>
          </div>
        )}
      </div>

      <div className="grid-column-span-1">
        {/* Enhanced Instructor Info Card */}
        <div className="card instructorCard">
          <div className="card-header">
            <h3>{t('top_instructor')}</h3>
            <FaStar className="featured-icon" />
          </div>
          
          {instructorInfo ? (
            <>
              <div className="instructorHeader">
                <img
                  src={instructorInfo.profileImage || defaultProfileImage}
                  alt={instructorInfo.name || "Instructor"}
                  className="instructorAvatar"
                />
                <div className="instructorDetails">
                  <h3>{instructorInfo.name}</h3>
                  <p className="instructor-specialty">{instructorInfo.specialty}</p>
                  <div className="instructor-location">
                    <FaMapMarkerAlt size={12} />
                    <span>{t('remote_instructor')}</span>
                  </div>
                </div>
              </div>
              
              <div className="instructorStats">
                <div className="stat-item">
                  <FaGraduationCap className="statIcon" />
                  <div className="stat-content">
                    <span className="stat-value">{instructorInfo.studentsCount || 0}</span>
                    <span className="stat-label">{t('students')}</span>
                  </div>
                </div>
                <div className="stat-item">
                  <FaStar className="statIcon" />
                  <div className="stat-content">
                    <span className="stat-value">{instructorInfo.rating || 0}</span>
                    <span className="stat-label">{t('rating')}</span>
                  </div>
                </div>
                <div className="stat-item">
                  <FaBookReader className="statIcon" />
                  <div className="stat-content">
                    <span className="stat-value">{instructorInfo.coursesCount || 0}</span>
                    <span className="stat-label">{t('courses')}</span>
                  </div>
                </div>
              </div>
              
              <button className="actionButton viewProfileButton">
                {t('view_profile')} <FaExternalLinkAlt style={{ marginLeft: '5px' }} />
              </button>
            </>
          ) : (
            <div className="instructorInfoPlaceholder">
              <FaUserCircle size={60} className="placeholder-avatar"/>
              <h3>Dr. Sarah Johnson</h3>
              <p className="instructor-specialty">{t('full_stack_development')}</p>
              <div className="instructor-location">
                <FaMapMarkerAlt size={12} />
                <span>{t('remote_instructor')}</span>
              </div>
              <div className="instructorStats">
                <div className="stat-item">
                  <FaGraduationCap className="statIcon" />
                  <div className="stat-content">
                    <span className="stat-value">1,234</span>
                    <span className="stat-label">{t('students')}</span>
                  </div>
                </div>
                <div className="stat-item">
                  <FaStar className="statIcon" />
                  <div className="stat-content">
                    <span className="stat-value">4.8</span>
                    <span className="stat-label">{t('rating')}</span>
                  </div>
                </div>
                <div className="stat-item">
                  <FaBookReader className="statIcon" />
                  <div className="stat-content">
                    <span className="stat-value">12</span>
                    <span className="stat-label">{t('courses')}</span>
                  </div>
                </div>
              </div>
              <button className="actionButton viewProfileButton">
                {t('view_profile')} <FaExternalLinkAlt style={{ marginLeft: '5px' }} />
              </button>
            </div>
          )}
        </div>

        {/* Enhanced Work Plan Card */}
        <div className="card workPlanCard">
          <div className="card-header">
            <h3>
              <FaCalendarAlt className="header-icon" />
              {t('upcoming_tasks')}
            </h3>
            <button className="view-all-tasks">
              {t('view_all')}
            </button>
          </div>
          
          <div className="work-plan-list">
            {workPlan && workPlan.slice(0, 3).map(task => (
              <div key={task.id} className={`task-item ${task.status} ${getPriorityClass(task.priority)}`}>
                <div className="task-left">
                  {getTaskStatusIcon(task.status)}
                  <div className="task-content">
                    <h4 className="task-title">{task.title}</h4>
                    <p className="task-description">{task.description}</p>
                    <div className="task-meta">
                      <span className="task-due">
                        {t('due')}: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                      <span className={`task-priority ${task.priority}`}>
                        {t(`priority_${task.priority}`)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="task-actions">
                  <button className="task-action-btn" title={t('view_task')}>
                    <FaEye />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Section3;
