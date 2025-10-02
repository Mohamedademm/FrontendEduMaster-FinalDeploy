import React from 'react';
import { useTranslation } from 'react-i18next';

const Section3 = () => {
  const { t } = useTranslation();

  return (
    <section className="section3">
      <h2>{t('section3_title')}</h2>
      <p>{t('section3_description')}</p>
    </section>
  );
};

export default Section3;
