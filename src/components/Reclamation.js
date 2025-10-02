import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Fade,
  Tooltip,
  Snackbar,
} from '@mui/material';
import {
  Support as SupportIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  PriorityHigh as PriorityIcon,
  Assignment as AssignmentIcon,
  Refresh as RefreshIcon,
  Send as SendIcon,
} from '@mui/icons-material';
// import '../Css/SupportTicketSystem.css'; // Removed for MUI styling
import Sidebar from './dash/Sidebar';

const Reclamation = () => {
  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('open');
  const [assignedTeam, setAssignedTeam] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [userRole, setUserRole] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Fetch tickets from backend API
  const fetchTickets = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/support-tickets');
      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }
      const data = await response.json();
      setTickets(data);
    } catch (err) {
      setError('Erreur lors du chargement des tickets');
    }
  };

  useEffect(() => {
    // Get user role from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role) {
      setUserRole(user.role);
    }
    fetchTickets();
  }, []);

  const handleTicketSubmit = async () => {
    setError('');
    setSuccessMessage('');
    if (!newTicket.trim()) {
      setError('Le message du ticket est requis');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/support-tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newTicket,
          priority,
          status,
          assignedTeam,
        }),
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la soumission du ticket');
      }
      const result = await response.json();
      setSuccessMessage('Ticket soumis avec succès');
      setSnackbarOpen(true);
      setNewTicket('');
      setPriority('medium');
      setStatus('open');
      setAssignedTeam('');
      fetchTickets(); // Refresh ticket list
    } catch (err) {
      setError(err.message || 'Erreur lors de la soumission du ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setError('');
    setSuccessMessage('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/support-tickets/${ticketToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la suppression du ticket');
      }
      setSuccessMessage('Ticket supprimé avec succès');
      setSnackbarOpen(true);
      fetchTickets(); // Refresh ticket list
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression du ticket');
    } finally {
      setDeleteDialogOpen(false);
      setTicketToDelete(null);
    }
  };

  const handleDeleteClick = (ticketId) => {
    setTicketToDelete(ticketId);
    setDeleteDialogOpen(true);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'info';
      case 'in-progress': return 'warning';
      case 'resolved': return 'success';
      default: return 'default';
    }
  };

  const getTeamColor = (team) => {
    switch (team) {
      case 'Backend': return 'primary';
      case 'Frontend': return 'secondary';
      case 'Mobile': return 'info';
      default: return 'default';
    }
  };

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
                  Système de Support
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
                    Gestion des tickets de support et réclamations
                  </Typography>
                  <Chip 
                    icon={<SupportIcon />}
                    label={`${tickets.length} ticket${tickets.length > 1 ? 's' : ''}`}
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              </Box>
              <Tooltip title="Actualiser les tickets">
                <IconButton 
                  onClick={fetchTickets}
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
          </Box>
        </Fade>

        {/* Statistics Cards */}
        <Fade in timeout={1000}>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
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
                        Total Tickets
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {tickets.length}
                      </Typography>
                    </Box>
                    <SupportIcon sx={{ fontSize: 48, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
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
                        Tickets Ouverts
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {tickets.filter(t => t.status === 'open').length}
                      </Typography>
                    </Box>
                    <AssignmentIcon sx={{ fontSize: 48, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
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
                        En Cours
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {tickets.filter(t => t.status === 'in-progress').length}
                      </Typography>
                    </Box>
                    <PriorityIcon sx={{ fontSize: 48, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  color: 'white',
                  boxShadow: '0 8px 32px rgba(67, 233, 123, 0.3)',
                  borderRadius: 3,
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(67, 233, 123, 0.4)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                        Résolus
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {tickets.filter(t => t.status === 'resolved').length}
                      </Typography>
                    </Box>
                    <AssignmentIcon sx={{ fontSize: 48, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Fade>

        {/* Ticket Creation Form */}
        <Fade in timeout={1200}>
          <Card 
            sx={{ 
              mb: 4, 
              backgroundColor: 'white',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <AddIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h5" fontWeight="bold">
                  Créer un nouveau ticket
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Description du problème"
                    value={newTicket}
                    onChange={(e) => setNewTicket(e.target.value)}
                    placeholder="Décrivez votre problème en détail..."
                    disabled={loading}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Priorité</InputLabel>
                    <Select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      disabled={loading}
                      label="Priorité"
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="low">Faible</MenuItem>
                      <MenuItem value="medium">Moyenne</MenuItem>
                      <MenuItem value="high">Élevée</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Statut</InputLabel>
                    <Select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      disabled={loading}
                      label="Statut"
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="open">Ouvert</MenuItem>
                      <MenuItem value="in-progress">En cours</MenuItem>
                      <MenuItem value="resolved">Résolu</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Équipe assignée</InputLabel>
                    <Select
                      value={assignedTeam}
                      onChange={(e) => setAssignedTeam(e.target.value)}
                      disabled={loading}
                      label="Équipe assignée"
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="">-- Sélectionner une équipe --</MenuItem>
                      <MenuItem value="Backend">Backend</MenuItem>
                      <MenuItem value="Frontend">Frontend</MenuItem>
                      <MenuItem value="Mobile">Mobile</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      onClick={handleTicketSubmit}
                      disabled={loading || !newTicket.trim()}
                      startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 4,
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
                      {loading ? 'Envoi...' : 'Soumettre le ticket'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Fade>

        {/* Tickets Table */}
        <Fade in timeout={1400}>
          <Card 
            sx={{ 
              backgroundColor: 'white',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden'
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h5" fontWeight="bold">
                  Liste des tickets de support
                </Typography>
              </Box>

              {tickets.length === 0 ? (
                <Box sx={{ p: 8, textAlign: 'center' }}>
                  <SupportIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h5" color="text.secondary" gutterBottom>
                    Aucun ticket trouvé
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Créez votre premier ticket de support ci-dessus.
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>Message</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>Priorité</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>Statut</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>Équipe assignée</TableCell>
                        {userRole === 'admin' && (
                          <TableCell sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>Actions</TableCell>
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tickets.map((ticket, index) => (
                        <TableRow 
                          key={ticket._id || ticket.id}
                          sx={{ 
                            '&:hover': { backgroundColor: '#f8fafc' },
                            borderBottom: '1px solid #f1f5f9'
                          }}
                        >
                          <TableCell sx={{ maxWidth: 300 }}>
                            <Typography variant="body2" sx={{ 
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical'
                            }}>
                              {ticket.message}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={ticket.priority === 'high' ? 'Élevée' : ticket.priority === 'medium' ? 'Moyenne' : 'Faible'}
                              color={getPriorityColor(ticket.priority)}
                              size="small"
                              variant="filled"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={ticket.status === 'open' ? 'Ouvert' : ticket.status === 'in-progress' ? 'En cours' : 'Résolu'}
                              color={getStatusColor(ticket.status)}
                              size="small"
                              variant="filled"
                            />
                          </TableCell>
                          <TableCell>
                            {ticket.assignedTeam ? (
                              <Chip
                                label={ticket.assignedTeam}
                                color={getTeamColor(ticket.assignedTeam)}
                                size="small"
                                variant="outlined"
                              />
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                Non assigné
                              </Typography>
                            )}
                          </TableCell>
                          {userRole === 'admin' && (
                            <TableCell>
                              <Tooltip title="Supprimer le ticket">
                                <IconButton
                                  onClick={() => handleDeleteClick(ticket._id || ticket.id)}
                                  color="error"
                                  size="small"
                                  sx={{
                                    '&:hover': {
                                      backgroundColor: 'error.light',
                                      transform: 'scale(1.1)',
                                    },
                                    transition: 'all 0.2s ease'
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Fade>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{ 
            sx: { 
              borderRadius: 3, 
              boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
              minWidth: 400
            } 
          }}
        >
          <DialogTitle sx={{ fontWeight: 'bold', pb: 1, borderBottom: '1px solid #e2e8f0' }}>
            Confirmer la suppression
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <DialogContentText sx={{ fontSize: '1rem', lineHeight: 1.6 }}>
              Êtes-vous sûr de vouloir supprimer ce ticket ? Cette action ne peut pas être annulée.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid #e2e8f0' }}>
            <Button 
              onClick={() => setDeleteDialogOpen(false)}
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
              onClick={handleDeleteConfirm}
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              sx={{ 
                borderRadius: 2, 
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)'
              }}
            >
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity="success"
            variant="filled"
            sx={{ 
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              fontSize: '0.95rem'
            }}
          >
            {successMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default Reclamation;
