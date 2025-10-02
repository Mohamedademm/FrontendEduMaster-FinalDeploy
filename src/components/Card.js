import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import "../Css/CategoryCard.css"; // Ensure this path is correct

// Helper function to render stars for display
const renderDisplayStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5; // Simple half-star logic, full star for display
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  for (let i = 0; i < fullStars; i++) {
    stars.push(<span key={`full-${i}`} className="star full-star">★</span>);
  }
  if (halfStar) {
    // For display, a full star is often used if > .5, or use a specific half-star icon/CSS
    stars.push(<span key="half" className="star full-star">★</span>); 
  }
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<span key={`empty-${i}`} className="star empty-star">☆</span>);
  }
  return stars;
};

function CourseCard({
  image,
  title,
  teacher = {},
  progress,
  lesson,
  isPremium,
  price,
  averageRating = 0,
  numberOfRatings = 0,
  courseId, // Added courseId prop
  onRateCourse, // Added prop to handle rating submission
  isRatingEnabled = false, // To enable rating input
}) {
  const { t } = useTranslation();
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleRatingSubmit = () => {
    if (userRating > 0 && onRateCourse) {
      onRateCourse(userRating); // Pass only the rating value
    }
  };

  // Render stars for rating input
  const renderInputStars = () => {
    return [1, 2, 3, 4, 5].map((starValue) => (
      <span
        key={starValue}
        className={`star interactive-star ${
          hoverRating >= starValue || userRating >= starValue
            ? "full-star"
            : "empty-star"
        }`}
        onMouseEnter={() => setHoverRating(starValue)}
        onMouseLeave={() => setHoverRating(0)}
        onClick={() => setUserRating(starValue)}
      >
        {hoverRating >= starValue || userRating >= starValue ? "★" : "☆"}
      </span>
    ));
  };

  return (
    <div className="courseCardCourese">
      <div className="courseImageContainer">
        <img
          src={image}
          alt={title}
          className="courseImageCCCrourseCD"
        />
        {isPremium && (
          <span className="premium-badge">
            Premium
          </span>
        )}
      </div>
      <div className="courseDetails">
        <h3 className="courseTitleCCCrourseCD">{title}</h3>
        
        {teacher && (teacher.firstName || teacher.lastName) && (
          <div className="teacher-info">
            <img
              src={teacher.profileImage || 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg'}
              alt={(`${teacher.firstName || ''} ${teacher.lastName || ''}`).trim() || 'Teacher'}
              className="teacher-avatar"
            />
            <span className="teacher-name">{`${teacher.firstName || ''} ${teacher.lastName || ''}`.trim()}</span>
          </div>
        )}

        <div className="course-rating">
          {numberOfRatings > 0 ? (
            <>
              <span className="stars-container">{renderDisplayStars(averageRating)}</span>
              <span className="rating-value">{averageRating.toFixed(1)}</span>
              <span className="rating-count">({numberOfRatings} ratings)</span>
            </>
          ) : (
            <span className="no-ratings">No ratings yet</span>
          )}
        </div>

        {isRatingEnabled && (
          <div className="course-rating-input">
            <div className="stars-container input-stars-container">
              {renderInputStars()}
            </div>
            {userRating > 0 && (
              <button onClick={handleRatingSubmit} className="submit-rating-button">
                Submit {userRating} Star{userRating > 1 ? 's' : ''}
              </button>
            )}
          </div>
        )}

        <div className="progressBarContainerCCCrourseCD">
          <div
            className="progressFillCCCrourseCD"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="lessonCountCCCrourseCD">{lesson}</span>
        {isPremium && price > 0 && (
          <div className="premiumPriceCCCrourseCD">
            {`$${price}`}
          </div>
        )}
        {isPremium && price === 0 && (
          <div className="premiumPriceCCCrourseCD">
            Free
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseCard;
