import React from 'react';
import '../Css/UseCaseDiagram.css';

const UseCaseDiagram = () => {
  return (
    <div className="use-case-diagram-container">
      <h1 className="diagram-title">Diagramme de Cas d'Utilisation</h1>
      <div className="diagram-content">
        <div className="actors">
          <h2>Acteurs</h2>
          <ul>
            <li>Admin</li>
            <li>Enseignant</li>
            <li>Étudiant</li>
          </ul>
        </div>
        <div className="use-cases">
          <h2>Cas d'Utilisation</h2>
          <div className="use-case-group">
            <h3>Admin</h3>
            <ul>
              <li>Gérer les Utilisateurs</li>
              <li>Gérer les Cours</li>
              <li>Voir les Statistiques</li>
              <li>Gérer les Notifications</li>
              <li>Gérer les Paiements</li>
              <li>Gérer les Tickets de Support</li>
            </ul>
          </div>
          <div className="use-case-group">
            <h3>Enseignant</h3>
            <ul>
              <li>Créer un Cours</li>
              <li>Gérer ses Propres Cours</li>
              <li>Voir ses Propres Statistiques</li>
              <li>Gérer les Classes en Ligne</li>
              <li>Gérer le Compte Bancaire</li>
            </ul>
          </div>
          <div className="use-case-group">
            <h3>Étudiant</h3>
            <ul>
              <li>S'inscrire à un Cours</li>
              <li>Voir les Cours Inscrits</li>
              <li>Participer aux Classes en Ligne</li>
              <li>Voir les Notifications</li>
              <li>Gérer le Profil</li>
              <li>Accéder au Système de Support</li>
            </ul>
          </div>
        </div>
        <div className="relationships">
          <h2>Relations</h2>
          <ul>
            <li>Admin -> Gérer les Utilisateurs</li>
            <li>Admin -> Gérer les Cours</li>
            <li>Admin -> Voir les Statistiques</li>
            <li>Admin -> Gérer les Notifications</li>
            <li>Admin -> Gérer les Paiements</li>
            <li>Admin -> Gérer les Tickets de Support</li>
            <li>Enseignant -> Créer un Cours</li>
            <li>Enseignant -> Gérer ses Propres Cours</li>
            <li>Enseignant -> Voir ses Propres Statistiques</li>
            <li>Enseignant -> Gérer les Classes en Ligne</li>
            <li>Enseignant -> Gérer le Compte Bancaire</li>
            <li>Étudiant -> S'inscrire à un Cours</li>
            <li>Étudiant -> Voir les Cours Inscrits</li>
            <li>Étudiant -> Participer aux Classes en Ligne</li>
            <li>Étudiant -> Voir les Notifications</li>
            <li>Étudiant -> Gérer le Profil</li>
            <li>Étudiant -> Accéder au Système de Support</li>
          </ul>
        </div>
      </div>
      <div className="website-details">
        <h2>Détails du Site Web</h2>
        <p>Ce site web, EduMaster, est une plateforme éducative qui permet aux administrateurs, enseignants et étudiants de gérer et participer à des cours en ligne. Voici les détails des fonctionnalités disponibles pour chaque type d'utilisateur :</p>
        <h3>Admin</h3>
        <ul>
          <li><strong>Gérer les Utilisateurs :</strong> Ajouter, modifier et supprimer des utilisateurs.</li>
          <li><strong>Gérer les Cours :</strong> Ajouter, modifier et supprimer des cours.</li>
          <li><strong>Voir les Statistiques :</strong> Afficher les statistiques d'utilisation de la plateforme.</li>
          <li><strong>Gérer les Notifications :</strong> Envoyer des notifications aux utilisateurs.</li>
          <li><strong>Gérer les Paiements :</strong> Gérer les paiements et les transactions financières.</li>
          <li><strong>Gérer les Tickets de Support :</strong> Gérer les tickets de support soumis par les utilisateurs.</li>
        </ul>
        <h3>Enseignant</h3>
        <ul>
          <li><strong>Créer un Cours :</strong> Créer de nouveaux cours et les publier sur la plateforme.</li>
          <li><strong>Gérer ses Propres Cours :</strong> Modifier et supprimer les cours créés par l'enseignant.</li>
          <li><strong>Voir ses Propres Statistiques :</strong> Afficher les statistiques des cours créés par l'enseignant.</li>
          <li><strong>Gérer les Classes en Ligne :</strong> Organiser et gérer des classes en ligne.</li>
          <li><strong>Gérer le Compte Bancaire :</strong> Gérer les informations de compte bancaire pour les paiements.</li>
        </ul>
        <h3>Étudiant</h3>
        <ul>
          <li><strong>S'inscrire à un Cours :</strong> S'inscrire à des cours disponibles sur la plateforme.</li>
          <li><strong>Voir les Cours Inscrits :</strong> Afficher la liste des cours auxquels l'étudiant est inscrit.</li>
          <li><strong>Participer aux Classes en Ligne :</strong> Participer aux classes en ligne organisées par les enseignants.</li>
          <li><strong>Voir les Notifications :</strong> Recevoir et afficher les notifications envoyées par les administrateurs et enseignants.</li>
          <li><strong>Gérer le Profil :</strong> Modifier les informations de profil de l'étudiant.</li>
          <li><strong>Accéder au Système de Support :</strong> Soumettre des tickets de support et consulter les réponses.</li>
        </ul>
      </div>
    </div>
  );
};

export default UseCaseDiagram;
