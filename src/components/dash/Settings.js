import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import Sidebar from "./Sidebar";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Grid,
  Paper,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Fade,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Snackbar,
  useTheme,
  Stack,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Palette as PaletteIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  IntegrationInstructions as IntegrationIcon, // Change this line
  Backup as BackupIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  CloudDownload as CloudDownloadIcon,
  CloudUpload as CloudUploadIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  ColorLens as ColorLensIcon,
} from '@mui/icons-material';
import '../../Css/dash/Settings.css';

// Comprehensive list of color variables from index.css
const allColorVariables = [
  // Primary
  '--Primary900-color', '--Primary800-color', '--Primary700-color',
  // Secondary
  '--Secondary1-color', '--Secondary2-color', '--Secondary3-color',
  // Grayscale
  '--Gray1-color', '--gray2-color', '--gray3-color', '--White-color',
  // Derived & General UI
  '--primary-color', '--secondary-color', '--hover-color',
  '--text-color', '--background-color', '--card-background-color',
  '--border-color', '--shadow-color'
];

// Grouped for UI
const colorGroups = {
  primary: ['--Primary900-color', '--Primary800-color', '--Primary700-color', '--primary-color', '--hover-color'],
  secondary: ['--Secondary1-color', '--Secondary2-color', '--Secondary3-color'],
  grayscale: ['--Gray1-color', '--gray2-color', '--gray3-color', '--White-color'],
  ui: ['--text-color', '--background-color', '--card-background-color', '--border-color', '--shadow-color', '--secondary-color']
};


const defaultLightColors = {
  '--Primary900-color': '#0A3D62', '--Primary800-color': '#1B6B93', '--Primary700-color': '#4682B4',
  '--Secondary1-color': '#FF8C00', '--Secondary2-color': '#3CB371', '--Secondary3-color': '#E6F2F8',
  '--Gray1-color': '#333333', '--gray2-color': '#666666', '--gray3-color': '#F0F0F0', '--White-color': '#FFFFFF',
  '--primary-color': '#4682B4', '--secondary-color': '#333333', '--hover-color': '#5A9BDC',
  '--text-color': '#333333', '--background-color': '#FFFFFF', '--card-background-color': '#FFFFFF',
  '--border-color': '#DDDDDD', '--shadow-color': 'rgba(0, 0, 0, 0.07)',
};

const defaultDarkColors = {
  '--Primary900-color': '#1E3A5F', '--Primary800-color': '#2A528A', '--Primary700-color': '#3B78B8',
  '--Secondary1-color': '#FFA500', '--Secondary2-color': '#50C878', '--Secondary3-color': '#102A43',
  '--Gray1-color': '#E5E5E5', '--gray2-color': '#A0A0A0', '--gray3-color': '#2C2C2C', '--White-color': '#1A1A1A',
  '--primary-color': '#3B78B8', '--secondary-color': '#E5E5E5', '--hover-color': '#4F8FD6',
  '--text-color': '#E5E5E5', '--background-color': '#1A1A1A', '--card-background-color': '#2C2C2C',
  '--border-color': '#444444', '--shadow-color': 'rgba(0, 0, 0, 0.2)',
};


