import React from 'react';
import { useTranslation } from 'react-i18next';
import '../Css/Certification.css';

const certificationData = [
  {
    titleKey: "professional_certification",
    title: "Professional Certification",
    descriptionKey: "professional_certification_desc",
    description: "Recognized by top companies worldwide",
    buttonTextKey: "get_certified",
    buttonText: "Get Certified",
    className: "Certification1"
  },
  {
    titleKey: "industry_certification",
    title: "Industry Certification",
    descriptionKey: "industry_certification_desc",
    description: "Validate your expertise",
    buttonTextKey: "learn_more",
    buttonText: "Learn More",
    className: "Certification2"
  },
  {
    titleKey: "academic_certification",
    title: "Academic Certification",
    descriptionKey: "academic_certification_desc",
    description: "University-backed credentials",
    buttonTextKey: "learn_more",
    buttonText: "Learn More",
    className: "Certification3"
  }
];

function Certification() {
  const { t } = useTranslation();
  return (
    <section className="SectionCertCertification">
      <div className="ContainerCertCertification">
        <h2 className="TitleCertCertification">{t('get_certified', 'Get Certified')}</h2>
        <div className="CardContainerCertCertification">
          {certificationData.map((cert, index) => (
            <div 
              key={index} 
              className={`CardCertCertification ${cert.className}`}
            >
              <div className="ImageContainerCertCertification"></div>
              <h3 className="CardTitleCertCertification">{t(cert.titleKey, cert.title)}</h3>
              <p className="CardDescriptionCertCertification">{t(cert.descriptionKey, cert.description)}</p>
              <button className="CardButtonCertCertification">{t(cert.buttonTextKey, cert.buttonText)}</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Certification;
