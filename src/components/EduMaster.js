import React from 'react';
import '../Css/EduMaster.css';
import TopPicks from './TopPicks';
import CloudSoftware from './CloudSoftware';
import Certification from './Certification';
import Instructors from './Instructors';

function EduMaster() {
  return (
    <div className="eduMaster">
      <TopPicks />
      <CloudSoftware />
      <Certification />
      <Instructors/>
    </div>
  );
}

export default EduMaster;
