import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../Css/Teacher/AddMicroCourse.css';

const AddMicroCourse = () => {
  const { t } = useTranslation();
  const [microCourseName, setMicroCourseName] = useState('');
  const [microCourseContent, setMicroCourseContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique de soumission du formulaire
  };

  return (
    <div className="add-micro-course">
      <header className="header">
        <h1>{t('add_micro_course')}</h1>
      </header>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="title">{t('micro_course_name')}</label>
          <input
            type="text"
            id="title"
            value={microCourseName}
            onChange={(e) => setMicroCourseName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">{t('micro_course_content')}</label>
          <textarea
            id="description"
            value={microCourseContent}
            onChange={(e) => setMicroCourseContent(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn">{t('submit')}</button>
      </form>
    </div>
  );
};

export default AddMicroCourse;
