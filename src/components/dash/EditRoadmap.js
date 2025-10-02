import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../Css/dash/EditRoadmap.css';
const EditRoadmap = () => {
  const [roadmapData, setRoadmapData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const roadmapId = new URLSearchParams(location.search).get('id');

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/roadmaps/${roadmapId}`);
        const data = await res.json();
        if (data.success) {
          setRoadmapData(data.roadmap);
        } else {
          setError('Failed to fetch roadmap data.');
        }
      } catch (err) {
        setError('An error occurred while fetching roadmap data.');
      }
    };

    if (roadmapId) {
      fetchRoadmap();
    }
  }, [roadmapId]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/api/roadmaps/${roadmapId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roadmapData),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Roadmap updated successfully!');
        navigate('/RoadmapVisualizer');
      } else {
        setError(data.error || 'Failed to update roadmap.');
      }
    } catch (err) {
      setError('An error occurred while updating the roadmap.');
    }
  };

  const handleChange = (field, value) => {
    setRoadmapData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTopicChange = (index, field, value) => {
    const updatedTopics = [...roadmapData.topics];
    updatedTopics[index] = { ...updatedTopics[index], [field]: value };
    setRoadmapData((prev) => ({ ...prev, topics: updatedTopics }));
  };

  const addTopic = () => {
    setRoadmapData((prev) => ({
      ...prev,
      topics: [
        ...prev.topics,
        {
          id: '',
          title: '',
          description: '',
          content: '',
          order: prev.topics.length + 1,
          dependencies: [],
          resources: [],
        },
      ],
    }));
  };

  const removeTopic = (index) => {
    const updatedTopics = roadmapData.topics.filter((_, i) => i !== index);
    setRoadmapData((prev) => ({ ...prev, topics: updatedTopics }));
  };

  if (!roadmapData) {
    return <p>Loading...</p>;
  }
  return (
    <div className="edit-roadmap-container">
      <button type="button" className="back-buttonROADMAP" onClick={handleGoBack}>
        Back
      </button>

      <div className="header-section">
        <div className="header-icon">
          ✏️
        </div>
        <h1>Edit Roadmap</h1>
        <p className="subtitle">
          Modify and update your learning roadmap to keep it current and effective
        </p>
      </div>

      <form onSubmit={handleSubmit} className="edit-roadmap-form">
        <div className="form-section">
          <div className="section-header">
            <span className="section-icon">📋</span>
            <h2>Basic Information</h2>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">
                <span className="label-icon">📝</span>
                Title
              </label>
              <input
                type="text"
                id="title"
                value={roadmapData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter roadmap title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="difficulty">
                <span className="label-icon">⚡</span>
                Difficulty
              </label>
              <select
                id="difficulty"
                value={roadmapData.difficulty}
                onChange={(e) => handleChange('difficulty', e.target.value)}
                required
              >
                <option value="">Select Difficulty</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">
              <span className="label-icon">📄</span>
              Description
            </label>
            <textarea
              id="description"
              value={roadmapData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe what this roadmap covers and its learning objectives"
              required
            ></textarea>
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <span className="section-icon">🎨</span>
            <h2>Appearance & Settings</h2>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="estimatedHours">
                <span className="label-icon">⏱️</span>
                Estimated Hours
              </label>
              <input
                type="number"
                id="estimatedHours"
                value={roadmapData.estimatedHours}
                onChange={(e) => handleChange('estimatedHours', e.target.value)}
                placeholder="Total learning hours"
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="icon">
                <span className="label-icon">🎯</span>
                Icon
              </label>
              <input
                type="text"
                id="icon"
                value={roadmapData.icon}
                onChange={(e) => handleChange('icon', e.target.value)}
                placeholder="Enter an emoji or icon"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="color">
              <span className="label-icon">🎨</span>
              Theme Color
            </label>
            <div className="color-input-wrapper">
              <input
                type="color"
                id="color"
                value={roadmapData.color}
                onChange={(e) => handleChange('color', e.target.value)}
              />
              <div 
                className="color-preview" 
                style={{ backgroundColor: roadmapData.color }}
              ></div>
              <span>{roadmapData.color}</span>
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <span className="section-icon">📚</span>
            <h2>Topics Management</h2>
          </div>
          
          <div className="topics-container">
            {roadmapData.topics && roadmapData.topics.length > 0 ? (
              roadmapData.topics.map((topic, index) => (
                <div key={index} className="topic-card">
                  <div className="topic-header">
                    <div className="topic-number">{index + 1}</div>
                    <h3>Topic {index + 1}</h3>
                  </div>
                  
                  <div className="topic-content">
                    <div className="form-group">
                      <label>
                        <span className="label-icon">📝</span>
                        Title
                      </label>
                      <input
                        type="text"
                        value={topic.title}
                        onChange={(e) => handleTopicChange(index, 'title', e.target.value)}
                        placeholder="Topic title"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        <span className="label-icon">📄</span>
                        Description
                      </label>
                      <textarea
                        value={topic.description}
                        onChange={(e) => handleTopicChange(index, 'description', e.target.value)}
                        placeholder="Brief description of this topic"
                        required
                      ></textarea>
                    </div>

                    <div className="form-group">
                      <label>
                        <span className="label-icon">📖</span>
                        Content
                      </label>
                      <textarea
                        value={topic.content}
                        onChange={(e) => handleTopicChange(index, 'content', e.target.value)}
                        placeholder="Detailed learning content and instructions"
                        required
                      ></textarea>
                    </div>

                    <div className="form-group">
                      <label>
                        <span className="label-icon">🔢</span>
                        Order
                      </label>
                      <input
                        type="number"
                        value={topic.order}
                        onChange={(e) => handleTopicChange(index, 'order', e.target.value)}
                        min="1"
                        required
                      />
                    </div>

                    <button 
                      type="button" 
                      onClick={() => removeTopic(index)} 
                      className="remove-topic-button"
                    >
                      🗑️ Remove Topic
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <h3>No Topics Yet</h3>
                <p>Add your first topic to start building the roadmap content.</p>
                <button type="button" onClick={addTopic} className="empty-add-button">
                  ➕ Add First Topic
                </button>
              </div>
            )}

            {roadmapData.topics && roadmapData.topics.length > 0 && (
              <button type="button" onClick={addTopic} className="add-topic-button">
                ➕ Add New Topic
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <div className="submit-section">
          <div className="submit-info">
            <span className="info-icon">💡</span>
            <p>Make sure all information is accurate before updating the roadmap.</p>
          </div>
          
          <button type="submit" className="submit-button">
            <span className="button-icon">💾</span>
            Update Roadmap
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRoadmap;