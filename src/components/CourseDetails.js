import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from "react-router-dom";
import "../Css/CourseDetails.css";

const CourseDetails = () => {
  const { t } = useTranslation();
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [loadingAccess, setLoadingAccess] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchCourseDetails() {
      try {
        const res = await fetch(`http://localhost:3000/api/courses/${courseId}`);
        if (!res.ok) throw new Error("Erreur lors du chargement des détails du cours");
        const data = await res.json();
        setCourse(data);
      } catch (error) {
        console.error("Erreur:", error);
        setErrorMessage("Erreur lors du chargement des détails du cours.");
      }
    }
    fetchCourseDetails();
  }, [courseId]);

  useEffect(() => {
    async function checkAccess() {
      try {
        const userId = localStorage.getItem("userId");
        console.log("UserId from localStorage:", userId);
        if (!userId) {
          setHasAccess(false);
          setLoadingAccess(false);
          setErrorMessage("Vous devez être connecté pour accéder à ce cours.");
          return;
        }
        const res = await fetch(`http://localhost:3000/api/payments/check-access/${userId}/${courseId}`);
        if (res.ok) {
          const data = await res.json();
          setHasAccess(data.hasAccess);
        } else {
          setHasAccess(false);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'accès :", error);
        setHasAccess(false);
      } finally {
        setLoadingAccess(false);
      }
    }
    checkAccess();
  }, [courseId]);

  const handleBuyCourse = async () => {
    try {
      const userId = localStorage.getItem("userId");
      console.log("UserId for payment:", userId);
      if (!userId) {
        alert("Vous devez être connecté pour acheter ce cours.");
        navigate("/login");
        return;
      }
      const amount = course.price;

      // Simulate payment process here or integrate real payment API
      // For now, just record payment directly
      const res = await fetch(`http://localhost:3000/api/courses/${courseId}/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, amount }),
      });

      if (res.ok) {
        alert("Paiement effectué avec succès !");
        setHasAccess(true);
      } else {
        alert("Erreur lors du paiement.");
      }
    } catch (error) {
      console.error("Erreur lors du paiement :", error);
      alert("Erreur lors du paiement.");
    }
  };

  if (errorMessage) {
    return <div className="error-message">{errorMessage}</div>;
  }

  if (!course || loadingAccess) {
    return <div>{t('loading')}</div>;
  }

  return (
    <div className="course-details">
      <h1>{course.name}</h1>
      <img src={course.image} alt={course.name} />
      <p>{course.description}</p>
      <p><strong>{t('price')}:</strong> {course.price}</p>
      <p><strong>{t('course_instructor')}:</strong> {course.instructor?.name || t('unknown')}</p>
      <p><strong>{t('course_program')}:</strong> {course.program}</p>
      {!hasAccess && course.isPremium && course.price > 0 ? (
        <button onClick={handleBuyCourse}>{t('buy_course')}</button>
      ) : (
        <div>
          <p>{t('access_granted')}</p>
          {/* Render course content or link to micro-courses here */}
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
