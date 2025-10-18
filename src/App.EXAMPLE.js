/**
 * EXEMPLE: Comment intégrer ErrorBoundary dans App.js
 * 
 * Remplacer la fonction App() actuelle par cette version
 */

import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './i18n/i18n';
import ErrorBoundary from './components/ErrorBoundary'; // ← AJOUTER CETTE LIGNE
import Navbar from './components/Navbar';
// ... autres imports ...

const AppContent = () => {
  const location = useLocation();

  const hideNavbarRoutes = [
    '/Dashboard',
    '/dashboard',
    // ... autres routes ...
  ];

  const shouldHideNavbar = hideNavbarRoutes.some(route => 
    location.pathname.startsWith(route)
  );

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        {/* ... autres routes ... */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

// ✨ VERSION AMÉLIORÉE AVEC ERROR BOUNDARY
function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

export default App;

/**
 * ALTERNATIVE: ErrorBoundary pour des sections spécifiques
 * 
 * Si vous voulez protéger uniquement certaines parties:
 */

/*
function App() {
  return (
    <AppContent />
  );
}

const AppContent = () => {
  return (
    <>
      <Navbar />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={
            <ErrorBoundary>
              <Courses />
            </ErrorBoundary>
          } />
        </Routes>
      </ErrorBoundary>
    </>
  );
};
*/

/**
 * NOTES:
 * - ErrorBoundary capture les erreurs React uniquement
 * - Pour les erreurs async, utiliser try/catch
 * - Pour les erreurs globales, ajouter window.onerror
 */
