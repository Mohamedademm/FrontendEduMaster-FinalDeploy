import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaRoad,
  FaArrowLeft,
  FaEdit,
  FaPlus,
  FaTrash,
  FaSave,
  FaClock,
  FaGraduationCap,
  FaBookOpen,
  FaLightbulb,
  FaFlag,
  FaPalette,
  FaLayerGroup,
  FaTags,
  FaFileAlt,
  FaCode,
  FaProjectDiagram,
  FaInfoCircle,
  FaExclamationTriangle
} from 'react-icons/fa';
import '../../Css/dash/CreeRoadmap.css';

const CreeRoadmap = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const roadmapData = location.state?.roadmap || null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [icon, setIcon] = useState('');
  const [color, setColor] = useState('');
  const [topics, setTopics] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (roadmapData) {
      setTitle(roadmapData.title || '');
      setDescription(roadmapData.description || '');
      setDifficulty(roadmapData.difficulty || '');
      setEstimatedHours(roadmapData.estimatedHours || '');
      setIcon(roadmapData.icon || '');
      setColor(roadmapData.color || '');
      setTopics(roadmapData.topics || []);
    }
  }, [roadmapData]);

  const addTopic = () => {
    setTopics([...topics, {
      id: '',
      title: '',
      description: '',
      content: '',
      order: topics.length + 1,
      timeEstimate: '',
      prerequisites: '',
      resources: [],
      quizzes: [],
      realLifeProject: ''
    }]);
  };

  const updateTopic = (index, field, value) => {
    const updatedTopics = [...topics];
    updatedTopics[index] = { ...updatedTopics[index], [field]: value };
    setTopics(updatedTopics);
  };

  const removeTopic = (index) => {
    const updatedTopics = topics.filter((_, i) => i !== index);
    setTopics(updatedTopics);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/api/roadmaps/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: title.toLowerCase().replace(/\s+/g, '-'), // Generate ID from title
          title,
          description,
          icon: icon || 'default-icon', // Use a default icon if not provided
          color: color || '#000000', // Use a default color if not provided
          difficulty,
          estimatedHours: parseInt(estimatedHours, 10),
          topics, // Include topics in the payload
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Roadmap created successfully!');
        navigate('/RoadmapIndex'); // Redirect to admin dashboard or roadmap list
      } else {
        setError(data.message || 'An error occurred while creating the roadmap.');
      }
    } catch (err) {
      console.error('Error creating roadmap:', err);
      setError('An error occurred while creating the roadmap.');
    }
  };

  const handleGoBack = () => {
    navigate(-1); // Navigate to the previous page
  };
  return (
    <div className="cree-roadmap-container">
      
      <button
        type="button"
        className="back-buttonROADMAP"
        onClick={handleGoBack}
      >
        <FaArrowLeft />
        Back
      </button>

      <div className="header-section">
        <div className="header-icon">
          <FaRoad />
        </div>
        <h1>{roadmapData ? 'Edit Roadmap' : 'Create a New Roadmap'}</h1>
        <p className="subtitle">
          {roadmapData 
            ? 'Update your learning path with new content and structure' 
            : 'Design a comprehensive learning journey for your students'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="cree-roadmap-form">
        
        {/* Basic Information Section */}
        <div className="form-section">
          <div className="section-header">
            <FaBookOpen className="section-icon" />
            <h2>Basic Information</h2>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">
                <FaEdit className="label-icon" />
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter roadmap title..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="difficulty">
                <FaFlag className="label-icon" />
                Difficulty Level
              </label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                required
              >
                <option value="">Select Difficulty</option>
                <option value="Beginner">🟢 Beginner</option>
                <option value="Intermediate">🟡 Intermediate</option>
                <option value="Advanced">🔴 Advanced</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">
              <FaFileAlt className="label-icon" />
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what students will learn in this roadmap..."
              required
            ></textarea>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="form-section">
          <div className="section-header">
            <FaPalette className="section-icon" />
            <h2>Appearance & Branding</h2>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="estimatedHours">
                <FaClock className="label-icon" />
                Estimated Hours
              </label>
              <input
                type="number"
                id="estimatedHours"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                placeholder="Total learning hours..."
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="color">
                <FaPalette className="label-icon" />
                Theme Color
              </label>
              <div className="color-input-wrapper">
                <input
                  type="color"
                  id="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
                <span className="color-preview" style={{backgroundColor: color}}></span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="icon">
              <FaTags className="label-icon" />
              Icon (Font Awesome class)
            </label>
            <input
              type="text"
              id="icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="e.g., fa-code, fa-design, fa-marketing..."
            />
          </div>
        </div>

        {/* Topics Section */}
        <div className="form-section">
          <div className="section-header">
            <FaLayerGroup className="section-icon" />
            <h2>Learning Topics</h2>
            <button type="button" onClick={addTopic} className="add-topic-button">
              <FaPlus /> Add Topic
            </button>
          </div>
          
          {topics.length === 0 ? (
            <div className="empty-state">
              <FaLightbulb className="empty-icon" />
              <h3>No topics added yet</h3>
              <p>Start building your roadmap by adding learning topics</p>
              <button type="button" onClick={addTopic} className="empty-add-button">
                <FaPlus /> Add First Topic
              </button>
            </div>
          ) : (
            <div className="topics-container">
              {topics.map((topic, index) => (
                <div key={index} className="topic-card">
                  <div className="topic-header">
                    <div className="topic-number">
                      <span>{index + 1}</span>
                    </div>
                    <h3>Topic {index + 1}</h3>
                    <button 
                      type="button" 
                      onClick={() => removeTopic(index)} 
                      className="remove-topic-button"
                      title="Remove this topic"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  <div className="topic-content">
                    <div className="form-row">
                      <div className="form-group">
                        <label>
                          <FaEdit className="label-icon" />
                          Topic Title
                        </label>
                        <input
                          type="text"
                          value={topic.title}
                          onChange={(e) => updateTopic(index, 'title', e.target.value)}
                          placeholder="Enter topic title..."
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          <FaClock className="label-icon" />
                          Time Estimate (hours)
                        </label>
                        <input
                          type="number"
                          value={topic.timeEstimate}
                          onChange={(e) => updateTopic(index, 'timeEstimate', e.target.value)}
                          placeholder="Hours needed..."
                          min="1"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>
                        <FaFileAlt className="label-icon" />
                        Description
                      </label>
                      <textarea
                        value={topic.description}
                        onChange={(e) => updateTopic(index, 'description', e.target.value)}
                        placeholder="Describe what will be covered in this topic..."
                        required
                      ></textarea>
                    </div>

                    <div className="form-group">
                      <label>
                        <FaCode className="label-icon" />
                        Content
                      </label>
                      <textarea
                        value={topic.content}
                        onChange={(e) => updateTopic(index, 'content', e.target.value)}
                        placeholder="Detailed learning content and instructions..."
                        required
                      ></textarea>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>
                          <FaGraduationCap className="label-icon" />
                          Prerequisites
                        </label>
                        <input
                          type="text"
                          value={topic.prerequisites}
                          onChange={(e) => updateTopic(index, 'prerequisites', e.target.value)}
                          placeholder="Required knowledge or skills..."
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          <FaProjectDiagram className="label-icon" />
                          Real-Life Project
                        </label>
                        <input
                          type="text"
                          value={topic.realLifeProject}
                          onChange={(e) => updateTopic(index, 'realLifeProject', e.target.value)}
                          placeholder="Practical project or exercise..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <FaExclamationTriangle className="error-icon" />
            {error}
          </div>
        )}

        {/* Submit Section */}
        <div className="submit-section">
          <div className="submit-info">
            <FaInfoCircle className="info-icon" />
            <span>
              {roadmapData 
                ? 'Your changes will be saved and the roadmap will be updated.' 
                : 'Once created, students will be able to enroll in your roadmap.'
              }
            </span>
          </div>
          
          <button type="submit" className="submit-button">
            <FaSave className="button-icon" />
            {roadmapData ? 'Update Roadmap' : 'Create Roadmap'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreeRoadmap;