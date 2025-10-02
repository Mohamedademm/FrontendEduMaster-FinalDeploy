import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha'; // Import ReCAPTCHA
import { ToastContainer, toast } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import react-toastify CSS
import '../../Css/creationM.css';
import Sidebar from './Sidebar';

function SignupManager() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'admin',  // Role set to admin for this form
  });

  const [error, setError] = useState('');
  const [admins, setAdmins] = useState([]); // To store admins fetched from API
  const [recaptchaValue, setRecaptchaValue] = useState(null); // State for reCAPTCHA
  const navigate = useNavigate();

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get('http://localhost:3000/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const adminUsers = response.data.filter(user => user.role === 'admin');
      setAdmins(adminUsers);
    } catch (err) {
      console.error('Error fetching admin users:', err);
      setError(t('error_fetching_admins'));
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError(t('all_fields_are_required'));
      toast.error(t('all_fields_are_required'));
      return;
    }
    if (formData.password.length < 6) {
      setError(t('password_min_length'));
      toast.error(t('password_min_length'));
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError(t('invalid_email_format'));
      toast.error(t('invalid_email_format'));
      return;
    }
    if (!recaptchaValue) {
      setError(t('recaptcha_validation_required'));
      toast.error(t('recaptcha_validation_required'));
      return;
    }

    console.log('Submitting form data:', { ...formData, recaptchaToken: recaptchaValue });
    try {
      const authToken = localStorage.getItem("token"); // Get auth token of the current admin
      if (!authToken) {
        setError(t('authentication_token_missing'));
        toast.error(t('authentication_token_missing'));
        return;
      }

      const response = await axios.post('http://localhost:3000/api/auth/register', {
        ...formData,
        recaptchaToken: recaptchaValue,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`, // Send auth token
        },
      });

      if (response.status === 201) {
        toast.success(t('manager_created_successfully'));
        setFormData({ firstName: '', lastName: '', email: '', password: '', role: 'admin' }); // Reset form
        setRecaptchaValue(null); // Reset reCAPTCHA
        if (window.grecaptcha) { // Ensure grecaptcha is available
            window.grecaptcha.reset(); // Explicitly reset reCAPTCHA widget
        }
        fetchAdmins(); // Refresh admin list
        // navigate('/dashboard'); // Optional: Redirect if needed
      } else {
        // This case might not be hit if backend sends non-201 status as error
        const errorMessage = response.data.message || t('failed_to_create_manager');
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error('API call failed:', err.response || err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
        toast.error(err.response.data.error);
      } else {
        setError(t('error_occurred_try_again'));
        toast.error(t('error_occurred_try_again'));
      }
      if (window.grecaptcha) {
        window.grecaptcha.reset(); // Reset reCAPTCHA on error
      }
      setRecaptchaValue(null);
    }
  };

  return (
    <div className="AdminCours">
      <Sidebar />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Box className="creationM-container">
        <Typography variant="h4" gutterBottom>
          {t('manager_signup')}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} className="creationM-field">
              <TextField
                label={t('first_name')}
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} className="creationM-field">
              <TextField
                label={t('last_name')}
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} className="creationM-field">
              <TextField
                label={t('email')}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} className="creationM-field">
              <TextField
                label={t('password')}
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                required
                inputProps={{ minLength: 6 }}
              />
            </Grid>
            {/* reCAPTCHA */}
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <ReCAPTCHA
                sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"} // Use your site key
                onChange={handleRecaptchaChange}
                onExpired={() => setRecaptchaValue(null)}
                onError={() => setRecaptchaValue(null)}
              />
            </Grid>
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              type="submit"
              className="creationM-button"
              variant="contained"
              disabled={!recaptchaValue} // Disable button if reCAPTCHA not validated
            >
              {t('sign_up')}
            </Button>
          </Box>
        </form>
        {error && (
          <Typography variant="body1" color="error" sx={{ mt: 2, textAlign: 'center' }}>
            {/* Error is now shown via toast, this can be removed or kept for non-toast errors if any */}
            {/* {error} */}
          </Typography>
        )}

        {/* Admin Users Table */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          {t('list_of_admins')}
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('first_name')}</TableCell>
                <TableCell>{t('last_name')}</TableCell>
                <TableCell>{t('email')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin._id}>
                  <TableCell sx={{ color: 'white' }}>{admin.firstName}</TableCell>
                  <TableCell sx={{ color: 'white' }}>{admin.lastName}</TableCell>
                  <TableCell sx={{ color: 'white' }}>{admin.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
}

export default SignupManager;
