import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  Button,
  Grid,
  Avatar,
  Divider,
  TextField,
  InputAdornment,
  Fade,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextareaAutosize,
} from '@mui/material';
import {
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Reply as ReplyIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  ContactMail as ContactMailIcon,
  Message as MessageIcon,
  Send as SendIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
// import '../../Css/dash/AdminContactMessages.css'; // Removed for MUI styling
import Sidebar from "./Sidebar";

const AdminContactMessages = () => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/contact', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      // Handle the new API response structure
      if (response.data.success) {
        setMessages(response.data.messages || []);
        setFilteredMessages(response.data.messages || []);
      } else {
        setMessages([]);
        setFilteredMessages([]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching contact messages:', err);
        if (err.response?.status === 403) {
        setError(t('access_denied_admin_required', 'Accès refusé. Privilèges administrateur requis.'));
      } else if (err.response?.status === 401) {
        setError(t('session_expired_please_login', 'Session expirée. Veuillez vous reconnecter.'));
      } else {
        setError(t('failed_loading_messages_retry', 'Échec du chargement des messages. Veuillez réessayer.'));
      }
      
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Filter and sort messages
  useEffect(() => {
    let filtered = messages.filter((msg) =>
      msg.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort messages
    filtered.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.date) - new Date(a.date);
      } else if (sortBy === 'oldest') {
        return new Date(a.date) - new Date(b.date);
      } else if (sortBy === 'name') {
        return (a.nom || '').localeCompare(b.nom || '');
      }
      return 0;
    });

    setFilteredMessages(filtered);
  }, [messages, searchTerm, sortBy]);

  const getInitials = (name) => {
    if (!name) return 'A';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (email) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];
    const index = email ? email.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));    if (diffDays === 1) return t('today', 'Aujourd\'hui');
    if (diffDays === 2) return t('yesterday', 'Hier');
    if (diffDays <= 7) return `${t('days_ago', 'Il y a')} ${diffDays} ${t('days', 'jours')}`;
    return date.toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Function to mark message as read
  const markAsRead = async (messageId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3000/api/contact/${messageId}/read`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      // Update local state
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === messageId ? { ...msg, read: true } : msg
        )
      );
      
      // Update filtered messages as well
      setFilteredMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === messageId ? { ...msg, read: true } : msg
        )
      );
      
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  };
  // Function to delete a message
  const deleteMessage = async (messageId) => {
    if (!window.confirm(t('confirm_delete_message', 'Êtes-vous sûr de vouloir supprimer ce message ?'))) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/contact/${messageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Remove from local state
      setMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageId));
      setFilteredMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageId));
        } catch (err) {
      console.error('Error deleting message:', err);
      alert(t('error_deleting_message', 'Erreur lors de la suppression du message'));
    }
  };

  // Function to send response to a message
  const sendResponse = async (messageId, response) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:3000/api/contact/${messageId}/respond`, 
        { response }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
      
      // Update local state
      const updatedMessage = {
        responded: true,
        adminResponse: response,
        respondedAt: new Date().toISOString(),
        read: true
      };
      
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === messageId ? { ...msg, ...updatedMessage } : msg
        )
      );
      
      setFilteredMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === messageId ? { ...msg, ...updatedMessage } : msg
        )
      );
        alert(t('response_sent_successfully', 'Réponse envoyée avec succès !'));
      
    } catch (err) {
      console.error('Error sending response:', err);
      alert(t('error_sending_response', 'Erreur lors de l\'envoi de la réponse'));
    }
  };

  // Function to handle email reply with better formatting
  const handleEmailReply = (message) => {
    // Mark message as read when replying
    if (!message.read) {
      markAsRead(message.id);
    }    // Create a well-formatted email template
    const subject = encodeURIComponent(`${t('email_subject_prefix', 'RE: Votre demande de contact')} - ${t('platform_name', 'Platform EduMaster')}`);
    
    const emailBody = encodeURIComponent(`${t('email_greeting', 'Bonjour')} ${message.nom},

${t('email_thanks', 'Merci de nous avoir contactés via notre plateforme EduMaster.')}

${t('email_regarding', 'Concernant votre message du')} ${formatDate(message.date)} :
"${message.message}"

${t('email_received', 'Nous avons bien reçu votre demande et nous vous répondons personnellement.')}

[${t('email_your_response', 'Votre réponse ici')}]

${t('email_regards', 'Cordialement')},
${t('email_team', 'L\'équipe EduMaster')}

---
${t('platform_name', 'Platform EduMaster')} - ${t('platform_tagline', 'Votre partenaire d\'apprentissage')}
Email: admin@edumaster.com
${t('website', 'Site web')}: https://edumaster.com`);

    const mailtoLink = `mailto:${message.email}?subject=${subject}&body=${emailBody}`;
    
    // Try to open email client
    try {
      window.location.href = mailtoLink;
    } catch (error) {
      // Fallback: copy email to clipboard and show notification
      console.error('Error opening email client:', error);
      copyEmailToClipboard(message);
    }
  };

  // Fallback function to copy email details to clipboard
  const copyEmailToClipboard = (message) => {
    const emailText = `À: ${message.email}
Objet: RE: Votre demande de contact - Platform EduMaster

Bonjour ${message.nom},

Merci de nous avoir contactés via notre plateforme EduMaster.

Concernant votre message du ${formatDate(message.date)} :
"${message.message}"

Nous avons bien reçu votre demande et nous vous répondons personnellement.

[Votre réponse ici]

Cordialement,
L'équipe EduMaster`;

    navigator.clipboard.writeText(emailText).then(() => {
      alert('Les détails de l\'email ont été copiés dans le presse-papiers. Vous pouvez maintenant les coller dans votre client email.');
    }).catch(err => {
      console.error('Erreur lors de la copie:', err);
      alert(`Impossible d'ouvrir le client email. Voici les détails à copier manuellement:\n\nÀ: ${message.email}\nObjet: RE: Votre demande de contact`);
    });
  };

  const handleOpenResponseDialog = (message) => {
    setSelectedMessage(message);
    setReplyText('');
    setReplyDialogOpen(true);
  };

  const handleCloseResponseDialog = () => {
    setReplyDialogOpen(false);
    setSelectedMessage(null);
    setReplyText('');
  };

  const handleSendResponse = async () => {
    if (!replyText.trim()) {
      return;
    }

    await sendResponse(selectedMessage.id, replyText.trim());
    handleCloseResponseDialog();
  };

  // Function to open reply dialog
  const openReplyDialog = (message) => {
    setSelectedMessage(message);
    setReplyText(`Bonjour ${message.nom},

Merci de nous avoir contactés via notre plateforme EduMaster.

Concernant votre message :
"${message.message}"

[Votre réponse ici]

Cordialement,
L'équipe EduMaster`);
    setReplyDialogOpen(true);
    
    // Mark as read when opening reply dialog
    if (!message.read) {
      markAsRead(message.id);
    }
  };

  // Function to close reply dialog
  const closeReplyDialog = () => {
    setReplyDialogOpen(false);
    setSelectedMessage(null);
    setReplyText('');
  };

  // Function to send quick reply
  const sendQuickReply = () => {
    if (!selectedMessage || !replyText.trim()) {
      alert('Veuillez saisir une réponse');
      return;
    }

    // Send response via API
    sendResponse(selectedMessage.id, replyText);
    closeReplyDialog();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <Sidebar />
        <Box 
          component="main"
          sx={{ 
            flexGrow: 1, 
            p: 3,
            ml: { xs: 0, md: '240px' },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CircularProgress size={60} thickness={4} />
          <Typography sx={{ mt: 3, color: "text.secondary", fontSize: '1.1rem' }}>
            Chargement des messages...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <Sidebar />
        <Box 
          component="main"
          sx={{ 
            flexGrow: 1, 
            p: 3,
            ml: { xs: 0, md: '240px' }
          }}
        >
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: 2,
              '& .MuiAlert-message': { fontSize: '1rem' }
            }}
          >
            {error}
          </Alert>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar />
      <Box 
        component="main"
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
                  Messages de Contact
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
                    Gestion des demandes de contact
                  </Typography>
                  <Chip 
                    icon={<ContactMailIcon />}
                    label={`${filteredMessages.length} message${filteredMessages.length > 1 ? 's' : ''}`}
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              </Box>
              <Tooltip title="Actualiser les messages">
                <IconButton 
                  onClick={fetchMessages}
                  sx={{ 
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': { backgroundColor: 'primary.dark', transform: 'rotate(180deg)' },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Divider sx={{ borderColor: 'divider' }} />
          </Box>
        </Fade>

        {/* Statistics Card */}
        <Fade in timeout={1000}>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <Card 
                sx={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                  borderRadius: 3,
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                        Total Messages
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {messages.length}
                      </Typography>
                    </Box>
                    <MessageIcon sx={{ fontSize: 48, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Card 
                sx={{ 
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  boxShadow: '0 8px 32px rgba(240, 147, 251, 0.3)',
                  borderRadius: 3,
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(240, 147, 251, 0.4)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                        Aujourd'hui
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {messages.filter(msg => {
                          const today = new Date();
                          const msgDate = new Date(msg.date);
                          return msgDate.toDateString() === today.toDateString();
                        }).length}
                      </Typography>
                    </Box>
                    <CalendarIcon sx={{ fontSize: 48, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card 
                sx={{ 
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: 'white',
                  boxShadow: '0 8px 32px rgba(79, 172, 254, 0.3)',
                  borderRadius: 3,
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(79, 172, 254, 0.4)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                        Cette Semaine
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {messages.filter(msg => {
                          const weekAgo = new Date();
                          weekAgo.setDate(weekAgo.getDate() - 7);
                          const msgDate = new Date(msg.date);
                          return msgDate >= weekAgo;
                        }).length}
                      </Typography>
                    </Box>
                    <EmailIcon sx={{ fontSize: 48, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Fade>

        {/* Filters */}
        <Fade in timeout={1200}>
          <Paper 
            sx={{ 
              p: 3, 
              mb: 3, 
              backgroundColor: 'white',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <FilterIcon sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                Filtres & Recherche
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Rechercher dans les messages"
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Nom, email ou contenu du message..."
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  select
                  fullWidth
                  label="Trier par"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  SelectProps={{ native: true }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  <option value="newest">Plus récents</option>
                  <option value="oldest">Plus anciens</option>
                  <option value="name">Nom (A-Z)</option>
                </TextField>
              </Grid>
            </Grid>
          </Paper>
        </Fade>

        {/* Messages List */}
        <Fade in timeout={1400}>
          <Box>
            {filteredMessages.length === 0 ? (
              <Paper 
                sx={{ 
                  p: 8, 
                  textAlign: 'center',
                  backgroundColor: 'white',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                  borderRadius: 3,
                }}
              >
                <ContactMailIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  Aucun message trouvé
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {searchTerm ? 'Aucun message ne correspond à votre recherche.' : 'Aucun message de contact pour le moment.'}
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {filteredMessages.map((msg, index) => (
                  <Grid item xs={12} key={msg.id || index}>
                    <Fade in timeout={1600 + index * 100}>
                      <Card 
                        sx={{ 
                          backgroundColor: 'white',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                          borderRadius: 3,
                          border: '1px solid',
                          borderColor: 'divider',
                          overflow: 'hidden',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          {/* Header */}
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar
                                sx={{
                                  bgcolor: getAvatarColor(msg.email),
                                  width: 56,
                                  height: 56,
                                  fontSize: '1.25rem',
                                  fontWeight: 'bold'
                                }}
                              >
                                {getInitials(msg.nom)}
                              </Avatar>
                              <Box>
                                <Typography variant="h6" fontWeight="bold" color="text.primary">
                                  {msg.nom || 'Anonyme'}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                  <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                  <Typography variant="body2" color="text.secondary">
                                    {msg.email}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                              <Chip 
                                icon={<CalendarIcon />}
                                label={formatDate(msg.date)}
                                size="small"
                                variant="outlined"
                                color="primary"
                              />
                            </Box>
                          </Box>

                          <Divider sx={{ my: 2 }} />

                          {/* Message Content */}
                          <Box sx={{ mb: 3 }}>
                            <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.7 }}>
                              {msg.message}
                            </Typography>
                          </Box>                          {/* Footer */}
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              {!msg.read && (
                                <Chip
                                  label="Non lu"
                                  size="small"
                                  color="warning"
                                  variant="outlined"
                                />
                              )}
                              {msg.responded && (
                                <Chip
                                  label="Répondu"
                                  size="small"
                                  color="success"
                                  variant="outlined"
                                />
                              )}
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              {!msg.read && (
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => markAsRead(msg.id)}
                                  sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 500,
                                  }}
                                >
                                  Marquer comme lu
                                </Button>
                              )}                              <Button
                                variant="outlined"
                                startIcon={<ReplyIcon />}
                                onClick={() => openReplyDialog(msg)}
                                sx={{
                                  borderRadius: 2,
                                  textTransform: 'none',
                                  fontWeight: 600,
                                  px: 2,
                                  py: 1,
                                  mr: 1
                                }}
                              >
                                Réponse Rapide
                              </Button>
                              <Button
                                variant="contained"
                                startIcon={<EmailIcon />}
                                onClick={() => handleEmailReply(msg)}
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
                                Email Client
                              </Button>
                              <IconButton
                                onClick={() => deleteMessage(msg.id)}
                                sx={{
                                  color: 'error.main',
                                  '&:hover': {
                                    backgroundColor: 'error.lighter',
                                  }
                                }}
                                size="small"
                              >
                                <Tooltip title="Supprimer le message">
                                  <span>🗑️</span>
                                </Tooltip>
                              </IconButton>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Fade>

        {/* Response Dialog */}
        <Dialog
          open={replyDialogOpen}
          onClose={handleCloseResponseDialog}
          maxWidth="sm"
          fullWidth
          sx={{ '& .MuiDialog-paper': { borderRadius: 3 } }}
        >
          <DialogTitle>
            Répondre au message
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" paragraph>
              Vous répondez à :
            </Typography>
            <Typography variant="h6" fontWeight="medium" color="text.primary" paragraph>
              {selectedMessage?.nom} - {selectedMessage?.email}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary" paragraph>
              Contenu du message :
            </Typography>
            <Typography variant="body1" color="text.primary" paragraph sx={{ whiteSpace: 'pre-line' }}>
              {selectedMessage?.message}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <TextareaAutosize
              minRows={4}
              placeholder="Écrivez votre réponse ici..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              style={{ 
                width: '100%', 
                borderRadius: 8, 
                padding: '12px 16px',
                border: '1px solid',
                borderColor: '#e0e0e0',
                fontSize: '1rem',
                fontFamily: 'Roboto, sans-serif',
                color: '#333',
                outline: 'none',
                transition: 'border-color 0.3s',
                resize: 'none'
              }}
              sx={{ '&::placeholder': { color: 'text.disabled', opacity: 1 } }}
              placeholderTextColor="#b0b0b0"
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button 
              onClick={handleCloseResponseDialog} 
              color="inherit"
              startIcon={<CloseIcon />}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'action.hover',
                }
              }}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleSendResponse} 
              variant="contained"
              color="primary"
              startIcon={<SendIcon />}
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
              Envoyer la réponse
            </Button>
          </DialogActions>        </Dialog>

        {/* Quick Reply Dialog */}
        <Dialog
          open={replyDialogOpen}
          onClose={closeReplyDialog}
          maxWidth="md"
          fullWidth
          sx={{ '& .MuiDialog-paper': { borderRadius: 3 } }}
        >
          <DialogTitle sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontWeight: 'bold'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ReplyIcon />
              Réponse Rapide
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            {selectedMessage && (
              <>
                <Box sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                    Message de : {selectedMessage.nom}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Email : {selectedMessage.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Date : {formatDate(selectedMessage.date)}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                    "{selectedMessage.message}"
                  </Typography>
                </Box>
                
                <Typography variant="subtitle2" gutterBottom>
                  Votre réponse :
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Tapez votre réponse ici..."
                  variant="outlined"
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 2,
                      '&:hover': {
                        borderColor: 'primary.main',
                      }
                    }
                  }}
                />
              </>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button 
              onClick={closeReplyDialog} 
              color="inherit"
              startIcon={<CloseIcon />}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                px: 3
              }}
            >
              Annuler
            </Button>
            <Button 
              onClick={sendQuickReply} 
              variant="contained"
              color="primary"
              startIcon={<SendIcon />}
              disabled={!replyText.trim()}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                },
                '&:disabled': {
                  background: '#ccc',
                  color: '#666'
                }
              }}
            >
              Envoyer la Réponse
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default AdminContactMessages;
