// Courses.js
import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Card from "../Card";
import CreeCours from "./CreeCours";
import "../../Css/Teacher/CoursTeacher.css";
import { CircularProgress } from "@mui/material"; // Import CircularProgress for loading spinner
import axios from "axios";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';

function CoursTeacher() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingCourse, setEditingCourse] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;
  const teacherId = localStorage.getItem("teacherId"); // Get the logged-in teacher's ID

  // Debug teacherId
  useEffect(() => {
    console.log("=== TEACHER DEBUG INFO ===");
    console.log("Teacher ID from localStorage:", teacherId);
    console.log("All localStorage keys:", Object.keys(localStorage));
    console.log("All localStorage values:");
    Object.keys(localStorage).forEach(key => {
      console.log(`  ${key}:`, localStorage.getItem(key));
    });
    
    if (!teacherId) {
      console.error("❌ No teacherId found in localStorage!");
      console.log("Available storage keys:", Object.keys(localStorage));
      // Check for alternative keys
      const possibleKeys = ['userId', 'id', 'user_id', 'teacher_id', 'userID'];
      possibleKeys.forEach(key => {
        const value = localStorage.getItem(key);
        if (value) {
          console.log(`Alternative key found - ${key}:`, value);
        }
      });
    }
  }, [teacherId]);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await axios.get("http://localhost:3000/api/courses");
        const teacherCourses = response.data.filter(course => course.teacher && course.teacher._id === teacherId);
        setCourses(teacherCourses);
      } catch (error) {
        console.error(t('error_loading_courses'), error);
        setErrorMessage(t('error_loading_courses'));
      } finally {
        setLoading(false);
      }
    }
    if (teacherId) {
      fetchCourses();
    } else {
      console.error("teacherId is missing in localStorage.");
    }
  }, [t, teacherId]);

  const handleCourseSaved = (data) => {
    console.log("=== COURSE SAVED CALLBACK ===");
    console.log("Received data:", data);
    
    const updatedCourse = data.course || data;
    console.log("Updated course:", updatedCourse);
    
    if (editingCourse) {
      console.log("Updating existing course in list");
      setCourses((prev) =>
        prev.map((course) =>
          course._id === updatedCourse._id ? updatedCourse : course
        )
      );
      setSuccessMessage(t('course_updated_successfully'));
    } else {
      console.log("Adding new course to list");
      setCourses((prev) => [...prev, updatedCourse]);
      setSuccessMessage(t('course_created_successfully'));
    }
    
    setShowForm(false);
    setEditingCourse(null);
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 5000);
  };

  const handleDelete = async (courseId) => {
    const confirmDelete = window.confirm(t('confirm_delete_course') || 'Êtes-vous sûr de vouloir supprimer ce cours ?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:3000/api/courses/${courseId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(t('error_deleting_course'));
      setCourses((prev) => prev.filter((course) => course._id !== courseId));
      setSuccessMessage(t('course_deleted_successfully'));
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error(t('error_deleting_course'), error);
      setErrorMessage(t('error_deleting_course'));
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleConsult = (course) => {
    localStorage.setItem("courseId", course._id);
    navigate("/CreeTecherMicroCours");
  };

  // Add this new function for card click
  const handleCardClick = (course) => {
    handleConsult(course);
  };

  return (
    <section className="courseSectionCS-page-wrapper">
      <div className="courseSectionCS-header">
        <h2 className="courseSectionCS-title">{t('welcome_back')}</h2>
        <button
          className="courseSectionCS-button-create"
          onClick={() => {
            setShowForm(!showForm);
            setEditingCourse(null);
          }}
        >
          {showForm ? <CloseIcon sx={{ mr: 0.8 }} /> : <AddCircleOutlineIcon sx={{ mr: 0.8 }} />}
          {showForm ? t('close') : t('create_new_course')}
        </button>
      </div>

      {successMessage && <div className="courseSectionCS-success-message">{successMessage}</div>}
      {errorMessage && <div className="courseSectionCS-error-message">{errorMessage}</div>}

      {showForm && (
        <div className="courseSectionCS-form-container">
          <CreeCours
            onCourseCreated={handleCourseSaved}
            initialCourse={editingCourse}
            teacherId={teacherId}
            key={editingCourse ? editingCourse._id : 'new-course'} // Force re-render when switching between edit/create
          />
        </div>
      )}

      <div className="courseSectionCS-main-content">
        <div className="courseSectionCS-search-container">
          <input
            type="text"
            placeholder={t('search_course') + "..."}
            value={searchQuery}
            onChange={handleSearch}
            className="courseSectionCS-search-input"
          />
        </div>

        {loading ? (
          <div className="courseSectionCS-loading"><CircularProgress /></div>
        ) : (
          <>
            {currentCourses.length === 0 && !searchQuery && !showForm ? (
              <div className="courseSectionCS-no-courses initial-message">
                <div className="courseSectionCS-no-courses-icon-container">
                  {/* Placeholder for a more engaging icon or illustration */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-journal-plus" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M2 1.5A1.5 1.5 0 0 0 .5 3v10A1.5 1.5 0 0 0 2 14.5h12a1.5 1.5 0 0 0 1.5-1.5V3A1.5 1.5 0 0 0 14 1.5H2zM1 3a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v10a.5.5 0 0 1-.5.5h-13A.5.5 0 0 1 1 13V3z"/>
                    <path fillRule="evenodd" d="M8 5.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5z"/>
                    <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/>
                    <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/>
                  </svg>
                </div>
                <p>{t('no_courses_created_yet')}</p>
                <button
                  className="courseSectionCS-button-create-alt"
                  onClick={() => {
                    setShowForm(true);
                    setEditingCourse(null);
                  }}
                >
                  <AddCircleOutlineIcon sx={{ mr: 1 }} />
                  {t('create_your_first_course')}
                </button>
              </div>
            ) : currentCourses.length === 0 && searchQuery ? (
              <div className="courseSectionCS-no-courses search-message">{t('no_courses_match_search')}</div>
            ) : (
              <div
                className="courseSectionCS-course-list"
              >
                {currentCourses.map((course) => {
                  const imageUrl =
                    course.image && course.image.startsWith("http")
                      ? course.image
                      : `http://localhost:3000${course.image}`;
                  return (
                    <div key={course._id} className="courseSectionCS-course-card">
                      {/* Make the card clickable */}
                      <div 
                        className="courseSectionCS-card-clickable"
                        onClick={() => handleCardClick(course)}
                        style={{ cursor: 'pointer' }}
                        title={t('click_to_manage_course') || 'Cliquez pour gérer ce cours'}
                      >
                        <Card
                          image={imageUrl}
                          title={course.name}
                          instructor={{ name: course.domaine }}
                          progress={course.NbMicroCour}
                          lesson={`${course.NbMicroCour} ${t('micro_courses')}`}
                          isPremium={course.isPremium}
                          price={course.price}
                        />
                      </div>
                      <div className="courseSectionCS-card-actions">
                        <button
                          title={t('edit')}
                          className="courseSectionCS-action-button courseSectionCS-action-edit"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card click
                            setEditingCourse(course);
                            setShowForm(true);
                          }}
                        >
                          <EditIcon fontSize="small" /> 
                          <span className="courseSectionCS-button-text">{t('edit')}</span>
                        </button>
                        <button
                          title={t('delete')}
                          className="courseSectionCS-action-button courseSectionCS-action-delete"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card click
                            handleDelete(course._id);
                          }}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                          <span className="courseSectionCS-button-text">{t('delete')}</span>
                        </button>
                        <button
                          title={t('consult')}
                          className="courseSectionCS-action-button courseSectionCS-action-consult"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card click
                            handleConsult(course);
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                          <span className="courseSectionCS-button-text">{t('manage')}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {totalPages > 1 && (
              <div className="courseSectionCS-pagination-controls">
                <button onClick={handlePrev} disabled={currentPage === 1} className="courseSectionCS-pagination-button prev button-3d">
                  <div className="button-top">
                    <span className="material-icons">❮</span>
                  </div>
                  <div className="button-bottom"></div>
                  <div className="button-base"></div>
                </button>
                <span className="courseSectionCS-pagination-info">
                  {t('page')} {currentPage} / {totalPages}
                </span>
                <button onClick={handleNext} disabled={currentPage === totalPages} className="courseSectionCS-pagination-button next button-3d">
                  <div className="button-top">
                    <span className="material-icons">❯</span>
                  </div>
                  <div className="button-bottom"></div>
                  <div className="button-base"></div>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default CoursTeacher;
