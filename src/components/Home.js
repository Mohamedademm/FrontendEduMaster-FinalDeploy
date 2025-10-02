import React from 'react';
import AboutUs from './Footer';
import HSection from './HSection';
import EduMaster from './EduMaster';
import '../Css/Home.css'

function Home() {
  return (
    
       <div className="Home">
        <HSection />
        <EduMaster/>
        <AboutUs />
      </div>

     
    
  );
}

export default Home;
