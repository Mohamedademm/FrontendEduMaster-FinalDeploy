import React from 'react';
import { useTranslation } from 'react-i18next';

const Section2 = () => {
  const { t } = useTranslation();

  return (
    <section className="section2">
      <h2>{t('section2_title')}</h2>
      <p>{t('section2_description')}</p>
    </section>
  );
};

export default Section2;
