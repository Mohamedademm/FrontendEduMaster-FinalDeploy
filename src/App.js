import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './i18n/i18n'; // Import i18n configuration
import Navbar from './components/Navbar';
import Home from './components/Home';
import Courses from './components/Courses';
import CourseDetails from './components/CourseDetails';
import Careers from './components/Careers';
import JobOffers from './components/JobOffers';
import Blog from './components/Blog';
import LoginRegister from './components/LoginRegister';
import ForgotPassword from './components/ForgotPassword';
import SignupManager from './components/dash/SignupManager';
import Contact from './components/Contact';
import ChatAndForum from './components/ChatAndForum';
import NotificationManagement from './components/NotificationManagement';
import Reclamation from './components/Reclamation';
import GestionProfil from './components/GestionProfil';
import PrivateRoute from './components/PrivateRoute';
import ChatBot from './components/ChatBot';
import MicroCours from './components/MicroCours';
import UseCaseDiagram from './components/UseCaseDiagram';
import RoadmapIndex from './components/RoadmapIndex';
import RoadmapVisualizer from "./components/RoadmapVisualizer";
import RoadmapTitle from './components/RoadmapTitle';
import RoadmapV2 from './components/RoadmapV2';
import MeetingPage from './components/MeetingPage';
import Podcasts from './components/Podcasts';
import Books from './components/Books';
// Teacher pages 
import HomeTeacher from './components/Teacher/HomeTeacher';
import CoursTeacher from './components/Teacher/CoursTeacher';
import CreeCours from './components/Teacher/CreeCours';
import CreeTecherMicroCours from './components/Teacher/CreeTecherMicroCours';
import BankAccount from './components/Teacher/BankAccount';
import OnlineClasses from './components/User/OnlineClasses';
import MeetingJoin from './components/MeetingJoin';
import PaiementsT from './components/Teacher/Paiements';

// Dashboard pages (routes protégées)
import Dashboard from './components/dash/Dashboard';
import AdminCours from './components/dash/AdminCours';
import AdminUser from './components/dash/AdminUser';
import AdminTeacher from './components/dash/AdminTeacher';
import Certifications from './components/dash/certifications';
import Paiements from './components/dash/PaiementsG';
import Settings from './components/dash/Settings';
import CreeRoadmap from './components/dash/CreeRoadmap';
import EditRoadmap from './components/dash/EditRoadmap';
// Import de la page NotFound
import NotFound from './components/NotFound';  // Assurez-vous que ce fichier existe
import AdminContactMessages from './components/dash/AdminContactMessages'; // Import the new component

import TypingApp from './components/TypingApp';
import StudyGame from './components/StudyGame';
import CodeMaster from './components/CodeMaster';
import CodeLive from './components/CodeLive';
import Verification from './components/Verification';

import './App.css';

const AppContent = () => {
  const location = useLocation();

  // Liste des routes où la Navbar ne doit pas s'afficher
  const hideNavbarRoutes = [
    '/Dashboard',
    '/dashboard',
    '/ManagerInterface',
    '/SignupManager',
    '/AdminCours',
    '/AdminUser',
    '/AdminTeacher',
    '/certifications',
    '/settings',
    '/RoadmapVisualizer',
    '/RoadmapTitle',
    '/RoadmapIndex',
    '/Paiements',
    '/*',
    '/CreeRoadmap',
    '/EditRoadmap',
    '/Reclamation',
    '/AdminContactMessages',
    '/HomeTeacher'
  ];

  // Vérifie si le chemin actuel commence par l'une des routes où on cache la Navbar
  const shouldHideNavbar = hideNavbarRoutes.some(route => location.pathname.startsWith(route));

  return (
    <>
      {/* Afficher la Navbar si la route n'est pas dans hideNavbarRoutes */}
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course-details/:courseId" element={<CourseDetails />} />
        <Route path="/Careers" element={<Careers />} />
        <Route path="/JobOffers" element={<JobOffers />} />
        
        <Route path="/Podcasts" element={<Podcasts />} />
        <Route path="/Books" element={<Books />} />

        <Route path="/Blog" element={<Blog />} />
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/ChatAndForum" element={<ChatAndForum />} />
        <Route path="/Paiements" element={<Paiements />} />
        <Route path="/NotificationManagement" element={<NotificationManagement />} />
        <Route path="/Reclamation" element={<Reclamation />} />
        <Route path="/GestionProfil" element={<GestionProfil />} />
        <Route path="/RoadmapIndex" element={<RoadmapIndex />} />
        <Route path="/RoadmapVisualizer" element={<RoadmapVisualizer />} />
        <Route path="/RoadmapTitle/:id" element={<RoadmapTitle />} /> 
        
        <Route path="/ChatBot" element={<ChatBot />} />
        <Route path="/RoadmapV2" element={<RoadmapV2 />} />
        <Route path="/MeetingPage" element={<MeetingPage />} />

        {/* Routes pour les professeurs */}
        <Route path="/HomeTeacher" element={<HomeTeacher />} />
        <Route path="/CoursTeacher" element={<CoursTeacher />} />
        <Route path="/CreeCours" element={<CreeCours />} />
        <Route path="/CreeTecherMicroCours" element={<CreeTecherMicroCours />} />
        <Route path="/BankAccount" element={<BankAccount />} />
        <Route path="/OnlineClasses" element={<OnlineClasses />} />
        <Route path="/MeetingJoin" element={<MeetingJoin />} />
        <Route path="/meeting/:meetingId" element={<MeetingJoin />} />

        <Route path="/MicroCours" element={<MicroCours />} />
        <Route path="/use-case-diagram" element={<UseCaseDiagram />} />
        
        <Route path="/PaiementsT" element={<PaiementsT />} />


        {/* Routes protégées avec PrivateRoute */}
        <Route element={<PrivateRoute />}>
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/AdminCours" element={<AdminCours />} />
          <Route path="/AdminUser" element={<AdminUser />} />
          <Route path="/AdminTeacher" element={<AdminTeacher />} />
          <Route path="/Certifications" element={<Certifications />} />
          <Route path="/Settings" element={<Settings />} />
          <Route path="/SignupManager" element={<SignupManager />} />
          <Route path="/CreeRoadmap" element={<CreeRoadmap />} />
          <Route path="/EditRoadmap" element={<EditRoadmap />} />
          <Route path="/AdminContactMessages" element={<AdminContactMessages />} /> {/* Add new admin route */}

          
        </Route>

        {/* Route NotFound pour toutes les autres URL incorrectes */}
        <Route path="*" element={<NotFound />} />
        <Route path="/verify-email/:token" element={<Verification />} />
        <Route path="/TypingApp" element={<TypingApp />} />
        <Route path="/StudyGame" element={<StudyGame />} />
        <Route path="/CodeMaster" element={<CodeMaster />} />
        <Route path="/CodeLive" element={<CodeLive />} />
      </Routes>
    </>
  );
};

function App() {
  return <AppContent />;
}

export default App;
