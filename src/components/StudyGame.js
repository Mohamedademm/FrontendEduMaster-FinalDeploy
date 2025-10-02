import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import '../Css/StudyGame.css';

// Quiz data by category
const quizData = {
  webdev: {
    name: "Développement Web",
    icon: "🌐",
    color: "from-blue-500 to-cyan-500",
    questions: [
      {
        id: 1,
        question: "Quel est le rôle principal de React ?",
        options: [
          "Gestion de base de données",
          "Création d'interfaces utilisateur",
          "Gestion des serveurs",
          "Analyse de données"
        ],
        correct: 1,
        explanation: "React est une bibliothèque JavaScript pour créer des interfaces utilisateur interactives et réactives."
      },
      {
        id: 2,
        question: "Que signifie CSS ?",
        options: [
          "Computer Style Sheets",
          "Cascading Style Sheets",
          "Creative Style System",
          "Code Style Structure"
        ],
        correct: 1,
        explanation: "CSS (Cascading Style Sheets) est un langage de feuille de style utilisé pour décrire la présentation d'un document HTML."
      },
      {
        id: 3,
        question: "Quelle méthode HTTP est utilisée pour envoyer des données ?",
        options: ["GET", "POST", "PUT", "DELETE"],
        correct: 1,
        explanation: "POST est utilisé pour envoyer des données au serveur, comme lors de la soumission d'un formulaire."
      }
    ]
  },
  ai: {
    name: "Intelligence Artificielle",
    icon: "🤖",
    color: "from-purple-500 to-pink-500",
    questions: [
      {
        id: 1,
        question: "Qu'est-ce que le Machine Learning ?",
        options: [
          "Programmation manuelle d'algorithmes",
          "Apprentissage automatique à partir de données",
          "Interface utilisateur intelligente",
          "Système de base de données"
        ],
        correct: 1,
        explanation: "Le Machine Learning permet aux machines d'apprendre et de s'améliorer automatiquement à partir de l'expérience sans être explicitement programmées."
      },
      {
        id: 2,
        question: "Que signifie 'Deep Learning' ?",
        options: [
          "Apprentissage en profondeur avec réseaux de neurones",
          "Apprentissage lent et détaillé",
          "Analyse de données profondes",
          "Intelligence artificielle basique"
        ],
        correct: 0,
        explanation: "Le Deep Learning utilise des réseaux de neurones artificiels avec plusieurs couches pour modéliser et comprendre des données complexes."
      }
    ]
  },
  cybersec: {
    name: "Cybersécurité",
    icon: "🔒",
    color: "from-red-500 to-orange-500",
    questions: [
      {
        id: 1,
        question: "Qu'est-ce qu'une attaque par déni de service (DDoS) ?",
        options: [
          "Vol de données personnelles",
          "Surcharge d'un serveur pour le rendre indisponible",
          "Installation de logiciels malveillants",
          "Piratage de mots de passe"
        ],
        correct: 1,
        explanation: "Une attaque DDoS vise à rendre un service indisponible en le surchargeant avec un trafic excessif."
      },
      {
        id: 2,
        question: "Que signifie 'Phishing' ?",
        options: [
          "Pêche aux informations personnelles par tromperie",
          "Piratage de réseaux Wi-Fi",
          "Installation de virus",
          "Cryptage de données"
        ],
        correct: 0,
        explanation: "Le phishing est une technique de fraude visant à obtenir des informations confidentielles en se faisant passer pour un tiers de confiance."
      }
    ]
  }
};

