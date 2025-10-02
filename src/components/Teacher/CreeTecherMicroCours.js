import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../../utils/axiosConfig";
import "../../Css/Teacher/CreeTecherMicroCours-Modern.css";
import Sidebar from "./Sidebar";
import ContentDisplay from "./ContentDisplay";
import FormCreate from "./FormCreate";
import Modal from "react-modal";
import { 
  MenuOpen, 
  MenuOpenOutlined, 
  School, 
  LibraryBooks, 
  Dashboard,
  TrendingUp,
  NotificationsActive
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";

const CreeTecherMicroCours = () => {
  const [microCourses, setMicroCourses] = useState([]);
  const [tests, setTests] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const courseId = localStorage.getItem("courseId");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [microCourseToEdit, setMicroCourseToEdit] = useState(null);
  const [testToEdit, setTestToEdit] = useState(null);
  const [isTestEditModalOpen, setIsTestEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Set modal app element to prevent warnings
  useEffect(() => {
    Modal.setAppElement('#root');
  }, []);

  useEffect(() => {
    if (courseId) {
      setLoading(true);
      
      const fetchData = async () => {
        try {
          // Fetch micro-courses using configured api
          const microCoursesResponse = await api.get("/micro-courses");
          const filteredCourses = microCoursesResponse.data.filter((mc) => mc.course === courseId);
          setMicroCourses(filteredCourses);

          // Fetch tests using configured api
          const testsResponse = await api.get(`/courses/${courseId}/tests`);
          console.log("Tests API Response:", testsResponse.data);
          setTests(testsResponse.data.tests || []);
          
        } catch (error) {
          console.error("Erreur de récupération des données :", error);
          // Error details are already logged by interceptor
          setMicroCourses([]);
          setTests([]);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId) {
      axios
        .get(`http://localhost:3000/api/courses/${courseId}`)
        .then((response) => {
          console.log("Course details:", response.data); // Debug log
          // Optionally, display course details in the UI
        })
        .catch((error) => console.error("Error fetching course details:", error));
    }
  }, [courseId]);
  const handleSelectItem = (item) => {
    setSelectedItem(item);
    // No need to fetch additional test details since we already have all the data
    // The test data from the list should be complete
  };

  const handleAddMicroCourse = async (title, contents = [], insertIndex) => {
    try {
      // Validate required fields
      if (!title || !courseId) {
        alert("Le titre et l'ID du cours sont obligatoires.");
        return;
      }

      const formData = new FormData();
      formData.append("course", courseId);
      formData.append("title", title);

      // Handle insertIndex if it exists
      if (insertIndex !== null && insertIndex !== undefined) {
        formData.append("insertIndex", insertIndex);
      }

      // Validate and process contents array
      const processedContents = (contents || []).map((content) => {
        if (content.type === "text" || content.type === "youtube") {
          return content; // No changes for text or YouTube content
        } else if (content.value instanceof File) {
          const fileName = content.value.name;
          formData.append("files", content.value); // Append file to FormData
          return { type: content.type, value: fileName }; // Use the file name
        } else {
          return content; // Return content as is for other types
        }
      });

      // Ensure contents array is not empty
      if (processedContents.length === 0) {
        alert("Le contenu est obligatoire.");
        return;
      }

      formData.append("contents", JSON.stringify(processedContents));

      const response = await axios.post("http://localhost:3000/api/micro-courses", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newMicroCourse = response.data.microCourse;
      const updatedMicroCourses = [...microCourses];
      if (insertIndex !== null) {
        updatedMicroCourses.splice(insertIndex, 0, newMicroCourse);
      } else {
        updatedMicroCourses.push(newMicroCourse);
      }

      setMicroCourses(updatedMicroCourses);
      return newMicroCourse; // Return the new course for potential further actions
    } catch (error) {
      console.error("Erreur lors de l'ajout du micro-cours :", error.response?.data || error.message);

      // Detailed error logging
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);

        // Specific error handling for validation issues
        if (error.response.data.message) {
          alert(`Erreur: ${error.response.data.message}`);
        }
      }
      throw error; // Re-throw to let caller handle it if needed
    }
  };

  const handleDeleteItem = async (item) => {
    if (!item || !item._id) {
      console.error("Invalid item selected for deletion.");
      return;
    }

    const confirmDelete = window.confirm(
      `Êtes-vous sûr de vouloir supprimer cet élément (${item.type || "micro-course"}) ?`
    );
    if (!confirmDelete) return;

    try {
      if (item.type === "micro-course" || !item.type) {
        // Default to micro-course if type is undefined
        await axios.delete(`http://localhost:3000/api/micro-courses/${item._id}`);
        setMicroCourses((prev) => prev.filter((mc) => mc._id !== item._id));
      } else if (item.type === "test") {
        await axios.delete(`http://localhost:3000/api/courses/tests/${item._id}`); // Fixed endpoint
        setTests((prev) => prev.filter((test) => test._id !== item._id));
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'élément :", error.response?.data || error.message);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(microCourses || []); // Ensure microCourses is not undefined
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);

    setMicroCourses(reorderedItems);

    // Update order in the backend
    const orderedIds = reorderedItems.map((item) => item._id); // Ensure map is called on a valid array
    try {
      await axios.put("http://localhost:3000/api/micro-courses/order", {
        orderedIds,
      });
      console.log("Ordre mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'ordre :", error.response?.data || error.message);
    }
  };  const handleAddTestAtPosition = async (title, questions, timer) => {
    try {
      const testPayload = { courseId, title, questions, timer };
      const response = await axios.post("http://localhost:3000/api/courses/tests", testPayload);
      console.log("Test created successfully:", response.data); // Debug log
      
      // Force reload all tests with retry mechanism
      const reloadTests = async (retries = 3) => {
        for (let i = 0; i < retries; i++) {
          try {
            const refreshResponse = await axios.get(`http://localhost:3000/api/courses/${courseId}/tests?t=${Date.now()}`, {
              headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
              }
            });
            
            if (refreshResponse.data && refreshResponse.data.tests) {
              setTests(refreshResponse.data.tests);
              console.log("Tests reloaded successfully:", refreshResponse.data.tests); // Debug log
              return;
            }
          } catch (error) {
            console.error(`Attempt ${i + 1} failed:`, error);
            if (i === retries - 1) {
              throw error;
            }
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
      };

      await reloadTests();
      
    } catch (error) {
      console.error("Erreur lors de la création du test :", error.response?.data || error.message);
    }
  };

  const handleEditMicroCourse = (microCourse) => {
    console.log("Edit micro-course:", microCourse);
    // Add logic for editing a micro-course if needed
  };
  const triggerEditMode = (microCourse) => {
    // Close any open modals first
    setIsTestEditModalOpen(false);
    setTestToEdit(null);
    
    // Then open micro-course edit modal
    setMicroCourseToEdit(microCourse);
    setIsEditModalOpen(true);
  };
  const handleEditMicroCourseSubmit = async (updatedMicroCourse) => {
    try {
      console.log("Updating micro-course:", updatedMicroCourse);
      
      // Ensure we have the correct ID
      const microCourseId = updatedMicroCourse._id || microCourseToEdit?._id;
      if (!microCourseId) {
        console.error("No micro-course ID found for update");
        return;
      }

      const formData = new FormData();
      formData.append("title", updatedMicroCourse.title);
      formData.append("order", updatedMicroCourse.order || 0);

      // Ensure contents is an array and handle it properly
      const contents = updatedMicroCourse.contents || [];
      const processedContents = contents.map((content) => {
        if (content.type === "text" || content.type === "youtube") {
          return content; // No changes for text or YouTube content
        } else if (content.value instanceof File) {
          const fileName = content.value.name;
          formData.append("files", content.value); // Append file to FormData
          return { type: content.type, value: fileName }; // Use the file name
        } else {
          return content; // Return content as is for other types
        }
      });

      formData.append("contents", JSON.stringify(processedContents));

      const response = await axios.put(
        `http://localhost:3000/api/micro-courses/${microCourseId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Update the state with the edited micro-course
      setMicroCourses((prev) =>
        prev.map((mc) =>
          mc._id === microCourseId ? response.data.microCourse : mc
        )
      );

      setIsEditModalOpen(false); // Close the modal
      setMicroCourseToEdit(null); // Clear the edit state
        console.log("Micro-course updated successfully");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du micro-cours :", error.response?.data || error.message);
    }
  };
  const handleEditTest = (test) => {
    // Close any open modals first
    setIsEditModalOpen(false);
    setMicroCourseToEdit(null);
    
    // Then open test edit modal
    setTestToEdit(test);
    setIsTestEditModalOpen(true);
  };
  const handleEditTestSubmit = async (updatedTest) => {
    try {
      console.log("Updating test:", updatedTest);
      
      // Ensure we have the correct ID
      const testId = updatedTest._id || testToEdit?._id;
      if (!testId) {
        console.error("No test ID found for update");
        return;
      }

      const response = await axios.put(
        `http://localhost:3000/api/courses/tests/${testId}`,
        {
          title: updatedTest.title,
          questions: updatedTest.questions,
          timer: updatedTest.timer
        }
      );

      // Update the state with the edited test
      setTests((prev) =>
        prev.map((test) => (test._id === testId ? response.data.test : test))
      );

      setIsTestEditModalOpen(false); // Close the modal
      setTestToEdit(null); // Clear the edit state
      
      console.log("Test updated successfully");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du test :", error.response?.data || error.message);
    }
  };

  const handleDeleteTest = async (test) => {
    if (!test || !test._id) {
      console.error("Invalid test selected for deletion.");
      return;
    }
  
    const confirmDelete = window.confirm(`Êtes-vous sûr de vouloir supprimer le test "${test.title}" ?`);
    if (!confirmDelete) return;
  
    try {
      const url = `http://localhost:3000/api/courses/tests/${test._id}`; // Use the correct endpoint
      console.log("Deleting test with URL:", url); // Debug log
      const response = await axios.delete(url); // Send DELETE request
      console.log("Delete response:", response.data); // Debug log
      setTests((prev) => prev.filter((t) => t._id !== test._id)); // Update state
    } catch (error) {
      console.error("Erreur lors de la suppression du test :", error.response?.data || error.message);
    }
  };
  return (
    <div className="creeMicroCours">
      {/* Modern Header */}
      <div className="modern-header">
        <div className="header-left">
          <Tooltip title={sidebarOpen ? "Masquer la sidebar" : "Afficher la sidebar"}>
            <button 
              className="sidebar-toggle-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <MenuOpen /> : <MenuOpenOutlined />}
            </button>
          </Tooltip>
          <div className="header-title">
            <School className="header-iconcreeMicroCours" />
            <span>Gestion des Micro-Cours</span>
          </div>
        </div>
        <div className="header-right">
          <div className="stats-container">
            <div className="stat-item">
              <LibraryBooks className="stat-icon" />
              <div className="stat-info">
                <span className="stat-number">{microCourses?.length || 0}</span>
                <span className="stat-label">Cours</span>
              </div>
            </div>
            <div className="stat-item">
              <Dashboard className="stat-icon" />
              <div className="stat-info">
                <span className="stat-number">{tests?.length || 0}</span>
                <span className="stat-label">Tests</span>
              </div>
            </div>
          </div>
          <Tooltip title="Statistiques avancées">
            <button className="stats-btn">
              <TrendingUp />
            </button>
          </Tooltip>
          <Tooltip title="Notifications">
            <button className="notification-btn">
              <NotificationsActive />
            </button>
          </Tooltip>        </div>
      </div>
        {/* Main Content */}
      <div className="main-content-wrapper">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Chargement des données...</p>
          </div>
        ) : (
          <>
            <Sidebar
              microCourses={microCourses || []}
              tests={tests || []}
              selectedItem={selectedItem}
              handleSelectItem={handleSelectItem}
          handleEditMicroCourse={handleEditMicroCourse}
          handleDeleteItem={handleDeleteItem}
          handleDragEnd={handleDragEnd}
          triggerEditMode={triggerEditMode}
          handleEditTest={handleEditTest}
          handleDeleteTest={handleDeleteTest}
          isOpen={sidebarOpen}
        />        
            <div className="content-area">
              <ContentDisplay selectedItem={selectedItem} />
              <FormCreate
                courseId={courseId}
                handleAddMicroCourse={handleAddMicroCourse}
                handleAddTestAtPosition={handleAddTestAtPosition}
              />
            </div>
          </>
        )}
      </div>

      {/* Professional Edit Modal */}
      {isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          onRequestClose={() => setIsEditModalOpen(false)}
          contentLabel="Modifier le Micro-Cours"
          className="professional-modal"
          overlayClassName="professional-modal-overlay"
        >
          <div className="modal-header">
            <div className="modal-title-section">
              <LibraryBooks className="modal-icon" />
              <h2>Modifier le Micro-Cours</h2>
            </div>
            <button 
              className="modal-close-btn"
              onClick={() => setIsEditModalOpen(false)}
              aria-label="Fermer"
            >
              ×
            </button>
          </div>
          <div className="modal-body">            <FormCreate
              courseId={courseId}
              handleAddMicroCourse={handleEditMicroCourseSubmit}
              handleAddTestAtPosition={() => {}}
              initialData={{...microCourseToEdit, type: "micro-course"}}
              isEditing={true}
            />
          </div>
        </Modal>
      )}

      {/* Professional Edit Test Modal */}
      {isTestEditModalOpen && (
        <Modal
          isOpen={isTestEditModalOpen}
          onRequestClose={() => setIsTestEditModalOpen(false)}
          contentLabel="Modifier le Test"
          className="professional-modal"
          overlayClassName="professional-modal-overlay"
        >
          <div className="modal-header">
            <div className="modal-title-section">
              <Dashboard className="modal-icon" />
              <h2>Modifier le Test</h2>
            </div>
            <button 
              className="modal-close-btn"
              onClick={() => setIsTestEditModalOpen(false)}
              aria-label="Fermer"
            >
              ×
            </button>
          </div>
          <div className="modal-body">            <FormCreate
              courseId={courseId}
              handleAddMicroCourse={() => {}}
              handleAddTestAtPosition={handleEditTestSubmit}
              initialData={{...testToEdit, type: "test"}}
              isEditing={true}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CreeTecherMicroCours;
