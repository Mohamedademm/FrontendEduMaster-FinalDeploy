/**
 * Logger utility pour remplacer console.log en production
 * Utilisation: import logger from './utils/logger';
 */

const isDevelopment = process.env.NODE_ENV === 'development';

const logger = {
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  error: (...args) => {
    // Toujours logger les erreurs
    console.error(...args);
    // TODO: Envoyer à un service de monitoring comme Sentry
  },

  warn: (...args) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  info: (...args) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },

  debug: (...args) => {
    if (isDevelopment && process.env.REACT_APP_DEBUG === 'true') {
      console.debug(...args);
    }
  }
};

export default logger;