const StudyGame = () => {
  const { t } = useTranslation();
  
  // Game state
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);
  
  // UI state
  const [darkMode, setDarkMode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [streak, setStreak] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [showHelp, setShowHelp] = useState(false);

  // Refs
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const timerRef = useRef(null);
  // Load best score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('studyGameBestScore');
    if (saved) setBestScore(parseInt(saved));
  }, []);

  const playSound = useCallback((type) => {
    if (!soundEnabled) return;
    
    if (type === 'correct' && correctSoundRef.current) {
      correctSoundRef.current.currentTime = 0;
      correctSoundRef.current.play().catch(e => console.log('Sound play failed:', e));
    } else if (type === 'wrong' && wrongSoundRef.current) {
      wrongSoundRef.current.currentTime = 0;
      wrongSoundRef.current.play().catch(e => console.log('Sound play failed:', e));
    }
  }, [soundEnabled]);

  const handleTimeUp = useCallback(() => {
    if (selectedAnswer === null) {
      setSelectedAnswer(-1); // Indicate timeout
      setStreak(0);
      playSound('wrong');
      setTimeout(() => {
        setShowExplanation(true);
      }, 500);
    }
  }, [selectedAnswer, playSound]);

  // Timer effect
  useEffect(() => {
    if (isTimerActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      handleTimeUp();
    }
    return () => clearTimeout(timerRef.current);
  }, [isTimerActive, timeLeft, handleTimeUp]);

  const startGame = (category) => {
    setSelectedCategory(category);
    setGameStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setStreak(0);
    setGameCompleted(false);
    setTimeLeft(30);
    setIsTimerActive(true);
  };

  const handleAnswerSelect = (answerIndex) => {
    if (selectedAnswer !== null || showExplanation) return;
    
    setSelectedAnswer(answerIndex);
    setIsTimerActive(false);
    
    const currentQuestion = quizData[selectedCategory].questions[currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correct;
    
    if (isCorrect) {
      const points = Math.max(1, Math.floor(timeLeft / 3)); // More points for faster answers
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      playSound('correct');
    } else {
      setStreak(0);
      playSound('wrong');
    }
    
    setTimeout(() => {
      setShowExplanation(true);
    }, 500);
  };

  const handleNextQuestion = () => {
    const questions = quizData[selectedCategory].questions;
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimeLeft(30);
      setIsTimerActive(true);
    } else {
      completeGame();
    }
  };
  const completeGame = () => {
    setGameCompleted(true);
    setIsTimerActive(false);
    
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('studyGameBestScore', score.toString());
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setSelectedCategory(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setStreak(0);
    setGameCompleted(false);
    setTimeLeft(30);
    setIsTimerActive(false);
  };

  const getScoreColor = () => {
    if (score >= 20) return 'text-green-400';
    if (score >= 10) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getTimerColor = () => {
    if (timeLeft > 20) return 'text-green-400';
    if (timeLeft > 10) return 'text-yellow-400';
    return 'text-red-400';
  };

  // Render category selection
  if (!gameStarted) {
    return (
      <div className={`study-game ${darkMode ? 'dark' : 'light'}`}>
        <div className="study-game-background">
          <div className="study-game-particles"></div>
        </div>
        
        {/* Header */}
        <div className="study-game-header">          <div className="study-game-title">
            <h1>🎓 StudyGame</h1>
            <p>{t('study_game_subtitle')}</p>
          </div>
          
          <div className="study-game-controls">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="control-btn"
              title={darkMode ? t('light_mode') : t('dark_mode')}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="control-btn"
              title={soundEnabled ? t('disable_sounds') : t('enable_sounds')}
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>
            <button 
              onClick={() => setShowHelp(!showHelp)}
              className="control-btn"
              title={t('help')}
            >
              ❓
            </button>
          </div>
        </div>        {/* Stats */}
        <div className="study-game-stats">
          <div className="stat-item">
            <span className="stat-label">{t('best_score')}</span>
            <span className="stat-value">{bestScore}</span>
          </div>
        </div>

        {/* Help Modal */}
        {showHelp && (
          <div className="help-modal">
            <div className="help-content">
              <h3>{t('how_to_play')}</h3>
              <ul>
                <li>🎯 {t('choose_category')}</li>
                <li>⏱️ {t('answer_quickly_points')}</li>
                <li>🔥 {t('maintain_streak')}</li>
                <li>📚 {t('read_explanations')}</li>
              </ul>
              <button onClick={() => setShowHelp(false)}>{t('close')}</button>
            </div>
          </div>
        )}

        {/* Category Selection */}
        <div className="categories-grid">
          {Object.entries(quizData).map(([key, category]) => (
            <div
              key={key}
              className={`category-card bg-gradient-to-br ${category.color}`}
              onClick={() => startGame(key)}
            >
              <div className="category-icon">{category.icon}</div>
              <h3>{category.name}</h3>
              <p>{category.questions.length} questions</p>
              <div className="category-overlay">
                <span>Commencer</span>
              </div>
            </div>
          ))}
        </div>

        {/* Audio elements */}
        <audio ref={correctSoundRef} preload="auto">
          <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QOAoUXrTp66hVFApGn+DyvmASBy2B0+/LdS0EKkWb7kNjAABHhjRJkVOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5A=" type="audio/wav" />
        </audio>
        <audio ref={wrongSoundRef} preload="auto">
          <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QOAoUXrTp66hVFApGn+DyvmASBy2B0+/LdS0EKgSb7kNjAABHhjRJkVOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5BTkFOQU5A=" type="audio/wav" />
        </audio>
      </div>
    );
  }

  // Render game completed screen
  if (gameCompleted) {
    const totalQuestions = quizData[selectedCategory].questions.length;
    const percentage = Math.round((score / (totalQuestions * 5)) * 100); // Max 5 points per question
    
    return (
      <div className={`study-game ${darkMode ? 'dark' : 'light'}`}>
        <div className="study-game-background">
          <div className="study-game-particles"></div>
        </div>
        
        <div className="game-completed">
          <div className="completion-card">
            <div className="completion-icon">
              {percentage >= 80 ? '🏆' : percentage >= 60 ? '🥈' : percentage >= 40 ? '🥉' : '💪'}
            </div>            <h2>{t('game_completed')}</h2>
            <div className="final-stats">
              <div className="final-stat">
                <span className="final-stat-value">{score}</span>
                <span className="final-stat-label">{t('points')}</span>
              </div>
              <div className="final-stat">
                <span className="final-stat-value">{percentage}%</span>
                <span className="final-stat-label">{t('accuracy')}</span>
              </div>
              {score > bestScore && (
                <div className="new-record">🎉 {t('new_record')}</div>
              )}
            </div>
            <div className="completion-actions">
              <button onClick={resetGame} className="play-again-btn">
                🔄 {t('play_again')}
              </button>
              <button onClick={() => setSelectedCategory(null)} className="change-category-btn">
                📚 {t('change_category')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render game screen
  const currentQuestion = quizData[selectedCategory].questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizData[selectedCategory].questions.length) * 100;

  return (
    <div className={`study-game ${darkMode ? 'dark' : 'light'}`}>
      <div className="study-game-background">
        <div className="study-game-particles"></div>
      </div>
      
      {/* Game Header */}
      <div className="game-header">
        <div className="game-info">
          <h2>{quizData[selectedCategory].name}</h2>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="question-counter">
            {currentQuestionIndex + 1} / {quizData[selectedCategory].questions.length}
          </span>
        </div>
        
        <div className="game-stats">
          <div className="stat-box">
            <div className={`stat-value ${getScoreColor()}`}>{score}</div>
            <div className="stat-label">Score</div>
          </div>
          <div className="stat-box">
            <div className={`stat-value ${getTimerColor()}`}>{timeLeft}</div>
            <div className="stat-label">Temps</div>
          </div>
          <div className="stat-box">
            <div className="stat-value text-orange-400">{streak}</div>
            <div className="stat-label">Série</div>
          </div>
        </div>
        
        <button onClick={resetGame} className="quit-btn">❌</button>
      </div>

      {/* Question Section */}
      <div className="question-section">
        <div className="question-card">
          <h3>{currentQuestion.question}</h3>
          
          <div className="options-grid">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`option-btn ${
                  selectedAnswer === index 
                    ? (index === currentQuestion.correct ? 'correct' : 'wrong')
                    : ''
                } ${
                  showExplanation && index === currentQuestion.correct ? 'correct' : ''
                }`}
                onClick={() => handleAnswerSelect(index)}
                disabled={selectedAnswer !== null}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option}</span>
                {showExplanation && index === currentQuestion.correct && (
                  <span className="option-icon">✓</span>
                )}
                {selectedAnswer === index && index !== currentQuestion.correct && (
                  <span className="option-icon">✗</span>
                )}
              </button>
            ))}
          </div>

          {showExplanation && (
            <div className="explanation-card">
              <h4>💡 Explication</h4>
              <p>{currentQuestion.explanation}</p>
              <button onClick={handleNextQuestion} className="next-btn">
                {currentQuestionIndex < quizData[selectedCategory].questions.length - 1 
                  ? '➡️ Question Suivante' 
                  : '🏁 Terminer'
                }
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyGame;
