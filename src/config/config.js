// Configuration API pour l'environnement de déploiement
const config = {
  // URL de l'API backend (TON BACKEND DÉPLOYÉ)
  API_BASE_URL: process.env.REACT_APP_API_URL || 'https://edumaster-backend-10b5.onrender.com/api',
  
  // URL complète du backend (pour les images et autres ressources)
  BACKEND_URL: process.env.REACT_APP_BACKEND_URL || 'https://edumaster-backend-10b5.onrender.com',
  
  // URL du frontend (pour les redirections)
  FRONTEND_URL: process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3005',
  
  // Autres configurations
  APP_NAME: 'EduMaster',
  VERSION: '1.0.0',
  
  // Configuration des services tiers
  GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  PAYPAL_CLIENT_ID: process.env.REACT_APP_PAYPAL_CLIENT_ID,
  STRIPE_PUBLIC_KEY: process.env.REACT_APP_STRIPE_PUBLIC_KEY,
};

export default config;