const Settings = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [settings, setSettings] = useState({
    appName: 'EduMaster',
    version: '1.0.0',
    language: 'en',
    theme: 'light',
    fontSize: 'medium',
    notifications: { email: true, sms: false, push: true },
    security: { twoFactor: false, passwordPolicy: 'strong' },
    integrations: { apiKey: '', webhookUrl: '' },
    colors: { ...defaultLightColors },
    recaptchaSiteKey: process.env.REACT_APP_RECAPTCHA_SITE_KEY || '',
    emailNotifications: true,
    darkMode: false,
  });
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [restoreFileContent, setRestoreFileContent] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    // Apply colors dynamically to document root
    if (settings.colors && typeof settings.colors === 'object') {
      Object.entries(settings.colors).forEach(([varName, color]) => {
        if (varName && color) { // Ensure varName and color are valid
          document.documentElement.style.setProperty(varName, color);
        }
      });
    }
  }, [settings.colors]);

  useEffect(() => {
    // Toggle dark mode class on body when theme changes
    if (settings.theme === 'dark') {
      document.body.classList.add('dark-mode');
      // Optionally apply default dark colors if not customized, or let user customize them
      // For now, changing theme in appearance tab only toggles the class.
      // Colors are managed in the 'colors' tab.
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [settings.theme]);


  const fetchSettings = async () => {
    setLoading(true);
    try {
      // const response = await axios.get('/api/settings'); // Replace with your actual API endpoint
      // const fetchedData = response.data;
      
      // Placeholder: Simulate fetching data. Replace with actual API call.
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      const fetchedData = { // Simulate fetched data structure
          // appName: "EduMaster Pro", 
          // version: "1.0.1",
          // language: "fr",
          // theme: "light", // API might return the last saved theme
          // colors: { ...defaultLightColors, '--Primary700-color': '#FF0000' }, // Example of a customized color
          // ... other settings
      }; // Remove this placeholder block when API is ready


      setSettings(prevSettings => ({
        ...prevSettings, // Keep existing state as a base
        ...fetchedData,  // Override with fetched data
        // Ensure nested objects are properly merged or initialized
        notifications: { ...prevSettings.notifications, ...(fetchedData.notifications || {}) },
        security: { ...prevSettings.security, ...(fetchedData.security || {}) },
        integrations: { ...prevSettings.integrations, ...(fetchedData.integrations || {}) },
        colors: fetchedData.colors && Object.keys(fetchedData.colors).length > 0 
                ? { ...defaultLightColors, ...fetchedData.colors } // Merge with defaults to ensure all keys exist
                : { ...prevSettings.colors }, // Fallback to current or initial defaults
      }));
    } catch (err) {
      setError(t('error_loading_settings') + (err.message ? `: ${err.message}` : ''));
      // Ensure settings.colors remains an object even on error
      setSettings(prev => ({
        ...prev,
        colors: prev.colors || { ...defaultLightColors },
      }));
    } finally {
      setLoading(false);
    }
  };

  const validateSettings = () => {
    const errors = {};
    if (!settings.appName.trim()) {
      errors.appName = t('app_name_required');
    }
    if (!settings.version.trim()) {
      errors.version = t('version_required');
    }
    if (!settings.language) {
      errors.language = t('language_required');
    }
    if (!settings.integrations.apiKey.trim()) {
      errors.apiKey = t('api_key_required');
    }
    if (!settings.integrations.webhookUrl.trim()) {
      errors.webhookUrl = t('webhook_url_required');
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [name]: checked,
      },
    }));
  };

  const handleSecurityChange = (e) => {
    const { name, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      security: {
        ...prev.security,
        [name]: checked,
      },
    }));
  };

  const handleIntegrationChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      integrations: {
        ...prev.integrations,
        [name]: value,
      },
    }));
    setValidationErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleColorChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      colors: {
        ...(prev.colors || {}), // Ensure prev.colors is an object
        [name]: value,
      },
    }));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');
    setNotification('');
    setValidationErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotification('');
    if (!validateSettings()) {
      setError(t('please_fix_errors'));
      return;
    }
    setLoading(true);
    try {
      await axios.put('/api/settings', settings);
      setNotification(t('settings_updated_successfully'));
      setTimeout(() => setNotification(''), 3000);
    } catch (err) {
      setError(t('error_updating_settings'));
    } finally {
      setLoading(false);
    }
  };

  const handleBackup = async () => {
    try {
      const response = await axios.get('/api/settings/backup');
      const blob = new Blob([JSON.stringify(response.data)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'settings_backup.json';
      link.click();
      URL.revokeObjectURL(url);
      setNotification(t('backup_successful'));
      setTimeout(() => setNotification(''), 3000);
    } catch (err) {
      setError(t('error_backup'));
    }
  };

  const handleRestoreFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setRestoreFileContent(event.target.result);
      setShowRestoreConfirm(true);
    };
    reader.readAsText(file);
  };

  const confirmRestore = async () => {
    try {
      const restoredSettings = JSON.parse(restoreFileContent);
      await axios.post('/api/settings/restore', restoredSettings);
      setSettings(restoredSettings);
      setNotification(t('restore_successful'));
      setTimeout(() => setNotification(''), 3000);
    } catch (err) {
      setError(t('error_restore'));
    } finally {
      setShowRestoreConfirm(false);
      setRestoreFileContent(null);
    }
  };

  const cancelRestore = () => {
    setShowRestoreConfirm(false);
    setRestoreFileContent(null);
  };

  const handleResetDefaults = () => {
    // Resets all settings to application defaults, including theme to light and light colors
    const appDefaultSettings = {
      appName: 'EduMaster',
      version: '1.0.0',
      language: 'en',
      theme: 'light', // Reset theme to light
      fontSize: 'medium',
      notifications: { email: true, sms: false, push: true },
      security: { twoFactor: false, passwordPolicy: 'strong' },
      integrations: { apiKey: '', webhookUrl: '' },
      colors: { ...defaultLightColors }, // Reset colors to light defaults
      recaptchaSiteKey: process.env.REACT_APP_RECAPTCHA_SITE_KEY || '', // reCAPTCHA site key
      emailNotifications: true, // Email notifications toggle
      darkMode: false, // Dark mode toggle
    };
    setSettings(appDefaultSettings);
    
    // Apply theme and colors immediately
    document.body.classList.remove('dark-mode');
    Object.entries(defaultLightColors).forEach(([varName, color]) => {
        document.documentElement.style.setProperty(varName, color);
    });

    setNotification(t('defaults_restored'));
    setTimeout(() => setNotification(''), 3000);
  };

  const loadThemeColors = (themeType) => {
    const colorsToLoad = themeType === 'dark' ? defaultDarkColors : defaultLightColors;
    setSettings(prev => ({
      ...prev,
      colors: { ...colorsToLoad } // Replace current custom colors with selected theme defaults
    }));
    // Note: This only loads colors into the customizer. 
    // The actual theme (light/dark mode class on body) is controlled by settings.theme via Appearance tab.
    setNotification(t(themeType === 'dark' ? 'dark_theme_colors_loaded' : 'light_theme_colors_loaded'));
    setTimeout(() => setNotification(''), 3000);
  };

  // Help text for settings
  const helpTexts = {
    appName: t('help_app_name'),
    version: t('help_version'),
    language: t('help_language'),
    theme: t('help_theme'),
    fontSize: t('help_font_size'),
    notifications: t('help_notifications'),
    security: t('help_security'),
    integrations: t('help_integrations'),
    backup: t('help_backup'),
    colors: t('help_colors'),
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      localStorage.setItem('adminSettings', JSON.stringify(settings));
      toast.success('Paramètres sauvegardés avec succès');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde des paramètres');
    } finally {
      setLoading(false);
    }
  };

  const tabsData = [
    { label: t('general'), icon: <SettingsIcon />, value: 0 },
    { label: t('appearance'), icon: <PaletteIcon />, value: 1 },
    { label: t('notifications'), icon: <NotificationsIcon />, value: 2 },
    { label: t('security'), icon: <SecurityIcon />, value: 3 },
    { label: t('integrations'), icon: <IntegrationIcon />, value: 4 },
    { label: t('backup'), icon: <BackupIcon />, value: 5 },
    { label: t('color_palette'), icon: <ColorLensIcon />, value: 6 },
  ];

  return (
    <Box min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar />
      <Box 
        component="main" className="flex-1 ml-64 p-8" style={{ width:"80%" }}
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, sm: 3 },
          ml: { xs: 0, md: '240px' },
          backgroundColor: '#f8fafc',
          minHeight: '100vh'
        }}
      >
        {/* Header */}
        <Fade in timeout={800}>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography 
                  variant="h3" 
                  component="h1"
                  sx={{ 
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1
                  }}
                >
                  Paramètres du Système
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
                  Configurez et personnalisez votre environnement
                </Typography>
              </Box>
              <Stack direction="row" spacing={2}>
                <Tooltip title="Actualiser les paramètres">
                  <IconButton 
                    onClick={fetchSettings}
                    disabled={loading}
                    sx={{ 
                      backgroundColor: 'info.main',
                      color: 'white',
                      '&:hover': { backgroundColor: 'info.dark', transform: 'rotate(180deg)' },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
                <Button
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  onClick={handleSaveSettings}
                  disabled={loading}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
              </Stack>
            </Box>
            <Divider sx={{ borderColor: 'divider' }} />
          </Box>
        </Fade>

        {/* Alerts */}
        {error && (
          <Fade in>
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          </Fade>
        )}

        {/* Main Content */}
        <Fade in timeout={1000}>
          <Paper 
            sx={{ 
              backgroundColor: 'white',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden'
            }}
          >
            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: '#f8fafc' }}>
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': {
                    minHeight: 70,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: 'text.secondary',
                    '&.Mui-selected': {
                      color: 'primary.main',
                    },
                  },
                  '& .MuiTabs-indicator': {
                    height: 3,
                    borderRadius: '3px 3px 0 0',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  },
                }}
              >
                {tabsData.map((tab) => (
                  <Tab
                    key={tab.value}
                    icon={tab.icon}
                    label={tab.label}
                    iconPosition="start"
                    sx={{ gap: 1 }}
                  />
                ))}
              </Tabs>
            </Box>

            {/* Tab Content */}
            <Box sx={{ p: 4 }}>
              {/* General Settings */}
              {activeTab === 0 && (
                <Fade in timeout={600}>
                  <Box>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                      Paramètres Généraux
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Nom de l'application"
                          value={settings.appName}
                          onChange={(e) => setSettings({...settings, appName: e.target.value})}
                          error={!!validationErrors.appName}
                          helperText={validationErrors.appName}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Version"
                          value={settings.version}
                          onChange={(e) => setSettings({...settings, version: e.target.value})}
                          error={!!validationErrors.version}
                          helperText={validationErrors.version}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel>Langue par défaut</InputLabel>
                          <Select
                            value={settings.language}
                            onChange={(e) => setSettings({...settings, language: e.target.value})}
                            label="Langue par défaut"
                            sx={{ borderRadius: 2 }}
                          >
                            <MenuItem value="fr">Français</MenuItem>
                            <MenuItem value="en">English</MenuItem>
                            <MenuItem value="es">Español</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Box>
                </Fade>
              )}

              {/* Appearance Settings */}
              {activeTab === 1 && (
                <Fade in timeout={600}>
                  <Box>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                      Personnalisation de l'Apparence
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Card sx={{ p: 3, boxShadow: 2, borderRadius: 2 }}>
                          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PaletteIcon color="primary" />
                            Thème
                          </Typography>
                          <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel>Sélectionner un thème</InputLabel>
                            <Select
                              value={settings.theme}
                              onChange={(e) => setSettings({...settings, theme: e.target.value})}
                              label="Sélectionner un thème"
                              sx={{ borderRadius: 2 }}
                            >
                              <MenuItem value="light">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <LightModeIcon />
                                  Clair
                                </Box>
                              </MenuItem>
                              <MenuItem value="dark">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <DarkModeIcon />
                                  Sombre
                                </Box>
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Card sx={{ p: 3, boxShadow: 2, borderRadius: 2 }}>
                          <Typography variant="h6" gutterBottom>
                            Taille de police
                          </Typography>
                          <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel>Taille</InputLabel>
                            <Select
                              value={settings.fontSize}
                              onChange={(e) => setSettings({...settings, fontSize: e.target.value})}
                              label="Taille"
                              sx={{ borderRadius: 2 }}
                            >
                              <MenuItem value="small">Petite</MenuItem>
                              <MenuItem value="medium">Moyenne</MenuItem>
                              <MenuItem value="large">Grande</MenuItem>
                            </Select>
                          </FormControl>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>
                </Fade>
              )}

              {/* Notifications Settings */}
              {activeTab === 2 && (
                <Fade in timeout={600}>
                  <Box>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                      Paramètres de Notification
                    </Typography>
                    <Grid container spacing={3}>
                      {Object.entries(settings.notifications).map(([key, value]) => (
                        <Grid item xs={12} md={4} key={key}>
                          <Card sx={{ p: 3, boxShadow: 2, borderRadius: 2, height: '100%' }}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={value}
                                  onChange={(e) => setSettings({
                                    ...settings,
                                    notifications: {
                                      ...settings.notifications,
                                      [key]: e.target.checked
                                    }
                                  })}
                                  color="primary"
                                />
                              }
                              label={
                                <Box>
                                  <Typography variant="subtitle1" fontWeight="medium">
                                    {key === 'email' ? 'Email' : key === 'sms' ? 'SMS' : 'Push'}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {key === 'email' ? 'Notifications par email' : 
                                     key === 'sms' ? 'Notifications par SMS' : 
                                     'Notifications push'}
                                  </Typography>
                                </Box>
                              }
                              labelPlacement="end"
                              sx={{ alignItems: 'flex-start', m: 0 }}
                            />
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Fade>
              )}

              {/* Security Settings */}
              {activeTab === 3 && (
                <Fade in timeout={600}>
                  <Box>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                      Paramètres de Sécurité
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Card sx={{ p: 3, boxShadow: 2, borderRadius: 2 }}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={settings.security.twoFactor}
                                onChange={(e) => setSettings({
                                  ...settings,
                                  security: {
                                    ...settings.security,
                                    twoFactor: e.target.checked
                                  }
                                })}
                                color="primary"
                              />
                            }
                            label={
                              <Box>
                                <Typography variant="subtitle1" fontWeight="medium">
                                  Authentification à deux facteurs
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Sécurité renforcée pour votre compte
                                </Typography>
                              </Box>
                            }
                            labelPlacement="end"
                            sx={{ alignItems: 'flex-start', m: 0 }}
                          />
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Card sx={{ p: 3, boxShadow: 2, borderRadius: 2 }}>
                          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                            Politique de mot de passe
                          </Typography>
                          <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel>Niveau de sécurité</InputLabel>
                            <Select
                              value={settings.security.passwordPolicy}
                              onChange={(e) => setSettings({
                                ...settings,
                                security: {
                                  ...settings.security,
                                  passwordPolicy: e.target.value
                                }
                              })}
                              label="Niveau de sécurité"
                              sx={{ borderRadius: 2 }}
                            >
                              <MenuItem value="weak">Faible</MenuItem>
                              <MenuItem value="medium">Moyen</MenuItem>
                              <MenuItem value="strong">Fort</MenuItem>
                            </Select>
                          </FormControl>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>
                </Fade>
              )}

              {/* Integrations Settings */}
              {activeTab === 4 && (
                <Fade in timeout={600}>
                  <Box>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                      Intégrations Externes
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Clé API"
                          value={settings.integrations.apiKey}
                          onChange={(e) => setSettings({
                            ...settings,
                            integrations: {
                              ...settings.integrations,
                              apiKey: e.target.value
                            }
                          })}
                          error={!!validationErrors.apiKey}
                          helperText={validationErrors.apiKey}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="URL Webhook"
                          value={settings.integrations.webhookUrl}
                          onChange={(e) => setSettings({
                            ...settings,
                            integrations: {
                              ...settings.integrations,
                              webhookUrl: e.target.value
                            }
                          })}
                          error={!!validationErrors.webhookUrl}
                          helperText={validationErrors.webhookUrl}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Fade>
              )}

              {/* Backup Settings */}
              {activeTab === 5 && (
                <Fade in timeout={600}>
                  <Box>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                      Sauvegarde et Restauration
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Card sx={{ p: 3, boxShadow: 2, borderRadius: 2, textAlign: 'center' }}>
                          <CloudDownloadIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                          <Typography variant="h6" gutterBottom>
                            Télécharger une sauvegarde
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Exportez vos paramètres actuels
                          </Typography>
                          <Button
                            variant="contained"
                            onClick={handleBackup}
                            disabled={loading}
                            startIcon={<CloudDownloadIcon />}
                            sx={{ borderRadius: 2 }}
                          >
                            Télécharger
                          </Button>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Card sx={{ p: 3, boxShadow: 2, borderRadius: 2, textAlign: 'center' }}>
                          <CloudUploadIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
                          <Typography variant="h6" gutterBottom>
                            Restaurer les paramètres
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Importez une sauvegarde existante
                          </Typography>
                          <input
                            type="file"
                            accept="application/json"
                            onChange={handleRestoreFileChange}
                            style={{ display: 'none' }}
                            id="restore-file-input"
                          />
                          <label htmlFor="restore-file-input">
                            <Button
                              variant="outlined"
                              component="span"
                              disabled={loading}
                              startIcon={<CloudUploadIcon />}
                              sx={{ borderRadius: 2 }}
                            >
                              Sélectionner un fichier
                            </Button>
                          </label>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>
                </Fade>
              )}

              {/* Color Palette Settings */}
              {activeTab === 6 && (
                <Fade in timeout={600}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        Palette de Couleurs
                      </Typography>
                      <Stack direction="row" spacing={2}>
                        <Button
                          variant="outlined"
                          startIcon={<LightModeIcon />}
                          onClick={() => loadThemeColors('light')}
                          sx={{ borderRadius: 2 }}
                        >
                          Thème Clair
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<DarkModeIcon />}
                          onClick={() => loadThemeColors('dark')}
                          sx={{ borderRadius: 2 }}
                        >
                          Thème Sombre
                        </Button>
                      </Stack>
                    </Box>

                    {Object.entries(colorGroups).map(([groupName, vars]) => (
                      <Card key={groupName} sx={{ mb: 3, p: 3, boxShadow: 2, borderRadius: 2 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                          {groupName.replace(/([A-Z])/g, ' $1')} Colors
                        </Typography>
                        <Grid container spacing={2}>
                          {vars.map((varName) => (
                            <Grid item xs={12} sm={6} md={4} key={varName}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <input
                                  type="color"
                                  value={(settings.colors && settings.colors[varName]) ? settings.colors[varName] : (defaultLightColors[varName] || '#000000')}
                                  onChange={(e) => handleColorChange(e)}
                                  name={varName}
                                  style={{
                                    width: 50,
                                    height: 50,
                                    border: 'none',
                                    borderRadius: 8,
                                    cursor: 'pointer'
                                  }}
                                />
                                <Box>
                                  <Typography variant="body2" fontWeight="medium">
                                    {varName.replace('--', '').replace(/-/g, ' ').replace('color', ' Color')}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {(settings.colors && settings.colors[varName]) ? settings.colors[varName] : (defaultLightColors[varName] || '#000000')}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Card>
                    ))}
                  </Box>
                </Fade>
              )}
            </Box>
          </Paper>
        </Fade>

        {/* Restore Confirmation Dialog */}
        <Dialog
          open={showRestoreConfirm}
          onClose={cancelRestore}
          PaperProps={{ 
            sx: { 
              borderRadius: 3, 
              boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
              minWidth: 400
            } 
          }}
        >
          <DialogTitle sx={{ fontWeight: 'bold', pb: 1, borderBottom: '1px solid #e2e8f0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WarningIcon color="warning" />
              Confirmer la restauration
            </Box>
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <DialogContentText sx={{ fontSize: '1rem', lineHeight: 1.6 }}>
              Êtes-vous sûr de vouloir restaurer ces paramètres ? Cette action remplacera tous vos paramètres actuels.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid #e2e8f0' }}>
            <Button 
              onClick={cancelRestore}
              sx={{ 
                borderRadius: 2, 
                textTransform: 'none',
                fontWeight: 600,
                px: 3
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={confirmRestore}
              variant="contained"
              color="warning"
              startIcon={<CheckCircleIcon />}
              sx={{ 
                borderRadius: 2, 
                textTransform: 'none',
                fontWeight: 600,
                px: 3
              }}
            >
              Confirmer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success Snackbar */}
        <Snackbar
          open={!!notification}
          autoHideDuration={6000}
          onClose={() => setNotification('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setNotification('')}
            severity="success"
            variant="filled"
            sx={{ 
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              fontSize: '0.95rem'
            }}
          >
            {notification}
          </Alert>
        </Snackbar>
      </Box>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="mt-16"
      />
    </Box>
  );
};

export default Settings;