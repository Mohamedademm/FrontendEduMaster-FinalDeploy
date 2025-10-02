// Script utilitaire pour automatiser l'internationalisation des composants React
const fs = require('fs');
const path = require('path');

// Patterns courants à traduire
const commonPatterns = [
  // Boutons et actions
  { fr: 'Enregistrer', en: 'Save', key: 'save' },
  { fr: 'Annuler', en: 'Cancel', key: 'cancel' },
  { fr: 'Supprimer', en: 'Delete', key: 'delete' },
  { fr: 'Modifier', en: 'Edit', key: 'edit' },
  { fr: 'Ajouter', en: 'Add', key: 'add' },
  { fr: 'Créer', en: 'Create', key: 'create' },
  { fr: 'Fermer', en: 'Close', key: 'close' },
  { fr: 'Ouvrir', en: 'Open', key: 'open' },
  { fr: 'Valider', en: 'Validate', key: 'validate' },
  { fr: 'Confirmer', en: 'Confirm', key: 'confirm' },
  
  // Messages d'erreur courants
  { fr: 'Une erreur est survenue', en: 'An error occurred', key: 'error_occurred' },
  { fr: 'Chargement en cours...', en: 'Loading...', key: 'loading' },
  { fr: 'Aucune donnée disponible', en: 'No data available', key: 'no_data_available' },
  { fr: 'Champ obligatoire', en: 'Required field', key: 'required_field' },
  { fr: 'Format invalide', en: 'Invalid format', key: 'invalid_format' },
  
  // Navigation
  { fr: 'Accueil', en: 'Home', key: 'home' },
  { fr: 'Profil', en: 'Profile', key: 'profile' },
  { fr: 'Paramètres', en: 'Settings', key: 'settings' },
  { fr: 'Aide', en: 'Help', key: 'help' },
  { fr: 'Contact', en: 'Contact', key: 'contact' },
  { fr: 'À propos', en: 'About', key: 'about' },
  
  // Formulaires
  { fr: 'Nom', en: 'Name', key: 'name' },
  { fr: 'Prénom', en: 'First Name', key: 'first_name' },
  { fr: 'Nom de famille', en: 'Last Name', key: 'last_name' },
  { fr: 'Email', en: 'Email', key: 'email' },
  { fr: 'Mot de passe', en: 'Password', key: 'password' },
  { fr: 'Téléphone', en: 'Phone', key: 'phone' },
  { fr: 'Adresse', en: 'Address', key: 'address' },
  { fr: 'Date', en: 'Date', key: 'date' },
  { fr: 'Description', en: 'Description', key: 'description' },
  { fr: 'Titre', en: 'Title', key: 'title' },
  
  // États et statuts
  { fr: 'Actif', en: 'Active', key: 'active' },
  { fr: 'Inactif', en: 'Inactive', key: 'inactive' },
  { fr: 'En attente', en: 'Pending', key: 'pending' },
  { fr: 'Terminé', en: 'Completed', key: 'completed' },
  { fr: 'Annulé', en: 'Cancelled', key: 'cancelled' },
  { fr: 'Brouillon', en: 'Draft', key: 'draft' },
  
  // Messages de succès
  { fr: 'Opération réussie', en: 'Operation successful', key: 'operation_successful' },
  { fr: 'Données sauvegardées', en: 'Data saved', key: 'data_saved' },
  { fr: 'Création réussie', en: 'Created successfully', key: 'created_successfully' },
  { fr: 'Modification réussie', en: 'Updated successfully', key: 'updated_successfully' },
  { fr: 'Suppression réussie', en: 'Deleted successfully', key: 'deleted_successfully' },
];

// Fonction pour extraire les textes d'un fichier React
function extractTextsFromComponent(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const texts = [];
  
  // Patterns regex pour trouver les textes à traduire
  const patterns = [
    // Textes entre guillemets simples ou doubles dans les JSX
    /(?:>|label="|placeholder="|title="|alt=")([^"<>{}]+)(?="|<)/g,
    // Textes dans les Typography, Button, etc.
    /(?:Typography|Button)[^>]*>([^<>{}]+)</g,
    // Messages d'erreur et de notification
    /message:\s*["']([^"']+)["']/g,
    // Labels et placeholders
    /(?:label|placeholder):\s*["']([^"']+)["']/g,
  ];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const text = match[1].trim();
      if (text && text.length > 1 && !text.includes('{') && !text.includes('$')) {
        texts.push(text);
      }
    }
  });
  
  return [...new Set(texts)]; // Supprimer les doublons
}

// Fonction pour générer une clé de traduction
function generateTranslationKey(text) {
  return text
    .toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

// Fonction pour ajouter les traductions aux fichiers JSON
function addTranslationsToJSON(translations, frPath, enPath) {
  // Charger les fichiers existants
  const frData = JSON.parse(fs.readFileSync(frPath, 'utf8'));
  const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  
  // Ajouter les nouvelles traductions
  translations.forEach(({ key, fr, en }) => {
    if (!frData[key]) {
      frData[key] = fr;
    }
    if (!enData[key]) {
      enData[key] = en;
    }
  });
  
  // Sauvegarder les fichiers
  fs.writeFileSync(frPath, JSON.stringify(frData, null, 2), 'utf8');
  fs.writeFileSync(enPath, JSON.stringify(enData, null, 2), 'utf8');
}

// Fonction pour modifier un composant React pour utiliser les traductions
function internationalizeComponent(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Ajouter l'import useTranslation si pas déjà présent
  if (!content.includes('useTranslation')) {
    content = content.replace(
      /^(import React[^;]*;)/m,
      '$1\nimport { useTranslation } from \'react-i18next\';'
    );
  }
  
  // Ajouter const { t } = useTranslation(); dans le composant
  if (!content.includes('const { t } = useTranslation()')) {
    content = content.replace(
      /function\s+(\w+)\s*\([^)]*\)\s*{/,
      'function $1($2) {\n  const { t } = useTranslation();'
    );
  }
  
  return content;
}

module.exports = {
  commonPatterns,
  extractTextsFromComponent,
  generateTranslationKey,
  addTranslationsToJSON,
  internationalizeComponent
};
