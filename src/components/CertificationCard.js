import React from 'react';
import '../Css/CertificationCard.css';

function CertificationCard({ title, description, buttonText, isFeatured }) {
  return (
    <div className={`certification-card ${isFeatured ? 'featured' : ''}`}>
      {isFeatured && <div className="featured-badge">Featured</div>}
      <h3 className="certification-title">{title}</h3>
      <p className="certification-description">{description}</p>
      <button className="certification-button">{buttonText}</button>
    </div>
  );
}

export default CertificationCard;
