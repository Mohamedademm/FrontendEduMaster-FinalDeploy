import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  Play, Pause, RotateCcw, Trophy, Target, Clock, Zap, 
  TrendingUp, Award, Activity, BarChart3, Moon, Sun, Keyboard,
  Volume2, VolumeX, Flame, Star, ChevronUp, ChevronDown
} from "lucide-react";
import '../Css/TypingApp.css';

// Textes d'entraînement plus variés et professionnels
const textLibrary = {
  beginner: [
    "Le développement web moderne utilise des frameworks comme React et Vue. Ces outils permettent de créer des interfaces utilisateur interactives et performantes.",
    "La programmation orientée objet est un paradigme fondamental. Elle permet d'organiser le code en classes et objets pour une meilleure maintenance.",
    "Les bases de données relationnelles stockent les informations de manière structurée. SQL est le langage standard pour interroger ces données."
  ],
  intermediate: [
    "L'architecture microservices décompose les applications en services indépendants. Cette approche améliore la scalabilité et la maintenabilité des systèmes complexes.",
    "Le machine learning transforme l'analyse de données grâce aux algorithmes d'apprentissage automatique. Ces technologies permettent de découvrir des patterns cachés dans de vastes ensembles de données.",
    "La cybersécurité est devenue cruciale avec la digitalisation croissante. Les entreprises doivent implémenter des stratégies de sécurité multicouches pour protéger leurs actifs numériques."
  ],
  advanced: [
    "L'intelligence artificielle générative révolutionne la création de contenu à travers des modèles de langage sophistiqués utilisant l'architecture transformer et l'attention multi-têtes pour générer du texte cohérent et contextuel.",
    "Les systèmes distribués modernes exploitent des architectures événementielles asynchrones avec des patterns CQRS et Event Sourcing pour optimiser les performances et la résilience des applications à grande échelle.",
    "L'informatique quantique exploite les propriétés de superposition et d'intrication pour résoudre des problèmes computationnellement complexes, promettant des avancées révolutionnaires en cryptographie et optimisation."
  ],
  code: [
    'const fibonacci = (n) => n <= 1 ? n : fibonacci(n-1) + fibonacci(n-2);',
    'function debounce(func, delay) { let timeout; return (...args) => { clearTimeout(timeout); timeout = setTimeout(() => func.apply(this, args), delay); }; }',
    'const users = await fetch("/api/users").then(res => res.json()).catch(err => console.error("Error:", err));'
  ]
};

// Layouts de clavier améliorés
const layouts = {
  AZERTY: {
    normal: [
      ["&", "é", "\"", "'", "(", "-", "è", "_", "ç", "à", ")", "="],
      ["a", "z", "e", "r", "t", "y", "u", "i", "o", "p", "^", "$"],
      ["q", "s", "d", "f", "g", "h", "j", "k", "l", "m", "ù", "*"],
      ["⇧", "w", "x", "c", "v", "b", "n", ",", ";", ":", "!"],
      ["Space"]
    ],
    shift: [
      ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "°", "+"],
      ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P", "¨", "£"],
      ["Q", "S", "D", "F", "G", "H", "J", "K", "L", "M", "%", "µ"],
      ["⇧", "W", "X", "C", "V", "B", "N", "?", ".", "/", "§"],
      ["Space"]
    ]
  },
  QWERTY: {
    normal: [
      ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
      ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\\\"],
      ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"],
      ["⇧", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
      ["Space"]
    ],
    shift: [
      ["~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+"],
      ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "{", "}", "|"],
      ["A", "S", "D", "F", "G", "H", "J", "K", "L", ":", "\""],
      ["⇧", "Z", "X", "C", "V", "B", "N", "M", "<", ">", "?"],
      ["Space"]
    ]
  }
};

// Couleurs des doigts avec gradients
const fingerColors = {
  thumb: "from-emerald-400 to-emerald-600",
  indexLeft: "from-blue-400 to-blue-600",
  middleLeft: "from-purple-400 to-purple-600",
  ringLeft: "from-amber-400 to-amber-600",
  pinkyLeft: "from-red-400 to-red-600",
  indexRight: "from-cyan-400 to-cyan-600",
  middleRight: "from-pink-400 to-pink-600",
  ringRight: "from-orange-400 to-orange-600",
  pinkyRight: "from-rose-400 to-rose-600",
};

