import React, { useState, useEffect } from "react";
import "../../Css/Teacher/CreeCours.css";

// Professional Educational Icons
const BookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const ImageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const CategoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

const LessonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

const PremiumIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const PriceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
  </svg>
);

const SaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
  </svg>
);

const ResetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const DraftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const CreeCours = ({ onCourseCreated, initialCourse, teacherId }) => {
  const [courseName, setCourseName] = useState("");
  const [courseImage, setCourseImage] = useState(null);
  const [courseDescription, setCourseDescription] = useState("");
  const [courseNbMicroCour, setCourseNbMicroCour] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [price, setPrice] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (initialCourse) {
      setCourseName(initialCourse.name);
      setCourseDescription(initialCourse.domaine);
      setCourseNbMicroCour(initialCourse.NbMicroCour);
      setIsPremium(initialCourse.isPremium);
      setPrice(initialCourse.price);
      setImagePreview(initialCourse.image);
    }
  }, [initialCourse]);

  // Enhanced image upload with drag & drop
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCourseImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setCourseImage(file);
        setImagePreview(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("=== DEBUT DE SOUMISSION DU FORMULAIRE ===");
    console.log("Event triggered:", e.type);
    console.log("Form data check:");
    console.log("- Course Name:", courseName);
    console.log("- Domain:", courseDescription);
    console.log("- Micro Courses:", courseNbMicroCour);
    console.log("- Teacher ID:", teacherId);
    console.log("- Is Premium:", isPremium);
    console.log("- Price:", price);
    console.log("- Image selected:", !!courseImage);

    // Enhanced validation with console logs
    if (!courseName.trim()) {
      console.error("Validation failed: Course name is empty");
      alert("Le nom du cours est requis.");
      return;
    }

    if (!courseDescription) {
      console.error("Validation failed: Course domain is empty");
      alert("Le domaine du cours est requis.");
      return;
    }

    if (!courseImage && !initialCourse) {
      console.error("Validation failed: Course image is missing");
      alert("L'image du cours est requise.");
      return;
    }

    if (courseNbMicroCour === "" || courseNbMicroCour < 1) {
      console.error("Validation failed: Invalid number of micro courses");
      alert("Le nombre de micro-cours doit être supérieur à 0.");
      return;
    }

    if (!teacherId) {
      console.error("Validation failed: Teacher ID is missing");
      alert("ID du professeur manquant.");
      return;
    }

    if (isPremium && (!price || price <= 0)) {
      console.error("Validation failed: Invalid price for premium course");
      alert("Le prix doit être supérieur à 0 pour un cours premium.");
      return;
    }

    console.log("✅ All validations passed, proceeding with API call...");

    try {
      // Create FormData correctly
      const formData = new FormData();
      
      // Append course data with proper type conversion
      formData.append("name", courseName.trim());
      formData.append("domaine", courseDescription);
      formData.append("NbMicroCour", parseInt(courseNbMicroCour, 10));
      formData.append("teacher", teacherId);
      formData.append("isPremium", isPremium.toString());
      formData.append("price", isPremium ? parseFloat(price) : 0);

      // Only append image if a new one is selected
      if (courseImage) {
        formData.append("image", courseImage);
        console.log("✅ Image appended to FormData");
      }

      // Debug: Log FormData contents
      console.log("📤 FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value);
      }

      let url = "http://localhost:3000/api/courses";
      let method = "POST";
      
      if (initialCourse) {
        url = `http://localhost:3000/api/courses/${initialCourse._id}`;
        method = "PUT";
      }

      console.log(`🚀 Making ${method} request to: ${url}`);

      const response = await fetch(url, {
        method,
        body: formData,
        // Don't set Content-Type header for FormData - browser handles it automatically
      });

      console.log("📥 Response received:");
      console.log("  Status:", response.status);
      console.log("  Status Text:", response.statusText);
      console.log("  Headers:", Object.fromEntries(response.headers.entries()));

      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Server error response:", errorText);
        
        // Try to parse as JSON if possible
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || `Server error: ${response.status}`);
        } catch (parseError) {
          throw new Error(`Server error: ${response.status} - ${errorText}`);
        }
      }

      // Parse successful response
      const responseData = await response.json();
      console.log("✅ Success response:", responseData);

      // Call the callback with the course data
      if (onCourseCreated) {
        // Pass the course data (might be nested in responseData.course or directly responseData)
        const courseData = responseData.course || responseData;
        console.log("📢 Calling onCourseCreated with:", courseData);
        onCourseCreated(courseData);
      }
      
      // Show success message
      alert(initialCourse ? "Cours modifié avec succès !" : "Cours créé avec succès !");
      
      // Reset form if it's a new course
      if (!initialCourse) {
        console.log("🔄 Resetting form...");
        handleReset();
      }
      
    } catch (error) {
      console.error("💥 Error during course creation/update:", error);
      console.error("Error stack:", error.stack);
      
      // More specific error messages
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        alert("Erreur de connexion au serveur. Vérifiez que le serveur backend fonctionne sur http://localhost:3000");
      } else if (error.message.includes('Failed to fetch')) {
        alert("Impossible de se connecter au serveur. Vérifiez votre connexion internet et que le serveur backend est démarré.");
      } else {
        alert(`Erreur: ${error.message}`);
      }
    }

    console.log("=== FIN DE SOUMISSION DU FORMULAIRE ===");
  };

  const handleReset = () => {
    setCourseName("");
    setCourseDescription("");
    setCourseImage(null);
    setImagePreview(null);
    setCourseNbMicroCour("");
    setIsPremium(false);
    setPrice(0);
  };

  const handleSaveDraft = () => {
    localStorage.setItem(
      "draftCourse",
      JSON.stringify({
        courseName,
        courseDescription,
        courseImage: imagePreview,
        courseNbMicroCour,
        isPremium,
        price,
      })
    );
    alert("Brouillon enregistré !");
  };

  return (
    <div className="edu-course-creator">
      <div className="creator-container">
        {/* Enhanced Header */}
        <div className="creator-header">
          <div className="header-content">
            <div className="header-icon">
              <BookIcon />
            </div>
            <div className="header-text">
              <h1 className="header-title">
                {initialCourse ? "Modifier le Cours" : "Créer un Nouveau Cours"}
              </h1>
              <p className="header-subtitle">
                Concevez une expérience d'apprentissage exceptionnelle pour vos étudiants
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="creator-form" noValidate>
          <div className="form-grid">
            {/* Course Name */}
            <div className="form-section full-width">
              <div className="input-group">
                <label className="input-label">
                  <BookIcon />
                  <span>Nom du Cours</span>
                  <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="form-input"
                  placeholder="Ex: Introduction au JavaScript"
                  required
                />
              </div>
            </div>

            {/* Course Image Upload */}
            <div className="form-section full-width">
              <div className="input-group">
                <label className="input-label">
                  <ImageIcon />
                  <span>Image du Cours</span>
                  <span className="required">*</span>
                </label>
                <div 
                  className={`image-upload-zone ${dragActive ? 'drag-active' : ''} ${imagePreview ? 'has-image' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {imagePreview ? (
                    <div className="image-preview-container">
                      <img src={imagePreview} alt="Aperçu" className="image-preview" />
                      <div className="image-overlay">
                        <button 
                          type="button" 
                          className="change-image-btn"
                          onClick={() => document.getElementById('image-input').click()}
                        >
                          Changer l'image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <ImageIcon />
                      <h3>Glissez-déposez votre image ici</h3>
                      <p>ou cliquez pour sélectionner un fichier</p>
                      <span className="file-types">PNG, JPG, JPEG jusqu'à 5MB</span>
                    </div>
                  )}
                  <input
                    id="image-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden-input"
                    required={!initialCourse}
                  />
                </div>
              </div>
            </div>

            {/* Course Domain and Lessons */}
            <div className="form-section">
              <div className="input-group">
                <label className="input-label">
                  <CategoryIcon />
                  <span>Domaine du Cours</span>
                  <span className="required">*</span>
                </label>
                <select
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  className="form-select"
                  required
                >
                  <option value="">Sélectionnez un domaine</option>
                  <option value="Développement Web">Développement Web</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Intelligence Artificielle">Intelligence Artificielle</option>
                  <option value="Cybersécurité">Cybersécurité</option>
                  <option value="Design UX/UI">Design UX/UI</option>
                  <option value="Marketing Digital">Marketing Digital</option>
                  <option value="Gestion de Projet">Gestion de Projet</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            </div>

            <div className="form-section">
              <div className="input-group">
                <label className="input-label">
                  <LessonIcon />
                  <span>Nombre de Micro-Cours</span>
                  <span className="required">*</span>
                </label>
                <input
                  type="number"
                  value={courseNbMicroCour}
                  onChange={(e) => setCourseNbMicroCour(e.target.value)}
                  className="form-input"
                  placeholder="Ex: 10"
                  min="1"
                  max="100"
                  required
                />
              </div>
            </div>

            {/* Premium Section */}
            <div className="form-section full-width">
              <div className="premium-section">
                <div className="premium-toggle">
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      checked={isPremium}
                      onChange={(e) => setIsPremium(e.target.checked)}
                      className="toggle-input"
                    />
                    <span className="toggle-switch">
                      <span className="toggle-slider"></span>
                    </span>
                    <div className="toggle-content">
                      <PremiumIcon />
                      <div>
                        <span className="toggle-title">Cours Premium</span>
                        <span className="toggle-description">Accès payant avec contenu exclusif</span>
                      </div>
                    </div>
                  </label>
                </div>

                {isPremium && (
                  <div className="price-section">
                    <div className="input-group">
                      <label className="input-label">
                        <PriceIcon />
                        <span>Prix du Cours</span>
                        <span className="required">*</span>
                      </label>
                      <div className="price-input-wrapper">
                        <input
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="form-input price-input"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          required
                        />
                        <span className="currency-symbol">€</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button
              type="button"
              onClick={(e) => {
                console.log("Draft button clicked");
                handleSaveDraft();
              }}
              className="action-btn draft-btn"
            >
              <DraftIcon />
              <span>Sauvegarder Brouillon</span>
            </button>
            
            <button
              type="button"
              onClick={(e) => {
                console.log("Reset button clicked");
                handleReset();
              }}
              className="action-btn reset-btn"
            >
              <ResetIcon />
              <span>Réinitialiser</span>
            </button>
            
            <button
              type="submit"
              className="action-btn submit-btn"
              onClick={(e) => {
                console.log("Submit button clicked!");
                console.log("Button type:", e.target.type);
                console.log("Form valid:", e.target.form?.checkValidity());
                // Don't prevent default here, let the form handle it
              }}
            >
              <SaveIcon />
              <span>{initialCourse ? "Modifier le Cours" : "Créer le Cours"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreeCours;
