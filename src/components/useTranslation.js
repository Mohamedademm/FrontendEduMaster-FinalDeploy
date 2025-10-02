// ExempleComponent.js
import React from 'react';
import { useTranslation } from 'react-i18next';

const ExempleComponent = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('welcome_message')}</h1>
      <button>{t('login')}</button>
      <button>{t('register')}</button>
    </div>
  );
};

export default ExempleComponent;
