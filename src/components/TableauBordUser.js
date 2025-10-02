import React from 'react';
import { useTranslation } from 'react-i18next';
import '../Css/tableauBordUser.css';

const TableauBordUser = () => {
  const { t } = useTranslation();
  
  // Données simulées pour la démonstration
  const userProgress = [
    { course: t('mathematics'), progress: 80 },
    { course: t('physics'), progress: 50 },
    { course: t('chemistry'), progress: 70 },
  ];

  return (
    <div className="tableau-bord-user">
      <h2>{t('personal_dashboard')}</h2>
      <div className="progress-container">
        {userProgress.map((item, index) => (
          <div key={index} className="course-progress">
            <h3>{item.course}</h3>
            <div className="progress-bar">
              <div 
                className="progress" 
                style={{ width: `${item.progress}%` }}
              ></div>
            </div>
            <span>{item.progress}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableauBordUser;
