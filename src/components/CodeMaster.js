import React, { useState, useEffect, useCallback } from 'react';
import { FaLock, FaUnlock, FaStar, FaTrophy, FaCode, FaBug, FaLightbulb, FaRocket, FaGem, FaCrown } from 'react-icons/fa';
import axios from 'axios';
import '../Css/CodeMaster.css';

const CodeMaster = () => {
  const [userProfile, setUserProfile] = useState({
    name: 'Code Warrior',
    totalXP: 0,
    completedLevels: 0,
    badges: [],
    streak: 0,
    rank: 'Beginner'
  });
  const [gameData, setGameData] = useState({
    unlockedLevels: [1],
    levelProgress: {},
    achievements: []
  });
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [userCode, setUserCode] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [showLevelUp, setShowLevelUp] = useState(false);

  // Game levels with progressive difficulty
  const levels = [
    {
      id: 1,
      title: "Variables & Data Types",
      description: "Master the basics of programming variables",
      difficulty: "Beginner",
      xpReward: 50,
      icon: FaCode,
      color: "from-blue-500 to-purple-600",
      challenges: [
        {
          id: 1,
          title: "Create Your First Variable",
          description: "Declare a variable named 'message' and assign it the value 'Hello World!'",
          starterCode: "// Create a variable named 'message'\n// Assign it the value 'Hello World!'\n",
          solution: "let message = 'Hello World!';",
          hint: "Use 'let' keyword to declare a variable",
          xp: 20
        },
        {
          id: 2,
          title: "Number Operations",
          description: "Create two variables 'a' and 'b', then calculate their sum",
          starterCode: "// Create variables a = 10 and b = 5\n// Calculate their sum in a variable named 'sum'\n",
          solution: "let a = 10;\nlet b = 5;\nlet sum = a + b;",
          hint: "Use arithmetic operators to perform calculations",
          xp: 25
        },
        {
          id: 3,
          title: "String Manipulation",
          description: "Combine firstName and lastName into a fullName",
          starterCode: "let firstName = 'John';\nlet lastName = 'Doe';\n// Create fullName by combining them\n",
          solution: "let firstName = 'John';\nlet lastName = 'Doe';\nlet fullName = firstName + ' ' + lastName;",
          hint: "Use the + operator to concatenate strings",
          xp: 30
        }
      ]
    },
    {
      id: 2,
      title: "Functions & Logic",
      description: "Learn to create and use functions",
      difficulty: "Intermediate",
      xpReward: 75,
      icon: FaLightbulb,
      color: "from-green-500 to-teal-600",
      challenges: [
        {
          id: 1,
          title: "Your First Function",
          description: "Create a function that greets a person by name",
          starterCode: "// Create a function named 'greet' that takes a 'name' parameter\n// Return 'Hello, ' + name + '!'\n",
          solution: "function greet(name) {\n  return 'Hello, ' + name + '!';\n}",
          hint: "Use the 'function' keyword to declare a function",
          xp: 35
        },
        {
          id: 2,
          title: "Conditional Logic",
          description: "Create a function that checks if a number is positive or negative",
          starterCode: "// Create function 'checkNumber' that takes a number\n// Return 'positive' if > 0, 'negative' if < 0, 'zero' if = 0\n",
          solution: "function checkNumber(num) {\n  if (num > 0) return 'positive';\n  else if (num < 0) return 'negative';\n  else return 'zero';\n}",
          hint: "Use if-else statements for conditional logic",
          xp: 40
        }
      ]
    },
    {
      id: 3,
      title: "Arrays & Loops",
      description: "Master data structures and iteration",
      difficulty: "Intermediate",
      xpReward: 100,
      icon: FaBug,
      color: "from-orange-500 to-red-600",
      challenges: [
        {
          id: 1,
          title: "Array Basics",
          description: "Create an array of your favorite colors and access the first element",
          starterCode: "// Create an array named 'colors' with 3 favorite colors\n// Store the first color in a variable named 'firstColor'\n",
          solution: "let colors = ['blue', 'green', 'red'];\nlet firstColor = colors[0];",
          hint: "Arrays use square brackets and are zero-indexed",
          xp: 45
        },
        {
          id: 2,
          title: "Loop Through Array",
          description: "Use a for loop to print all elements in an array",
          starterCode: "let fruits = ['apple', 'banana', 'orange'];\n// Use a for loop to console.log each fruit\n",
          solution: "let fruits = ['apple', 'banana', 'orange'];\nfor (let i = 0; i < fruits.length; i++) {\n  console.log(fruits[i]);\n}",
          hint: "Use a for loop with array.length to iterate through all elements",
          xp: 55
        }
      ]
    },
    {
      id: 4,
      title: "Objects & Methods",
      description: "Work with objects and their methods",
      difficulty: "Advanced",
      xpReward: 125,
      icon: FaGem,
      color: "from-purple-500 to-pink-600",
      challenges: [
        {
          id: 1,
          title: "Create an Object",
          description: "Create a person object with name, age, and a greet method",
          starterCode: "// Create a person object with properties: name, age\n// Add a greet method that returns 'Hi, I am ' + this.name\n",
          solution: "let person = {\n  name: 'Alice',\n  age: 25,\n  greet: function() {\n    return 'Hi, I am ' + this.name;\n  }\n};",
          hint: "Objects use curly braces and methods are functions inside objects",
          xp: 60
        }
      ]
    },
    {
      id: 5,
      title: "Advanced Algorithms",
      description: "Master complex problem-solving",
      difficulty: "Expert",
      xpReward: 200,
      icon: FaCrown,
      color: "from-yellow-500 to-orange-600",
      challenges: [
        {
          id: 1,
          title: "Fibonacci Sequence",
          description: "Create a function that generates the nth Fibonacci number",
          starterCode: "// Create function 'fibonacci' that takes number n\n// Return the nth Fibonacci number\n",
          solution: "function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}",
          hint: "Fibonacci: F(n) = F(n-1) + F(n-2), with F(0)=0, F(1)=1",
          xp: 100
        }
      ]
    }
  ];

  const badges = [
    { id: 'first_level', name: 'First Steps', icon: FaRocket, condition: (profile) => profile.completedLevels >= 1 },
    { id: 'problem_solver', name: 'Problem Solver', icon: FaBug, condition: (profile) => profile.completedLevels >= 3 },
    { id: 'code_master', name: 'Code Master', icon: FaCrown, condition: (profile) => profile.completedLevels >= 5 },
    { id: 'xp_collector', name: 'XP Collector', icon: FaStar, condition: (profile) => profile.totalXP >= 500 }
  ];

  const ranks = [
    { name: 'Beginner', minXP: 0, color: 'text-gray-500' },
    { name: 'Apprentice', minXP: 100, color: 'text-green-500' },
    { name: 'Developer', minXP: 300, color: 'text-blue-500' },
    { name: 'Expert', minXP: 600, color: 'text-purple-500' },
    { name: 'Master', minXP: 1000, color: 'text-yellow-500' }
  ];
  useEffect(() => {
    loadGameData();
  }, []);

  const loadGameData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Si pas de token, utiliser localStorage comme fallback
        const savedData = localStorage.getItem('codeMasterData');
        const savedProfile = localStorage.getItem('codeMasterProfile');
        
        if (savedData) {
          setGameData(JSON.parse(savedData));
        }
        if (savedProfile) {
          setUserProfile(JSON.parse(savedProfile));
        }
        return;
      }

      // Charger depuis l'API
      const response = await axios.get('http://localhost:3000/api/games/CodeMaster/progress', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        const progress = response.data.data;
        
        // Convertir les données du backend vers le format frontend
        setUserProfile({
          name: progress.profile.name || 'Code Warrior',
          totalXP: progress.profile.totalXP || 0,
          completedLevels: progress.profile.completedLevels || 0,
          badges: progress.profile.badges || [],
          streak: progress.profile.streak || 0,
          rank: progress.profile.rank || 'Beginner'
        });

        setGameData({
          unlockedLevels: progress.gameData.unlockedLevels || [1],
          levelProgress: progress.gameData.levelProgress || {},
          achievements: progress.gameData.achievements || []
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      // Fallback vers localStorage en cas d'erreur
      const savedData = localStorage.getItem('codeMasterData');
      const savedProfile = localStorage.getItem('codeMasterProfile');
      
      if (savedData) {
        setGameData(JSON.parse(savedData));
      }
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      }
    }
  };

  const getRank = (xp) => {
    for (let i = ranks.length - 1; i >= 0; i--) {
      if (xp >= ranks[i].minXP) {
        return ranks[i];
      }
    }
    return ranks[0];
  };

  const checkBadges = (newProfile) => {
    const newBadges = badges.filter(badge => 
      badge.condition(newProfile) && !newProfile.badges.includes(badge.id)
    );
    return newBadges;
  };

  const startChallenge = (levelId, challengeId) => {
    const level = levels.find(l => l.id === levelId);
    const challenge = level.challenges.find(c => c.id === challengeId);
    setActiveChallenge({ ...challenge, levelId });
    setUserCode(challenge.starterCode);
    setShowResult(false);
  };

  const submitCode = () => {
    if (!activeChallenge) return;

    const isCorrect = userCode.trim().includes(activeChallenge.solution.trim());
    const result = {
      correct: isCorrect,
      earnedXP: isCorrect ? activeChallenge.xp : 0,
      feedback: isCorrect ? 
        "🎉 Excellent! You solved the challenge!" : 
        "❌ Not quite right. Check the hint and try again!"
    };

    if (isCorrect) {
      completeChallenge(activeChallenge.levelId, activeChallenge.id, activeChallenge.xp);
    }

    setCurrentResult(result);
    setShowResult(true);
  };
  const completeChallenge = async (levelId, challengeId, xpGained) => {
    try {
      const token = localStorage.getItem('token');
      
      // Préparer les données locales d'abord
      const newGameData = { ...gameData };
      const levelKey = `level_${levelId}`;
      
      if (!newGameData.levelProgress[levelKey]) {
        newGameData.levelProgress[levelKey] = { completedChallenges: [] };
      }
      
      if (!newGameData.levelProgress[levelKey].completedChallenges.includes(challengeId)) {
        newGameData.levelProgress[levelKey].completedChallenges.push(challengeId);
      }

      const level = levels.find(l => l.id === levelId);
      const allChallengesCompleted = newGameData.levelProgress[levelKey].completedChallenges.length === level.challenges.length;
      let levelCompleted = false;

      if (allChallengesCompleted && !newGameData.levelProgress[levelKey].completed) {
        newGameData.levelProgress[levelKey].completed = true;
        levelCompleted = true;
        
        // Unlock next level
        const nextLevelId = levelId + 1;
        if (nextLevelId <= levels.length && !newGameData.unlockedLevels.includes(nextLevelId)) {
          newGameData.unlockedLevels.push(nextLevelId);
          setShowLevelUp(true);
          setTimeout(() => setShowLevelUp(false), 3000);
        }
      }

      const newProfile = {
        ...userProfile,
        totalXP: userProfile.totalXP + xpGained,
        completedLevels: Object.values(newGameData.levelProgress).filter(p => p.completed).length,
        streak: userProfile.streak + 1
      };

      const newRank = getRank(newProfile.totalXP);
      newProfile.rank = newRank.name;

      const newBadges = checkBadges(newProfile);
      if (newBadges.length > 0) {
        newProfile.badges = [...newProfile.badges, ...newBadges.map(b => b.id)];
      }

      // Mettre à jour l'état local
      setGameData(newGameData);
      setUserProfile(newProfile);

      // Sauvegarder dans l'API si connecté
      if (token) {
        await axios.post('http://localhost:3000/api/games/CodeMaster/complete-challenge', {
          xpGained,
          levelCompleted,
          challengeId,
          levelId,
          sessionDuration: 5, // Vous pouvez tracker le temps réel
          performance: xpGained
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } else {
        // Fallback vers localStorage si pas connecté
        localStorage.setItem('codeMasterData', JSON.stringify(newGameData));
        localStorage.setItem('codeMasterProfile', JSON.stringify(newProfile));
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du défi:', error);
      // En cas d'erreur API, sauvegarder localement
      localStorage.setItem('codeMasterData', JSON.stringify(gameData));
      localStorage.setItem('codeMasterProfile', JSON.stringify(userProfile));
    }
  };

  const getLevelProgress = (levelId) => {
    const levelKey = `level_${levelId}`;
    const progress = gameData.levelProgress[levelKey];
    if (!progress) return 0;
    
    const level = levels.find(l => l.id === levelId);
    return (progress.completedChallenges.length / level.challenges.length) * 100;
  };

  const isLevelUnlocked = (levelId) => {
    return gameData.unlockedLevels.includes(levelId);
  };

  const isChallengeCompleted = (levelId, challengeId) => {
    const levelKey = `level_${levelId}`;
    const progress = gameData.levelProgress[levelKey];
    return progress && progress.completedChallenges.includes(challengeId);
  };
  // Function to save progress to backend
  const saveProgressToBackend = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return; // Skip if not logged in

      await axios.post('http://localhost:3000/api/games/CodeMaster/progress', {
        profile: userProfile,
        gameData: gameData,
        sessionStats: {
          totalSessions: 1,
          totalPlayTime: 10, // Track actual play time
          averageSessionTime: 10,
          lastSessionDuration: 10
        }
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Progrès sauvegardés avec succès');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  }, [userProfile, gameData]);
  // Auto-save progress every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      saveProgressToBackend();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [userProfile, gameData, saveProgressToBackend]);

  if (activeChallenge) {
    return (
      <div className="code-master-container">
        <div className="challenge-view">
          <div className="challenge-header">
            <button 
              className="back-btn"
              onClick={() => setActiveChallenge(null)}
            >
              ← Back to Levels
            </button>
            <div className="challenge-info">
              <h2>{activeChallenge.title}</h2>
              <p>{activeChallenge.description}</p>
              <div className="challenge-xp">
                <FaStar /> {activeChallenge.xp} XP
              </div>
            </div>
          </div>

          <div className="challenge-workspace">
            <div className="code-editor">
              <div className="editor-header">
                <span>Code Editor</span>
                <button className="hint-btn" title={activeChallenge.hint}>
                  <FaLightbulb /> Hint
                </button>
              </div>
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                className="code-textarea"
                placeholder="Write your code here..."
              />
              <div className="editor-actions">
                <button className="submit-btn" onClick={submitCode}>
                  <FaRocket /> Submit Code
                </button>
              </div>
            </div>

            {showResult && (
              <div className={`result-panel ${currentResult.correct ? 'success' : 'error'}`}>
                <div className="result-content">
                  <h3>{currentResult.feedback}</h3>
                  {currentResult.correct && (
                    <div className="xp-gained">
                      <FaStar /> +{currentResult.earnedXP} XP
                    </div>
                  )}
                  {!currentResult.correct && (
                    <div className="hint-text">
                      💡 Hint: {activeChallenge.hint}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {showLevelUp && (
          <div className="level-up-modal">
            <div className="level-up-content">
              <FaTrophy className="level-up-icon" />
              <h2>Level Completed!</h2>
              <p>You've unlocked the next level!</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="code-master-container">
      {/* Header */}
      <div className="game-header">
        <div className="header-content">
          <div className="game-title">
            <FaCode className="title-icon" />
            <h1>CodeMaster</h1>
            <span className="subtitle">Progressive Coding Adventure</span>
          </div>

          <div className="user-stats">
            <div className="stat-item">
              <FaStar />
              <span>{userProfile.totalXP} XP</span>
            </div>
            <div className="stat-item">
              <FaTrophy />
              <span>Level {userProfile.completedLevels + 1}</span>
            </div>
            <div className={`rank-badge ${getRank(userProfile.totalXP).color}`}>
              {userProfile.rank}
            </div>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="user-profile">
        <div className="profile-card">
          <div className="profile-avatar">
            <FaCode />
          </div>
          <div className="profile-info">
            <h3>{userProfile.name}</h3>
            <p className={getRank(userProfile.totalXP).color}>
              {userProfile.rank}
            </p>
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-value">{userProfile.totalXP}</span>
                <span className="stat-label">Total XP</span>
              </div>
              <div className="stat">
                <span className="stat-value">{userProfile.completedLevels}</span>
                <span className="stat-label">Levels</span>
              </div>
              <div className="stat">
                <span className="stat-value">{userProfile.streak}</span>
                <span className="stat-label">Streak</span>
              </div>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="badges-section">
          <h4>Achievements</h4>
          <div className="badges-grid">
            {badges.map(badge => {
              const earned = userProfile.badges.includes(badge.id);
              const BadgeIcon = badge.icon;
              return (
                <div key={badge.id} className={`badge ${earned ? 'earned' : 'locked'}`}>
                  <BadgeIcon />
                  <span>{badge.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Levels Grid */}
      <div className="levels-section">
        <h2>Coding Levels</h2>
        <div className="levels-grid">
          {levels.map(level => {
            const LevelIcon = level.icon;
            const unlocked = isLevelUnlocked(level.id);
            const progress = getLevelProgress(level.id);
            const completed = progress === 100;

            return (
              <div key={level.id} className={`level-card ${unlocked ? 'unlocked' : 'locked'} ${completed ? 'completed' : ''}`}>
                <div className={`level-background bg-gradient-to-br ${level.color}`}>
                  <div className="level-lock">
                    {unlocked ? <FaUnlock /> : <FaLock />}
                  </div>
                </div>

                <div className="level-content">
                  <div className="level-icon">
                    <LevelIcon />
                  </div>
                  <h3>{level.title}</h3>
                  <p>{level.description}</p>
                  <div className="level-meta">
                    <span className={`difficulty ${level.difficulty.toLowerCase()}`}>
                      {level.difficulty}
                    </span>
                    <span className="xp-reward">
                      <FaStar /> {level.xpReward} XP
                    </span>
                  </div>

                  {unlocked && (
                    <>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="level-challenges">
                        {level.challenges.map(challenge => (
                          <button
                            key={challenge.id}
                            className={`challenge-btn ${isChallengeCompleted(level.id, challenge.id) ? 'completed' : ''}`}
                            onClick={() => startChallenge(level.id, challenge.id)}
                          >
                            {isChallengeCompleted(level.id, challenge.id) ? (
                              <FaStar />
                            ) : (
                              <FaCode />
                            )}
                            {challenge.title}
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  {!unlocked && (
                    <div className="locked-message">
                      Complete previous levels to unlock
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CodeMaster;
