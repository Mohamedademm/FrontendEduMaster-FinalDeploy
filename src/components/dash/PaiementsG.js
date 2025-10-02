import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  TableContainer,
  Paper,
  Button,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
  Stack,
  Grid,
  Card,
  CardContent,
  Chip,
  InputAdornment,
  Divider,
  IconButton,
  Tooltip,
  Fade,
} from "@mui/material";
import {
  AttachMoney as AttachMoneyIcon,
  Receipt as ReceiptIcon,
  PieChart as PieChartIcon,
  Download as DownloadIcon,
  CreditCardOff as RefundIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { DataGrid } from "@mui/x-data-grid";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
// import "../../Css/Paiements.css"; // Removed for MUI styling
import Sidebar from "./Sidebar";

const Paiements = () => {
  const [paiements, setPaiements] = useState([]);
  const [filtreStatut, setFiltreStatut] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [sortModel, setSortModel] = useState([{ field: "paymentDate", sort: "desc" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPaiement, setSelectedPaiement] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Compute statistics from paiements data
  const totalRevenue = paiements.reduce((sum, p) => sum + (p.montant || 0), 0);
  const totalPayments = paiements.length;
  const averagePayment = totalPayments > 0 ? totalRevenue / totalPayments : 0;

  const statusCounts = paiements.reduce((acc, p) => {
    acc[p.statut] = (acc[p.statut] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(statusCounts).map(([key, value]) => ({
    name: key,
    value,
  }));

  const [confirmLoading, setConfirmLoading] = useState(false);

  const fetchPaiements = useCallback(() => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");

    const sortField = sortModel.length > 0 ? sortModel[0].field : "paymentDate";
    const sortOrder = sortModel.length > 0 ? sortModel[0].sort : "desc";

    const params = new URLSearchParams({
      page: page + 1,
      limit: pageSize,
      sortField,
      sortOrder,
      search: searchTerm,
      status: filtreStatut,
    });

    fetch(`http://localhost:3000/api/paiements?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const mappedData = data.data.map((p) => ({
          id: p.id,
          nom: p.nom,
          email: p.email,
          montant: p.montant,
          type: p.type || "Cours premium",
          statut: p.statut || "Réussi",
        }));
        setPaiements(mappedData);
        setTotalRows(data.total);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur chargement paiements :", err);
        setError("Erreur lors du chargement des paiements.");
        setLoading(false);
      });
  }, [page, pageSize, sortModel, searchTerm, filtreStatut]);

  useEffect(() => {
    fetchPaiements();
  }, [fetchPaiements]);

  // Debounce recherche
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchPaiements();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, fetchPaiements]);

  const handleFiltreChange = (event) => {
    setFiltreStatut(event.target.value);
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(0);
  };

  const handleSortModelChange = (model) => {
    setSortModel(model);
  };

  const handleRemboursement = (id) => {
    setSelectedPaiement(id);
    setOpenDialog(true);
  };

  const confirmerRemboursement = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setSnackbar({ open: true, message: "Remboursement effectué avec succès.", severity: "success" });
      setOpenDialog(false);
      setConfirmLoading(false);
      fetchPaiements();
    }, 1500);
  };

  const handleFactureDownload = (id) => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:3000/api/paiements/invoice/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Facture non trouvée");
        }
        return res.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `facture_${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Erreur lors du téléchargement de la facture :", error);
        setSnackbar({ open: true, message: "Erreur lors du téléchargement de la facture.", severity: "error" });
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const columns = [
    { 
      field: "id", 
      headerName: "ID", 
      width: 90, 
      sortable: true,
      renderCell: (params) => (
        <Chip 
          label={`#${params.value}`} 
          size="small" 
          variant="outlined" 
          color="primary"
          sx={{ fontWeight: 'bold' }}
        />
      )
    },
    { 
      field: "nom", 
      headerName: "Nom", 
      flex: 1, 
      minWidth: 150, 
      sortable: true,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: (theme) => theme.palette.primary.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              mr: 2,
              fontSize: '0.875rem'
            }}
          >
            {params.value.charAt(0).toUpperCase()}
          </Box>
          <Typography variant="body2" fontWeight="medium">
            {params.value}
          </Typography>
        </Box>
      )
    },
    { field: "email", headerName: "Email", flex: 1, minWidth: 200, sortable: true },
    { 
      field: "montant", 
      headerName: "Montant", 
      width: 130, 
      sortable: true,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main', fontWeight: 'bold' }}>
          <AttachMoneyIcon sx={{ fontSize: 16, mr: 0.5 }} />
          {params.value?.toFixed(2)} €
        </Box>
      )
    },
    { 
      field: "type", 
      headerName: "Type", 
      width: 150, 
      sortable: true,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          variant="filled"
          sx={{ 
            backgroundColor: (theme) => theme.palette.info.light,
            color: (theme) => theme.palette.info.contrastText,
          }}
        />
      )
    },
    { 
      field: "statut", 
      headerName: "Statut", 
      width: 130, 
      sortable: true,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small"
          color={
            params.value === "Réussi" ? "success" :
            params.value === "Échoué" ? "error" :
            params.value === "Remboursable" ? "warning" :
            "default"
          }
          variant="filled"
          sx={{ fontWeight: 'medium' }}
        />
      )
    },
    {
      field: "facture",
      headerName: "Facture",
      width: 160,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title="Télécharger la facture">
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<DownloadIcon />}
            onClick={() => handleFactureDownload(params.row.id)}
            sx={{ 
              textTransform: "none",
              borderRadius: 2,
              '&:hover': {
                backgroundColor: (theme) => theme.palette.primary.light,
                transform: 'translateY(-1px)',
                boxShadow: 2
              }
            }}
          >
            Facture
          </Button>
        </Tooltip>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 180,
      sortable: false,
      renderCell: (params) =>
        params.row.statut === "Remboursable" ? (
          <Tooltip title="Effectuer un remboursement">
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<RefundIcon />}
              onClick={() => handleRemboursement(params.row.id)}
              sx={{ 
                textTransform: "none",
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: (theme) => theme.palette.error.light,
                  transform: 'translateY(-1px)',
                  boxShadow: 2
                }
              }}
            >
              Rembourser
            </Button>
          </Tooltip>
        ) : null,
    },
  ];

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
                  Gestion des Paiements
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
                  Tableau de bord des transactions et revenus
                </Typography>
              </Box>
              <Tooltip title="Actualiser les données">
                <IconButton 
                  onClick={fetchPaiements}
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

        {/* Statistics Cards */}
        <Fade in timeout={1000}>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  height: '100%', 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                  borderRadius: 3,
                  overflow: 'hidden',
                  position: 'relative',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <CardContent sx={{ p: 3, position: 'relative' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                        Total Paiements
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {totalPayments.toLocaleString()}
                      </Typography>
                    </Box>
                    <ReceiptIcon sx={{ fontSize: 48, opacity: 0.8 }} />
                  </Box>
                  <TrendingUpIcon sx={{ position: 'absolute', right: 16, bottom: 16, opacity: 0.3, fontSize: 32 }} />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  height: '100%', 
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  boxShadow: '0 8px 32px rgba(240, 147, 251, 0.3)',
                  borderRadius: 3,
                  overflow: 'hidden',
                  position: 'relative',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(240, 147, 251, 0.4)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <CardContent sx={{ p: 3, position: 'relative' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                        Revenu Total
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {totalRevenue.toLocaleString()} €
                      </Typography>
                    </Box>
                    <AttachMoneyIcon sx={{ fontSize: 48, opacity: 0.8 }} />
                  </Box>
                  <TrendingUpIcon sx={{ position: 'absolute', right: 16, bottom: 16, opacity: 0.3, fontSize: 32 }} />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  height: '100%', 
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: 'white',
                  boxShadow: '0 8px 32px rgba(79, 172, 254, 0.3)',
                  borderRadius: 3,
                  overflow: 'hidden',
                  position: 'relative',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(79, 172, 254, 0.4)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <CardContent sx={{ p: 3, position: 'relative' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                        Paiement Moyen
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {averagePayment.toFixed(0)} €
                      </Typography>
                    </Box>
                    <AssessmentIcon sx={{ fontSize: 48, opacity: 0.8 }} />
                  </Box>
                  <TrendingUpIcon sx={{ position: 'absolute', right: 16, bottom: 16, opacity: 0.3, fontSize: 32 }} />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  height: '100%', 
                  backgroundColor: 'white',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  borderRadius: 3,
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PieChartIcon sx={{ fontSize: 24, color: 'primary.main', mr: 1 }} />
                    <Typography variant="h6" fontWeight="bold" color="text.primary">
                      Répartition des Statuts
                    </Typography>
                  </Box>
                  <ResponsiveContainer width="100%" height={120}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={50}
                        fill="#8884d8"
                        labelLine={false}
                      >
                        {pieData.map((entry, index) => {
                          const colors = ['#667eea', '#f093fb', '#4facfe', '#43e97b'];
                          return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                        })}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
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
            <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems="center">
              <FormControl sx={{ minWidth: 200, flex: 1 }}>
                <InputLabel>Filtrer par statut</InputLabel>
                <Select 
                  value={filtreStatut} 
                  onChange={(e) => setFiltreStatut(e.target.value)}
                  label="Filtrer par statut"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value=""><em>Tous</em></MenuItem>
                  <MenuItem value="Réussi">Réussi</MenuItem>
                  <MenuItem value="Échoué">Échoué</MenuItem>
                  <MenuItem value="Remboursable">Remboursable</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Rechercher nom ou email"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ flex: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          </Paper>
        </Fade>

        {/* DataGrid */}
        <Fade in timeout={1400}>
          <Paper 
            sx={{ 
              width: '100%', 
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            {loading ? (
              <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", py: 8 }}>
                <CircularProgress size={60} thickness={4} />
                <Typography sx={{ mt: 3, color: "text.secondary", fontSize: '1.1rem' }}>
                  Chargement des paiements...
                </Typography>
              </Box>
            ) : error ? (
              <Alert 
                severity="error" 
                sx={{ 
                  m: 3, 
                  borderRadius: 2,
                  '& .MuiAlert-message': { fontSize: '1rem' }
                }}
              >
                {error}
              </Alert>
            ) : (
              <DataGrid
                rows={paiements}
                columns={columns}
                page={page}
                pageSize={pageSize}
                rowCount={totalRows}
                pagination
                paginationMode="server"
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                sortingMode="server"
                sortModel={sortModel}
                onSortModelChange={handleSortModelChange}
                rowsPerPageOptions={[5, 10, 20, 50]}
                autoHeight
                disableSelectionOnClick
                sx={{
                  border: 0,
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#f8fafc',
                    borderBottom: '2px solid #e2e8f0',
                    '& .MuiDataGrid-columnHeaderTitle': {
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      color: '#1e293b',
                    },
                  },
                  '& .MuiDataGrid-cell': {
                    borderBottom: '1px solid #f1f5f9',
                    fontSize: '0.9rem',
                  },
                  '& .MuiDataGrid-row': {
                    '&:hover': {
                      backgroundColor: '#f8fafc',
                      transform: 'scale(1.001)',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    },
                    transition: 'all 0.2s ease',
                  },
                  '& .MuiDataGrid-footerContainer': {
                    borderTop: '2px solid #e2e8f0',
                    backgroundColor: '#f8fafc',
                  },
                  minHeight: 400,
                }}
              />
            )}
          </Paper>
        </Fade>

        {/* Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={() => !confirmLoading && setOpenDialog(false)}
          PaperProps={{ 
            sx: { 
              borderRadius: 3, 
              boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
              minWidth: 400
            } 
          }}
        >
          <DialogTitle sx={{ fontWeight: 'bold', pb: 1, borderBottom: '1px solid #e2e8f0' }}>
            Confirmer le remboursement
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <DialogContentText sx={{ fontSize: '1rem', lineHeight: 1.6 }}>
              Êtes-vous sûr de vouloir rembourser ce paiement ? Cette action ne peut pas être annulée.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid #e2e8f0' }}>
            <Button 
              onClick={() => setOpenDialog(false)} 
              disabled={confirmLoading}
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
              onClick={confirmerRemboursement}
              variant="contained"
              color="error"
              disabled={confirmLoading}
              startIcon={confirmLoading ? <CircularProgress size={20} color="inherit" /> : <RefundIcon />}
              sx={{ 
                borderRadius: 2, 
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)'
              }}
            >
              {confirmLoading ? "Traitement..." : "Confirmer le remboursement"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={6000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity} 
            variant="filled"
            sx={{ 
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              fontSize: '0.95rem'
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default Paiements;
