import React from "react";
import "../Css/NotFound.css"; // Make sure to create a corresponding CSS file for styling

import { Link } from 'react-router-dom'; // Si vous utilisez React Router

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <p className="not-found-message">Oups! La page que vous cherchez est introuvable.</p>
        <p className="not-found-description">Il semble que l'URL saisie soit incorrecte ou la page a été déplacée.</p>
        <Link to="/" className="back-home-button">Retour à l'accueil</Link>
      </div>
    </div>
  );
};

export default NotFound;
