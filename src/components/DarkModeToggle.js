// DarkModeToggle.js
import React, { useEffect, useState } from 'react';

const DarkModeToggle = () => {
  // Vérifier si le mode sombre est sauvegardé dans le localStorage
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <button onClick={() => setDarkMode(prev => !prev)}>
      {darkMode ? 'Mode Clair' : 'Mode Sombre'}
    </button>
  );
};

export default DarkModeToggle;
