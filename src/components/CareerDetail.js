// CareerDetail.js
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../Css/careers.css';

const jobOffers = [
  { id: 1, title: 'Développeur Front-End', department: 'Tech', description: 'Intégrez notre équipe technique et participez à la création d’interfaces web innovantes.', details: 'Vous serez responsable du développement des interfaces web, en collaborant étroitement avec notre équipe de designers et back-end. Exigences : maîtrise de React, HTML, CSS et JavaScript.' },
  { id: 2, title: 'Chef de Projet Marketing', department: 'Marketing', description: 'Rejoignez notre équipe marketing et contribuez à la stratégie globale de l’entreprise.', details: 'Votre rôle consistera à coordonner les campagnes marketing, analyser les performances et collaborer avec les équipes commerciales. Exigences : expérience en gestion de projets marketing et compétences en communication.' },
  // Ajoutez d'autres offres si nécessaire...
];

const CareerDetail = () => {
  const { id } = useParams();
  const job = jobOffers.find(job => job.id === parseInt(id));

  if (!job) {
    return <div>Offre d'emploi non trouvée.</div>;
  }

  return (
    <div className="career-detail-page">
      <header className="career-detail-header">
        <div className="career-detail-logo">
          <img src="logo-edumaster.png" alt="Logo EduMaster" />
        </div>
        <h1>{job.title}</h1>
      </header>
      <main className="career-detail-content">
        <section className="career-detail-description">
          <h2>Description du Poste</h2>
          <p>{job.details}</p>
        </section>
        <section className="career-detail-apply">
          <h2>Postulez pour ce poste</h2>
          <Link to="/careers" className="btn-back">Retour aux Offres</Link>
          {/* Vous pouvez intégrer ici un formulaire de candidature spécifique */}
        </section>
      </main>
      <footer>
        <div className="career-detail-footer">
          <p>&copy; {new Date().getFullYear()} EduMaster. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default CareerDetail;
