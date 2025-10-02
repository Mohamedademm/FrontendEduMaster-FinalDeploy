import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import Card from "./Card";
import "../Css/Courses.css";
import Swal from "sweetalert2";
import PayPalPayment from "./PayPalPayment"; // Composant PayPal (voir code séparé)

function Courses({ userRole }) {
  const { t } = useTranslation();
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingCourse, setEditingCourse] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 8;

  const [showPayPal, setShowPayPal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  async function fetchCoursesData() {
    setLoading(true);
    try {
      let endpoint = "http://localhost:3000/api/courses";
      if (userRole === "teacher") {
        const teacherId = localStorage.getItem("teacherId");
        endpoint = `http://localhost:3000/api/courses/teacher/${teacherId}`;
      }
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(t('error_loading_courses'));
      const data = await res.json();
      const validatedCourses = data.filter((course) => course.validation === "validated");
      setCourses(validatedCourses);
    } catch (error) {
      console.error("Erreur:", error);
      setErrorMessage(t('error_loading_courses'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCoursesData();
  }, [userRole]);

  const handleDelete = async (courseId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/courses/${courseId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(t('error_deleting_course'));
      setCourses((prev) => prev.filter((course) => course._id !== courseId));
      setSuccessMessage(t('course_deleted_successfully'));
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Erreur de suppression:", error);
      setErrorMessage(t('error_deleting_course'));
      setTimeout(() => setErrorMessage(""), 3000);
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

  // Nouvelle fonction handleConsult modifiée pour PayPal
  const handleConsult = (course) => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    localStorage.setItem("courseId", course._id);

    if (course.isPremium && course.price > 0) {
      setSelectedCourse(course);
      setShowPayPal(true);
    } else {
      window.location.href = "/MicroCours";
    }
  };

  const onPaymentSuccess = (details) => {
    alert("Paiement réussi !");
    setShowPayPal(false);
    // TODO: Appeler backend pour enregistrer paiement et accorder accès
    window.location.href = "/MicroCours";
  };

  const onPaymentCancel = () => {
    alert("Paiement annulé");
    setShowPayPal(false);
  };

  const onPaymentError = (error) => {
    alert("Erreur lors du paiement : " + error.message);
    setShowPayPal(false);
  };

  const handleRateCourse = async (courseId, rating) => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire("Erreur", "Vous devez être connecté pour évaluer un cours.", "error");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/courses/${courseId}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Erreur lors de l'évaluation du cours.");
      }

      Swal.fire("Succès!", "Votre évaluation a été enregistrée.", "success");
      setCourses((prevCourses) =>
        prevCourses.map((c) =>
          c._id === courseId
            ? { ...c, averageRating: result.averageRating, numberOfRatings: result.numberOfRatings }
            : c
        )
      );
    } catch (error) {
      console.error("Erreur d'évaluation:", error);
      Swal.fire("Erreur", error.message || "Une erreur s'est produite lors de l'évaluation.", "error");
    }
  };

  return (
    <section className="courseSectionCS">
      <div className="headerCS">
        <h2 className="titleCS">{t('welcome_message')}</h2>
        {userRole === "teacher" && (
          <button
            className="button-courses-create"
            onClick={() => {
              setShowForm(!showForm);
              setEditingCourse(null);
            }}
          >
            <span className="material-icons">add_circle_outline</span>
            {showForm ? t('close') : t('create_new_course')}
          </button>
        )}
      </div>

      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="searchContainer">
        <input
          type="text"
          placeholder={t('search_courses')}
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {loading ? (
        <div className="loading-state">{t('loading_courses')}</div>
      ) : (
        <>
          <div className="courseListCS">
            {currentCourses.length === 0 ? (
              <div className="no-courses-state">{t('no_courses_available')}</div>
            ) : (
              currentCourses.map((course) => {
                const imageUrl =
                  course.image && course.image.startsWith("http")
                    ? course.image
                    : `http://localhost:3000${course.image}`;

                const teacherData = course.teacher || {};

                let teacherProfileImageUrl =
                  "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg";
                if (teacherData.profileImage) {
                  if (
                    teacherData.profileImage.startsWith("http") ||
                    teacherData.profileImage.startsWith("data:")
                  ) {
                    teacherProfileImageUrl = teacherData.profileImage;
                  } else {
                    teacherProfileImageUrl = `http://localhost:3000${
                      teacherData.profileImage.startsWith("/") ? "" : "/"
                    }${teacherData.profileImage}`;
                  }
                }

                return (
                  <div key={course._id} className="courseCardItem">
                    <Card
                      courseId={course._id}
                      image={imageUrl}
                      title={course.name}
                      teacher={{
                        firstName: teacherData.firstName,
                        lastName: teacherData.lastName,
                        profileImage: teacherProfileImageUrl,
                      }}
                      progress={course.NbMicroCour}
                      lesson={`${course.NbMicroCour} Micro-Cours`}
                      isPremium={course.isPremium}
                      price={course.price}
                      averageRating={course.averageRating || 0}
                      numberOfRatings={course.numberOfRatings || 0}
                      isRatingEnabled={userRole !== "teacher"}
                      onRateCourse={(rating) => handleRateCourse(course._id, rating)}
                    />
                    <div className="card-actions-container">
                      {userRole === "teacher" && (
                        <div className="boutonCRUD">
                          <button
                            className="button-courses-edit"
                            onClick={() => {
                              setEditingCourse(course);
                              setShowForm(true);
                            }}
                          >
                            <span className="material-icons">edit</span> Modifier
                          </button>
                          <button
                            className="button-courses-delete"
                            onClick={() => handleDelete(course._id)}
                          >
                            <span className="material-icons">delete_outline</span> {t('delete')}
                          </button>
                        </div>
                      )}
                      <button
                        className="button-course-consult"
                        onClick={() => handleConsult(course)}
                      >
                        <span className="material-icons">visibility</span> {t('buy_course')}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {totalPages > 0 && currentCourses.length > 0 && (
            <div className="pagination-container">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                <span className="material-icons">navigate_before</span>
              </button>
              <span className="pagination-info">
                Page {currentPage} sur {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages || totalPages === 0}
                className="pagination-button"
              >
                <span className="material-icons">navigate_next</span>
              </button>
            </div>
          )}
        </>
      )}

      {showPayPal && selectedCourse && (
        <div className="paypal-modal">
          <PayPalPayment
            amount={selectedCourse.price}
            onSuccess={onPaymentSuccess}
            onCancel={onPaymentCancel}
            onError={onPaymentError}
          />
          <button onClick={() => setShowPayPal(false)}>Annuler</button>
        </div>
      )}
    </section>
  );
}

export default Courses;
