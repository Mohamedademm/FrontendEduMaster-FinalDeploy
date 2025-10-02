import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../Css/H_section.css'; // Ensure this CSS file exists with your styles
import RoadmapUser from './RoadmapUser';

const HSection1 = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeRoadmaps, setActiveRoadmaps] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')); // Retrieve user data from localStorage
    if (user && user.activeRoadmaps) {
      setActiveRoadmaps(user.activeRoadmaps); // Set activeRoadmaps from localStorage
    }
  }, []);

  const handleGetStartedClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/courses');
    } else {
      navigate('/login');
    }
  };

  const handleExploreCoursesClick = () => {
    navigate('/courses');
  };

  return (
    <div className="landingSection">
      <main className="mainContentHome">
        <div className="contentWrapper">
          <div className="gridLayout">
            <div className="textContainer">
              <h1 className="heroTitle">{t('hero_title', 'Master Your Future with AI-Driven Learning')}</h1>
              <p className="heroSubtitle">{t('hero_subtitle', 'Courses, Certifications, and Career-Boosting Skills in One Platform')}</p>
              <div className="ctaButtons">
                <button className="primaryCta1" onClick={handleGetStartedClick}>
                  {t('get_started_free', 'Get Started for Free')}
                </button>
                <button className="secondaryCta" onClick={handleExploreCoursesClick}>
                  {t('explore_courses', 'Explore Courses')}
                </button>
              </div>
            </div>
            <div className="visualContainer">
              {activeRoadmaps.length > 0 ? (
                <RoadmapUser activeRoadmapId={activeRoadmaps[0]} />
              ) : (
                <div className="imageContainer">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/4c5f3b2089f3400b839048fcebfa2d23/0a55039f0359052a9aeb53943f2fb9955ab0214e16f05b9131f1f6a882112d46?apiKey=4c5f3b2089f3400b839048fcebfa2d23&"
                    alt={t('ai_learning_platform_alt', 'AI-driven learning platform interface')}
                    className="heroImage"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HSection1;