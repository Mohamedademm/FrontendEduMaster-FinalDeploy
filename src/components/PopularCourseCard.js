import React from 'react';
import '../Css/PopularCourseCard.css';

function PopularCourseCard({ image, title, instructor, rating, students }) {
  return (
    <div className="popularCourseCard">
      <img src={image} alt="" className="courseImage" />
      <div className="courseInfo">
        <h3 className="courseTitle">{title}</h3>
        <div className="instructorInfo">
          <img src={instructor.avatar} alt="" className="instructorAvatar" />
          <span className="instructorName">{instructor.name}</span>
        </div>
        <div className="courseStats">
          <div className="ratingContainer">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/0d38eb804aba5fe1f303bc171ff55cf9379740f662c827737a9ed5ff6e9b9bce?placeholderIfAbsent=true&apiKey=62962492ff174c4d90fed90497575cba"
              alt=""
              className="ratingIcon"
            />
            <span className="ratingText">{rating} ({students} students)</span>
          </div>
          <button className="startLearningButton">Start Learning →</button>
        </div>
      </div>
    </div>
  );
}

export default PopularCourseCard;
