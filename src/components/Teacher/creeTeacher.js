import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import "../../Css/Teacher/creeTeacher.css";

const CreeTeacher = () => {
  const { t } = useTranslation();
  const [teacherName, setTeacherName] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique de soumission du formulaire
  };

  return (
    <div className="cree-teacher">
      <h1>{t('create_teacher')}</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{t('teacher_name')}</label>
          <input
            type="text"
            value={teacherName}
            onChange={(e) => setTeacherName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>{t('teacher_email')}</label>
          <input
            type="email"
            value={teacherEmail}
            onChange={(e) => setTeacherEmail(e.target.value)}
          />
        </div>
        <button type="submit">{t('submit')}</button>
      </form>
    </div>
  );
};

export default CreeTeacher;
