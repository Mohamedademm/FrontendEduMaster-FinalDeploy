import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChartBar, FaBookOpen, FaChevronDown, FaUsers, FaChartLine, FaArrowUp, FaArrowDown, FaEye } from 'react-icons/fa';
import '../../Css/dash/Section2.css';

function Section2({ enrollmentTrends, popularCourses, timeRange, totalStudents, totalCourses }) {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Enhanced chart rendering with real data visualization
  const renderEnrollmentChart = (data) => {
    if (!data || data.length === 0) {
      return (
        <div className="no-data-message">
          <FaChartLine size={48} color="#e5e7eb" />
          <p>{t('no_enrollment_data_available')}</p>
          <small>{t('chart_data_coming_soon')}</small>
        </div>
      );
    }

    const maxEnrollments = Math.max(...data.map(item => item.enrollments));
    
    return (
      <div className="enrollment-chart">
        <div className="chart-stats">
          <div className="stat-box">
            <div className="stat-value">{data.reduce((sum, item) => sum + item.enrollments, 0)}</div>
            <div className="stat-label">{t('total_enrollments')}</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">
              {data.length > 1 ? (
                data[data.length - 1].enrollments > data[data.length - 2].enrollments ? (
                  <span className="trending-up"><FaArrowUp /> +{((data[data.length - 1].enrollments - data[data.length - 2].enrollments) / data[data.length - 2].enrollments * 100).toFixed(1)}%</span>
                ) : (
                  <span className="trending-down"><FaArrowDown /> -{((data[data.length - 2].enrollments - data[data.length - 1].enrollments) / data[data.length - 2].enrollments * 100).toFixed(1)}%</span>
                )
              ) : '0%'}
            </div>
            <div className="stat-label">{t('trend')}</div>
          </div>
        </div>
        
        <div className="chart-visualization">
          <div className="chart-bars">
            {data.map((item, index) => (
              <div key={index} className="chart-bar-container">
                <div 
                  className="chart-bar"
                  style={{ 
                    height: `${(item.enrollments / maxEnrollments) * 100}%`,
                    backgroundColor: index === data.length - 1 ? '#3b82f6' : '#94a3b8'
                  }}
                  title={`${item.label}: ${item.enrollments} enrollments`}
                >
                  <span className="bar-value">{item.enrollments}</span>
                </div>
                <div className="chart-label">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderPopularCoursesChart = (courses) => {
    if (!courses || courses.length === 0) {
      return (
        <div className="no-data-message">
          <FaBookOpen size={48} color="#e5e7eb" />
          <p>{t('no_popular_courses_data')}</p>
          <small>{t('chart_data_coming_soon')}</small>
        </div>
      );
    }

    return (
      <div className="popular-courses-list">
        {courses.map((course, index) => (
          <div key={course._id || index} className="course-item">
            <div className="course-rank">#{index + 1}</div>
            <div className="course-info">
              <div className="course-title">{course.title}</div>
              <div className="course-stats">
                <span className="enrollment-count">
                  <FaUsers size={12} /> {course.enrollmentCount || 0} {t('students')}
                </span>
                <span className="completion-rate">
                  <FaChartBar size={12} /> {course.completionRate || 0}% {t('completion')}
                </span>
              </div>
            </div>
            <div className="course-progress">
              <div 
                className="progress-bar"
                style={{ width: `${course.completionRate || 0}%` }}
              ></div>
            </div>
            <button className="view-course-btn" title={t('view_course')}>
              <FaEye />
            </button>
          </div>
        ))}
      </div>
    );
  };

  const getTimeRangeLabel = () => {
    switch(timeRange) {
      case '7d': return t('last_7_days');
      case '30d': return t('last_30_days');
      case '90d': return t('last_90_days');
      case '1y': return t('last_year');
      default: return t('last_7_days');
    }
  };

  return (
    <section className="section2">
      <div className="chart-card enrollmentTrends">
        <div className="sectionHeader">
          <h2>
            <FaChartBar className="header-iconSection2" /> 
            {t('enrollment_trends')}
          </h2>
          <div className="dropdown">
            <span className="time-range-label">{getTimeRangeLabel()}</span>
            <FaChevronDown className="dropdownIcon" />
          </div>
        </div>
        <div className="chart-container" aria-label={t('enrollment_trends_chart')} role="img">
          {renderEnrollmentChart(enrollmentTrends)}
        </div>
      </div>

      <div className="chart-card popularCourses">
        <div className="sectionHeader">
          <h2>
            <FaBookOpen className="header-iconSection2" /> 
            {t('popular_courses')}
          </h2>
          <div className="dropdown">
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              <option value="all">{t('all_categories')}</option>
              <option value="programming">{t('programming')}</option>
              <option value="design">{t('design')}</option>
              <option value="business">{t('business')}</option>
              <option value="marketing">{t('marketing')}</option>
            </select>
          </div>
        </div>
        <div className="chart-container" aria-label={t('popular_courses_chart')} role="img">
          {renderPopularCoursesChart(popularCourses)}
        </div>
      </div>

      {/* Enhanced insights section */}
      <div className="insights-section">
        <h3 className="insights-title">
          <FaUsers className="insights-icon" />
          {t('analytics_overview')}
        </h3>
        <div className="insights-grid">
          <div className="insight-card primary">
            <div className="insight-header">
              <FaUsers className="insight-icon" />
              <span className="insight-trend positive">+12%</span>
            </div>
            <div className="insight-value">{totalStudents || 0}</div>
            <div className="insight-label">{t('total_students')}</div>
            <div className="insight-sublabel">{t('from_last_month')}</div>
          </div>
          
          <div className="insight-card secondary">
            <div className="insight-header">
              <FaBookOpen className="insight-icon" />
              <span className="insight-trend positive">+8%</span>
            </div>
            <div className="insight-value">{totalCourses || 0}</div>
            <div className="insight-label">{t('active_courses')}</div>
            <div className="insight-sublabel">{t('from_last_month')}</div>
          </div>
          
          <div className="insight-card tertiary">
            <div className="insight-header">
              <FaChartLine className="insight-icon" />
              <span className="insight-trend positive">+15%</span>
            </div>
            <div className="insight-value">
              {totalStudents && totalCourses ? Math.round(totalStudents / totalCourses) : 0}
            </div>
            <div className="insight-label">{t('avg_students_per_course')}</div>
            <div className="insight-sublabel">{t('enrollment_ratio')}</div>
          </div>
          
          <div className="insight-card quaternary">
            <div className="insight-header">
              <FaArrowUp className="insight-icon" />
              <span className="insight-trend positive">+22%</span>
            </div>
            <div className="insight-value">
              {enrollmentTrends && enrollmentTrends.length > 0 ? 
                enrollmentTrends[enrollmentTrends.length - 1].enrollments : 0}
            </div>
            <div className="insight-label">{t('recent_enrollments')}</div>
            <div className="insight-sublabel">{t('this_week')}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Section2;
