import React from 'react';
import { useTranslation } from 'react-i18next';
import '../Css/Instructors.css';

const instructorsData = [
  {
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/d5ea899c292fee2b57c88829aeb658eb71e0faf45f85e31132ee0366bd34a0df?placeholderIfAbsent=true&apiKey=62962492ff174c4d90fed90497575cba",
    nameKey: "instructor_emily",
    name: "Dr. Emily White",
    expertiseKey: "ai_ml_expert",
    expertise: "AI & ML Expert",
    studentsKey: "students_15k",
    students: "15,000+"
  },
  {
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/ea14a6c5451c33e91e19050c2d7707b7e74a5307e1d23e58f47a1c45eb88f18a?placeholderIfAbsent=true&apiKey=62962492ff174c4d90fed90497575cba",
    nameKey: "instructor_david",
    name: "Prof. David Lee",
    expertiseKey: "data_science_expert",
    expertise: "Data Science",
    studentsKey: "students_12k",
    students: "12,000+"
  },
  {
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/816f3a470626982d39bd518763a355fe5da74447803333b0d185ea68c2676321?placeholderIfAbsent=true&apiKey=62962492ff174c4d90fed90497575cba",
    nameKey: "instructor_sarah",
    name: "Sarah Miller",
    expertiseKey: "ux_ui_expert",
    expertise: "UX/UI Design",
    studentsKey: "students_9k",
    students: "9,000+"
  },
  {
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/ea0a1c38d592b9067d121a484be561a701d8a479098e9443b193a3b85d867ca8?placeholderIfAbsent=true&apiKey=62962492ff174c4d90fed90497575cba",
    nameKey: "instructor_mark",
    name: "Mark Thompson",
    expertiseKey: "web_dev_expert",
    expertise: "Web Development",
    studentsKey: "students_20k",
    students: "20,000+"
  }
];

function Instructors() {
  const { t } = useTranslation();
  
  return (
    <section className="sectionInstructors">
      <div className="containerInstructors">
        <h2 className="titleInstructors">{t('learn_from_best', 'Learn from the Best')}</h2>
        <div className="cardContainerInstructors">
          {instructorsData.map((instructor, index) => (
            <div key={index} className="instructor-card">
              <img src={instructor.image} alt={t(instructor.nameKey, instructor.name)} className="instructor-image" />
              <h3 className="instructor-name">{t(instructor.nameKey, instructor.name)}</h3>
              <p className="instructor-expertise">{t(instructor.expertiseKey, instructor.expertise)}</p>
              <p className="instructor-students">{t(instructor.studentsKey, instructor.students)} {t('students_label', 'students')}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Instructors;
