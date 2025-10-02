import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import '../Css/Contact.css';
import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope, FaUser, FaPaperPlane } from 'react-icons/fa'; // Added FaUser for name input

const Contact = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState(null);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = t('contact_name_required', "Name is required");
    if (!form.email.trim()) newErrors.email = t('contact_email_required', "Email is required");
    else if (!validateEmail(form.email)) newErrors.email = t('contact_invalid_email', "Invalid email address");
    if (!form.message.trim()) newErrors.message = t('contact_message_required', "Message is required");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMsg(null);
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom: form.name, email: form.email, message: form.message }),
      });

      const responseData = await res.json();

      if (res.ok) {
        setResponseMsg({ type: 'success', text: responseData.msg || t('contact_message_sent', "Message sent successfully!") });
        setForm({ name: '', email: '', message: '' });
      } else {
        setResponseMsg({ type: 'error', text: responseData.msg || t('contact_message_error', "Error sending message.") });
      }
    } catch (error) {
      console.error("Contact form submission error:", error);
      setResponseMsg({ type: 'error', text: t('contact_network_error', "Network error. Please try again.") });
    }
    setLoading(false);
  };

  return (
    <section className="contact-section">
      <h1 className="contact-section-title">{t('contact_get_in_touch', 'Get in Touch')}</h1>
      <div className="contact-container">
        <div className="contact-info">
          <p className="intro-text">
            {t('contact_intro_text', 'Our project aims to design and implement an updated "Iset" platform. Feel free to contact us for any questions or collaboration opportunities.')}
          </p>
          <div className="contact-details">
            <h4>{t('contact_us', 'Contact Us')}</h4>
            <div className="detail-item">
              <FaPhoneAlt className="detail-icon" />
              <p><strong>{t('contact_phone', 'Phone')}:</strong><br />+216 73 307 960 / 73 307 961</p>
            </div>
            <div className="detail-item">
              <FaMapMarkerAlt className="detail-icon" />
              <p><strong>{t('contact_location', 'Location')}:</strong><br />Cité Erriadh - B.P 135 - 4023 Sousse, Tunisia</p>
            </div>
            <div className="detail-item">
              <FaEnvelope className="detail-icon" />
              <p><strong>{t('email', 'Email')}:</strong><br />admin@isetso.rnu.tn</p>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <h2>{t('contact_send_message', 'Send Us a Message')}</h2>

          <div className="form-groupContact">
            <label htmlFor="name">
              <FaUser className="label-icon" /> {t('contact_name_label', 'Name')}:
            </label>
            <div className="input-wrapper">
              <FaUser className="input-icon" />
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
                placeholder={t('contact_name_placeholder', 'Your full name')}
              />
            </div>
            {errors.name && <small className="error-msg">{errors.name}</small>}
          </div>

          <div className="form-groupContact">
            <label htmlFor="email">
              <FaEnvelope className="label-icon" /> {t('email', 'Email')}:
            </label>
            <div className="input-wrapper">
              <FaEnvelope className="input-icon" />
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder={t('contact_email_placeholder', 'Your valid email address')}
              />
            </div>
            {errors.email && <small className="error-msg">{errors.email}</small>}
          </div>

          <div className="form-groupContact">
            <label htmlFor="message">
              <FaPaperPlane className="label-icon" /> {t('contact_message_label', 'Message')}:
            </label>
            <div className="input-wrapper">
              {/* Textarea might not need an icon inside, but label icon is good */}
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                className={errors.message ? 'error' : ''}
                placeholder={t('contact_message_placeholder', 'Your detailed message')}
                rows={6}
              />
            </div>
            {errors.message && <small className="error-msg">{errors.message}</small>}
          </div>

          <button type="submit" className='buttonContact' disabled={loading}>
            {loading ? t('contact_sending', 'Sending...') : (
              <>
                {t('send_message', 'Send Message')} <FaPaperPlane className="button-icon" />
              </>
            )}
          </button>

          {responseMsg && (
            <p className={`response-message ${responseMsg.type === 'success' ? 'success-msg' : 'error-msg'}`}>
              {responseMsg.text}
            </p>
          )}
        </form>
      </div>
    </section>
  );
};

export default Contact;
