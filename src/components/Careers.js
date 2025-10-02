import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { useTranslation } from 'react-i18next';
import Card from './Card'; // Import Card component
import '../Css/Careers.css';

const Careers = () => {
  const { t } = useTranslation();
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchCareerData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/users/career`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token for authentication
          },
        });        if (!response.ok) {
          throw new Error(t('failed_fetch_career_data'));
        }

        const data = await response.json();
        setSelectedCourses(data.selectedCourses || []); // Set fetched selected courses
        setCompletedCourses(data.completedCourses || []); // Set fetched completed courses
      } catch (error) {
        console.error(t('error_fetching_career_data'), error.message);
        setSelectedCourses([]); // Ensure the state is set to an empty array on error
        setCompletedCourses([]); // Ensure the state is set to an empty array on error
      } finally {
        setLoading(false);
      }
    };    fetchCareerData();
  }, [t]);

  const handleConsult = (course) => {
    localStorage.setItem('courseId', course._id); // Store course ID in localStorage
    navigate('/MicroCours'); // Navigate to MicroCours page
  };

  const handleViewDetails = (course) => {
    localStorage.setItem('courseId', course._id); // Store course ID in localStorage
    navigate('/CreeTecherMicroCours'); // Navigate to CreeTecherMicroCours page
  };
  if (loading) {
    return <div className="loading">{t('loading')}</div>;
  }

  return (    <div className="careers-page">
      <h2 className="page-title">{t('my_career')}</h2>

      {/* Help Section */}
      <div className="help-section">
        <p>
          {t('career_help_message')}
        </p>
      </div>      {/* Selected Courses Section */}
      <div className="section" >
        <h3 className="section-title">{t('selected_courses')}</h3>
        {selectedCourses.length > 0 ? (
          <div
            className="courseListCS"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1rem",
            }}
          >
            {selectedCourses.map((course) => {
              const imageUrl =
                course.image && course.image.startsWith("http")
                  ? course.image
                  : `http://localhost:3000${course.image}`;
              return (
                <div key={course._id} className="courseCardCourse">
                  <Card
                    image={imageUrl}
                    title={course.name}
                    instructor={{ name: course.domaine }}
                    progress={course.NbMicroCour || "N/A"}                    lesson={`${course.NbMicroCour || 0} ${t('micro_courses')}`}
                    isPremium={course.isPremium}
                    price={course.price}
                  />
                  <button
                    className="button-courses-consult"
                    onClick={() => handleConsult(course)}
                  >
                    {t('consult')}
                  </button>
                </div>
              );
            })}
          </div>        ) : (
          <p>{t('no_selected_courses')}</p>
        )}
      </div>      {/* Completed Courses Section */}
      <div className="section">
        <h3 className="section-title">{t('completed_courses')}</h3>
        {completedCourses.length > 0 ? (
          <div
            className="courseListCS"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1rem",
            }}
          >
            {completedCourses.map((completed) => {
              const course = completed.course; // Access the course details
              const imageUrl =
                course.image && course.image.startsWith("http")
                  ? course.image
                  : `http://localhost:3000${course.image}`;
              return (
                <div key={course._id} className="courseCardCourse">
                  <Card
                    image={imageUrl}
                    title={course.name}
                    instructor={{ name: course.domaine }}                    progress={`${t('score')}: ${completed.score}`}
                    lesson={`${course.NbMicroCour || 0} ${t('micro_courses')}`}
                    isPremium={course.isPremium}
                    price={course.price}
                  />
                  <button
                    className="button-courses-details"
                    onClick={() => handleViewDetails(course)} // Use handleViewDetails
                  >
                    {t('view_details')}
                  </button>
                </div>
              );
            })}
          </div>        ) : (
          <p>{t('no_completed_courses')}</p>
        )}
      </div>
    </div>
  );
};

export default Careers;
