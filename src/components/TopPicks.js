import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getApiUrl, getImageUrl, API_ENDPOINTS } from '../utils/apiHelper';
import '../Css/TopPicks.css';

function TopPicks() {
  const { t } = useTranslation();
  const [topPicksData, setTopPicksData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        let coursesToShow = [];

        if (user && user.token) {
          setIsLoggedIn(true);

          // Fetch user career data
          const careerResponse = await fetch(getApiUrl(API_ENDPOINTS.users.career), {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });

          if (!careerResponse.ok) {
            throw new Error(t('error_fetch_career_data', 'Failed to fetch user career data.'));
          }

          const careerData = await careerResponse.json();

          if (careerData.selectedCourses && careerData.selectedCourses.length > 0) {
            coursesToShow = careerData.selectedCourses.map(course => ({
              id: course._id,
              title: course.name,
              description: course.domaine,
              averageRating: course.averageRating || 0,
              image: getImageUrl(course.image),
            }));
          }

          // If less than 3 courses, fetch from all courses to fill
          if (coursesToShow.length < 3) {
            const coursesResponse = await fetch(getApiUrl(API_ENDPOINTS.courses.all));
            if (!coursesResponse.ok) {
              throw new Error(t('error_fetch_all_courses', 'Failed to fetch all courses.'));
            }
            const allCourses = await coursesResponse.json();

            // Filter out courses already in coursesToShow
            const existingIds = new Set(coursesToShow.map(c => c.id));
            const additionalCourses = allCourses
              .filter(course => !existingIds.has(course._id))
              .slice(0, 3 - coursesToShow.length)
              .map(course => ({
                id: course._id,
                title: course.name,
                description: course.domaine,
                averageRating: course.averageRating || 0,
                image: getImageUrl(course.image),
              }));

            coursesToShow = [...coursesToShow, ...additionalCourses];
          }
        } else {
          setIsLoggedIn(false);
          // User not logged in, fetch 3 courses from all courses API
          const coursesResponse = await fetch(getApiUrl(API_ENDPOINTS.courses.all));
          if (!coursesResponse.ok) {
            throw new Error(t('error_fetch_all_courses', 'Failed to fetch all courses.'));
          }
          const allCourses = await coursesResponse.json();
          coursesToShow = allCourses.slice(0, 3).map(course => ({
            id: course._id,
            title: course.name,
            description: course.domaine,
            averageRating: course.averageRating || 0,
            image: getImageUrl(course.image),
          }));
        }

        // Sort courses by averageRating descending and select top 3
        if (coursesToShow.length > 3) {
          coursesToShow.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
          coursesToShow = coursesToShow.slice(0, 3);
        }
        setTopPicksData(coursesToShow);
      } catch (error) {
        console.error(t('error_fetching_courses', 'Error fetching courses:'), error);
        setTopPicksData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [t]);

  if (loading) {
    return <div className="loading-spinner">{t('loading_courses', 'Loading courses...')}</div>;
  }

  if (topPicksData.length === 0) {
    return <div className="no-courses">{t('no_courses_available', 'No courses available at the moment.')}</div>;
  }

  const handleStartLearning = (courseId) => {
    localStorage.setItem('courseId', courseId);
    navigate('/MicroCours');
  };

  return (
    <section className="popular-courses">
      <div className="container">
        <div className="section-header" style={{ display: 'flex',fontSize: 20  , justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>{isLoggedIn ? t('your_courses', 'Your Courses') : t('popular_courses', 'Popular Courses')}</h2>
        </div>
        <div className="courses-grid">
          {topPicksData.map((course) => (
            <div className="course-card" key={course.id}>
              <div className="course-image">
                <img src={course.image} alt={course.title} />
              </div>
              <div className="course-content">
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <button className="start-link" onClick={() => handleStartLearning(course.id)}>
                  {t('start_learning', 'Start Learning')} →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TopPicks;
