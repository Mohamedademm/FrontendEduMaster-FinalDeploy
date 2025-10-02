import React from 'react';
import { useTranslation } from 'react-i18next';

const Section1 = () => {
  const { t } = useTranslation();

  return (
    <section className="section1">
      <h2>{t('section1_title')}</h2>
      <p>{t('section1_description')}</p>
    </section>
  );
};

export default Section1;
