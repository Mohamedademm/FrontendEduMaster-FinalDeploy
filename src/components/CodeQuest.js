import React, { useState, useEffect, useCallback, useRef } from 'react';
import '../Css/CodeQuest.css';

// Game levels with progressive difficulty
const gameLevels = {
  1: {
    id: 1,
    title: "Variables & Types",
    description: "Maîtrisez les bases des variables et types de données",
    icon: "📝",
    xpReward: 100,
    unlocked: true,
    challenges: [
      {
        id: 1,
        type: "code-completion",
        title: "Déclarer une variable",
        question: "Complétez le code pour déclarer une variable 'name' avec la valeur 'John':",
        codeTemplate: "let ___ = ___;",
        correctAnswer: "let name = 'John';",
        hint: "Utilisez 'let' pour déclarer et assignez la chaîne entre guillemets",
        explanation: "En JavaScript, 'let' permet de déclarer une variable. Les chaînes de caractères sont entourées de guillemets.",
        points: 50
      },
      {
        id: 2,
        type: "debug",
        title: "Corriger l'erreur",
        question: "Trouvez et corrigez l'erreur dans ce code:",
        codeTemplate: "const age = 25\nconsole.log('Age: ' + age;",
        correctAnswer: "const age = 25;\nconsole.log('Age: ' + age);",
        hint: "Il manque un point-virgule et une parenthèse",
        explanation: "Il faut fermer la parenthèse de console.log() et ajouter un point-virgule après la déclaration.",
        points: 75
      },
      {
        id: 3,
        type: "algorithm",
        title: "Calculer la somme",
        question: "Écrivez une fonction qui additionne deux nombres:",
        codeTemplate: "function add(a, b) {\n  return ___;\n}",
        correctAnswer: "function add(a, b) {\n  return a + b;\n}",
        hint: "Retournez la somme des paramètres a et b",
        explanation: "Une fonction d'addition simple retourne la somme des deux paramètres.",
        points: 100
      }
    ]
  },
  2: {
    id: 2,
    title: "Conditions & Boucles",
    description: "Apprenez les structures de contrôle",
    icon: "🔄",
    xpReward: 150,
    unlocked: false,
    challenges: [
      {
        id: 1,
        type: "code-completion",
        title: "Condition if/else",
        question: "Complétez la condition pour vérifier si un nombre est pair:",
        codeTemplate: "function isEven(num) {\n  if (num ___ 2 === 0) {\n    return true;\n  } else {\n    return false;\n  }\n}",
        correctAnswer: "function isEven(num) {\n  if (num % 2 === 0) {\n    return true;\n  } else {\n    return false;\n  }\n}",
        hint: "Utilisez l'opérateur modulo %",
        explanation: "L'opérateur % retourne le reste de la division. Un nombre pair a un reste de 0 quand divisé par 2.",
        points: 75
      },
      {
        id: 2,
        type: "algorithm",
        title: "Boucle for",
        question: "Créez une boucle qui affiche les nombres de 1 à 5:",
        codeTemplate: "for (let i = ___; i ___ ___; i___) {\n  console.log(i);\n}",
        correctAnswer: "for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}",
        hint: "Initialisez i à 1, condition i <= 5, incrémentez avec i++",
        explanation: "Une boucle for classique avec initialisation, condition et incrémentation.",
        points: 100
      },
      {
        id: 3,
        type: "debug",
        title: "Boucle infinie",
        question: "Corrigez cette boucle qui ne s'arrête jamais:",
        codeTemplate: "let count = 0;\nwhile (count < 5) {\n  console.log(count);\n}",
        correctAnswer: "let count = 0;\nwhile (count < 5) {\n  console.log(count);\n  count++;\n}",
        hint: "La variable count n'est jamais modifiée dans la boucle",
        explanation: "Il faut incrémenter count dans la boucle pour éviter une boucle infinie.",
        points: 125
      }
    ]
  },
  3: {
    id: 3,
    title: "Arrays & Objects",
    description: "Manipulez les structures de données",
    icon: "📦",
    xpReward: 200,
    unlocked: false,
    challenges: [
      {
        id: 1,
        type: "code-completion",
        title: "Accès aux éléments",
        question: "Accédez au premier élément du tableau:",
        codeTemplate: "const fruits = ['apple', 'banana', 'orange'];\nconst first = fruits[___];",
        correctAnswer: "const fruits = ['apple', 'banana', 'orange'];\nconst first = fruits[0];",
        hint: "Les indices des tableaux commencent à 0",
        explanation: "En JavaScript, les tableaux sont indexés à partir de 0.",
        points: 75
      },
      {
        id: 2,
        type: "algorithm",
        title: "Propriété d'objet",
        question: "Créez un objet person avec nom et âge, puis affichez le nom:",
        codeTemplate: "const person = {\n  ___: ___,\n  ___: ___\n};\nconsole.log(person.___);\n",
        correctAnswer: "const person = {\n  name: 'John',\n  age: 30\n};\nconsole.log(person.name);",
        hint: "Utilisez la notation objet avec propriétés nom et age",
        explanation: "Les objets JavaScript stockent des paires clé-valeur et on accède aux propriétés avec la notation point.",
        points: 100
      },
      {
        id: 3,
        type: "algorithm",
        title: "Méthode push",
        question: "Ajoutez 'grape' à la fin du tableau fruits:",
        codeTemplate: "const fruits = ['apple', 'banana'];\nfruits.___(___);",
        correctAnswer: "const fruits = ['apple', 'banana'];\nfruits.push('grape');",
        hint: "Utilisez la méthode push() pour ajouter un élément",
        explanation: "La méthode push() ajoute un élément à la fin d'un tableau.",
        points: 125
      }
    ]
  },
  4: {
    id: 4,
    title: "Functions & Scope",
    description: "Maîtrisez les fonctions et la portée",
    icon: "⚡",
    xpReward: 250,
    unlocked: false,
    challenges: [
      {
        id: 1,
        type: "code-completion",
        title: "Fonction fléchée",
        question: "Convertissez cette fonction en fonction fléchée:",
        codeTemplate: "const multiply = ___ => ___;",
        correctAnswer: "const multiply = (a, b) => a * b;",
        hint: "Syntaxe: (paramètres) => expression",
        explanation: "Les fonctions fléchées offrent une syntaxe plus concise pour les fonctions simples.",
        points: 100
      },
      {
        id: 2,
        type: "debug",
        title: "Portée des variables",
        question: "Corrigez l'erreur de portée:",
        codeTemplate: "function test() {\n  if (true) {\n    var x = 1;\n  }\n  console.log(x);\n}\ntest();",
        correctAnswer: "function test() {\n  let x;\n  if (true) {\n    x = 1;\n  }\n  console.log(x);\n}",
        hint: "Déclarez x dans la portée de la fonction",
        explanation: "var a une portée de fonction, mais il vaut mieux déclarer les variables dans la bonne portée.",
        points: 150
      },
      {
        id: 3,
        type: "algorithm",
        title: "Closure",
        question: "Créez une fonction qui retourne une fonction:",
        codeTemplate: "function createCounter() {\n  let count = 0;\n  return function() {\n    ___;\n    return count;\n  };\n}",
        correctAnswer: "function createCounter() {\n  let count = 0;\n  return function() {\n    count++;\n    return count;\n  };\n}",
        hint: "Incrémentez count dans la fonction retournée",
        explanation: "Une closure permet à une fonction d'accéder aux variables de sa portée englobante.",
        points: 200
      }
    ]
  },
  5: {
    id: 5,
    title: "Async & Promises",
    description: "Programmation asynchrone avancée",
    icon: "🚀",
    xpReward: 300,
    unlocked: false,
    challenges: [
      {
        id: 1,
        type: "code-completion",
        title: "Promise basique",
        question: "Créez une Promise qui se résout après 1 seconde:",
        codeTemplate: "const delay = new Promise((___, ___) => {\n  setTimeout(() => {\n    ___(\"Done!\");\n  }, 1000);\n});",
        correctAnswer: "const delay = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve(\"Done!\");\n  }, 1000);\n});",
        hint: "Utilisez resolve et reject comme paramètres",
        explanation: "Une Promise prend une fonction avec resolve et reject comme paramètres.",
        points: 150
      },
      {
        id: 2,
        type: "algorithm",
        title: "Async/Await",
        question: "Convertissez en async/await:",
        codeTemplate: "___ function fetchData() {\n  const response = ___ fetch('/api/data');\n  const data = ___ response.json();\n  return data;\n}",
        correctAnswer: "async function fetchData() {\n  const response = await fetch('/api/data');\n  const data = await response.json();\n  return data;\n}",
        hint: "Utilisez async avant function et await avant les Promises",
        explanation: "Async/await rend le code asynchrone plus lisible et plus facile à comprendre.",
        points: 200
      },
      {
        id: 3,
        type: "debug",
        title: "Gestion d'erreurs",
        question: "Ajoutez la gestion d'erreurs à cette fonction async:",
        codeTemplate: "async function getData() {\n  const response = await fetch('/api/data');\n  return response.json();\n}",
        correctAnswer: "async function getData() {\n  try {\n    const response = await fetch('/api/data');\n    return response.json();\n  } catch (error) {\n    console.error('Error:', error);\n    throw error;\n  }\n}",
        hint: "Utilisez try/catch pour gérer les erreurs",
        explanation: "Try/catch permet de gérer les erreurs dans les fonctions asynchrones.",
        points: 250
      }
    ]
  }
};

