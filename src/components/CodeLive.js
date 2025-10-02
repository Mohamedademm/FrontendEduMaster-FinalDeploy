import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPlay, FaCode, FaEye, FaRocket, FaPlus, FaUsers, FaTrophy, FaStar } from 'react-icons/fa';
import { MdLanguage, MdCheck, MdClose } from 'react-icons/md';
import axios from 'axios';
import '../Css/CodeLive.css';

const CodeLive = () => {
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState('html');
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [userCode, setUserCode] = useState('');
  const [livePreview, setLivePreview] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [userProgress, setUserProgress] = useState({
    totalXP: 0,
    completedChallenges: 0,
    currentStreak: 0,
    rank: t('beginner_rank', 'Beginner'),
    badges: []
  });
  const [gameMode, setGameMode] = useState('play'); // 'play', 'create', 'community'
  const [communityLevels, setCommunityLevels] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  
  // États pour le formulaire de création de défi
  const [challengeForm, setChallengeForm] = useState({
    title: '',
    description: '',
    language: 'html',
    difficulty: 'Beginner',
    xpReward: 100,
    starterCode: '',
    expectedElements: '',
    hints: '',
    isPublic: false,
    tags: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [createError, setCreateError] = useState('');
  // Languages disponibles avec leurs configurations
  const languages = useMemo(() => ({
    html: {
      name: 'HTML',
      icon: '🌐',
      color: '#E34F26',
      mode: 'xml',
      defaultCode: '<!DOCTYPE html>\n<html>\n<head>\n    <title>Mon Site</title>\n</head>\n<body>\n    <h1>Hello World!</h1>\n</body>\n</html>',
      supportsLivePreview: true
    },
    css: {
      name: 'CSS',
      icon: '🎨',
      color: '#1572B6',
      mode: 'css',
      defaultCode: '.container {\n    background: linear-gradient(45deg, #667eea, #764ba2);\n    padding: 20px;\n    border-radius: 10px;\n    color: white;\n    text-align: center;\n}',
      supportsLivePreview: true
    },
    javascript: {
      name: 'JavaScript',
      icon: '⚡',
      color: '#F7DF1E',
      mode: 'javascript',
      defaultCode: 'function saluer(nom) {\n    return "Bonjour " + nom + "!";\n}\n\nconsole.log(saluer("Développeur"));',
      supportsLivePreview: true
    },
    python: {
      name: 'Python',
      icon: '🐍',
      color: '#3776AB',
      mode: 'python',
      defaultCode: 'def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\nprint(fibonacci(10))',
      supportsLivePreview: false
    },
    react: {
      name: 'React',
      icon: '⚛️',
      color: '#61DAFB',
      mode: 'jsx',
      defaultCode: 'function MonComposant() {\n    const [count, setCount] = useState(0);\n    \n    return (\n        <div>\n            <h2>Compteur: {count}</h2>\n            <button onClick={() => setCount(count + 1)}>\n                Incrémenter\n            </button>\n        </div>\n    );\n}',
      supportsLivePreview: true
    }
  }), []);

  // Défis prédéfinis par langage
  const predefinedChallenges = {
    html: [
      {
        id: 1,
        title: "Créer un Formulaire de Contact",
        description: "Créez un formulaire avec les champs: nom, prénom, email et message",
        difficulty: "Beginner",
        xpReward: 50,
        starterCode: `<!DOCTYPE html>
<html>
<head>
    <title>Formulaire de Contact</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input, textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
        button { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
    </style>
</head>
<body>
    <h1>Contactez-nous</h1>
    <!-- Ajoutez votre formulaire ici -->
    
</body>
</html>`,
        expectedOutput: {
          contains: ['<form', 'name', 'email', 'message', 'input', 'textarea'],
          structure: 'form with input fields'
        },
        hints: [
          "Utilisez la balise <form> pour créer le formulaire",
          "Ajoutez des <input> pour nom, prénom et email",
          "Utilisez <textarea> pour le message",
          "N'oubliez pas les <label> pour l'accessibilité"
        ]
      },
      {
        id: 2,
        title: "Page Portfolio Simple",
        description: "Créez une page portfolio avec header, à propos, compétences et contact",
        difficulty: "Intermediate",
        xpReward: 75,
        starterCode: `<!DOCTYPE html>
<html>
<head>
    <title>Mon Portfolio</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; line-height: 1.6; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        header { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 2rem 0; text-align: center; }
        section { padding: 2rem 0; }
        .skills { display: flex; gap: 1rem; flex-wrap: wrap; }
        .skill { background: #f4f4f4; padding: 0.5rem 1rem; border-radius: 20px; }
    </style>
</head>
<body>
    <!-- Créez votre portfolio ici -->
</body>
</html>`,
        expectedOutput: {
          contains: ['header', 'section', 'h1', 'h2', 'portfolio'],
          structure: 'portfolio page with sections'
        }
      }
    ],
    css: [
      {
        id: 1,
        title: "Carte de Profil Animée",
        description: "Créez une carte de profil avec animations hover",
        difficulty: "Intermediate",
        xpReward: 60,
        starterCode: `.profile-card {
    width: 300px;
    padding: 20px;
    background: white;
    border-radius: 15px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    text-align: center;
    margin: 50px auto;
    /* Ajoutez vos styles et animations ici */
}

.profile-image {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: linear-gradient(45deg, #667eea, #764ba2);
    margin: 0 auto 20px;
}

.profile-name {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
}

.profile-title {
    color: #666;
    margin-bottom: 20px;
}

/* Ajoutez vos animations et effets hover ici */`,
        expectedOutput: {
          contains: ['hover', 'transition', 'transform'],
          structure: 'animated profile card'
        }
      }
    ],
    javascript: [
      {
        id: 1,
        title: "Calculatrice Interactive",
        description: "Créez une calculatrice qui peut additionner, soustraire, multiplier et diviser",
        difficulty: "Intermediate",
        xpReward: 80,
        starterCode: `// Créez une calculatrice interactive
class Calculatrice {
    constructor() {
        this.resultat = 0;
        this.operation = '';
    }
    
    // Implémentez les méthodes ici
    additionner(nombre) {
        
    }
    
    soustraire(nombre) {
        
    }
    
    multiplier(nombre) {
        
    }
    
    diviser(nombre) {
        
    }
    
    obtenirResultat() {
        return this.resultat;
    }
}

// Testez votre calculatrice
const calc = new Calculatrice();
// Ajoutez vos tests ici`,
        expectedOutput: {
          contains: ['additionner', 'soustraire', 'multiplier', 'diviser'],
          structure: 'working calculator class'
        }
      }
    ]
  };

  // Charger les progrès de l'utilisateur
  useEffect(() => {
    loadUserProgress();
    loadCommunityLevels();
  }, []);

  const loadUserProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get('http://localhost:3000/api/games/CodeLive/progress', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setUserProgress(response.data.data.profile);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des progrès:', error);
    }
  };

  const loadCommunityLevels = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/codelive/community/levels');
      setCommunityLevels(response.data.levels || []);
    } catch (error) {
      console.error('Erreur lors du chargement des niveaux communautaires:', error);
    }
  };

  // Fonction pour créer un nouveau défi
  const createChallenge = async () => {
    if (!challengeForm.title.trim() || !challengeForm.description.trim() || !challengeForm.starterCode.trim()) {
      setCreateError('Veuillez remplir tous les champs obligatoires (titre, description, code de départ)');
      return;
    }

    setIsCreating(true);
    setCreateError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setCreateError('Vous devez être connecté pour créer un défi');
        setIsCreating(false);
        return;
      }

      const challengeData = {
        title: challengeForm.title.trim(),
        description: challengeForm.description.trim(),
        language: challengeForm.language,
        difficulty: challengeForm.difficulty,
        starterCode: challengeForm.starterCode,
        xpReward: parseInt(challengeForm.xpReward) || 100,
        expectedOutput: {
          contains: challengeForm.expectedElements.split(',').map(e => e.trim()).filter(e => e),
          structure: `${challengeForm.title} structure`
        },
        hints: challengeForm.hints.split('\n').map(h => h.trim()).filter(h => h),
        isPublic: challengeForm.isPublic,
        tags: challengeForm.tags.split(',').map(t => t.trim()).filter(t => t),
        category: 'UI/UX' // Catégorie par défaut, peut être étendue
      };

      const response = await axios.post('http://localhost:3000/api/codelive/challenges', challengeData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setCreateSuccess(true);
        // Réinitialiser le formulaire
        setChallengeForm({
          title: '',
          description: '',
          language: 'html',
          difficulty: 'Beginner',
          xpReward: 100,
          starterCode: '',
          expectedElements: '',
          hints: '',
          isPublic: false,
          tags: ''
        });
        
        // Rediriger vers le mode jeu après 2 secondes
        setTimeout(() => {
          setCreateSuccess(false);
          setGameMode('play');
        }, 2000);
      } else {
        setCreateError(response.data.message || 'Erreur lors de la création du défi');
      }
    } catch (error) {
      console.error('Erreur lors de la création du défi:', error);
      setCreateError(error.response?.data?.message || 'Erreur serveur lors de la création du défi');
    } finally {
      setIsCreating(false);
    }
  };  // Fonction pour mettre à jour le formulaire
  const updateChallengeForm = (field, value) => {
    setChallengeForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Exécuter le code et générer l'aperçu
  const runCode = useCallback(() => {
    if (!userCode.trim()) return;
    
    setIsRunning(true);
    
    try {
      if (selectedLanguage === 'html') {
        setLivePreview(userCode);
      } else if (selectedLanguage === 'css') {
        const htmlWithCSS = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>${userCode}</style>
          </head>
          <body>
            <div class="profile-card">
              <div class="profile-image"></div>
              <div class="profile-name">John Doe</div>
              <div class="profile-title">Développeur Web</div>
              <button>Contact</button>
            </div>
          </body>
          </html>
        `;
        setLivePreview(htmlWithCSS);
      } else if (selectedLanguage === 'javascript') {
        // Pour JavaScript, on simule l'exécution et affiche les résultats
        try {
          const results = [];
          const originalLog = console.log;
          console.log = (...args) => {
            results.push(args.join(' '));
          };
            // Exécution sécurisée du code JavaScript
          // eslint-disable-next-line no-new-func
          const func = new Function(userCode);
          func();
          
          console.log = originalLog;
          
          const resultHTML = `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
                .console { background: #2d3748; color: #e2e8f0; padding: 15px; border-radius: 8px; font-family: monospace; }
                .result { margin-bottom: 10px; }
              </style>
            </head>
            <body>
              <h3>Résultats de l'exécution:</h3>
              <div class="console">
                ${results.map(result => `<div class="result">► ${result}</div>`).join('')}
              </div>
            </body>
            </html>
          `;
          setLivePreview(resultHTML);
        } catch (error) {
          setLivePreview(`
            <html>
              <body style="font-family: Arial; padding: 20px;">
                <h3 style="color: red;">Erreur dans le code:</h3>
                <pre style="background: #ffe6e6; padding: 15px; border-radius: 5px;">${error.message}</pre>
              </body>
            </html>
          `);
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'exécution:', error);
    }
    
    setTimeout(() => setIsRunning(false), 500);
  }, [userCode, selectedLanguage]);
  // Exécution automatique pendant que l'utilisateur tape
  useEffect(() => {
    const timer = setTimeout(() => {
      if (languages[selectedLanguage]?.supportsLivePreview) {
        runCode();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [userCode, runCode, selectedLanguage, languages]);

  // Sélectionner un défi
  const selectChallenge = (challenge) => {
    setCurrentChallenge(challenge);
    setUserCode(challenge.starterCode);
    setShowResults(false);
  };

  // Soumettre la solution
  const submitSolution = async () => {
    if (!currentChallenge) return;

    try {
      // Vérifier si la solution contient les éléments requis
      const expectedElements = currentChallenge.expectedOutput.contains;
      const hasAllElements = expectedElements.every(element => 
        userCode.toLowerCase().includes(element.toLowerCase())
      );

      const isCorrect = hasAllElements;
      const results = expectedElements.map(element => ({
        element,
        passed: userCode.toLowerCase().includes(element.toLowerCase())
      }));

      setTestResults(results);
      setShowResults(true);

      if (isCorrect) {
        // Sauvegarder les progrès
        const token = localStorage.getItem('token');
        if (token) {
          await axios.post('http://localhost:3000/api/games/CodeLive/complete-challenge', {
            challengeId: currentChallenge.id,
            language: selectedLanguage,
            xpGained: currentChallenge.xpReward,
            code: userCode
          }, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
        }

        // Mettre à jour les progrès locaux
        setUserProgress(prev => ({
          ...prev,
          totalXP: prev.totalXP + currentChallenge.xpReward,
          completedChallenges: prev.completedChallenges + 1,
          currentStreak: prev.currentStreak + 1
        }));
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  // Changer de langage
  const changeLanguage = (lang) => {
    setSelectedLanguage(lang);
    setUserCode(languages[lang].defaultCode);
    setCurrentChallenge(null);
    setShowResults(false);
  };

  // Gérer les changements dans le formulaire de création de défi
  const handleChallengeFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setChallengeForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Soumettre le formulaire de création de défi
  const handleCreateChallenge = async () => {
    setIsCreating(true);
    setCreateSuccess(false);
    setCreateError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Utilisateur non authentifié');

      const response = await axios.post('http://localhost:3000/api/games/CodeLive/create-challenge', {
        ...challengeForm,
        expectedOutput: {
          contains: challengeForm.expectedElements.split(',').map(el => el.trim()),
          structure: 'form with input fields'
        }
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setCreateSuccess(true);
        // Réinitialiser le formulaire
        setChallengeForm({
          title: '',
          description: '',
          language: 'html',
          difficulty: 'Beginner',
          xpReward: 100,
          starterCode: '',
          expectedElements: '',
          hints: '',
          isPublic: false,
          tags: ''
        });
      } else {
        setCreateError('Erreur lors de la création du défi');
      }
    } catch (error) {
      setCreateError(error.message);
    }

    setIsCreating(false);
  };

  if (gameMode === 'create') {
    return (
      <div className="code-live-container">
        <div className="mode-header">
          <h1>🎮 Créateur de Niveaux</h1>
          <button onClick={() => setGameMode('play')} className="back-btn">
            ← Retour au Jeu
          </button>
        </div>

        <div className="level-creator">
          <div className="creator-header">
            <h2>🛠️ Créateur de Niveaux</h2>
            <p>Créez vos propres défis et partagez-les avec la communauté</p>
          </div>

          <div className="creator-form">
            <div className="form-section">
              <h3>Informations de base</h3>
              <div className="form-group">
                <label>Titre du défi</label>
                <input 
                  type="text" 
                  placeholder="ex: Créer une page de connexion moderne"
                  className="form-input"
                  name="title"
                  value={challengeForm.title}
                  onChange={handleChallengeFormChange}
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  placeholder="Décrivez ce que les utilisateurs doivent créer..."
                  className="form-textarea"
                  rows="3"
                  name="description"
                  value={challengeForm.description}
                  onChange={handleChallengeFormChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Langage</label>
                  <select 
                    className="form-select"
                    name="language"
                    value={challengeForm.language}
                    onChange={handleChallengeFormChange}
                  >
                    {Object.entries(languages).map(([key, lang]) => (
                      <option key={key} value={key}>{lang.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Difficulté</label>
                  <select 
                    className="form-select"
                    name="difficulty"
                    value={challengeForm.difficulty}
                    onChange={handleChallengeFormChange}
                  >
                    <option value="Beginner">Débutant</option>
                    <option value="Intermediate">Intermédiaire</option>
                    <option value="Advanced">Avancé</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Récompense XP</label>
                  <input 
                    type="number" 
                    min="10" 
                    max="500" 
                    defaultValue="100"
                    className="form-input"
                    name="xpReward"
                    value={challengeForm.xpReward}
                    onChange={handleChallengeFormChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Code de départ</h3>
              <div className="form-group">
                <label>Code fourni aux utilisateurs</label>
                <textarea 
                  placeholder="Entrez le code de départ..."
                  className="code-textarea"
                  rows="10"
                  name="starterCode"
                  value={challengeForm.starterCode}
                  onChange={handleChallengeFormChange}
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Solution et validation</h3>
              <div className="form-group">
                <label>Éléments requis (séparés par des virgules)</label>
                <input 
                  type="text" 
                  placeholder="ex: form, input, button, email"
                  className="form-input"
                  name="expectedElements"
                  value={challengeForm.expectedElements}
                  onChange={handleChallengeFormChange}
                />
              </div>
              
              <div className="form-group">
                <label>Indices (optionnel)</label>
                <textarea 
                  placeholder="Ajoutez des indices pour aider les utilisateurs..."
                  className="form-textarea"
                  rows="3"
                  name="hints"
                  value={challengeForm.hints}
                  onChange={handleChallengeFormChange}
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Publication</h3>
              <div className="form-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    name="isPublic"
                    checked={challengeForm.isPublic}
                    onChange={handleChallengeFormChange}
                  />
                  <span>Rendre public immédiatement</span>
                </label>
              </div>
              
              <div className="form-group">
                <label>Tags (optionnel)</label>
                <input 
                  type="text" 
                  placeholder="ex: html, css, formulaire, ui"
                  className="form-input"
                  name="tags"
                  value={challengeForm.tags}
                  onChange={handleChallengeFormChange}
                />
              </div>
            </div>

            <div className="creator-actions">
              <button className="btn-secondary" onClick={() => setGameMode('play')}>
                Annuler
              </button>
              <button className="btn-primary" onClick={handleCreateChallenge} disabled={isCreating}>
                {isCreating ? 'Création...' : 'Créer le défi'}
              </button>
            </div>

            {createSuccess && (
              <div className="success-message">
                🎉 Défi créé avec succès !
              </div>
            )}
            {createError && (
              <div className="error-message">
                ❌ {createError}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (gameMode === 'community') {
    return (
      <div className="code-live-container">
        <div className="mode-header">
          <h1>👥 Niveaux Communautaires</h1>
          <button onClick={() => setGameMode('play')} className="back-btn">
            ← Retour au Jeu
          </button>
        </div>

        <div className="community-hub">
          <div className="community-header">
            <h2>🌟 Hub Communautaire</h2>
            <p>Découvrez les créations de la communauté et partagez les vôtres</p>
          </div>

          <div className="community-filters">
            <div className="filter-group">
              <label>Langage</label>
              <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
                <option value="">Tous les langages</option>
                {Object.entries(languages).map(([key, lang]) => (
                  <option key={key} value={key}>{lang.name}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Difficulté</label>
              <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)}>
                <option value="">Toutes</option>
                <option value="Beginner">Débutant</option>
                <option value="Intermediate">Intermédiaire</option>
                <option value="Advanced">Avancé</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Trier par</label>
              <select>
                <option value="rating">Mieux notés</option>
                <option value="recent">Plus récents</option>
                <option value="popular">Plus populaires</option>
                <option value="trending">Tendances</option>
              </select>
            </div>
            
            <button className="search-btn">
              🔍 Rechercher
            </button>
          </div>

          <div className="community-tabs">
            <button className="tab-btn active">🏆 Populaires</button>
            <button className="tab-btn">🆕 Récents</button>
            <button className="tab-btn">🔥 Tendances</button>
            <button className="tab-btn">⭐ Favoris</button>
          </div>

          <div className="community-content">
            {communityLevels.length === 0 ? (
              <div className="empty-state">
                <h3>🎨 Pas encore de niveaux communautaires</h3>
                <p>Soyez le premier à créer et partager un défi !</p>
                <button 
                  className="btn-primary"
                  onClick={() => setGameMode('create')}
                >
                  Créer un défi
                </button>
              </div>
            ) : (
              <div className="community-grid">
                {communityLevels.map(level => (
                  <div key={level.id} className="community-card">
                    <div className="card-header">
                      <div className="card-info">
                        <h3>{level.title}</h3>
                        <p className="card-author">👤 {level.author}</p>
                      </div>
                      <div className="card-meta">
                        <span className={`difficulty-badge ${level.difficulty.toLowerCase()}`}>
                          {level.difficulty}
                        </span>
                        <span className="language-badge" style={{ backgroundColor: languages[level.language]?.color }}>
                          {languages[level.language]?.icon} {languages[level.language]?.name}
                        </span>
                      </div>
                    </div>
                    
                    <div className="card-stats">
                      <div className="stat">
                        <span className="stat-icon">⭐</span>
                        <span className="stat-value">{level.rating}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-icon">🎮</span>
                        <span className="stat-value">{level.plays}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-icon">✅</span>
                        <span className="stat-value">{Math.floor(level.plays * 0.6)}</span>
                      </div>
                    </div>
                    
                    <div className="card-actions">
                      <button 
                        className="btn-play"
                        onClick={() => {
                          setGameMode('play');
                          // Charger le niveau communautaire
                          alert(`Chargement de "${level.title}" par ${level.author}`);
                        }}
                      >
                        🎮 Jouer
                      </button>
                      <button className="btn-favorite">
                        ❤️
                      </button>
                      <button className="btn-share">
                        📤
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="code-live-container">
      {/* Header */}
      <div className="game-header">
        <div className="header-left">          <div className="game-title">
            <FaCode className="title-icon" />
            <h1>{t('codelive_title', 'CodeLive Interactive')}</h1>
            <span className="subtitle">{t('codelive_subtitle', 'Codez • Voyez • Apprenez')}</span>
          </div>
          
          <div className="user-stats">
            <div className="stat-item">
              <FaStar />
              <span>{userProgress.totalXP} XP</span>
            </div>
            <div className="stat-item">
              <FaTrophy />
              <span>{userProgress.completedChallenges} {t('challenges', 'Défis')}</span>
            </div>
            <div className="stat-item">
              <span className="rank-badge">{userProgress.rank}</span>
            </div>
          </div>
        </div>        <div className="mode-switcher">
          <button 
            className={`mode-btn ${gameMode === 'play' ? 'active' : ''}`}
            onClick={() => setGameMode('play')}
          >
            <FaPlay /> {t('play', 'Jouer')}
          </button>
          <button 
            className={`mode-btn ${gameMode === 'create' ? 'active' : ''}`}
            onClick={() => setGameMode('create')}
          >
            <FaPlus /> {t('create', 'Créer')}
          </button>
          <button 
            className={`mode-btn ${gameMode === 'community' ? 'active' : ''}`}
            onClick={() => setGameMode('community')}
          >
            <FaUsers /> {t('community', 'Communauté')}
          </button>
        </div>
      </div>

      {/* Language Selector */}
      <div className="language-selector">
        <h3><MdLanguage /> {t('choose_language', 'Choisissez votre langage')}</h3>
        <div className="languages-grid">
          {Object.entries(languages).map(([key, lang]) => (
            <button
              key={key}
              className={`language-btn ${selectedLanguage === key ? 'active' : ''}`}
              onClick={() => changeLanguage(key)}
              style={{ borderColor: selectedLanguage === key ? lang.color : 'transparent' }}
            >
              <span className="lang-icon">{lang.icon}</span>
              <span className="lang-name">{lang.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Challenges */}
      <div className="challenges-section">
        <h3>🎯 Défis {languages[selectedLanguage].name}</h3>
        <div className="challenges-grid">
          {predefinedChallenges[selectedLanguage]?.map(challenge => (
            <div
              key={challenge.id}
              className={`challenge-card ${currentChallenge?.id === challenge.id ? 'selected' : ''}`}
              onClick={() => selectChallenge(challenge)}
            >
              <div className="challenge-header">
                <h4>{challenge.title}</h4>
                <span className={`difficulty ${challenge.difficulty.toLowerCase()}`}>
                  {challenge.difficulty}
                </span>
              </div>
              <p>{challenge.description}</p>
              <div className="challenge-footer">
                <span className="xp-reward">
                  <FaStar /> {challenge.xpReward} XP
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Coding Interface */}
      {currentChallenge && (
        <div className="coding-interface">
          <div className="challenge-info">
            <h2>{currentChallenge.title}</h2>
            <p>{currentChallenge.description}</p>
            {currentChallenge.hints && (
              <div className="hints">
                <strong>💡 Indices:</strong>
                <ul>
                  {currentChallenge.hints.map((hint, index) => (
                    <li key={index}>{hint}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="code-workspace">
            <div className="code-editor-panel">
              <div className="panel-header">
                <span>📝 Éditeur de Code</span>
                <button 
                  className="run-btn"
                  onClick={runCode}
                  disabled={isRunning}
                >
                  {isRunning ? '⏳' : <FaPlay />} Exécuter
                </button>
              </div>
              <textarea
                className="code-editor"
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                placeholder={`Écrivez votre code ${languages[selectedLanguage].name} ici...`}
                spellCheck={false}
              />
              <div className="editor-actions">
                <button className="submit-btn" onClick={submitSolution}>
                  <FaRocket /> Soumettre la Solution
                </button>
              </div>
            </div>

            <div className="preview-panel">
              <div className="panel-header">
                <span><FaEye /> Aperçu en Direct</span>
              </div>
              <div className="live-preview">
                {languages[selectedLanguage].supportsLivePreview ? (
                  <iframe
                    srcDoc={livePreview}
                    title="Aperçu"
                    sandbox="allow-scripts"
                    className="preview-frame"
                  />
                ) : (
                  <div className="no-preview">
                    <p>Aperçu non disponible pour {languages[selectedLanguage].name}</p>
                    <p>Utilisez la console pour voir les résultats</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results */}
          {showResults && (
            <div className="results-panel">
              <h3>📊 Résultats des Tests</h3>
              <div className="test-results">
                {testResults.map((result, index) => (
                  <div key={index} className={`test-item ${result.passed ? 'passed' : 'failed'}`}>
                    {result.passed ? <MdCheck /> : <MdClose />}
                    <span>Contient "{result.element}"</span>
                  </div>
                ))}
              </div>
              {testResults.every(r => r.passed) && (
                <div className="success-message">
                  🎉 Félicitations ! Vous avez réussi le défi !
                  <br />
                  +{currentChallenge.xpReward} XP ajoutés à votre profil
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CodeLive;
