import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';
import ReCAPTCHA from 'react-google-recaptcha';
import '../Css/form.css'; // Import updated styles

const Register = ({ handleRegister, handleRegisterChange, registerData, showRegisterPassword, setShowRegisterPassword, passwordStrength, handleGoogleRegister, recaptchaToken, setRecaptchaToken }) => {
  const { t } = useTranslation();
  const onRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  return (
    <div className="formgroupRegister col-md-6 left-boxLR">
      <form onSubmit={handleRegister}>        <div className="header-textLR mb-4">
          <h1>{t('sign_up', 'Sign Up')}</h1>
        </div>
        <div className="input-groupLR mb-3">
          <input
            type="text"
            name="firstName"
            placeholder={t('first_name', 'First Name')}
            onChange={handleRegisterChange}
            value={registerData.firstName}
            required
          />
        </div>
        <div className="input-groupLR mb-3">
          <input
            type="text"
            name="lastName"
            placeholder={t('last_name', 'Last Name')}
            onChange={handleRegisterChange}
            value={registerData.lastName}
            required
          />
        </div>
        <div className="input-groupLR mb-3">
          <input
            type="email"
            name="email"
            placeholder={t('email', 'Email')}
            onChange={handleRegisterChange}
            value={registerData.email}
            required
          />
        </div>
        <div className="input-groupLR mb-3">
          <label htmlFor="role">{t('register_as', 'Register as')}:</label>          <select
            id="role"
            name="role"
            value={registerData.role || 'user'}
            onChange={handleRegisterChange}
            required
          >
            <option value="user">{t('user', 'User')}</option>
            <option value="company">{t('teacher', 'Teacher')}</option>
            <option value="company">{t('company', 'Company')}</option>
          </select>
        </div>
        <div className="input-groupLR mb-3 position-relative">
          <input
            type={showRegisterPassword ? "text" : "password"}
            name="password"
            placeholder={t('password', 'Password')}
            onChange={handleRegisterChange}
            value={registerData.password}
            required
          />
          <button
            type="button"
            className="button-register-setShowRegisterPassword"
            onClick={() => setShowRegisterPassword(!showRegisterPassword)}
          >
            {showRegisterPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <div className="password-strength mb-3">
          <small style={{ color: passwordStrength.color }}>
            {passwordStrength.text}
          </small>
        </div>
        <div className="input-groupLR mb-3 justify-content-center">
          {/* Using Google test site key for reCAPTCHA v2 checkbox to avoid invalid key error */}
          <ReCAPTCHA
            sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
            onChange={onRecaptchaChange}
          />
        </div>
        <div className="input-groupLR mb-3 justify-content-center">          <button
            type="submit"
            className="btn-primary"
            disabled={!recaptchaToken}
          >
            {t('register', 'Register')}
          </button>
        </div>
        <div className="input-groupLR mb-3 justify-content-center">
          <button
            type="button"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              backgroundColor: "white",
              color: "#555",
              border: "1px solid #ddd",
              padding: "10px 20px",
              borderRadius: "25px",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "background-color 0.3s ease, box-shadow 0.3s ease",
              textDecoration: "none",
            }}
            onClick={handleGoogleRegister}
          >
            <FaGoogle className="google-icon" /> {t('sign_up_google', 'Sign up with Google')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