// Mappage amélioré des touches aux doigts
const keyToFinger = {
  // AZERTY - Left Hand
  "&": "pinkyLeft", "1": "pinkyLeft", "é": "pinkyLeft", "2": "ringLeft", "\"": "middleLeft", "3": "middleLeft", "'": "indexLeft", "4": "indexLeft", "(": "indexLeft", "5": "indexLeft",
  a: "pinkyLeft", z: "ringLeft", e: "middleLeft", r: "indexLeft", t: "indexLeft",
  q: "pinkyLeft", s: "ringLeft", d: "middleLeft", f: "indexLeft", g: "indexLeft",
  w: "pinkyLeft", x: "ringLeft", c: "middleLeft", v: "indexLeft", b: "indexLeft",

  // AZERTY - Right Hand
  "-": "indexRight", "6": "indexRight", "è": "middleRight", "7": "middleRight", "_": "ringRight", "8": "ringRight", "ç": "pinkyRight", "9": "pinkyRight", "à": "pinkyRight", "0": "pinkyRight",
  y: "indexRight", u: "indexRight", i: "middleRight", o: "ringRight", p: "pinkyRight",
  h: "indexRight", j: "indexRight", k: "middleRight", l: "ringRight", m: "pinkyRight",
  n: "indexRight",
  
  // AZERTY punctuation/symbols (Right Hand primarily)
  ")": "pinkyRight", "=": "pinkyRight",
  "^": "pinkyRight", "$": "pinkyRight",
  ù: "pinkyRight", "*": "pinkyRight",
  ",": "middleRight", ";": "ringRight", ":": "pinkyRight", "!": "pinkyRight",

  // QWERTY specific (some overlap with AZERTY symbols but fingerings might differ)
  // Top row numbers for QWERTY (standard touch typing)
  // `~`: "pinkyLeft", 1: "pinkyLeft", 2: "ringLeft", 3: "middleLeft", 4: "indexLeft", 5: "indexLeft",
  // 6: "indexRight", 7: "indexRight", 8: "middleRight", 9: "ringRight", 0: "pinkyRight",
  // '-': "pinkyRight", '=': "pinkyRight",

  // QWERTY letter rows (many letters are same as AZERTY, but fingerings for surrounding keys differ)
  // q: "pinkyLeft", w: "ringLeft", e: "middleLeft", r: "indexLeft", t: "indexLeft",
  // y: "indexRight", u: "indexRight", i: "middleRight", o: "ringRight", p: "pinkyRight",
  // a: "pinkyLeft", s: "ringLeft", d: "middleLeft", f: "indexLeft", g: "indexLeft",
  // h: "indexRight", j: "indexRight", k: "middleRight", l: "ringRight",
  // z: "pinkyLeft", x: "ringLeft", c: "middleLeft", v: "indexLeft", b: "indexLeft",
  // n: "indexRight", m: "indexRight",

  // QWERTY symbols
  "[": "pinkyRight", "]": "pinkyRight", "\\\\": "pinkyRight",
  // ';': "pinkyRight", // QWERTY ';'
  // ''': "pinkyRight", // QWERTY '''
  // ',': "middleRight", // QWERTY ',',
  ".": "ringRight",   // QWERTY '.'
  "/": "pinkyRight",  // QWERTY '/'
  
  // Common
  " ": "thumb"
};

