import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaSearch, 
  FaBuilding, 
  FaMapMarkerAlt, 
  FaRoad, 
  FaGraduationCap, 
  FaUpload,
  FaPlus,
  FaUsers,
  FaGift,
  FaRocket,
  FaQuestionCircle,
  FaChevronDown,
  FaChevronUp,
  FaBriefcase,
  FaEnvelope,
  FaEye,
  FaCheck,
  FaTimes,
  FaClock,
  FaUser,
  FaDownload,
  FaFilter,
  FaStar,
  FaCalendarAlt
} from 'react-icons/fa';
import '../Css/JobOffers-Modern.css';

const API_BASE_URL = 'http://localhost:3000';

const JobOffers = () => {  const [userRole, setUserRole] = useState(null);
  const [showAddOfferForm, setShowAddOfferForm] = useState(false);
  const [jobOffers, setJobOffers] = useState([]);
  const [myJobOffers, setMyJobOffers] = useState([]); // For companies
  const [myApplications, setMyApplications] = useState([]); // For users
  const [selectedOffer, setSelectedOffer] = useState(null); // For viewing applicants
  const [showApplicants, setShowApplicants] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [currentView, setCurrentView] = useState('browse'); // 'browse', 'my-offers', 'my-applications'
  const [applicationStatus, setApplicationStatus] = useState({}); // Track application statuses
  const [newOffer, setNewOffer] = useState({
    title: '',
    description: '',
    department: '',
    requiredRoadmap: '',
    requiredCourses: '',
    companyDetails: {
      name: '',
      description: '',
      contactEmail: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchDepartment, setSearchDepartment] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [cvUploadStatus, setCvUploadStatus] = useState('');
  const [faqItems, setFaqItems] = useState([
    {
      question: 'How do I apply for a job?',
      answer: <>You can apply by clicking the <strong>Apply</strong> button on the job offer. For tips, check our <a href="/application-tips" target="_blank" rel="noopener noreferrer">Application Guide</a>.</>,
      isOpen: false
    },
    {
      question: 'Can I upload multiple CVs?',
      answer: 'Currently, you can upload one CV per user, which can be updated anytime.',
      isOpen: false
    },
    {
      question: 'What departments are available?',
      answer: 'We offer job offers in various departments. Use the search filters above to find them easily.',
      isOpen: false
    },
    {
      question: 'How long does the recruitment process take?',
      answer: 'The process usually takes 2-4 weeks depending on the position and your availability.',
      isOpen: false
    }
  ]);
  const [roadmapSuggestions, setRoadmapSuggestions] = useState([]);
  const [courseSuggestions, setCourseSuggestions] = useState([]);
  const [showRoadmapSuggestions, setShowRoadmapSuggestions] = useState(false);
  const [showCourseSuggestions, setShowCourseSuggestions] = useState(false);

  // Remove API autocomplete calls and filter suggestions on frontend only

  // Remove API autocomplete calls and filter suggestions on frontend only
  // Define allRoadmaps and allCourses as state to hold full lists fetched once

  const [allRoadmaps, setAllRoadmaps] = useState([]);
  const [allCourses, setAllCourses] = useState([]);

  // Fetch all roadmaps and courses once on component mount
  useEffect(() => {
    const fetchAllRoadmaps = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/roadmaps`);
        if (response.data && response.data.success) {
          setAllRoadmaps(response.data.roadmaps || response.data.results || []);
        }
      } catch (error) {
        console.error('Error fetching all roadmaps:', error);
      }
    };

    const fetchAllCourses = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/courses`);
        if (response.data && response.data.success) {
          setAllCourses(response.data.courses || response.data.results || []);
        }
      } catch (error) {
        console.error('Error fetching all courses:', error);
      }
    };

    fetchAllRoadmaps();
    fetchAllCourses();
  }, []);

  // Filter roadmap suggestions locally
  const filterRoadmapSuggestions = (query) => {
    if (!query) {
      // If input is empty, show all roadmap titles
      const allTitles = allRoadmaps.map(r => r.title);
      setRoadmapSuggestions(allTitles);
      setShowRoadmapSuggestions(true);
      return;
    }
    const filtered = allRoadmaps
      .filter(r => r.title.toLowerCase().startsWith(query.toLowerCase()))
      .map(r => r.title);
    setRoadmapSuggestions(filtered);
    setShowRoadmapSuggestions(true);
  };

  // Filter course suggestions locally
  const filterCourseSuggestions = (query) => {
    if (!query) {
      const allNames = allCourses.map(c => c.name);
      setCourseSuggestions(allNames);
      setShowCourseSuggestions(true);
      return;
    }
    const filtered = allCourses
      .filter(c => c.name.toLowerCase().startsWith(query.toLowerCase()))
      .map(c => c.name);
    setCourseSuggestions(filtered);
    setShowCourseSuggestions(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'requiredRoadmap') {
      filterRoadmapSuggestions(value);
    } else if (name === 'requiredCourses') {
      filterCourseSuggestions(value.split(',').pop().trim());
    }

    if (name === 'requiredRoadmap') {
      // Find the roadmap object by title to store the full object or id if needed
      const matchedRoadmap = roadmapSuggestions.find(r => r === value);
      if (matchedRoadmap) {
        setNewOffer(prev => ({ ...prev, requiredRoadmap: matchedRoadmap }));
      } else {
        setNewOffer(prev => ({ ...prev, requiredRoadmap: value }));
      }
      return;
    }

    if (name === 'requiredCourses') {
      // For courses, store the full list of course names as string
      setNewOffer(prev => ({ ...prev, requiredCourses: value }));
      return;
    }

    if (name.startsWith('companyDetails.')) {
      const key = name.split('.')[1];
      setNewOffer(prev => ({
        ...prev,
        companyDetails: {
          ...prev.companyDetails,
          [key]: value
        }
      }));
    } else {
      setNewOffer(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRoadmapSuggestionClick = (title) => {
    setNewOffer(prev => ({ ...prev, requiredRoadmap: title }));
    setRoadmapSuggestions([]);
    setShowRoadmapSuggestions(false);
  };

  const handleCourseSuggestionClick = (name) => {
    // For courses, append the selected course to the input string
    const currentCourses = newOffer.requiredCourses ? newOffer.requiredCourses.split(',').map(c => c.trim()) : [];
    if (!currentCourses.includes(name)) {
      currentCourses.push(name);
    }
    setNewOffer(prev => ({ ...prev, requiredCourses: currentCourses.join(', ') }));
    setCourseSuggestions([]);
    setShowCourseSuggestions(false);
  };

  const fetchUserRole = () => {
    const userDataString = localStorage.getItem('user');
    if (!userDataString) {
      setUserRole('guest');
      return;
    }
    try {
      const userData = JSON.parse(userDataString);
      if (userData && userData.role) {
        setUserRole(userData.role);
      } else {
        setUserRole('guest');
      }
    } catch (err) {
      console.error('Error parsing user data from localStorage:', err);
      setUserRole('guest');
    }
  };

  const handleCvFileChange = (e) => {
    setCvFile(e.target.files[0]);
    setCvUploadStatus(''); // reset status when selecting new file
  };

  const handleCvUpload = async () => {
    if (!cvFile) {
      alert('Please select a CV file to upload.');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to upload a CV.');
      return;
    }
    const formData = new FormData();
    formData.append('cv', cvFile);
    try {
      setCvUploadStatus('Uploading...');
      await axios.post(`${API_BASE_URL}/api/users/upload-cv`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      setCvUploadStatus('Upload successful');
      alert('CV uploaded successfully');
    } catch (error) {
      console.error('Error uploading CV:', error);
      setCvUploadStatus('Upload failed');
      alert('Failed to upload CV');
    }
  };

  
  const fetchJobOffers = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.title) params.title = filters.title;
      if (filters.department) params.department = filters.department;
      const response = await axios.get(`${API_BASE_URL}/api/joboffers`, { params });
      setJobOffers(response.data);
    } catch (err) {
      console.error('Error fetching job offers:', err);
      setError('Failed to load job offers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRole();
    fetchJobOffers();
  }, []);

 

  // Removed duplicate handleInputChange function to fix redeclaration error

  const handleAddOffer = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to add a job offer.');
      return;
    }
    try {
      const requiredCoursesArray = newOffer.requiredCourses
        .split(',')
        .map(c => c.trim())
        .filter(c => c.length > 0);
      const payload = {
        ...newOffer,
        requiredCourses: requiredCoursesArray
      };
      await axios.post(`${API_BASE_URL}/api/joboffers`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setShowAddOfferForm(false);
      setNewOffer({
        title: '',
        description: '',
        department: '',
        requiredRoadmap: '',
        requiredCourses: '',
        companyDetails: {
          name: '',
          description: '',
          contactEmail: ''
        }
      });
      fetchJobOffers();
      alert('Job offer added successfully');
    } catch (error) {
      console.error('Error adding job offer:', error);
      alert('Failed to add job offer');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobOffers({ title: searchTitle, department: searchDepartment });
  };
  // Fetch company's own job offers
  const fetchMyJobOffers = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/joboffers/company/my-offers`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMyJobOffers(response.data);
    } catch (error) {
      console.error('Error fetching company job offers:', error);
      setError('Failed to load your job offers');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's applications
  const fetchMyApplications = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/joboffers/user/my-applications`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMyApplications(response.data);
    } catch (error) {
      console.error('Error fetching user applications:', error);
      setError('Failed to load your applications');
    } finally {
      setLoading(false);
    }
  };

  // Fetch applicants for a specific job offer
  const fetchApplicants = async (jobOfferId) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/joboffers/${jobOfferId}/applicants`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setApplicants(response.data);
      setSelectedOffer(jobOfferId);
      setShowApplicants(true);
    } catch (error) {
      console.error('Error fetching applicants:', error);
      setError('Failed to load applicants');
    } finally {
      setLoading(false);
    }
  };

  // Update application status
  const updateApplicationStatus = async (jobOfferId, userId, status) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
      await axios.patch(`${API_BASE_URL}/api/joboffers/${jobOfferId}/applicants/${userId}/status`, 
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Refresh applicants list
      fetchApplicants(jobOfferId);
      alert(`Application status updated to ${status}`);
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Failed to update application status');
    }
  };

  const handleApply = async (jobOfferId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to apply for a job offer.');
      return;
    }
    
    // Check if already applied
    if (applicationStatus[jobOfferId]) {
      alert('You have already applied to this job offer.');
      return;
    }
    
    try {
      await axios.post(`${API_BASE_URL}/api/joboffers/${jobOfferId}/apply`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update local state to show applied status
      setApplicationStatus(prev => ({
        ...prev,
        [jobOfferId]: 'pending'
      }));
      
      alert('Application submitted successfully');
    } catch (error) {
      console.error('Error applying to job offer:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Failed to apply to job offer');
      }
    }
  };

  const toggleFaq = (index) => {
    setFaqItems(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, isOpen: !item.isOpen } : item
      )
    );
  };
  return (
    <div className="JobOffers-page">
      <h1>Job Offers</h1>
      
      {/* Navigation Tabs */}
      <div className="navigation-tabs">
        <button
          className={`nav-tab ${currentView === 'browse' ? 'active' : ''}`}
          onClick={() => {
            setCurrentView('browse');
            setShowApplicants(false);
            fetchJobOffers();
          }}
        >
          <FaSearch /> Browse Jobs
        </button>
        
        {userRole === 'company' && (
          <button
            className={`nav-tab ${currentView === 'my-offers' ? 'active' : ''}`}
            onClick={() => {
              setCurrentView('my-offers');
              setShowApplicants(false);
              fetchMyJobOffers();
            }}
          >
            <FaBriefcase /> My Offers
          </button>
        )}
        
        {userRole === 'user' && (
          <button
            className={`nav-tab ${currentView === 'my-applications' ? 'active' : ''}`}
            onClick={() => {
              setCurrentView('my-applications');
              setShowApplicants(false);
              fetchMyApplications();
            }}
          >
            <FaUser /> My Applications
          </button>
        )}
      </div>{userRole === 'company' && (
        <button
          className="bouttonjoboffers"
          onClick={() => setShowAddOfferForm(!showAddOfferForm)}
          disabled={loading}
          aria-expanded={showAddOfferForm}
          aria-controls="add-offer-form"
        >
          <FaPlus /> {showAddOfferForm ? 'Annuler' : 'Ajouter une Offre'}
        </button>
      )}      <form onSubmit={handleSearch} className="search-form" aria-label="Rechercher des offres d'emploi">
        <div className="search-input-group">
          <label htmlFor="search-title">
            <FaBriefcase className="search-input-icon" />
            Titre du poste
          </label>
          <input
            id="search-title"
            type="text"
            className="search-input"
            placeholder="Ex: Développeur Frontend"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            aria-label="Rechercher par titre du poste"
          />
        </div>
        <div className="search-input-group">
          <label htmlFor="search-department">
            <FaBuilding className="search-input-icon" />
            Département
          </label>
          <input
            id="search-department"
            type="text"
            className="search-input"
            placeholder="Ex: Marketing, IT"
            value={searchDepartment}
            onChange={(e) => setSearchDepartment(e.target.value)}
            aria-label="Rechercher par département"
          />
        </div>
        <button type="submit" className="search-button" disabled={loading} aria-busy={loading}>
          <FaSearch />
          {loading ? 'Recherche...' : 'Rechercher'}
        </button>
      </form>      {userRole === 'user' && (
        <div className="cv-upload-section">
          <h3><FaUpload /> Télécharger votre CV</h3>
          <div className="file-input-wrapper">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleCvFileChange}
              aria-describedby="cv-upload-help"
              className="file-input"
              id="cv-file-input"
            />
            <label htmlFor="cv-file-input" className="file-input-label">
              <FaUpload />
              {cvFile ? cvFile.name : 'Choisir un fichier'}
            </label>
          </div>
          <button
            onClick={handleCvUpload}
            disabled={cvUploadStatus === 'Uploading...'}
            className="upload-button"
          >
            <FaUpload />
            Télécharger le CV
          </button>
          <p id="cv-upload-help" className="upload-help">
            Formats acceptés : PDF, DOC, DOCX. Taille max : 5MB.
          </p>
          {cvUploadStatus && (
            <div
              className={`upload-status ${
                cvUploadStatus.includes('failed') ? 'error' : 'success'
              }`}
              role="alert"
              aria-live="polite"
            >
              {cvUploadStatus}
            </div>
          )}
        </div>
      )}      {showAddOfferForm && (
        <form
          onSubmit={handleAddOffer}
          className="add-offer-form"
          id="add-offer-form"
          aria-label="Formulaire d'ajout d'une nouvelle offre d'emploi"
        >
          <h2>Créer une Nouvelle Offre d'Emploi</h2>
          
          <div className="form-group">
            <label className="form-label">
              <FaBriefcase style={{ marginRight: '0.5rem' }} />
              Titre du poste:
            </label>
            <input
              type="text"
              name="title"
              className="form-input"
              placeholder="Ex: Ingénieur Logiciel"
              value={newOffer.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <FaBuilding style={{ marginRight: '0.5rem' }} />
              Description:
            </label>
            <textarea
              name="description"
              className="form-textarea"
              placeholder="Décrivez le poste en détail..."
              value={newOffer.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <FaMapMarkerAlt style={{ marginRight: '0.5rem' }} />
              Département:
            </label>
            <input
              type="text"
              name="department"
              className="form-input"
              placeholder="Ex: Marketing, Développement, RH"
              value={newOffer.department}
              onChange={handleInputChange}
            />
          </div>
          <label style={{ position: 'relative' }}>
            Required Roadmap:
            <input
              type="text"
              name="requiredRoadmap"
              placeholder="E.g., Frontend with React & Redux"
              value={newOffer.requiredRoadmap}
              onChange={handleInputChange}
              onFocus={() => {
                if (newOffer.requiredRoadmap) {
                  filterRoadmapSuggestions(newOffer.requiredRoadmap);
                } else {
                  setRoadmapSuggestions(allRoadmaps.map(r => r.title));
                  setShowRoadmapSuggestions(true);
                }
              }}
              onBlur={() => {
                // Delay hiding suggestions to allow click event to register
                setTimeout(() => setShowRoadmapSuggestions(false), 150);
              }}
              autoComplete="off"
              aria-autocomplete="list"
              aria-controls="roadmap-suggestions-list"
              aria-haspopup="listbox"
              aria-expanded={showRoadmapSuggestions}
            />
            <span
              title="Specify the learning roadmap needed for this position, e.g., 'Frontend with React & Redux'."
              style={{ cursor: 'help', marginLeft: '5px', color: '#007bff' }}
              aria-label="Help about required roadmap"
              tabIndex={0}
            >
              ?
            </span>
            {showRoadmapSuggestions && roadmapSuggestions.length > 0 && (
              <ul
                id="roadmap-suggestions-list"
                role="listbox"
                className="suggestions-dropdown"
                style={{
                  border: '1px solid #ccc',
                  maxHeight: '150px',
                  overflowY: 'auto',
                  position: 'absolute',
                  backgroundColor: 'white',
                  zIndex: 1000,
                  width: '100%',
                  marginTop: '2px',
                  paddingLeft: '0',
                  listStyleType: 'none',
                }}
              >                {roadmapSuggestions.map((title, index) => (
                  <li
                    key={index}
                    role="option"
                    aria-selected="false"
                    tabIndex={-1}
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevent input blur before click
                      handleRoadmapSuggestionClick(title);
                    }}
                    style={{
                      padding: '5px 10px',
                      cursor: 'pointer',
                    }}
                    onMouseOver={(e) => e.currentTarget.focus()}
                  >
                    <FaRoad style={{ marginRight: '0.5rem', color: '#10b981' }} />
                    {title}
                  </li>
                ))}
              </ul>
            )}
          </label>
          <label style={{ position: 'relative' }}>
            Required Courses (comma separated course titles):
            <input
              type="text"
              name="requiredCourses"
              placeholder="E.g., React, Node.js, Docker"
              value={newOffer.requiredCourses}
              onChange={handleInputChange}
              onFocus={() => {
                const lastCourse = newOffer.requiredCourses.split(',').pop().trim();
                if (lastCourse) {
                  filterCourseSuggestions(lastCourse);
                } else {
                  setCourseSuggestions(allCourses.map(c => c.name));
                  setShowCourseSuggestions(true);
                }
              }}
              onBlur={() => {
                setTimeout(() => setShowCourseSuggestions(false), 150);
              }}
              autoComplete="off"
              aria-autocomplete="list"
              aria-controls="course-suggestions-list"
              aria-haspopup="listbox"
              aria-expanded={showCourseSuggestions}
            />
            <small style={{ color: '#666', fontSize: '0.85rem' }}>
              List courses separated by commas, no need for numbering.
            </small>
            {showCourseSuggestions && courseSuggestions.length > 0 && (
              <ul
                id="course-suggestions-list"
                role="listbox"
                className="suggestions-dropdown"
                style={{
                  border: '1px solid #ccc',
                  maxHeight: '150px',
                  overflowY: 'auto',
                  position: 'absolute',
                  backgroundColor: 'white',
                  zIndex: 1000,
                  width: '100%',
                  marginTop: '2px',
                  paddingLeft: '0',
                  listStyleType: 'none',
                }}
              >                {courseSuggestions.map((name, index) => (
                  <li
                    key={index}
                    role="option"
                    aria-selected="false"
                    tabIndex={-1}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleCourseSuggestionClick(name);
                    }}
                    style={{
                      padding: '5px 10px',
                      cursor: 'pointer',
                    }}
                    onMouseOver={(e) => e.currentTarget.focus()}
                  >
                    <FaGraduationCap style={{ marginRight: '0.5rem', color: '#f59e0b' }} />
                    {name}
                  </li>
                ))}
              </ul>
            )}
          </label>
          <fieldset>
            <legend>Company Details</legend>
            <label>
              Name:
              <input
                type="text"
                name="companyDetails.name"
                placeholder="Company name"
                value={newOffer.companyDetails.name}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Description:
              <textarea
                name="companyDetails.description"
                placeholder="Brief description of the company"
                value={newOffer.companyDetails.description}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Contact Email:
              <input
                type="email"
                name="companyDetails.contactEmail"
                placeholder="contact@company.com"
                value={newOffer.companyDetails.contactEmail}
                onChange={handleInputChange}
                required
              />
            </label>
          </fieldset>
          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Offer'}
          </button>
        </form>
      )}      <hr style={{ margin: '3rem 0', border: 'none', height: '1px', background: 'linear-gradient(90deg, transparent, #e2e8f0, transparent)' }} />
      
      {loading && (
        <div className="loading-message">
          <div className="loading-spinner"></div>
          Chargement des offres d'emploi...
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <FaQuestionCircle style={{ marginRight: '0.5rem' }} />
          {error}
        </div>
      )}<div className="job-offers-list" aria-live="polite">
        {jobOffers.length === 0 && !loading && (
          <div className="no-offers-message">
            <FaBriefcase style={{ fontSize: '3rem', marginBottom: '1rem', color: '#94a3b8' }} />
            <p>Aucune offre d'emploi disponible pour le moment. Revenez plus tard ou ajustez vos critères de recherche.</p>
          </div>
        )}
        {jobOffers.map((offer) => (
          <div key={offer._id} className="job-offer" tabIndex={0} aria-label={`Offre d'emploi: ${offer.title}`}>
            <h3 className="job-title">
              <FaBriefcase />
              {offer.title}
            </h3>
            <p className="job-description">{offer.description}</p>
            
            <div className="job-detail">
              <span className="job-detail-label">
                <FaBuilding style={{ marginRight: '0.5rem' }} />
                Département:
              </span>
              <span className="job-detail-value">
                {offer.department ? (
                  <span className="department-tag">{offer.department}</span>
                ) : (
                  'Non spécifié'
                )}
              </span>
            </div>

            <div className="job-detail">
              <span className="job-detail-label">
                <FaRoad style={{ marginRight: '0.5rem' }} />
                Roadmap requis:
              </span>
              <span className="job-detail-value">
                {offer.requiredRoadmap ? (
                  <span className="roadmap-tag">{offer.requiredRoadmap}</span>
                ) : (
                  'Aucun'
                )}
              </span>
            </div>

            <div className="job-detail">
              <span className="job-detail-label">
                <FaGraduationCap style={{ marginRight: '0.5rem' }} />
                Cours requis:
              </span>
              <div className="job-detail-value">
                {offer.requiredCourses.length ? (
                  <div className="courses-list">
                    {offer.requiredCourses.map((course, index) => (
                      <span key={index} className="course-tag">{course}</span>
                    ))}
                  </div>
                ) : (
                  'Aucun'
                )}
              </div>
            </div>

            <div className="company-info">
              <div className="company-name">
                <FaBuilding style={{ marginRight: '0.5rem' }} />
                {offer.companyDetails.name}
              </div>
              {offer.companyDetails.description && (
                <p style={{ margin: '0.5rem 0', color: '#64748b' }}>
                  {offer.companyDetails.description}
                </p>
              )}
              {offer.companyDetails.contactEmail && (
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>
                  <FaEnvelope style={{ marginRight: '0.5rem' }} />
                  {offer.companyDetails.contactEmail}
                </p>
              )}
            </div>

            <button onClick={() => handleApply(offer._id)} className="apply-button">
              Postuler
            </button>
          </div>
        ))}
      </div>      {/* Sections supplémentaires */}

      <section id="culture" className="JobOffers-section culture-section">
        <h2><FaUsers /> Notre Culture</h2>
        <p>
          Chez EduMaster, nous valorisons l'innovation, l'inclusion et l'excellence. Découvrez notre histoire, 
          nos valeurs et la vie quotidienne au sein de notre équipe.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
          <div style={{ textAlign: 'center', padding: '1.5rem', background: '#f8fafc', borderRadius: '0.75rem' }}>
            <FaUsers style={{ fontSize: '2rem', color: '#2563eb', marginBottom: '1rem' }} />
            <h4>Collaboration</h4>
            <p>Travail d'équipe et partage de connaissances</p>
          </div>
          <div style={{ textAlign: 'center', padding: '1.5rem', background: '#f8fafc', borderRadius: '0.75rem' }}>
            <FaRocket style={{ fontSize: '2rem', color: '#10b981', marginBottom: '1rem' }} />
            <h4>Innovation</h4>
            <p>Technologies de pointe et créativité</p>
          </div>
          <div style={{ textAlign: 'center', padding: '1.5rem', background: '#f8fafc', borderRadius: '0.75rem' }}>
            <FaGraduationCap style={{ fontSize: '2rem', color: '#f59e0b', marginBottom: '1rem' }} />
            <h4>Apprentissage</h4>
            <p>Formation continue et développement</p>
          </div>
        </div>
      </section>

      <section id="avantages" className="JobOffers-section benefits-section">
        <h2><FaGift /> Avantages et Bénéfices</h2>
        <ul className="benefits-list">
          <li>Horaires flexibles et télétravail</li>
          <li>Programmes de formation et mentorat continus</li>
          <li>Assurance santé et avantages sociaux compétitifs</li>
          <li>Environnement de travail collaboratif et dynamique</li>
          <li>Budget formation et certifications</li>
          <li>Événements d'équipe et activités sociales</li>
        </ul>
      </section>

      <section id="processus" className="JobOffers-section process-section">
        <h2><FaRocket /> Notre Processus de Recrutement</h2>
        <ol className="process-list">
          <li>Soumettez votre candidature en ligne</li>
          <li>Entretien téléphonique/visioconférence</li>
          <li>Tests techniques et études de cas</li>
          <li>Entretien final avec la direction</li>
          <li>Intégration et formation</li>
        </ol>
        <p style={{ marginTop: '2rem', padding: '1rem', background: '#eff6ff', borderRadius: '0.5rem', borderLeft: '4px solid #2563eb' }}>
          💡 Préparez-vous en consultant nos conseils pour réussir votre entretien.
        </p>
      </section>      <section id="faq" className="JobOffers-section faq-section">
        <h2><FaQuestionCircle /> Questions Fréquemment Posées</h2>
        {faqItems.map((item, index) => (
          <div key={index} className="faq-item">
            <button
              className="faq-question"
              onClick={() => toggleFaq(index)}
              aria-expanded={item.isOpen}
              aria-controls={`faq-answer-${index}`}
              aria-label={`Basculer la réponse pour: ${item.question}`}
            >
              <span>{item.question}</span>
              {item.isOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {item.isOpen && (
              <div
                className="faq-answer"
                id={`faq-answer-${index}`}
                role="region"
                aria-live="polite"
                aria-labelledby={`faq-question-${index}`}
              >
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default JobOffers;
