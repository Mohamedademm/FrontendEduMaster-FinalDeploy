import React from 'react';
import { useTranslation } from 'react-i18next';
import '../Css/CloudSoftware.css';

function CloudSoftware() {
  const { t } = useTranslation();
  
  const featuresData = [
    {
      titleKey: "seamless_learning",
      title: "Seamless Learning",
      descriptionKey: "seamless_learning_desc",
      description: "Sync your progress across all your devices"
    },
    {
      titleKey: "ai_recommendations",
      title: "AI-Powered Recommendations",
      descriptionKey: "ai_recommendations_desc",
      description: "Personalized learning paths just for you"
    },
    {
      titleKey: "interactive_classes",
      title: "Interactive Live Classes",
      descriptionKey: "interactive_classes_desc",
      description: "Join real-time sessions with experts"
    }
  ];

  return (
    <section className="cloudSoftwareSectionCS">
      <div className="cloudSoftwareContainerCS">
        <h2 className="cloudSoftwareTitleCS">{t('cloud_software_title', 'All-In-One Cloud Software')}</h2>
        <div className="featureCardContainerCS">
          {featuresData.map((feature, index) => (
            <div key={index} className="featureCardCS">
              <h3 className="featureTitleCS">{t(feature.titleKey, feature.title)}</h3>
              <p className="featureDescriptionCS">{t(feature.descriptionKey, feature.description)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CloudSoftware;
  