const CodeQuest = () => {
  // Game state
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [userCode, setUserCode] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  // User progress
  const [userProfile, setUserProfile] = useState({
    name: 'CodeQuester',
    level: 1,
    totalXP: 0,
    completedLevels: [],
    completedChallenges: [],
    badges: [],
    streak: 0,
    bestStreak: 0
  });
  
  // UI state
  const [darkMode, setDarkMode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [animating, setAnimating] = useState(false);
  
  // Refs
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const levelUpSoundRef = useRef(null);
  const codeEditorRef = useRef(null);

  // Load user progress from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('codeQuestProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUserProfile(profile);
      setCurrentLevel(profile.level);
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = useCallback((newProfile) => {
    localStorage.setItem('codeQuestProfile', JSON.stringify(newProfile));
    setUserProfile(newProfile);
  }, []);

  const playSound = useCallback((type) => {
    if (!soundEnabled) return;
    
    const soundMap = {
      'correct': correctSoundRef,
      'wrong': wrongSoundRef,
      'levelup': levelUpSoundRef
    };
    
    const soundRef = soundMap[type];
    if (soundRef?.current) {
      soundRef.current.currentTime = 0;
      soundRef.current.play().catch(e => console.log('Sound play failed:', e));
    }
  }, [soundEnabled]);

  const checkAnswer = useCallback(() => {
    const level = gameLevels[currentLevel];
    const challenge = level.challenges[currentChallenge];
    const normalizedUserCode = userCode.trim().replace(/\s+/g, ' ');
    const normalizedCorrectAnswer = challenge.correctAnswer.trim().replace(/\s+/g, ' ');
    
    if (normalizedUserCode === normalizedCorrectAnswer) {
      // Correct answer
      playSound('correct');
      setChallengeCompleted(true);
      setShowExplanation(true);
      
      // Update progress
      const newProfile = { ...userProfile };
      const challengeId = `${currentLevel}-${currentChallenge}`;
      
      if (!newProfile.completedChallenges.includes(challengeId)) {
        newProfile.completedChallenges.push(challengeId);
        newProfile.totalXP += challenge.points;
        newProfile.streak += 1;
        newProfile.bestStreak = Math.max(newProfile.bestStreak, newProfile.streak);
      }
      
      saveProgress(newProfile);
      
      return true;
    } else {
      // Wrong answer
      playSound('wrong');
      setAnimating(true);
      setTimeout(() => setAnimating(false), 500);
      
      // Reset streak
      const newProfile = { ...userProfile };
      newProfile.streak = 0;
      saveProgress(newProfile);
      
      return false;
    }
  }, [userCode, currentLevel, currentChallenge, userProfile, saveProgress, playSound]);

  const nextChallenge = useCallback(() => {
    const level = gameLevels[currentLevel];
    
    if (currentChallenge < level.challenges.length - 1) {
      // Next challenge in current level
      setCurrentChallenge(prev => prev + 1);
      setUserCode('');
      setChallengeCompleted(false);
      setShowExplanation(false);
      setShowHint(false);
    } else {
      // Level completed
      playSound('levelup');
      
      const newProfile = { ...userProfile };
      if (!newProfile.completedLevels.includes(currentLevel)) {
        newProfile.completedLevels.push(currentLevel);
        newProfile.totalXP += level.xpReward;
        
        // Add level badge
        newProfile.badges.push({
          id: `level-${currentLevel}`,
          name: level.title,
          icon: level.icon,
          earnedAt: new Date().toISOString()
        });
        
        // Unlock next level
        if (gameLevels[currentLevel + 1]) {
          gameLevels[currentLevel + 1].unlocked = true;
          newProfile.level = currentLevel + 1;
        }
      }
      
      saveProgress(newProfile);
      
      // Show level completion animation
      setAnimating(true);
      setTimeout(() => {
        setAnimating(false);
        if (gameLevels[currentLevel + 1] && gameLevels[currentLevel + 1].unlocked) {
          setCurrentLevel(prev => prev + 1);
          setCurrentChallenge(0);
          setUserCode('');
          setChallengeCompleted(false);
          setShowExplanation(false);
          setShowHint(false);
        } else {
          // Game completed
          setGameStarted(false);
        }
      }, 2000);
    }
  }, [currentLevel, currentChallenge, userProfile, saveProgress, playSound]);

  const resetChallenge = useCallback(() => {
    const level = gameLevels[currentLevel];
    const challenge = level.challenges[currentChallenge];
    setUserCode(challenge.codeTemplate);
    setChallengeCompleted(false);
    setShowExplanation(false);
    setShowHint(false);
  }, [currentLevel, currentChallenge]);

  const startGame = useCallback((levelId) => {
    if (!gameLevels[levelId].unlocked) return;
    
    setCurrentLevel(levelId);
    setCurrentChallenge(0);
    setGameStarted(true);
    const challenge = gameLevels[levelId].challenges[0];
    setUserCode(challenge.codeTemplate);
    setChallengeCompleted(false);
    setShowExplanation(false);
    setShowHint(false);
  }, []);

  const returnToMenu = useCallback(() => {
    setGameStarted(false);
    setCurrentLevel(userProfile.level);
    setCurrentChallenge(0);
    setUserCode('');
    setChallengeCompleted(false);
    setShowExplanation(false);
    setShowHint(false);
  }, [userProfile.level]);
  // Calculate user level based on XP
  useEffect(() => {
    const calculateLevel = (xp) => {
      return Math.floor(xp / 500) + 1;
    };
    
    const newUserLevel = calculateLevel(userProfile.totalXP);
    if (newUserLevel !== userProfile.level) {
      const newProfile = { ...userProfile, level: newUserLevel };
      saveProgress(newProfile);
    }
  }, [userProfile, saveProgress]);

  // Initialize code editor with template
  useEffect(() => {
    if (gameStarted && currentLevel && currentChallenge !== undefined) {
      const level = gameLevels[currentLevel];
      const challenge = level?.challenges[currentChallenge];
      if (challenge && !userCode) {
        setUserCode(challenge.codeTemplate);
      }
    }
  }, [gameStarted, currentLevel, currentChallenge, userCode]);

  // Render level selection screen
  if (!gameStarted) {
    return (
      <div className={`code-quest ${darkMode ? 'dark' : 'light'}`}>
        <div className="code-quest-background">
          <div className="code-quest-particles"></div>
        </div>
        
        {/* Header */}
        <div className="code-quest-header">
          <div className="code-quest-title">
            <h1>💻 CodeQuest</h1>
            <p>Maîtrisez la programmation niveau par niveau</p>
          </div>
          
          <div className="code-quest-controls">
            <button 
              onClick={() => setShowProfile(!showProfile)}
              className="control-btn"
              title="Profil"
            >
              👤
            </button>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="control-btn"
              title={darkMode ? 'Mode clair' : 'Mode sombre'}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="control-btn"
              title={soundEnabled ? 'Désactiver les sons' : 'Activer les sons'}
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>
          </div>
        </div>

        {/* User Stats */}
        <div className="user-stats">
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <div className="stat-value">{userProfile.totalXP}</div>
              <div className="stat-label">XP Total</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-info">
              <div className="stat-value">{userProfile.completedLevels.length}</div>
              <div className="stat-label">Niveaux Complétés</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-info">
              <div className="stat-value">{userProfile.streak}</div>
              <div className="stat-label">Série Actuelle</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎖️</div>
            <div className="stat-info">
              <div className="stat-value">{userProfile.badges.length}</div>
              <div className="stat-label">Badges</div>
            </div>
          </div>
        </div>

        {/* Profile Modal */}
        {showProfile && (
          <div className="profile-modal">
            <div className="profile-content">
              <div className="profile-header">
                <h3>👤 Profil de {userProfile.name}</h3>
                <button onClick={() => setShowProfile(false)}>✕</button>
              </div>
              <div className="profile-stats">
                <div className="profile-stat">
                  <span>Niveau:</span>
                  <span>{userProfile.level}</span>
                </div>
                <div className="profile-stat">
                  <span>XP Total:</span>
                  <span>{userProfile.totalXP}</span>
                </div>
                <div className="profile-stat">
                  <span>Meilleure Série:</span>
                  <span>{userProfile.bestStreak}</span>
                </div>
              </div>
              
              {userProfile.badges.length > 0 && (
                <div className="badges-section">
                  <h4>🏆 Badges Obtenus</h4>
                  <div className="badges-grid">
                    {userProfile.badges.map((badge, index) => (
                      <div key={index} className="badge-item">
                        <span className="badge-icon">{badge.icon}</span>
                        <span className="badge-name">{badge.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Levels Grid */}
        <div className="levels-grid">
          {Object.values(gameLevels).map((level) => (
            <div
              key={level.id}
              className={`level-card ${level.unlocked ? 'unlocked' : 'locked'} ${
                userProfile.completedLevels.includes(level.id) ? 'completed' : ''
              }`}
              onClick={() => level.unlocked && startGame(level.id)}
            >
              <div className="level-icon">{level.icon}</div>
              <div className="level-info">
                <h3>Niveau {level.id}</h3>
                <h4>{level.title}</h4>
                <p>{level.description}</p>
                <div className="level-reward">+{level.xpReward} XP</div>
              </div>
              
              {!level.unlocked && (
                <div className="level-lock">🔒</div>
              )}
              
              {userProfile.completedLevels.includes(level.id) && (
                <div className="level-completed">✅</div>
              )}
              
              <div className="level-progress">
                {level.challenges.length} défis
              </div>
            </div>
          ))}
        </div>

        {/* Audio elements */}
        <audio ref={correctSoundRef} preload="auto">
          <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QOAoUXrTp66hVFApGn+DyvmASBy2B0+/LdS0EKnfH8N2QOAoUXrTp66hVFApGn+DyvmASBy2B0+/LdS0EKk" type="audio/wav" />
        </audio>
        <audio ref={wrongSoundRef} preload="auto">
          <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QOAoUXrTp66hVFApGn+DyvmASBy2B0+/LdS0EKgSb7kNjAABHh" type="audio/wav" />
        </audio>
        <audio ref={levelUpSoundRef} preload="auto">
          <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QOAoUXrTp66hVFApGn+DyvmASBy2B0+/LdS0EKn" type="audio/wav" />
        </audio>
      </div>
    );
  }

  // Render game screen
  const level = gameLevels[currentLevel];
  const challenge = level.challenges[currentChallenge];
  const progress = ((currentChallenge + 1) / level.challenges.length) * 100;

  return (
    <div className={`code-quest ${darkMode ? 'dark' : 'light'} ${animating ? 'animating' : ''}`}>
      <div className="code-quest-background">
        <div className="code-quest-particles"></div>
      </div>
      
      {/* Game Header */}
      <div className="game-header">
        <div className="game-info">
          <h2>{level.icon} Niveau {level.id}: {level.title}</h2>
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <span className="challenge-counter">
              Défi {currentChallenge + 1} / {level.challenges.length}
            </span>
          </div>
        </div>
        
        <div className="game-stats">
          <div className="stat-box">
            <div className="stat-value text-blue-400">{userProfile.totalXP}</div>
            <div className="stat-label">XP</div>
          </div>
          <div className="stat-box">
            <div className="stat-value text-orange-400">{userProfile.streak}</div>
            <div className="stat-label">Série</div>
          </div>
        </div>
        
        <button onClick={returnToMenu} className="quit-btn">🏠</button>
      </div>

      {/* Challenge Section */}
      <div className="challenge-section">
        <div className="challenge-card">
          <div className="challenge-header">
            <h3>{challenge.title}</h3>
            <span className="challenge-type">{challenge.type}</span>
          </div>
          
          <div className="challenge-question">
            <p>{challenge.question}</p>
          </div>

          {/* Code Editor */}
          <div className="code-editor">
            <div className="editor-header">
              <span>📝 Éditeur de Code</span>
              <div className="editor-actions">
                <button 
                  onClick={() => setShowHint(!showHint)}
                  className="hint-btn"
                  title="Afficher l'indice"
                >
                  💡
                </button>
                <button 
                  onClick={resetChallenge}
                  className="reset-btn"
                  title="Réinitialiser"
                >
                  🔄
                </button>
              </div>
            </div>
            
            <textarea
              ref={codeEditorRef}
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              className="code-textarea"
              placeholder="Tapez votre code ici..."
              disabled={challengeCompleted}
            />
          </div>

          {/* Hint */}
          {showHint && (
            <div className="hint-card">
              <h4>💡 Indice</h4>
              <p>{challenge.hint}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="challenge-actions">
            {!challengeCompleted ? (
              <button 
                onClick={checkAnswer}
                className="check-btn"
              >
                ✅ Vérifier la Réponse
              </button>
            ) : (
              <button 
                onClick={nextChallenge}
                className="next-btn"
              >
                {currentChallenge < level.challenges.length - 1 
                  ? '➡️ Défi Suivant' 
                  : '🏆 Terminer le Niveau'
                }
              </button>
            )}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className="explanation-card">
              <h4>🎓 Explication</h4>
              <p>{challenge.explanation}</p>
              <div className="points-earned">
                +{challenge.points} points
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Level completion animation overlay */}
      {animating && currentChallenge === level.challenges.length - 1 && challengeCompleted && (
        <div className="level-complete-overlay">
          <div className="level-complete-animation">
            <div className="level-complete-icon">{level.icon}</div>
            <h2>🎉 Niveau {level.id} Terminé!</h2>
            <div className="xp-reward">+{level.xpReward} XP</div>
            {gameLevels[currentLevel + 1] && (
              <p>Niveau {currentLevel + 1} débloqué!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeQuest;
