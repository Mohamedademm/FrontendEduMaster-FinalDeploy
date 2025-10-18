/**
 * EXEMPLE: Comment utiliser le logger dans vos composants
 */

import React, { useEffect, useState } from 'react';
import logger from '../utils/logger'; // ← Importer le logger

const ExampleComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // ❌ AVANT (à éviter):
      // console.log('Fetching data...');
      
      // ✅ APRÈS (recommandé):
      logger.log('Fetching data...');

      const response = await fetch('/api/data');
      const result = await response.json();
      
      // ❌ AVANT:
      // console.log('Data received:', result);
      
      // ✅ APRÈS:
      logger.info('Data received:', result);
      
      setData(result);
    } catch (error) {
      // ❌ AVANT:
      // console.error('Error fetching data:', error);
      
      // ✅ APRÈS (toujours logger les erreurs):
      logger.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      {/* Votre composant */}
    </div>
  );
};

export default ExampleComponent;

/**
 * NIVEAUX DE LOGGING:
 * 
 * logger.log()    → Informations générales (développement uniquement)
 * logger.info()   → Informations importantes (développement uniquement)
 * logger.warn()   → Avertissements (développement uniquement)
 * logger.error()  → Erreurs (TOUJOURS loggé, même en production)
 * logger.debug()  → Debug détaillé (nécessite REACT_APP_DEBUG=true)
 */

/**
 * REMPLACEMENT RAPIDE:
 * 
 * Rechercher/Remplacer dans VS Code:
 * 
 * 1. console.log(    → logger.log(
 * 2. console.error(  → logger.error(
 * 3. console.warn(   → logger.warn(
 * 4. console.info(   → logger.info(
 * 
 * Ensuite, ajouter l'import en haut du fichier:
 * import logger from '../utils/logger';
 */