const TypingApp = () => {
  const [text, setText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputHistory, setInputHistory] = useState([]);
  const [errorCount, setErrorCount] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [layout, setLayout] = useState("AZERTY");
  const [shift, setShift] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [difficulty, setDifficulty] = useState("beginner");
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [bestWPM, setBestWPM] = useState(0);
  const [bestAccuracy, setBestAccuracy] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [streak, setStreak] = useState(0);
  const [consistencyScore, setConsistencyScore] = useState(100);
  const [wpmHistory, setWpmHistory] = useState([]);
  const [showStats, setShowStats] = useState(false);
  
  const textRef = useRef(null);
  const intervalRef = useRef(null);
  const correctSoundRef = useRef(null);
  const errorSoundRef = useRef(null);

  // Preload audio files
  useEffect(() => {
    correctSoundRef.current = new Audio('/sounds/correct.mp3');
    correctSoundRef.current.volume = 0.3;
    // No need to call .load() explicitly for modern browsers with new Audio()
    
    errorSoundRef.current = new Audio('/sounds/error.mp3');
    errorSoundRef.current.volume = 0.3;
    // No need to call .load() explicitly
  }, []);

  const playSound = useCallback((type) => {
    if (!soundEnabled) return;
    if (type === 'correct' && correctSoundRef.current) {
      correctSoundRef.current.currentTime = 0;
      correctSoundRef.current.play().catch(error => console.error("Error playing correct sound:", error));
    } else if (type === 'error' && errorSoundRef.current) {
      errorSoundRef.current.currentTime = 0;
      errorSoundRef.current.play().catch(error => console.error("Error playing error sound:", error));
    }
  }, [soundEnabled]);

  const resetTest = useCallback(() => {
    const texts = textLibrary[difficulty]; 
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    setText(randomText);
    setCurrentIndex(0);
    setInputHistory([]);
    setErrorCount(0);
    setStartTime(null);
    setEndTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsActive(false);
    setIsPaused(false);
    setTimeElapsed(0);
    setStreak(0);
    setWpmHistory([]); // Reset WPM history
    setConsistencyScore(100); // Reset consistency score
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [difficulty]); // Removed state setters from deps as they are stable

  const completeTest = useCallback(() => {
    setIsActive(false);
    setEndTime(Date.now());

    if (wpm > bestWPM) {
      setBestWPM(wpm);
      localStorage.setItem('bestWPM', wpm.toString());
    }
    if (accuracy > bestAccuracy) {
      setBestAccuracy(accuracy);
      localStorage.setItem('bestAccuracy', accuracy.toString());
    }
    if (streak > maxStreak) {
      setMaxStreak(streak); // This was missing setMaxStreak
      localStorage.setItem('maxStreak', streak.toString());
    }
  }, [wpm, bestWPM, accuracy, bestAccuracy, streak, maxStreak]); // Removed state setters

  // Initialize
  useEffect(() => {
    resetTest();
    setBestWPM(parseInt(localStorage.getItem('bestWPM') || '0'));
    setBestAccuracy(parseInt(localStorage.getItem('bestAccuracy') || '0'));
    setMaxStreak(parseInt(localStorage.getItem('maxStreak') || '0'));
  }, [difficulty, resetTest]); // Added resetTest to deps, removed stable setters

  // Timer
  useEffect(() => {
    if (isActive && !isPaused && startTime) {
      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setTimeElapsed(elapsed);
        
        if (elapsed > 0 && currentIndex > 0) {
          const minutes = elapsed / 60;
          const currentWPM = Math.round((currentIndex / 5) / minutes);
          setWpmHistory(prev => [...prev.slice(-9), currentWPM]); // Keep last 10 WPMs
          
          if (wpmHistory.length >= 5) { // Use wpmHistory from state
            const mean = wpmHistory.reduce((a, b) => a + b, 0) / wpmHistory.length;
            const variance = wpmHistory.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / wpmHistory.length;
            setConsistencyScore(Math.max(0, 100 - Math.sqrt(variance) * 2));
          }
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, isPaused, startTime, currentIndex, wpmHistory]); // Added wpmHistory, removed stable setters

  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isActive || isPaused || !text) return;
      
      e.preventDefault();
      
      if (!startTime) {
        setStartTime(Date.now());
      }

      let key = e.key;
      
      if (key === "Shift") {
        setShift(true);
        return;
      }
      
      if (key === "Backspace") {
        if (currentIndex > 0) {
          setCurrentIndex(prev => prev - 1);
          setInputHistory(prev => prev.slice(0, -1));
          setStreak(0);
        }
        return;
      }
      
      if (key.length === 1 && currentIndex < text.length) {
        if (shift && key.match(/[a-z]/)) {
          key = key.toUpperCase();
        }
        
        const expectedChar = text[currentIndex];
        const correct = key === expectedChar;
        
        setInputHistory(prev => [...prev, { char: key, correct }]);
        
        if (correct) {
          const newCurrentIndex = currentIndex + 1;
          setCurrentIndex(newCurrentIndex);
          const newStreak = streak + 1;
          setStreak(newStreak);
          setMaxStreak(prevMax => Math.max(prevMax, newStreak));
          playSound('correct');
          
          if (newCurrentIndex >= text.length) {
            completeTest();
          }
        } else {
          setErrorCount(prev => prev + 1);
          setStreak(0);
          playSound('error');
        }
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === "Shift") { // Corrected syntax
        setShift(false);
      }
    };

    if (isActive && !isPaused) {
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
    }
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    isActive, isPaused, startTime, text, currentIndex, 
    shift, streak, // Removed inputHistory, errorCount as they are not directly used for decisions in the effect, only their setters
    playSound, completeTest, 
    // State setters are stable and don't need to be in deps
    // setStartTime, setShift, setCurrentIndex, setInputHistory, setStreak, setMaxStreak, setErrorCount 
  ]);

  // Calculate WPM and accuracy
  useEffect(() => {
    if (startTime && currentIndex > 0 && inputHistory.length > 0) {
      const minutes = (Date.now() - startTime) / 60000;
      if (minutes > 0) {
        const wordsTyped = currentIndex / 5;
        const currentWPM = Math.round(wordsTyped / minutes);
        setWpm(currentWPM);
      }
      const correctCount = inputHistory.filter((i) => i.correct).length;
      const currentAccuracy = Math.round((correctCount / inputHistory.length) * 100);
      setAccuracy(currentAccuracy);
    } else if (currentIndex === 0) { // Reset WPM/Accuracy if test is reset
      setWpm(0);
      setAccuracy(100);
    }
  }, [currentIndex, inputHistory, startTime]); // Removed stable setters

  const startTest = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const pauseTest = () => {
    setIsPaused(!isPaused);
  };

  const renderText = () => {
    return text.split("").map((char, idx) => {
      let charClassName = "text-char-default";
      
      if (idx < currentIndex) {
        charClassName = inputHistory[idx] && inputHistory[idx].correct 
          ? "text-char-correct" 
          : "text-char-incorrect";
      } else if (idx === currentIndex) {
        charClassName = "text-char-current";
      }
      
      return (
        <span key={idx} className={`text-char-base ${charClassName}`}>
          {char === " " ? "·" : char}
        </span>
      );
    });
  };

  const renderKey = (keyChar, baseKey) => { // keyChar is what's displayed, baseKey is for logic
    const lowerBaseKey = baseKey.toLowerCase();
    const expectedChar = text[currentIndex];
    let highlight = false;

    if (isActive && !isPaused && expectedChar) {
      // Highlight if the character displayed on the key is the expected character
      if (expectedChar === keyChar) {
        highlight = true;
      }
    }
    
    const finger = keyToFinger[lowerBaseKey] || keyToFinger[baseKey]; // Fallback to baseKey if lowerBaseKey not found (e.g. for '&')
    
    let keyClasses = "key-button";
    if (baseKey === "Space") keyClasses += " key-space";
    if (baseKey === "⇧") keyClasses += " key-shift";

    if (highlight) {
      keyClasses += ` key-current-active ${finger ? `finger-${finger}` : 'finger-default'}`;
    } else {
      keyClasses += darkMode ? " dark-mode" : " light-mode";
    }
    
    return (
      <div
        key={baseKey} // Use baseKey for React key prop for stability
        className={keyClasses}
      >
        {highlight && (
          <div className="key-pulse-overlay" />
        )}
        <span className="key-text">
          {baseKey === "Space" ? "Space" : baseKey === "⇧" ? "Shift" : keyChar}
        </span>
      </div>
    );
  };

  const renderKeyboard = () => {
    const currentLayoutSet = layouts[layout];
    const keysToRender = shift ? currentLayoutSet.shift : currentLayoutSet.normal;

    return (
      <div className="keyboard-layout">
        {keysToRender.map((row, rowIndex) => (
          <div key={rowIndex} className="keyboard-row">
            {row.map((keyChar, keyIndex) => {
              // Get the base key from the normal layout for consistent finger mapping and React keys
              const baseKey = currentLayoutSet.normal[rowIndex][keyIndex];
              return renderKey(keyChar, baseKey);
            })}
          </div>
        ))}
      </div>
    );
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPerformanceLevel = () => {
    if (wpm >= 80) return { label: "Expert", color: "text-purple-400", icon: Star };
    if (wpm >= 60) return { label: "Avancé", color: "text-blue-400", icon: Trophy };
    if (wpm >= 40) return { label: "Intermédiaire", color: "text-green-400", icon: Target };
    return { label: "Débutant", color: "text-yellow-400", icon: Activity };
  };

  const performance = getPerformanceLevel();
  const PerformanceIcon = performance.icon;

  return (
    <div className={`typing-app-shell ${darkMode ? 'theme-dark' : 'theme-light'}`}>
      {/* Background Pattern */}
      <div className="background-pattern">
        <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
          <g fill="none" fillRule="evenodd">
            <g fill="currentColor" fillOpacity="0.4">
              <circle cx="7" cy="7" r="1"/>
              <circle cx="30" cy="7" r="1"/>
              <circle cx="53" cy="7" r="1"/>
              <circle cx="7" cy="30" r="1"/>
              <circle cx="30" cy="30" r="1"/>
              <circle cx="53" cy="30" r="1"/>
              <circle cx="7" cy="53" r="1"/>
              <circle cx="30" cy="53" r="1"/>
              <circle cx="53" cy="53" r="1"/>
            </g>
          </g>
        </svg>
      </div>

      <div className="main-container">
        {/* Header */}
        <div className="app-header-flex">
          <div>
            <h1 className="main-title">
              Typing Master Pro
            </h1>
            <div className="subtitle-performance-flex">
              <p className={`subtitle-text ${darkMode ? 'text-dark-mode' : 'text-light-mode'}`}>
                Maîtrisez l'art de la frappe rapide
              </p>
              <div className={`performance-indicator ${performance.color.replace('text-', 'perf-color-')} ${darkMode ? 'dark-bg-current' : 'light-bg-current'}`}>
                <PerformanceIcon size={16} />
                {performance.label}
              </div>
            </div>
          </div>
          
          <div className="header-buttons-group">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`icon-button ${darkMode ? 'theme-dark-button' : 'theme-light-button'}`}
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`icon-button ${darkMode ? 'theme-dark-button' : 'theme-light-button'}`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <button
              onClick={() => setShowKeyboard(!showKeyboard)}
              className={`icon-button ${darkMode ? 'theme-dark-button' : 'theme-light-button'}`}
            >
              <Keyboard size={20} />
            </button>

            <button
              onClick={() => setShowStats(!showStats)}
              className={`icon-button ${darkMode ? 'theme-dark-button' : 'theme-light-button'}`}
            >
              <BarChart3 size={20} />
            </button>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="stats-grid-container">
          {/* WPM */}
          <div className={`stat-item ${darkMode ? 'theme-dark-item' : 'theme-light-item'}`}>
            <div className="stat-item-header">
              <div className="stat-icon-bg icon-wpm">
                <Zap className="stat-icon-fg" size={20} />
              </div>
              <div>
                <div className="stat-value-text">{wpm}</div>
                <div className={`stat-label-text ${darkMode ? 'text-dark-secondary' : 'text-light-secondary'}`}>MPM</div>
              </div>
            </div>
            <div className={`stat-progress-bar ${darkMode ? 'bg-dark-progress' : 'bg-light-progress'}`}>
              <div 
                className="stat-progress-fill fill-wpm"
                style={{ width: `${Math.min(wpm / 100 * 100, 100)}%` }}
              />
            </div>
          </div>
          {/* Accuracy */}
          <div className={`stat-item ${darkMode ? 'theme-dark-item' : 'theme-light-item'}`}>
            <div className="stat-item-header">
              <div className="stat-icon-bg icon-accuracy">
                <Target className="stat-icon-fg" size={20} />
              </div>
              <div>
                <div className="stat-value-text">{accuracy}%</div>
                <div className={`stat-label-text ${darkMode ? 'text-dark-secondary' : 'text-light-secondary'}`}>Précision</div>
              </div>
            </div>
            <div className={`stat-progress-bar ${darkMode ? 'bg-dark-progress' : 'bg-light-progress'}`}>
              <div 
                className="stat-progress-fill fill-accuracy"
                style={{ width: `${accuracy}%` }}
              />
            </div>
          </div>
          {/* Time */}
          <div className={`stat-item ${darkMode ? 'theme-dark-item' : 'theme-light-item'}`}>
            <div className="stat-item-header">
              <div className="stat-icon-bg icon-time">
                <Clock className="stat-icon-fg" size={20} />
              </div>
              <div>
                <div className="stat-value-text">{formatTime(timeElapsed)}</div>
                <div className={`stat-label-text ${darkMode ? 'text-dark-secondary' : 'text-light-secondary'}`}>Temps</div>
              </div>
            </div>
          </div>
          {/* Best WPM */}
          <div className={`stat-item ${darkMode ? 'theme-dark-item' : 'theme-light-item'}`}>
            <div className="stat-item-header">
              <div className="stat-icon-bg icon-best-wpm">
                <Trophy className="stat-icon-fg" size={20} />
              </div>
              <div>
                <div className="stat-value-text">{bestWPM}</div>
                <div className={`stat-label-text ${darkMode ? 'text-dark-secondary' : 'text-light-secondary'}`}>Record</div>
              </div>
            </div>
          </div>
          {/* Streak */}
          <div className={`stat-item ${darkMode ? 'theme-dark-item' : 'theme-light-item'}`}>
            <div className="stat-item-header">
              <div className="stat-icon-bg icon-streak">
                <Flame className="stat-icon-fg" size={20} />
              </div>
              <div>
                <div className="stat-value-text">{streak}</div>
                <div className={`stat-label-text ${darkMode ? 'text-dark-secondary' : 'text-light-secondary'}`}>Série</div>
              </div>
            </div>
          </div>
          {/* Consistency */}
          <div className={`stat-item ${darkMode ? 'theme-dark-item' : 'theme-light-item'}`}>
            <div className="stat-item-header">
              <div className="stat-icon-bg icon-consistency">
                <TrendingUp className="stat-icon-fg" size={20} />
              </div>
              <div>
                <div className="stat-value-text">{Math.round(consistencyScore)}</div>
                <div className={`stat-label-text ${darkMode ? 'text-dark-secondary' : 'text-light-secondary'}`}>Régularité</div>
              </div>
            </div>
            <div className={`stat-progress-bar ${darkMode ? 'bg-dark-progress' : 'bg-light-progress'}`}>
              <div 
                className="stat-progress-fill fill-consistency"
                style={{ width: `${consistencyScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Enhanced Controls */}
        <div className="controls-flex-wrap">
          <div className="control-group-flex">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className={`styled-select ${darkMode ? 'theme-dark-select' : 'theme-light-select'}`}
            >
              <option value="beginner">🌱 Débutant</option>
              <option value="intermediate">🚀 Intermédiaire</option>
              <option value="advanced">🎯 Avancé</option>
              <option value="code">💻 Code</option>
            </select>
            
            <select
              value={layout}
              onChange={(e) => setLayout(e.target.value)}
              className={`styled-select ${darkMode ? 'theme-dark-select' : 'theme-light-select'}`}
            >
              <option value="AZERTY">⌨️ AZERTY</option>
              <option value="QWERTY">⌨️ QWERTY</option>
            </select>
          </div>
          
          <div className="control-group-flex">
            {!isActive || isPaused ? (
              <button
                onClick={startTest}
                className="action-btn btn-start"
              >
                <Play size={20} />
                {!isActive ? 'Commencer' : 'Reprendre'}
              </button>
            ) : (
              <button
                onClick={pauseTest}
                className="action-btn btn-pause"
              >
                <Pause size={20} />
                Pause
              </button>
            )}
            
            <button
              onClick={resetTest}
              className="action-btn btn-reset"
            >
              <RotateCcw size={20} />
              Recommencer
            </button>
          </div>
        </div>

        {/* Enhanced Text Display */}
        <div className={`text-display-container ${darkMode ? 'theme-dark-container' : 'theme-light-container'}`}>
          <div className="text-display-header">
            <div className="text-display-title-group">
              <h3 className="text-display-title">Zone de frappe</h3>
              {streak > 0 && (
                <div className="streak-display-badge">
                  <Flame size={16} />
                  {streak} en série
                </div>
              )}
            </div>
            <div className={`char-progress-text ${darkMode ? 'text-dark-secondary' : 'text-light-secondary'}`}>
              {currentIndex} / {text.length} caractères
            </div>
          </div>
          
          <div
            ref={textRef}
            className="typing-text-area"
            tabIndex={0}
          >
            {isPaused ? (
              <div className="pause-overlay-content">
                <div className="pause-icon-container">
                  <Pause size={48} className="pause-icon-svg" />
                </div>
                <p className="pause-message-main">Test en pause</p>
                <p className="pause-message-sub">Cliquez sur Reprendre pour continuer</p>
              </div>
            ) : (
              <div className="text-render-wrapper">
                {renderText()}
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Statistics Panel */}
        {showStats && (
          <div className={`stats-panel-container ${darkMode ? 'theme-dark-container' : 'theme-light-container'}`}>
            <div className="stats-panel-header">
              <h3 className="stats-panel-title">
                <BarChart3 size={24} />
                Statistiques détaillées
              </h3>
              <button
                onClick={() => setShowStats(false)}
                className="panel-toggle-button"
              >
                <ChevronUp size={20} />
              </button>
            </div>
            
            <div className="detailed-stats-grid">
              {/* Records personnels */}
              <div className={`detailed-stat-item ${darkMode ? 'bg-dark-item' : 'bg-light-item'}`}>
                <h4 className="detailed-stat-title">
                  <Award className="title-icon icon-purple" size={18} />
                  Records personnels
                </h4>
                <div className="detailed-stat-content">
                  <div className="stat-row">
                    <span className="stat-key">Meilleur MPM:</span>
                    <span className="stat-value-colored color-purple">{bestWPM}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-key">Meilleure précision:</span>
                    <span className="stat-value-colored color-green">{bestAccuracy}%</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-key">Plus longue série:</span>
                    <span className="stat-value-colored color-orange">{maxStreak}</span>
                  </div>
                </div>
              </div>
              
              {/* Session actuelle */}
              <div className={`detailed-stat-item ${darkMode ? 'bg-dark-item' : 'bg-light-item'}`}>
                <h4 className="detailed-stat-title">
                  <Activity className="title-icon icon-blue" size={18} />
                  Session actuelle
                </h4>
                <div className="detailed-stat-content">
                  <div className="stat-row">
                    <span className="stat-key">Erreurs totales:</span>
                    <span className="stat-value-colored color-red">{errorCount}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-key">Taux d'erreur:</span>
                    <span className="stat-value-colored color-yellow">
                      {inputHistory.length > 0 ? Math.round((errorCount / inputHistory.length) * 100) : 0}%
                    </span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-key">Progression:</span>
                    <span className="stat-value-colored color-blue">
                      {Math.round((currentIndex / text.length) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Performance */}
              <div className={`detailed-stat-item ${darkMode ? 'bg-dark-item' : 'bg-light-item'}`}>
                <h4 className="detailed-stat-title">
                  <TrendingUp className="title-icon icon-green" size={18} />
                  Performance
                </h4>
                <div className="detailed-stat-content">
                  <div className="stat-row">
                    <span className="stat-key">Niveau:</span>
                    <span className={`stat-value-colored ${performance.color.replace('text-', 'color-')}`}>{performance.label}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-key">Régularité:</span>
                    <span className="stat-value-colored color-indigo">{Math.round(consistencyScore)}%</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-key">Série actuelle:</span>
                    <span className="stat-value-colored color-orange">{streak}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Virtual Keyboard */}
        {showKeyboard && (
          <div className={`keyboard-section-container ${darkMode ? 'theme-dark-container' : 'theme-light-container'}`}>
            <div className="keyboard-section-header">
              <h3 className="keyboard-section-title">
                <Keyboard size={24} />
                Clavier virtuel - {layout}
              </h3>
              <button
                onClick={() => setShowKeyboard(false)}
                className="panel-toggle-button"
              >
                <ChevronDown size={20} />
              </button>
            </div>
            <div className="keyboard-render-area">
              {renderKeyboard()}
            </div>
            
            {/* Finger Guide */}
            <div className="finger-guide-container">
              {Object.entries(fingerColors).map(([finger, gradient]) => {
                const name = finger.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                let displayName = name; // Default to capitalized English name

                // French translations
                if (name === "Thumb") displayName = "Pouce";
                else if (name === "Index Left") displayName = "Index gauche";
                else if (name === "Middle Left") displayName = "Majeur gauche";
                else if (name === "Ring Left") displayName = "Annulaire gauche";
                else if (name === "Pinky Left") displayName = "Auriculaire gauche";
                else if (name === "Index Right") displayName = "Index droit";
                else if (name === "Middle Right") displayName = "Majeur droit";
                else if (name === "Ring Right") displayName = "Annulaire droit";
                else if (name === "Pinky Right") displayName = "Auriculaire droit";
                // If no specific translation, it uses the capitalized English name.

                return (
                  <div key={finger} className="finger-guide-item">
                    <div className={`finger-color-indicator finger-${finger}`}></div>
                    <span>{displayName}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Enhanced Progress Bar */}
        <div className="main-progress-section">
          <div className="main-progress-header">
            <span className="main-progress-label">Progression du test</span>
            <span className="main-progress-percentage">
              {Math.round((currentIndex / text.length) * 100)}% complété
            </span>
          </div>
          <div className={`main-progress-track ${darkMode ? 'bg-dark-track' : 'bg-light-track'}`}>
            <div
              className="main-progress-filled"
              style={{ width: `${(currentIndex / text.length) * 100}%` }}
            >
              <div className="main-progress-pulse"></div>
            </div>
          </div>
          
          {/* Speed indicator */}
          {wpm > 0 && (
            <div className="speed-indicator-section">
              <div className="speed-indicator-item">
                <div className={`speed-dot ${
                  wpm >= 60 ? 'dot-green' : wpm >= 40 ? 'dot-yellow' : 'dot-red'
                }`}></div>
                <span>Vitesse actuelle: {wpm} MPM</span>
              </div>
              <div className="speed-indicator-item">
                <span>Temps écoulé: {formatTime(timeElapsed)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Completion Animation */}
        {endTime && (
          <div className="completion-modal-overlay-fixed">
            <div className={`completion-modal-box ${darkMode ? 'theme-dark-modal' : 'theme-light-modal'}`}>
              <div className="completion-modal-header">
                <div className="completion-trophy-icon">
                  <Trophy className="trophy-svg" size={32} />
                </div>
                <h2 className="completion-title">Test terminé !</h2>
                <p className="completion-subtitle">Félicitations pour votre performance</p>
              </div>
              
              <div className="completion-stats-grid">
                <div className={`completion-stat-item ${darkMode ? 'bg-dark-item' : 'bg-light-item'}`}>
                  <div className="completion-stat-value color-blue">{wpm}</div>
                  <div className="completion-stat-label">MPM</div>
                </div>
                <div className={`completion-stat-item ${darkMode ? 'bg-dark-item' : 'bg-light-item'}`}>
                  <div className="completion-stat-value color-green">{accuracy}%</div>
                  <div className="completion-stat-label">Précision</div>
                </div>
              </div>
              
              <button
                onClick={() => setEndTime(null)}
                className="completion-continue-button"
              >
                Continuer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TypingApp;