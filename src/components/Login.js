import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';
import Button from './ui/Button'; // Import reusable Button component
import '../Css/form.css'; // Import updated styles

const Login = ({ handleLogin, handleLoginChange, showLoginPassword, setShowLoginPassword, handleGoogleLogin }) => {
  const { t } = useTranslation();
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      handleLoginChange({ target: { name: 'email', value: savedEmail } });
      setRememberMe(true);
    }
  }, [handleLoginChange]);

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
    if (!e.target.checked) {
      localStorage.removeItem('rememberedEmail');
    }
  };

  const handleForgotPassword = () => {
    window.location.href = '/forgot-password';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rememberMe) {
      const emailInput = document.querySelector('input[name="email"]').value;
      localStorage.setItem('rememberedEmail', emailInput);
    }
    handleLogin(e);
  };

  return (
    <div className="form-group col-md-6 right-boxLR">
      <form onSubmit={handleSubmit}>        <div className="header-textLR mb-4">
          <h1>{t('sign_in', 'Sign In')}</h1>
        </div>
        <div className="input-groupLR mb-3">
          <input
            type="email"
            name="email"
            placeholder={t('email', 'Email')}
            className="form-control form-control-lg bg-light fs-6"
            onChange={handleLoginChange}
            required
          />
        </div>        <div className="input-groupLR mb-3 position-relative">
          <input
            type={showLoginPassword ? "text" : "password"}
            name="password"
            placeholder={t('password', 'Password')}
            className="form-control form-control-lg bg-light fs-6"
            onChange={handleLoginChange}
            required
          />
          <button
            type="button"
            className="button-login-setShowLoginPassword"
            onClick={() => setShowLoginPassword(!showLoginPassword)}
          >
            {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <div className="input-groupLR mb-5 d-flex justify-content-between">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="formcheck"
              checked={rememberMe}
              onChange={handleRememberMeChange}
            />            <label htmlFor="formcheck" className="form-check-label text-secondary">
              <small>{t('remember_me', 'Remember me')}</small>
            </label>
          </div>
          <div className="forgot">
            <small>
              <a href="#Forgot" onClick={handleForgotPassword}>
                {t('forgot_password', 'Forgot password?')}
              </a>
            </small>
          </div>
        </div>        <div className="input-groupLR mb-3 justify-content-center">
          <Button variant="primary" type="submit">
            {t('login', 'Login')}
          </Button>
        </div>
        <div className="input-groupLR mb-3 justify-content-center">
          <Button variant="google" onClick={handleGoogleLogin} type="button">
            <FaGoogle className="google-icon" /> {t('sign_in_google', 'Sign in with Google')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Login;
