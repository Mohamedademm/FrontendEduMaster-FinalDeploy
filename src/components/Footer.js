import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Css/Footer.css';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const Footer = () => {
  const { t } = useTranslation(); // Initialize useTranslation
  const quickLinks = [
    { href: '/', text: t('AboutUs') }, // Translate text
    { href: '/courses', text: t('Courses') },
    { href: '/careers', text: t('Career') }, // Translate text
    { href: '/contact', text: t('Contact') },
  ];

  const supportLinks = [
    { href: '/JobOffers', text: t('JobOffers') },
    { href: '/SupportTicketSystem', text: t('SupportTicketSystem') },
    { href: '/blog', text: t('Blog') },
    { href: '/faq', text: t('Faq') }, // Translate text (assuming 'Faq' key exists or will be added)
  ];

  return (
    <footer className="footer">
      <div className="footerContent">
        <div className="footerWrapper">
          <div className="footerSections">
            <div>
              <h1 className="brandName">EduMaster</h1>
              <p className="brandDescription">
                {t('EmpoweringFutures')} {/* Translate text */}
              </p>
            </div>
            <FooterSection title={t('QuickLinks')} links={quickLinks} /> {/* Translate title */}
            <FooterSection title={t('Support')} links={supportLinks} /> {/* Translate title */}
            <div>
              <h2 className="sectionTitle">{t('Connect')}</h2> {/* Translate title */}
              <SocialIcons />
              <ContactIcons />
            </div>
          </div>
        </div>
        <p className="copyright">{t('footer_message')}</p> {/* Translate text */}
      </div>
    </footer>
  );
};

const FooterSection = ({ title, links }) => {
  const navigate = useNavigate();
  // No t() needed here as title and link.text are already translated

  const handleClick = (href) => {
    navigate(href);
  };

  return (
    <div>
      <h2 className="sectionTitle">{title}</h2>
      <nav className="linkList">
        {links.map((link, index) => (
          <button
            key={index}
            className="footerLinkButton"
            onClick={() => handleClick(link.href)}
          >
            {link.text}
          </button>
        ))}
      </nav>
    </div>
  );
};

const SocialIcons = () => {
  const { t } = useTranslation(); // Initialize useTranslation
  return (
    <div className="socialIcons">
      <a href="https://facebook.com" aria-label={t('FacebookAria')} target="_blank" rel="noopener noreferrer"> {/* Translate aria-label */}
        <i className="ti ti-brand-facebook" />
      </a>
      <a href="https://twitter.com" aria-label={t('TwitterAria')} target="_blank" rel="noopener noreferrer"> {/* Translate aria-label */}
        <i className="ti ti-brand-twitter" />
      </a>
      <a href="https://linkedin.com" aria-label={t('LinkedInAria')} target="_blank" rel="noopener noreferrer"> {/* Translate aria-label */}
        <i className="ti ti-brand-linkedin" />
      </a>
      <a href="https://instagram.com" aria-label={t('InstagramAria')} target="_blank" rel="noopener noreferrer"> {/* Translate aria-label */}
        <i className="ti ti-brand-instagram" />
      </a>
    </div>
  );
};

const ContactIcons = () => {
  const { t } = useTranslation(); // Initialize useTranslation
  return (
    <div className="contactIcons">
      <a href="tel:+1234567890" aria-label={t('PhoneAria')}> {/* Translate aria-label */}
        <i className="ti ti-phone" />
      </a>
      <a href="mailto:contact@edumaster.com" aria-label={t('EmailAria')}> {/* Translate aria-label */}
        <i className="ti ti-mail" />
      </a>
    </div>
  );
};

export default Footer;
