import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  FaTachometerAlt, FaBook, FaUsers, FaChalkboardTeacher, FaRoute, 
  FaUserPlus, FaCreditCard, FaExclamationCircle, FaEnvelopeOpenText, FaCertificate, FaCog 
} from 'react-icons/fa';

function Sidebar() {
  const { t } = useTranslation();

  const navItems = [
    { to: "/dashboard", icon: <FaTachometerAlt />, label: t('dashboard') },
    { to: "/AdminCours", icon: <FaBook />, label: t('courses') },
    { to: "/AdminUser", icon: <FaUsers />, label: t('students') },
    { to: "/AdminTeacher", icon: <FaChalkboardTeacher />, label: t('instructors') },
    { to: "/RoadmapIndex", icon: <FaRoute />, label: t('Roadmap') },
    { to: "/SignupManager", icon: <FaUserPlus />, label: t('signup_manager') },
    { to: "/Paiements", icon: <FaCreditCard />, label: t('Paiements') },
    { to: "/Reclamation", icon: <FaExclamationCircle />, label: t('Reclamation') },
    { to: "/AdminContactMessages", icon: <FaEnvelopeOpenText />, label: t('Contact Messages') },
    { to: "/certifications", icon: <FaCertificate />, label: t('certifications') },
    { to: "/settings", icon: <FaCog />, label: t('settings') },
  ];

  const baseLinkClasses = "flex items-center py-3.5 px-6 text-[var(--Secondary3-color)] text-base decoration-none transition-all duration-300 ease-in-out border-l-4 border-transparent";
  const hoverLinkClasses = "hover:bg-[var(--Primary700-color)] hover:text-white hover:pl-8";
  const activeLinkClasses = "bg-[var(--Primary900-color)] text-[var(--Secondary1-color)] font-semibold border-[var(--Secondary1-color)]";


  return (
    <aside className="w-64 bg-[var(--Primary800-color)] text-[var(--Gray1-color)] dark:bg-[var(--Primary800-color)] dark:text-[var(--Gray1-color)] py-5 px-0 flex flex-col h-screen fixed left-0 top-0 shadow-[2px_0_5px_var(--shadow-color)] transition-width duration-300 ease-in-out overflow-y-auto lg:w-64 md:w-20 sm:w-20 group hover:w-64">
     <NavLink to="/" className="navButtonEduMaster" data-text="Awesome">
        <span className="navActualText">&nbsp;EduMaster&nbsp;</span>
        <span aria-hidden="true" className="navHoverText">&nbsp;EduMaster&nbsp;</span>
      </NavLink>
      <nav className="flex-grow">
        <ul className="list-none p-0 m-0">
          {navItems.map(item => (
            <li key={item.to} className="m-0">
              <NavLink 
                to={item.to} 
                className={({ isActive }) => 
                  `${baseLinkClasses} ${hoverLinkClasses} ${isActive ? activeLinkClasses : ''}`
                }
              >
                <span className="mr-4 text-xl w-6 text-center group-hover:mr-4 lg:mr-4 md:mr-0 sm:mr-0">{item.icon}</span>
                <span className="lg:inline md:hidden sm:hidden group-hover:inline">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;