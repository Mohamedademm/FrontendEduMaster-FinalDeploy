// certifications.js
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Sidebar from "./Sidebar"; // Assurez-vous que ce chemin est correct
import '../../Css/dash/Certifications.css'
import ReactDOM from 'react-dom/client';
import CertificateTemplate from './CertificateTemplate'; // Le template amélioré

// --- Icônes (optionnel, mais améliore l'UX) ---
// Vous pouvez utiliser une bibliothèque comme react-icons
// import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiUploadCloud, FiEye, FiSave, FiX } from 'react-icons/fi';

// --- Composant Modal Amélioré ---
const Modal = ({ children, onClose, title }) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close-button" onClick={onClose} aria-label="Fermer">
            {/* <FiX />  Utiliser une icône si disponible, sinon &times; */}
            &times;
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- Composant Notification (Toast-like) ---
const Notification = ({ message, type, onClose }) => {
  if (!message) return null;
  return (
    <div className={`notification notification-${type}`}>
      {message}
      <button onClick={onClose} className="notification-close">&times;</button>
    </div>
  );
};


const Certifications = () => {
  const { t } = useTranslation();
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    domain: '',
    level: '',
    imageC: '' // This might represent a badge or related image, not the certificate itself
  });
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');


  const clearNotification = () => setNotification({ message: '', type: '' });

  const displayNotification = (message, type = 'success', duration = 3000) => {
    setNotification({ message, type });
    setTimeout(clearNotification, duration);
  };

  const fetchCertifications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/certifications");
      setCertifications(response.data);
      setError('');
    } catch (err) {
      setError(t('error_loading_certifications'));
      console.error("Fetch Certifications Error:", err);
      displayNotification(t('error_loading_certifications'), 'error');
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchCertifications();
  }, [fetchCertifications]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const filteredCertifications = certifications.filter(cert =>
    (cert.name?.toLowerCase().includes(search.toLowerCase()) || 
     cert._id?.toString().includes(search) ||
     cert.domain?.toLowerCase().includes(search.toLowerCase()) ||
     cert.level?.toLowerCase().includes(search.toLowerCase()))
  );

  const getAuthToken = () => localStorage.getItem('token');

  const openFormModal = (mode, cert = null) => {
    setFormMode(mode);
    setPreviewMode(false); // Reset preview mode when opening form
    setImagePreviewUrl(''); // Clear previous image preview
    if (mode === 'add') {
      setFormData({ id: '', name: '', domain: '', level: '', imageC: '' });
    } else if (cert) {
      setFormData({
        id: cert._id,
        name: cert.name,
        domain: cert.domain,
        level: cert.level,
        imageC: cert.imageC || ''
      });
      if (cert.imageC) {
        // Assuming imageC is a full URL or a path that can be used to display the image
        // If it's just a filename, you might need to prefix it with your API's public URL
        setImagePreviewUrl(cert.imageC.startsWith('http') ? cert.imageC : `http://localhost:3000/${cert.imageC}`);
      }
    }
    setShowFormModal(true);
    setError(''); // Clear previous form errors
  };

  const closeFormModal = () => {
    setShowFormModal(false);
    setFormData({ id: '', name: '', domain: '', level: '', imageC: '' }); // Reset form
    setImagePreviewUrl('');
    setError('');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const tempPreviewUrl = URL.createObjectURL(file);
    setImagePreviewUrl(tempPreviewUrl); // Show instant preview

    setUploadingImage(true);
    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    try {
      const token = getAuthToken();
      if (!token) {
        displayNotification('Authentication token missing. Please login.', 'error');
        setUploadingImage(false);
        return;
      }
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.post('http://localhost:3000/api/upload', uploadFormData, config);
      setFormData(prev => ({ ...prev, imageC: response.data.path }));
      // Update preview URL to the actual server path if different
      // For now, local object URL is fine until save.
      // setImagePreviewUrl(`http://localhost:3000/${response.data.path}`);
      displayNotification('Image uploaded successfully.', 'success');
    } catch (err) {
      displayNotification('Error uploading image.', 'error');
      console.error('Upload error:', err.response || err.message || err);
      setImagePreviewUrl(''); // Clear preview on error
    } finally {
      setUploadingImage(false);
      // Don't revoke object URL immediately if you want to keep the preview
      // URL.revokeObjectURL(tempPreviewUrl); // Clean up object URL if not needed
    }
  };
  
  const canPreviewOrSave = formData.name.trim() !== '' && formData.domain.trim() !== '' && formData.level.trim() !== '';

  const handlePreviewToggle = () => {
    if (canPreviewOrSave) {
      setPreviewMode(!previewMode);
    } else {
      displayNotification('Please fill in Name, Domain, and Level to preview.', 'warning');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!canPreviewOrSave) {
      displayNotification('Name, Domain, and Level are required.', 'error');
      return;
    }
    setIsSubmitting(true);
    setError('');

    try {
      const token = getAuthToken();
      if (!token) {
        displayNotification('Authentication token missing. Please login.', 'error');
        setIsSubmitting(false);
        return;
      }
      
      const payload = {
        name: formData.name,
        domain: formData.domain,
        level: formData.level,
        imageC: formData.imageC
      };
      const config = { headers: { Authorization: `Bearer ${token}` } };

      let response;
      if (formMode === 'add') {
        response = await axios.post('http://localhost:3000/api/certifications', payload, config);
        displayNotification('Certification added successfully!', 'success');
      } else {
        response = await axios.put(`http://localhost:3000/api/certifications/${formData.id}`, payload, config);
        displayNotification('Certification updated successfully!', 'success');
      }
      
      fetchCertifications();
      closeFormModal();
      
      // Option: Generate certificate after successful save.
      // You might want a separate button for "Save and Generate" or "Generate" on the list.
      // For now, let's assume direct generation is desired.
      if (response.data) { // Assuming API returns the created/updated cert
         // generateCertificate(formMode === 'add' ? response.data : {...formData, ...response.data});
         // Or use formData if response.data isn't detailed enough for the certificate
         generateCertificate(formData); // Use formData as it has all necessary fields
      }

    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error submitting form.';
      displayNotification(errorMsg, 'error');
      setError(errorMsg); // For display within the form if needed
      console.error('API error:', err.response || err.message || err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (certId) => {
    if (window.confirm(t('confirm_delete_certification'))) {
      setIsSubmitting(true); // Use for general loading state on action
      try {
        const token = getAuthToken();
        if (!token) {
          displayNotification('Authentication token missing.', 'error');
          setIsSubmitting(false);
          return;
        }
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(`http://localhost:3000/api/certifications/${certId}`, config);
        displayNotification('Certification deleted successfully.', 'success');
        fetchCertifications();
      } catch (err) {
        displayNotification('Error deleting certification.', 'error');
        console.error("Delete Error:", err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const generateCertificate = (certData) => {
    const certWindow = window.open('', '_blank', 'width=850,height=650,scrollbars=yes,resizable=yes');
    if (certWindow) {
      certWindow.document.title = 'Certificate of Achievement';
      const container = certWindow.document.createElement('div');
      certWindow.document.body.appendChild(container);
      // Add specific class to body for standalone certificate styles
      certWindow.document.body.classList.add('certificate-standalone-body'); 
      
      const root = ReactDOM.createRoot(container);
      root.render(
        <React.StrictMode>
          <CertificateTemplate
            name={certData.name}
            domain={certData.domain}
            level={certData.level}
            date={new Date().toLocaleDateString()} // Or a stored issuance date if available
            signature="Director of Programs" // Make this configurable if needed
            // logoUrl="/path/to/your/logo.png" // Pass a real logo URL
          />
        </React.StrictMode>
      );
      certWindow.focus();
    } else {
      displayNotification('Please allow pop-ups for this site to generate certificates.', 'warning');
    }
  };


  return (
    <div className="admin-dashboard"> {/* Changed class for main container */}
      <Sidebar />
      <main className="mainContent">
        <header className="admin-header">
          <h1>{t('manage_certifications')}</h1>
          <button onClick={() => openFormModal('add')} className="button button-primary add-button">
            {/* <FiPlus /> {t('add_certification')} */}
            + {t('add_certification')}
          </button>
        </header>

        <Notification message={notification.message} type={notification.type} onClose={clearNotification} />
        
        <div className="controls-container">
          <div className="search-bar">
            {/* <FiSearch className="search-icon" /> */}
            <input
              type="text"
              placeholder={t('search_by_name_id_domain')}
              value={search}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-indicator">{t('loading_data')}...</div>
        ) : error && !certifications.length ? ( // Show main error if loading fails and no data
          <div className="error-message">{error}</div>
        ) : (
          <>
            {filteredCertifications.length === 0 && !loading && (
              <p className="no-data-message">{t('no_certifications_found')}</p>
            )}
            <div className="certifications-grid">
              {filteredCertifications.map(cert => (
                <div key={cert._id} className="certification-card">
                  <div className="card-certificate-preview" onClick={() => generateCertificate(cert)} title="Click to view full certificate">
                     {/* Use the PREVIEW_MODE prop/value to trigger compact styling in CertificateTemplate */}
                    <CertificateTemplate 
                        name={cert.name}
                        domain={cert.domain}
                        level={cert.level}
                        date={new Date(cert.createdAt || Date.now()).toLocaleDateString()} // Assuming createdAt exists
                        signature="Director"
                        logoUrl="PREVIEW_MODE" // Signal to CertificateTemplate for preview styling
                    />
                  </div>
                  
                  <div className="card-actions">
                    <button onClick={() => openFormModal('edit', cert)} className="button button-icon button-edit" title={t('edit')}>
                      {/* <FiEdit2 /> */} Edit
                    </button>
                    <button onClick={() => handleDelete(cert._id)} className="button button-icon button-delete" title={t('delete')} disabled={isSubmitting}>
                      {/* <FiTrash2 /> */} Delete
                    </button>
                    <button onClick={() => generateCertificate(cert)} className="button button-icon button-view" title={t('generate_certificate')}>
                      {/* <FiEye /> */} View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {showFormModal && (
          <Modal 
            onClose={closeFormModal} 
            title={formMode === 'add' ? t('add_new_certification') : t('edit_certification_details')}
          >
            {previewMode ? (
              <div className="certificate-form-preview">
                <h3>{t('certificate_preview')}</h3>
                <div className="preview-area">
                    <CertificateTemplate
                        name={formData.name}
                        domain={formData.domain}
                        level={formData.level}
                        date={new Date().toLocaleDateString()}
                        signature="Director of Programs"
                        logoUrl="PREVIEW_MODE"
                    />
                </div>
                <div className="form-actions">
                  <button type="button" onClick={handlePreviewToggle} className="button button-secondary">
                    {/* <FiEdit2 /> {t('back_to_editing')} */} Back to Edit
                  </button>
                  <button 
                    type="button" 
                    onClick={handleFormSubmit} 
                    className="button button-primary" 
                    disabled={isSubmitting || uploadingImage}
                  >
                    {/* <FiSave /> {isSubmitting ? t('saving') : t('confirm_and_save')} */}
                    {isSubmitting ? 'Saving...' : 'Confirm & Save'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="certification-form">
                {formMode === 'edit' && (
                  <p className="form-info"><strong>ID:</strong> {formData.id}</p>
                )}
                <div className="form-group">
                  <label htmlFor="name">{t('recipient_name')}:</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleFormChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="domain">{t('domain_of_achievement')}:</label>
                  <input type="text" id="domain" name="domain" value={formData.domain} onChange={handleFormChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="level">{t('level_achieved')}:</label>
                  <input type="text" id="level" name="level" value={formData.level} onChange={handleFormChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="certImage">{t('upload_badge_image')} (Optionnel):</label>
                  <input type="file" id="certImage" onChange={handleFileUpload} accept="image/*" />
                  {uploadingImage && <p className="upload-status">{t('uploading_image')}...</p>}
                  {imagePreviewUrl && (
                    <div className="image-preview-container">
                      <img src={imagePreviewUrl} alt="Badge Preview" className="badge-preview" />
                    </div>
                  )}
                  {formData.imageC && !imagePreviewUrl && ( // Show existing image if no new one is selected
                     <div className="image-preview-container">
                        <img src={formData.imageC.startsWith('http') ? formData.imageC : `http://localhost:3000/${formData.imageC}`} alt="Current Badge" className="badge-preview" />
                    </div>
                  )}
                </div>
                {error && <p className="error-message form-error">{error}</p>}
                <div className="form-actions">
                  <button type="button" onClick={closeFormModal} className="button button-secondary" disabled={isSubmitting}>
                    {/* <FiX /> {t('cancel')} */} Cancel
                  </button>
                  <button 
                    type="button" 
                    onClick={handlePreviewToggle} 
                    className="button button-tertiary" 
                    disabled={!canPreviewOrSave || isSubmitting || uploadingImage}
                  >
                    {/* <FiEye /> {t('preview_certificate')} */} Preview Certificate
                  </button>
                  <button type="submit" className="button button-primary" disabled={!canPreviewOrSave || isSubmitting || uploadingImage}>
                    {/* <FiSave /> {isSubmitting ? t('saving') : (formMode === 'add' ? t('add_certification') : t('save_changes'))} */}
                    {isSubmitting ? 'Saving...' : (formMode === 'add' ? 'Add Certification' : 'Save Changes')}
                  </button>
                </div>
              </form>
            )}
          </Modal>
        )}
      </main>
    </div>
  );
};

export default Certifications;