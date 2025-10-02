import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Css/LoginRegister.css';
import '../Css/form.css'; // Ensure updated styles are applied
import axios from 'axios';
import Login from './Login';
import Register from './Register';

function LoginRegister() {
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'user'
  });

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });  const [loading, setLoading] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ text: "", color: "" });

  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const content = document.getElementById('contentLR');
    const registerBtn = document.getElementById('registerLR');
    const loginBtn = document.getElementById('loginLR');
    const body = document.querySelector('body');

    if (registerBtn && loginBtn) {
      registerBtn.addEventListener('click', () => {
        content.classList.add('active');
        body.classList.add('register-active');
      });

      loginBtn.addEventListener('click', () => {
        content.classList.remove('active');
        body.classList.remove('register-active');
      });
    }
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      navigate('/'); // Navigate to the home page
    }
  }, [navigate]);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const verified = urlParams.get('verified');
    const error = urlParams.get('error');    if (verified === 'true') {
      alert('Votre e-mail a été vérifié avec succès. Vous pouvez maintenant vous connecter.');
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (verified === 'false') {
      if (error === 'user-not-found') {
        alert('Utilisateur non trouvé. Veuillez vérifier votre lien de vérification.');
      } else if (error === 'invalid-token') {
        alert('Lien de vérification invalide ou expiré.');
      } else {
        alert('Erreur lors de la vérification de l\'email.');
      }
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Vérifie la force du mot de passe
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  
    if (strength === 0) return { text: "Très faible", color: "red", value: 0 };
    if (strength === 1) return { text: "Faible", color: "orange", value: 25 };
    if (strength === 2) return { text: "Moyen", color: "yellow", value: 50 };
    if (strength === 3) return { text: "Fort", color: "lightgreen", value: 75 };
    return { text: "Très fort", color: "green", value: 100 };
  };

  // Gestion du changement des champs d'inscription
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
    setRegisterData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  // Gestion du changement des champs de connexion
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };
  
  // Gestion de l'inscription
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!recaptchaToken) {
        throw new Error('Please verify that you are not a robot.');
      }
      
      console.log('Attempting registration with data:', {
        ...registerData,
        password: '[HIDDEN]',
        recaptchaToken: recaptchaToken ? 'Present' : 'Missing'
      });
      
      const dataWithRecaptcha = { ...registerData, recaptchaToken };
      const response = await axios.post('http://localhost:3000/api/auth/register', dataWithRecaptcha, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      });      console.log('Registration response:', response.data);
      alert(response.data.message || 'Inscription réussie! Veuillez vérifier votre e-mail.');
      
      if (registerData.role === 'user' || registerData.role === 'teacher') {
        const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
          email: registerData.email,
          password: registerData.password
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        });
        
        localStorage.setItem('token', loginResponse.data.token);
        localStorage.setItem('user', JSON.stringify(loginResponse.data.user));
        localStorage.setItem('userId', loginResponse.data.user._id);
        
        if (loginResponse.data.user.role === 'teacher') {
          localStorage.setItem('teacherId', loginResponse.data.user._id);
        }
        alert('Inscription et connexion réussies!');
        navigate('/');
      }
    } catch (err) {
      console.error('Registration error:', err);
      
      // More detailed error handling
      if (err.response) {        // Server responded with error
        const errorMessage = err.response.data.error || err.response.data.message || 'Registration failed';
        alert(errorMessage);
        console.error('Server response error:', {
          status: err.response.status,
          data: err.response.data,
          headers: err.response.headers
        });
      } else if (err.request) {
        // Request was made but no response received
        alert('Erreur réseau. Veuillez vérifier votre connexion et réessayer.');
        console.error('Network error - no response:', err.request);
      } else {
        // Something else happened
        alert(err.message || 'Inscription échouée. Veuillez réessayer.');
        console.error('Unexpected error:', err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Gestion de la connexion
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', loginData);

      // Store the token and user object in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user)); // Store user object
      localStorage.setItem('userId', response.data.user._id); // Store userId separately

      // Navigate based on user role
      if (response.data.user.role === 'user') {
        navigate('/RoadmapIndex');
      } else if (response.data.user.role === 'teacher') {
        localStorage.setItem('teacherId', response.data.user._id);
        navigate('/HomeTeacher');
      } else if (response.data.user.role === 'admin') {
        navigate('/Dashboard');
      } else {
        navigate('/');      }

      alert('Connexion réussie!');
    } catch (err) {
      console.error('Login error:', err);
      
      // Better error handling for login
      if (err.response) {
        const errorMessage = err.response.data.error || err.response.data.message || 'Connexion échouée';
        if (errorMessage.includes('verify your email')) {
          alert('Veuillez vérifier votre e-mail avant de vous connecter. Consultez votre boîte de réception.');
        } else if (errorMessage.includes('Invalid email or password')) {
          alert('E-mail ou mot de passe invalide.');
        } else {
          alert(errorMessage);
        }
      } else if (err.request) {
        alert('Erreur réseau. Veuillez vérifier votre connexion et réessayer.');
      } else {
        alert('Erreur de connexion. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };  const handleGoogleRegister = async () => {
    try {
      console.log('Google Register button clicked - redirecting to:', 'http://localhost:3000/api/auth/google');
      // Use the original API route
      window.location.href = 'http://localhost:3000/api/auth/google';
    } catch (error) {      console.error('Error initiating Google authentication:', error);
      alert('Échec de l\'authentification Google.');
    }
  };const handleGoogleLogin = async () => {
    try {
      console.log('Google Login button clicked - redirecting to:', 'http://localhost:3000/api/auth/google');
      // Use the original API route
      window.location.href = 'http://localhost:3000/api/auth/google';
    } catch (error) {
      console.error('Error initiating Google authentication:', error);
      alert('Échec de l\'authentification Google.');
    }
  };

  const showLogin = () => {
    document.querySelector(".contentLR").classList.remove("right-panel-active");
  };
  
  const showRegister = () => {
    document.querySelector(".contentLR").classList.add("right-panel-active");
  };

  return (
    <div className="background-gradientLR">
      {loading && (
        <div className="spinner-overlayLR">
          <div className="spinnerLR"></div>
        </div>
      )}
      <div className="contentLR justify-content-center align-items-center d-flex shadow-lg" id="contentLR">
        {/* Formulaire d'inscription */}
        <Register
          handleRegister={handleRegister}
          handleRegisterChange={handleRegisterChange}
          registerData={registerData}
          showRegisterPassword={showRegisterPassword}
          setShowRegisterPassword={setShowRegisterPassword}
          passwordStrength={passwordStrength}
          handleGoogleRegister={handleGoogleRegister}
          recaptchaToken={recaptchaToken}
          setRecaptchaToken={setRecaptchaToken}
        />

        {/* Formulaire de connexion */}
        <Login
          handleLogin={handleLogin}
          handleLoginChange={handleLoginChange}
          showLoginPassword={showLoginPassword}
          setShowLoginPassword={setShowLoginPassword}
          handleGoogleLogin={handleGoogleLogin}
        />

        {/* Switch panel */}
        <div className="switch-contentLR">
          <div className="switchLR">
            <div className="switch-panelLR switch-leftLR">
              <h1>Hello, Again</h1>
              <p>We are happy to see you back</p>
              <button
                id="loginLR"
                className="button-loginRegister-login"
                onClick={showLogin}
              >
                Login
              </button>
            </div>
            <div className="switch-panelLR switch-rightLR">
              <h1>Welcome</h1>
              <p>Join Our Unique Platform, Explore a New Experience</p>
              <button
                id="registerLR"
                className="button-loginRegister-register"
                onClick={showRegister}
              >
                Register
              </button>
            </div>
          </div>        </div>
      </div>
    </div>
  );
}
export default LoginRegister;
