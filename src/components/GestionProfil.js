import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../Css/GestionProfilNew.css";
import { useTranslation } from 'react-i18next';
import {
  Container,
  TextField,
  Button,
  Typography,
  CardContent,
  CircularProgress,
  Snackbar,
  Alert,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Paper,
  Divider,
  Grid,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  CameraAlt as CameraIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  AccountCircle as AccountIcon,
  Delete as DeleteIcon,
  Upload as UploadIcon,
} from "@mui/icons-material";

function GestionProfil() {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "info" });
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [removeImageDialogOpen, setRemoveImageDialogOpen] = useState(false);

  // Validation errors par champ
  const [errors, setErrors] = useState({ firstName: "", lastName: "", email: "", image: "" });

  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?._id;
  const token = localStorage.getItem("token");
  const inputFileRef = useRef(null);

  useEffect(() => {
    if (!userId || !token) {
      setNotification({ open: true, message: t('user_not_connected'), severity: "error" });
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        if (response.data.profileImage) {
          setPreviewImage(`http://localhost:3000${response.data.profileImage}`);
        }
      } catch (err) {
        setNotification({
          open: true,
          message:
            err.response?.status === 401
              ? t('session_expired')
              : t('error_fetching_user_data'),
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, token, t]);

  // Validation en temps réel
  const validateField = (name, value) => {
    let error = "";
    if (name === "firstName" || name === "lastName") {
      if (!value.trim()) error = t('required_field');
      else if (value.trim().length < 2) error = t('min_2_chars');
    }
    if (name === "email") {
      if (!value.trim()) error = t('required_field');
      else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) error = t('invalid_email_format');
      }
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };

  // Validation complète avant envoi
  const validateForm = () => {
    const v1 = validateField("firstName", user.firstName || "");
    const v2 = validateField("lastName", user.lastName || "");
    const v3 = validateField("email", user.email || "");
    return v1 && v2 && v3;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
    validateField(name, value);
  };

  // Upload image avec validation taille/type
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, image: t('supported_formats') }));
      e.target.value = null;
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: t('max_size_2mb') }));
      e.target.value = null;
      return;
    }

    setErrors((prev) => ({ ...prev, image: "" }));
    setProfileImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  // Dialog confirmation suppression image
  const confirmRemoveImage = () => setRemoveImageDialogOpen(true);
  const cancelRemoveImage = () => setRemoveImageDialogOpen(false);
  const handleRemoveImage = () => {
    setProfileImage(null);
    setPreviewImage(null);
    if (inputFileRef.current) inputFileRef.current.value = null;
    setRemoveImageDialogOpen(false);
  };

  // Soumission formulaire
  const handleUpdate = async () => {
    if (!validateForm()) {
      setNotification({ open: true, message: t('fix_errors_before_submit'), severity: "error" });
      return;
    }
    if (errors.image) {
      setNotification({ open: true, message: t('fix_image_before_submit'), severity: "error" });
      return;
    }

    setUpdating(true);

    const formData = new FormData();
    formData.append("firstName", user.firstName.trim());
    formData.append("lastName", user.lastName.trim());
    formData.append("email", user.email.trim());
    formData.append("role", user.role);
    if (profileImage) {
      formData.append("profileImage", profileImage);
    } else if (previewImage === null) {
      formData.append("removeImage", "true");
    }

    try {
      const response = await axios.put(`http://localhost:3000/api/users/${userId}`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      setNotification({ open: true, message: t('profile_updated_successfully'), severity: "success" });
      setUser(response.data);
      setProfileImage(null);
      if (response.data.profileImage) setPreviewImage(`http://localhost:3000${response.data.profileImage}`);
      else setPreviewImage(null);
      setErrors({ firstName: "", lastName: "", email: "", image: "" });
    } catch (err) {
      setNotification({
        open: true,
        message: err.response?.data?.message || t('profile_update_error'),
        severity: "error",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }} className="profile-containerGestionProfil">
      <Paper elevation={3} className="profile-card">
        {/* Header avec titre et icône */}
        <Box 
          className="profile-header"
          sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'var(--Primary700-color)',
            p: 3,
            textAlign: 'center'
          }}
        >
          <AccountIcon sx={{ fontSize: 48, mb: 1 }} className="icon-hover" />
          <Typography variant="h4" component="h1" fontWeight="bold">
            {t('profile_management')}
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9, mt: 1 }}>
            {t('manage_personal_info')}
          </Typography>
        </Box>

        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={4}>
            {/* Section Image de profil */}
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom className="section-label">
                  <CameraIcon sx={{ mr: 1 }} />
                  {t('profile_photo')}
                </Typography>
                
                <Box className="profile-avatar-container" sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                  <Avatar
                    src={previewImage}
                    className="profile-avatar"
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      mx: 'auto',
                      border: '4px solid #f0f0f0',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 60 }} />
                  </Avatar>
                  {previewImage && (
                    <IconButton
                      color="error"
                      onClick={confirmRemoveImage}
                      className="remove-image-btn"
                      sx={{ 
                        position: 'absolute', 
                        top: -8, 
                        right: -8,
                        backgroundColor: 'white',
                        boxShadow: 2,
                        '&:hover': { backgroundColor: '#ffebee' }
                      }}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>

                <Box className="upload-section" sx={{ mt: 2, p: 2, borderRadius: 2 }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={inputFileRef}
                    style={{ display: 'none' }}
                    id="profile-image-input"
                  />
                  <label htmlFor="profile-image-input">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<UploadIcon />}
                      className="action-button"
                      sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        px: 3
                      }}
                    >
                      {t('choose_image')}
                    </Button>
                  </label>
                  {errors.image && (
                    <Typography color="error" variant="caption" className="field-error" sx={{ display: 'block', mt: 1 }}>
                      {errors.image}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>

            {/* Section Informations personnelles */}
            <Grid item xs={12} md={8}>
              <Box className="user-info-section">
                <Typography variant="h6" gutterBottom className="section-label">
                  <EditIcon sx={{ mr: 1 }} />
                  {t('personal_information')}
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label={t('first_name')}
                    name="firstName"
                    value={user?.firstName || ""}
                    onChange={handleChange}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    required
                    className="form-field"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="action" className="icon-hover" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ 
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />

                  <TextField
                    fullWidth
                    label={t('last_name')}
                    name="lastName"
                    value={user?.lastName || ""}
                    onChange={handleChange}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    required
                    className="form-field"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="action" className="icon-hover" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ 
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />

                  <TextField
                    fullWidth
                    label={t('email')}
                    name="email"
                    type="email"
                    value={user?.email || ""}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    required
                    className="form-field"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" className="icon-hover" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ 
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />

                  <TextField
                    fullWidth
                    label={t('role')}
                    value={user?.role || ""}
                    disabled
                    className="form-field"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BadgeIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ 
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                </Box>

                <Divider className="custom-divider" sx={{ my: 3 }} />

                {/* Informations compte */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccountIcon sx={{ mr: 1, fontSize: 18 }} className="icon-hover" />
                    {t('account_created')} : {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : ""}
                  </Typography>
                </Box>

                {/* Bouton d'action */}
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleUpdate}
                    disabled={
                      updating ||
                      !user?.firstName ||
                      !user?.lastName ||
                      !user?.email ||
                      errors.firstName !== "" ||
                      errors.lastName !== "" ||
                      errors.email !== "" ||
                      errors.image !== ""
                    }
                    startIcon={updating ? <CircularProgress size={18} color="inherit" className="custom-spinner" /> : <SaveIcon />}
                    className="save-btn action-button"
                    sx={{
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                        boxShadow: '0 6px 16px rgba(102, 126, 234, 0.6)',
                      },
                      '&:disabled': {
                        background: '#ccc',
                        boxShadow: 'none',
                      }
                    }}
                  >
                    {updating ? t('saving') : t('save_changes')}
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Paper>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          className={notification.severity === 'success' ? 'notification-success' : 'notification-error'}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Dialog confirmation suppression image */}
      <Dialog
        open={removeImageDialogOpen}
        onClose={cancelRemoveImage}
        className="custom-dialog"
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <DeleteIcon sx={{ mr: 1, color: 'error.main' }} className="icon-hover" />
          {t('confirm_delete_image')}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {t('confirm_delete_image_text')}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={cancelRemoveImage}
            variant="outlined"
            className="action-button"
            sx={{ borderRadius: 2 }}
          >
            {t('cancel')}
          </Button>
          <Button 
            onClick={handleRemoveImage} 
            color="error" 
            autoFocus
            variant="contained"
            className="action-button"
            sx={{ borderRadius: 2 }}
          >
            {t('delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default GestionProfil;
