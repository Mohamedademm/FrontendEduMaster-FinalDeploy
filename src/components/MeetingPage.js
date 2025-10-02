import React, { useState } from 'react';
import { Video, Mic, PhoneCall, Monitor, Share2, Settings, ChevronDown, ChevronUp, Clock, BookOpen, Check } from 'lucide-react';
import '../Css/MeetingPage.css';

const MeetingPage = () => {
  const [expandedSections, setExpandedSections] = useState({
    'get-started': true,
    'illustrator-structure': true,
    'using-illustrator': false,
    'what-is-figma': false,
    'work-with-numpy': false
  });

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  return (
    <div className="meeting-container">
      <div className="meeting-content">
        <div className="video-section">
          <div className="meeting-header">
            <div className="meeting-info">
              <h2>UX/UI Design Conference Meeting</h2>
              <div className="meeting-meta">
                <span>9 Lesson</span>
                <span className="dot-separator">•</span>
                <span><Clock size={14} className="inline-icon" /> 1h 30min</span>
              </div>
            </div>
            <button className="settings-button">
              <Settings size={20} />
            </button>
          </div>

          <div className="main-video-container">
            <div className="main-video">
              <img src="https://images.pexels.com/photos/789822/pexels-photo-789822.jpeg" alt="Main speaker" className="main-speaker" />
            </div>
            
            <div className="video-controls">
              <button className="control-button">
                <Video size={20} />
              </button>
              <button className="control-button">
                <Mic size={20} />
              </button>
              <button className="control-button call-button">
                <PhoneCall size={20} />
              </button>
              <button className="control-button">
                <Monitor size={20} />
              </button>
              <button className="control-button">
                <Share2 size={20} />
              </button>
            </div>
          </div>

          <div className="participants-list">
            <div className="participant-thumbnail">
              <img src="https://images.pexels.com/photos/5952647/pexels-photo-5952647.jpeg" alt="Participant" />
            </div>
            <div className="participant-thumbnail">
              <img src="https://images.pexels.com/photos/3785424/pexels-photo-3785424.jpeg" alt="Participant" />
            </div>
            <div className="participant-thumbnail">
              <img src="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg" alt="Participant" />
            </div>
          </div>
        </div>

        <div className=".sidebarMeeting">
          <div className="course-content">
            <div className=".sidebarMeeting-header">
              <h3>Course Contents</h3>
              <span className="progress-badge">
                2/8 COMPLETED
                <span className="calendar-icon">📅</span>
              </span>
            </div>

            <div className="content-sections">
              <div className="content-section">
                <div className="section-header" onClick={() => toggleSection('get-started')}>
                  <div className="section-title">
                    <span>Get Started</span>
                    <div className="section-meta">
                      <Clock size={14} className="inline-icon" /> 1 Hour
                    </div>
                  </div>
                  <div className="section-info">
                    <span className="lesson-count">5 Lessons</span>
                    {expandedSections['get-started'] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
                
                {expandedSections['get-started'] && (
                  <div className="section-content">
                    <div className="lesson-item completed">
                      <span className="lesson-number">1</span>
                      <span className="lesson-title">Lorem ipsum dolor sit amet</span>
                      <span className="lesson-duration">05:00</span>
                      <Check size={16} className="check-icon" />
                    </div>
                    <div className="lesson-item">
                      <span className="lesson-number">2</span>
                      <span className="lesson-title">Lorem ipsum dolor</span>
                      <span className="lesson-duration">22:00</span>
                    </div>
                    <div className="lesson-item">
                      <span className="lesson-number">3</span>
                      <span className="lesson-title">Lorem ipsum dolor sit amet</span>
                      <span className="lesson-duration">15:00</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="content-section">
                <div className="section-header" onClick={() => toggleSection('illustrator-structure')}>
                  <div className="section-title">
                    <span>Illustrator Structure</span>
                    <div className="section-meta">
                      <Clock size={14} className="inline-icon" /> 2 Hour
                    </div>
                  </div>
                  <div className="section-info">
                    <span className="lesson-count">3 Lessons</span>
                    {expandedSections['illustrator-structure'] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
                
                {expandedSections['illustrator-structure'] && (
                  <div className="section-content">
                    <div className="lesson-item">
                      <span className="lesson-number">1</span>
                      <span className="lesson-title">Lorem ipsum dolor sit amet</span>
                      <span className="lesson-duration">05:00</span>
                    </div>
                    <div className="lesson-item">
                      <span className="lesson-number">2</span>
                      <span className="lesson-title">Lorem ipsum dolor</span>
                      <span className="lesson-duration">22:00</span>
                    </div>
                    <div className="lesson-item">
                      <span className="lesson-number">3</span>
                      <span className="lesson-title">Lorem ipsum dolor sit amet</span>
                      <span className="lesson-duration">15:00</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="content-section">
                <div className="section-header" onClick={() => toggleSection('using-illustrator')}>
                  <div className="section-title">
                    <span>Using Illustrator</span>
                    <div className="section-meta">
                      <Clock size={14} className="inline-icon" /> 1 Hour
                    </div>
                  </div>
                  <div className="section-info">
                    <span className="lesson-count">4 Lessons</span>
                    {expandedSections['using-illustrator'] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
              </div>

              <div className="content-section">
                <div className="section-header" onClick={() => toggleSection('what-is-figma')}>
                  <div className="section-title">
                    <span>What is Figma?</span>
                    <div className="section-meta">
                      <Clock size={14} className="inline-icon" /> 1:24
                    </div>
                  </div>
                  <div className="section-info">
                    <span className="lesson-count">5 Lessons</span>
                    {expandedSections['what-is-figma'] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
              </div>

              <div className="content-section">
                <div className="section-header" onClick={() => toggleSection('work-with-numpy')}>
                  <div className="section-title">
                    <span>Work with Numpy</span>
                    <div className="section-meta">
                      <Clock size={14} className="inline-icon" /> 53:45
                    </div>
                  </div>
                  <div className="section-info">
                    <span className="lesson-count">3 Lessons</span>
                    {expandedSections['work-with-numpy'] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="recommendations">
            <div className="recommendations-header">
              <h3>Book for you</h3>
              <span className="calendar-icon">📅</span>
            </div>
            
            <div className="recommendation-cards">
              <div className="recommendation-card">
                <div className="card-image">
                  <img src="https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg" alt="Woman using laptop" />
                </div>
                <div className="card-content">
                  <h4>All Benefits of PLUS</h4>
                  <div className="card-price">$24</div>
                </div>
              </div>
              
              <div className="recommendation-card">
                <div className="card-image">
                  <img src="https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg" alt="Man with cat" />
                </div>
                <div className="card-content">
                  <h4>All Benefits of PLUS</h4>
                  <div className="card-price">$24</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingPage;