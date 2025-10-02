import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../utils/axiosConfig";
import ChatBotFloating from "./ChatBotFloating"; // Import new ChatBot component
import Swal from "sweetalert2"; // Import SweetAlert2 for custom alerts
import { FaFileAlt, FaFileImage, FaFileVideo, FaYoutube, FaFilePdf, FaPenFancy, FaLayerGroup, FaKeyboard, FaGamepad, FaCode, FaRocket } from "react-icons/fa";
import { MdMenu, MdMenuOpen, MdQuiz, MdBook, MdAccessTime, MdSpeed } from "react-icons/md";
import "../Css/MicroCours-Modern.css";

const MicroCours = () => {
  const navigate = useNavigate();
  const [microCourses, setMicroCourses] = useState([]);  const [tests, setTests] = useState([]); // Store tests/exams
  const [selectedItem, setSelectedItem] = useState(null); // Track the selected item (micro-course or test)
  const [userAnswers, setUserAnswers] = useState([]); // Track user answers for the test
  const [score, setScore] = useState(null); // Store the user's score
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false); // Initialize showCorrectAnswers
  const [courseDetails, setCourseDetails] = useState(null); // Store course details
  const [loading, setLoading] = useState(true); // Loading state
  const [isCourseInList, setIsCourseInList] = useState(false); // Track if the course is already in the user's list
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Sidebar state
  const [chatBotOpen, setChatBotOpen] = useState(false); // ChatBot state
  
  const courseId = localStorage.getItem("courseId");
  
  // Function to navigate to StudyGame
  const handleOpenStudyGame = () => {
    navigate('/StudyGame');
  };

  // Function to navigate to TypingApp
  const handleOpenTypingApp = () => {
    navigate('/TypingApp');
  };
  // Function to navigate to CodeMaster
  const handleOpenCodeMaster = () => {
    navigate('/CodeMaster');
  };

  // Function to navigate to CodeLive
  const handleOpenCodeLive = () => {
    navigate('/CodeLive');
  };

  // Fetch course details, micro-courses, and tests associated with the courseId
  useEffect(() => {
    if (courseId) {
      setLoading(true);
      axios
        .get(`http://localhost:3000/api/courses/${courseId}`)
        .then((response) => {
          setCourseDetails(response.data); // Set course details
        })
        .catch((error) => console.error("Erreur de récupération des détails du cours :", error));

      axios
        .get("http://localhost:3000/api/micro-courses")
        .then((response) => {
          const allMicroCourses = Array.isArray(response.data) ? response.data : [];
          const filteredCourses = allMicroCourses.filter((mc) => mc.course === courseId);
          setMicroCourses(filteredCourses);
        })
        .catch((error) => console.error("Erreur de récupération des micro-cours :", error));      api
        .get(`/courses/${courseId}/tests`)
        .then((response) => {
          console.log("Response from tests API:", response.data);
          const testsArray = Array.isArray(response.data?.tests) ? response.data.tests : [];
          console.log("Tests array:", testsArray);
          setTests(testsArray);
        })
        .catch((error) => {
          console.error("Erreur de récupération des tests :", error);
          setTests([]);
        });

      // Check if the course is already in the user's list
      axios
        .get("http://localhost:3000/api/users/career", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token for authentication
          },
        })
        .then((response) => {
          const isInList = response.data.selectedCourses.some((course) => course._id === courseId);
          setIsCourseInList(isInList);
        })
        .catch((error) => console.error("Erreur de vérification de la liste des cours :", error))
        .finally(() => setLoading(false));
    }
  }, [courseId]);

  // Function to handle adding the course to the user's list
  const handleAddToMyList = async () => {
    const result = await Swal.fire({
      title: "Confirmation",
      text: "Voulez-vous vraiment ajouter ce cours à votre liste ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, ajouter",
      cancelButtonText: "Annuler",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/users/add-course",
          { courseId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token for authentication
            },
          }
        );
        Swal.fire("Succès", response.data.message || "Cours ajouté à votre liste avec succès !", "success");
        setIsCourseInList(true); // Update the state to hide the button
      } catch (error) {
        console.error("Error adding course to list:", error.response?.data || error.message);
        Swal.fire("Erreur", error.response?.data?.error || "Échec de l'ajout du cours à votre liste.", "error");
      }
    }
  };

  // Function to select an item (micro-course or test) and display its content
  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setUserAnswers([]); // Reset user answers when selecting a new test
    setScore(null); // Reset score
    setShowCorrectAnswers(false); // Reset correct answers display
  };

  // Function to handle user answer selection
  const handleAnswerChange = (questionIndex, selectedOption) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[questionIndex] = selectedOption;
    setUserAnswers(updatedAnswers);
  };

  // Function to submit the test and calculate the score
  const handleSubmitTest = async () => {
    if (!selectedItem || selectedItem.type !== "test") return;

    try {
      // Calculate the score locally
      let calculatedScore = 0;
      selectedItem.questions.forEach((question, index) => {
        if (userAnswers[index] === question.correctOption) {
          calculatedScore += 1;
        }
      });

      // Send the score to the backend
      const response = await axios.post(
        "http://localhost:3000/api/users/complete-course",
        {
          courseId, // Use the courseId from localStorage
          score: calculatedScore,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token for authentication
          },
        }
      );

      setScore(calculatedScore); // Update the score in the state
      setShowCorrectAnswers(true); // Show correct answers after submission

      Swal.fire("Succès", response.data.message || "Test soumis avec succès !", "success");
    } catch (error) {
      console.error("Erreur lors de la soumission du test :", error.response?.data || error.message);
      Swal.fire("Erreur", error.response?.data?.error || "Échec de la soumission du test.", "error");
    }
  };

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return "";

    try {
      // Handle youtu.be links
      if (url.includes("youtu.be/")) {
        const videoId = url.split("youtu.be/")[1].split("?")[0];
        return `https://www.youtube.com/embed/${videoId}`;
      }

      // Handle youtube.com links
      if (url.includes("youtube.com/watch")) {
        const videoId = new URL(url).searchParams.get("v");
        return `https://www.youtube.com/embed/${videoId}`;
      }

      // If it's already an embed URL or invalid, return as is
      return url;
    } catch (error) {
      console.error("Error processing YouTube URL:", error);
      return url; // Return original URL if there's an error
    }
  };
  const renderMicroCourseContents = (contents) => {
    // Ensure contents is an array before mapping
    if (!Array.isArray(contents)) {
      return (
        <div className="microCours-empty-state">
          <MdBook className="microCours-empty-icon" />
          <p className="microCours-empty-text">Aucun contenu disponible pour ce micro-cours.</p>
        </div>
      );
    }
    return contents.map((content, index) => (
      <div key={index} className="microCours-content-item">
        {content.type === "text" && (
          <p>{content.value}</p>
        )}
        {content.type === "image" && (
          <img
            src={content.value}
            alt={`Content ${index + 1}`}
          />
        )}
        {content.type === "video" && (
          <video
            controls
            src={content.value}
          >
            Your browser does not support the video tag.
          </video>
        )}
        {content.type === "youtube" && (
          <iframe
            src={getYoutubeEmbedUrl(content.value)}
            title={`YouTube Video ${index + 1}`}
            width="100%"
            height="500px"
            allowFullScreen
          ></iframe>
        )}
        {content.type === "pdf" && (
          <iframe
            src={content.value}
            title={`PDF Viewer ${index + 1}`}
            width="100%"
            height="500px"
          ></iframe>
        )}
      </div>
    ));
  };

  // Helper function to get icon component based on content type
  const getIconForType = (item) => {
    if (item.type === "test") {
      return <FaPenFancy title="Test/Examen" style={{ marginRight: "8px" }} />;
    }
    // Ensure item.contents is an array before mapping
    const itemContents = Array.isArray(item.contents) ? item.contents : [];
    if (itemContents.length > 0) {
      // Get unique content types
      const uniqueTypes = [...new Set(itemContents.map((content) => content.type))];
      if (uniqueTypes.length > 1) {
        // Multiple content types, show special icon
        return <FaLayerGroup title="Multiple Types" style={{ marginRight: "8px" }} />;
      }
      const contentType = uniqueTypes[0];
      switch (contentType) {
        case "text":
          return <FaFileAlt title="Texte" style={{ marginRight: "8px" }} />;
        case "image":
          return <FaFileImage title="Image" style={{ marginRight: "8px" }} />;
        case "video":
          return <FaFileVideo title="Vidéo" style={{ marginRight: "8px" }} />;
        case "youtube":
          return <FaYoutube title="YouTube" style={{ marginRight: "8px" }} />;
        case "pdf":
          return <FaFilePdf title="PDF" style={{ marginRight: "8px" }} />;
        default:
          return null;
      }
    }
    return null;
  }
  // Combine micro-courses and tests into a unified list
  const items = [
    ...(Array.isArray(microCourses) ? microCourses.map((mc) => ({ ...mc, type: "micro-course" })) : []),
    ...(Array.isArray(tests) ? tests.map((test) => ({ ...test, type: "test" })) : []),
  ];
  
  console.log("MicroCourses:", microCourses); // Debug log
  console.log("Tests:", tests); // Debug log
  console.log("Combined items:", items); // Debug log
  if (loading) {
    return (
      <div className="microCours-loading">
        <div className="microCours-loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="microCours">
      {/* Modern Header */}
      <div className="microCours-header">
        <div className="microCours-header-left">
          <button 
            className="microCours-sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? "Ouvrir le menu" : "Fermer le menu"}
          >
            {sidebarCollapsed ? <MdMenu /> : <MdMenuOpen />}
          </button>
          
          <div className="microCours-header-title">
            <MdBook className="microCours-header-icon" />
            <h1>Micro-Cours</h1>
          </div>
        </div>        {courseDetails && (
          <div className="microCours-course-info">
            <span className="microCours-course-name">{courseDetails.name}</span>
            <div className="microCours-action-buttons">
              {!isCourseInList && (
                <button
                  onClick={handleAddToMyList}
                  className="microCours-add-btn"
                  title="Ajouter à ma liste"
                >
                  Ajouter à ma liste
                </button>
              )}
                {/* Typing App Button */}
              <button
                onClick={handleOpenTypingApp}
                className="microCours-typing-btn"
                title="Jeu de Frappe - Améliorez votre vitesse de frappe"
              >
                <FaKeyboard className="microCours-typing-icon" />
                <span>Jeu de Frappe</span>
                <MdSpeed className="microCours-speed-icon" />
              </button>              {/* Study Game Button */}
              <button
                onClick={handleOpenStudyGame}
                className="microCours-study-btn"
                title="Quiz Interactif - Testez vos connaissances en jouant"
              >
                <FaGamepad className="microCours-study-icon" />
                <span>Quiz Game</span>
                <MdQuiz className="microCours-quiz-icon" />
              </button>              {/* CodeMaster Button */}
              <button
                onClick={handleOpenCodeMaster}
                className="microCours-codemaster-btn"
                title="CodeMaster - Aventure de Programmation Progressive"
              >
                <FaCode className="microCours-codemaster-icon" />
                <span>CodeMaster</span>
                <FaRocket className="microCours-rocket-icon" />
              </button>

              {/* CodeLive Button */}
              <button
                onClick={handleOpenCodeLive}
                className="microCours-codelive-btn"
                title="CodeLive - Programmation Interactive en Temps Réel"
              >
                <FaCode className="microCours-codelive-icon" />
                <span>CodeLive</span>
                <FaRocket className="microCours-live-icon" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Layout */}
      <div className="microCours-layout">
        {/* Sidebar */}
        <div className={`microCours-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="microCours-sidebar-header">
            <h3 className="microCours-sidebar-title">
              <MdBook />
              Contenu du cours
            </h3>
          </div>
            <div className="microCours-sidebar-content">
            {/* Learning Tools Section */}
            <div className="microCours-tools-section">
              <h4 className="microCours-tools-title">
                <FaGamepad className="microCours-tools-icon" />
                Outils d'Apprentissage
              </h4>              <div 
                className="microCours-tool-item"
                onClick={handleOpenTypingApp}
                title="Améliorez votre vitesse de frappe avec notre jeu interactif"
              >
                <FaKeyboard className="microCours-tool-icon" />
                <span className="microCours-tool-name">Jeu de Frappe</span>
                <MdSpeed className="microCours-tool-badge" />
              </div>              <div 
                className="microCours-tool-item"
                onClick={handleOpenStudyGame}
                title="Testez vos connaissances avec des quiz interactifs"
              >
                <FaGamepad className="microCours-tool-icon" />
                <span className="microCours-tool-name">Quiz Game</span>
                <MdQuiz className="microCours-tool-badge" />
              </div>              <div 
                className="microCours-tool-item"
                onClick={handleOpenCodeMaster}
                title="Aventure de programmation progressive avec des défis de code"
              >
                <FaCode className="microCours-tool-icon" />
                <span className="microCours-tool-name">CodeMaster</span>
                <FaRocket className="microCours-tool-badge" />
              </div>

              <div 
                className="microCours-tool-item"
                onClick={handleOpenCodeLive}
                title="Programmation interactive en temps réel - Voyez votre code s'exécuter"
              >
                <FaCode className="microCours-tool-icon" />
                <span className="microCours-tool-name">CodeLive</span>
                <FaRocket className="microCours-tool-badge" />
              </div>
            </div>

            {/* Course Content Section */}
            <div className="microCours-content-section">
              <h4 className="microCours-content-section-title">Contenu du Cours</h4>
              {items.length > 0 ? (
                items.map((item) => (
                  <div
                    key={item._id}
                    className={`microCours-item ${selectedItem && selectedItem._id === item._id ? "selected" : ""}`}
                    onClick={() => handleSelectItem(item)}
                  >
                    <span className="microCours-item-icon">{getIconForType(item)}</span>
                    <span className="microCours-item-title">{item.title}</span>
                    <span className="microCours-item-type">
                      {item.type === "test" ? "Test" : "Cours"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="microCours-empty-state">
                  <MdBook className="microCours-empty-icon" />
                  <p className="microCours-empty-text">Aucun contenu disponible</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="microCours-main-content">
          {selectedItem ? (
            <>
              <div className="microCours-content-header">
                <h2 className="microCours-content-title">
                  {getIconForType(selectedItem)}
                  {selectedItem.title}
                </h2>
                <p className="microCours-content-subtitle">
                  {selectedItem.type === "test" ? "Test/Examen" : "Micro-cours"}
                </p>
              </div>

              <div className="microCours-content-body">
                {selectedItem.type === "micro-course" ? (
                  // Micro-course content
                  selectedItem.contents && selectedItem.contents.length > 0 ? (
                    renderMicroCourseContents(selectedItem.contents)
                  ) : (
                    <div className="microCours-empty-state">
                      <MdBook className="microCours-empty-icon" />
                      <p className="microCours-empty-text">Ce micro-cours ne contient aucun contenu.</p>
                    </div>
                  )
                ) : (
                  // Test content
                  <>
                    <div className="microCours-test-info">
                      <div className="microCours-test-duration">
                        <MdAccessTime />
                        Durée: {selectedItem.timer} minutes
                      </div>
                    </div>

                    {(Array.isArray(selectedItem.questions) ? selectedItem.questions : []).map((q, index) => (
                      <div key={index} className="microCours-question">
                        <h4 className="microCours-question-title">
                          Question {index + 1}: {q.question}
                        </h4>
                        <ul className="microCours-question-options">
                          {(Array.isArray(q.options) ? q.options : []).map((option, optIndex) => (
                            <li key={optIndex} className="microCours-question-option">
                              <label>
                                <input
                                  type="radio"
                                  name={`question-${index}`}
                                  value={optIndex}
                                  checked={userAnswers[index] === optIndex}
                                  onChange={() => handleAnswerChange(index, optIndex)}
                                  disabled={showCorrectAnswers}
                                />
                                {option}
                                {showCorrectAnswers && optIndex === q.correctOption && (
                                  <span className="microCours-answer-feedback microCours-answer-correct">(Correct)</span>
                                )}
                                {showCorrectAnswers &&
                                  userAnswers[index] === optIndex &&
                                  optIndex !== q.correctOption && (
                                    <span className="microCours-answer-feedback microCours-answer-incorrect">(Incorrect)</span>
                                  )}
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    {!showCorrectAnswers ? (
                      <button onClick={handleSubmitTest} className="microCours-submit-btn">
                        Soumettre le Test/Examen
                      </button>
                    ) : (
                      <div className="microCours-score-display">
                        <p className="microCours-score-text">
                          Score obtenu : {score}/{(selectedItem.questions || []).length}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="microCours-empty-state">
              <MdQuiz className="microCours-empty-icon" />
              <p className="microCours-empty-text">Sélectionnez un élément pour voir le contenu</p>
            </div>
          )}
        </div>
      </div>      {/* ChatBot Floating */}
      <ChatBotFloating 
        isOpen={chatBotOpen} 
        onToggle={() => setChatBotOpen(!chatBotOpen)} 
      />
    </div>
  );
};

export default MicroCours;
