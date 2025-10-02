import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from 'react-i18next';
import AdminUserStatistique from "./AdminUserStatistique";
import { ToastContainer, toast } from "react-toastify";
import { CSVLink } from "react-csv";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Sidebar";
import ReCAPTCHA from "react-google-recaptcha";

// Modern SVG Icons
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
  </svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const AddUserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
  </svg>
);

const ExportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const AdminUser = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isEditing, setIsEditing] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [editUser, setEditUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "user",
  });
  const [recaptchaValue, setRecaptchaValue] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement des utilisateurs :", err);
        setError(t('error_loading_users'));
        setLoading(false);
      }
    };
    fetchUsers();
  }, [t]);

  const handleDeleteClick = async (user) => {
    const confirmDelete = window.confirm(
      t('confirm_delete_user', { user: `${user.firstName} ${user.lastName}` })
    );
    if (!confirmDelete) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/users/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(t('user_deleted_successfully'));
      const updatedUsers = users.filter((u) => u._id !== user._id);
      setUsers(updatedUsers);
    } catch (err) {
      console.error("Erreur lors de la suppression de l'utilisateur :", err);
      toast.error(t('error_deleting_user'));
    }
  };

  const handleEditClick = (user) => {
    setUserToEdit(user);
    setEditUser({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
    setIsEditing(true);
  };

  const confirmEdit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:3000/api/users/${userToEdit._id}`,
        {
          firstName: editUser.firstName,
          lastName: editUser.lastName,
          email: editUser.email,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(t('user_updated_successfully'));
      const updatedUsers = users.map((u) =>
        u._id === userToEdit._id ? { ...u, ...response.data } : u
      );
      setUsers(updatedUsers);
      setIsEditing(false);
      setUserToEdit(null);
    } catch (err) {
      console.error("Erreur lors de la modification de l'utilisateur :", err);
      toast.error(t('error_updating_user'));
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    
    // Validation côté client
    if (!newUser.firstName.trim() || !newUser.lastName.trim() || 
        !newUser.email.trim() || !newUser.password.trim()) {
      toast.error("Tous les champs sont obligatoires");
      return;
    }

    if (newUser.password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      toast.error("Veuillez entrer une adresse email valide");
      return;
    }

    // Validation reCAPTCHA
    if (!recaptchaValue) {
      toast.error("Veuillez valider le reCAPTCHA");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("Token d'authentification manquant");
        return;
      }

      const response = await axios.post("http://localhost:3000/api/auth/register", {
        firstName: newUser.firstName.trim(),
        lastName: newUser.lastName.trim(),
        email: newUser.email.trim(),
        password: newUser.password,
        role: newUser.role,
        recaptchaToken: recaptchaValue
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      toast.success(t('user_added_successfully'));
      
      // Rafraîchir la liste des utilisateurs
      const usersResponse = await axios.get("http://localhost:3000/api/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(usersResponse.data);
      
      setIsAdding(false);
      setNewUser({ firstName: "", lastName: "", email: "", password: "", role: "user" });
      setRecaptchaValue(null);
      
    } catch (err) {
      console.error("Erreur lors de l'ajout de l'utilisateur :", err);
      
      if (err.response && err.response.data && err.response.data.error) {
        // Backend sends { error: "message" } for /api/auth/register
        toast.error(err.response.data.error);
      } else if (err.response) {
        // Fallback for other types of errors from the server if data.error is not present
        const status = err.response.status;
        if (status === 400) {
          toast.error("Données invalides ou requête incorrecte.");
        } else if (status === 401) {
          toast.error("Non autorisé. Veuillez vous reconnecter.");
        } else if (status === 403) {
          toast.error("Accès refusé. Permissions insuffisantes.");
        } else {
          toast.error( (err.response.data && err.response.data.message) || "Erreur du serveur. Veuillez réessayer.");
        }
      } else if (err.request) {
        // The request was made but no response was received
        toast.error("Impossible de contacter le serveur. Vérifiez votre connexion.");
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error("Erreur de configuration: " + err.message);
      }
    }
  };

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      filterRole === "all" || user.role === filterRole;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active"
        ? user.active !== false
        : user.active === false);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const csvData = filteredUsers.map((user) => ({
    Prénom: user.firstName,
    Nom: user.lastName,
    Email: user.email,
    Role: user.role,
    DateInscription: new Date(user.createdAt).toLocaleDateString(),
    Statut: user.active !== false ? t('active') : t('inactive'),
  }));

  const getRoleColor = (role) => {
    switch(role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'teacher': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role) => {
    switch(role) {
      case 'admin': return 'Administrateur';
      case 'teacher': return 'Enseignant';
      case 'user': return 'Étudiant';
      default: return role;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 p-8" style={{ width:"80%" }}>
          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8" >
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('user_management')}</h1>
                <p className="text-gray-600">Gérez et organisez vos utilisateurs avec facilité</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsAdding(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <AddUserIcon />
                  {t('add_user')}
                </button>
                <button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2">
                  <ExportIcon />
                  <CSVLink
                    data={csvData}
                    filename={"utilisateurs.csv"}
                    className="text-white no-underline"
                  >
                    {t('export_csv')}
                  </CSVLink>
                </button>
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <AdminUserStatistique />

          {/* Edit Modal */}
          {isEditing && userToEdit && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
              <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">{t('edit_user')}</h2>
                  <p className="text-gray-600">Modifiez les informations de l'utilisateur</p>
                </div>
                <form onSubmit={confirmEdit} className="space-y-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">{t('first_name')}</label>
                    <input
                      type="text"
                      id="firstName"
                      value={editUser.firstName}
                      onChange={(e) => setEditUser({ ...editUser, firstName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">{t('last_name')}</label>
                    <input
                      type="text"
                      id="lastName"
                      value={editUser.lastName}
                      onChange={(e) => setEditUser({ ...editUser, lastName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">{t('email')}</label>
                    <input
                      type="email"
                      id="email"
                      value={editUser.email}
                      onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => { setIsEditing(false); setUserToEdit(null); }}
                      className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 font-medium transition-all duration-200"
                    >
                      {t('cancel')}
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      {t('update')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Add User Modal */}
          {isAdding && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
              <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">{t('add_user')}</h2>
                  <p className="text-gray-600">Ajoutez un nouvel utilisateur à la plateforme</p>
                </div>
                <form onSubmit={handleAddUser} className="space-y-4">
                  <div>
                    <label htmlFor="newFirstName" className="block text-sm font-medium text-gray-700 mb-2">{t('first_name')}</label>
                    <input
                      type="text"
                      id="newFirstName"
                      value={newUser.firstName}
                      onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="newLastName" className="block text-sm font-medium text-gray-700 mb-2">{t('last_name')}</label>
                    <input
                      type="text"
                      id="newLastName"
                      value={newUser.lastName}
                      onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700 mb-2">{t('email')}</label>
                    <input
                      type="email"
                      id="newEmail"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
                    <input
                      type="password"
                      id="newPassword"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                      minLength="6"
                    />
                  </div>
                  <div>
                    <label htmlFor="newRole" className="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
                    <select
                      id="newRole"
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="user">Étudiant</option>
                      <option value="teacher">Enseignant</option>
                      <option value="admin">Administrateur</option>
                    </select>
                  </div>
                  
                  {/* reCAPTCHA */}
                  <div className="flex justify-center my-4">
                    <ReCAPTCHA
                      sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                      onChange={handleRecaptchaChange}
                      onExpired={() => setRecaptchaValue(null)}
                      onError={() => setRecaptchaValue(null)}
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => { 
                        setIsAdding(false); 
                        setNewUser({ firstName: "", lastName: "", email: "", password: "", role: "user" }); 
                        setRecaptchaValue(null);
                      }}
                      className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 font-medium transition-all duration-200"
                    >
                      {t('cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={!recaptchaValue}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t('add')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Filters and Search */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rechercher un utilisateur</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t('search_by_name_or_email')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <div className="absolute left-3 top-3.5">
                    <SearchIcon />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filtrer par rôle</label>
                <select
                  value={filterRole}
                  onChange={(e) => { setFilterRole(e.target.value); setCurrentPage(1); }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="all">Tous les rôles</option>
                  <option value="user">Étudiants</option>
                  <option value="teacher">Enseignants</option>
                  <option value="admin">Administrateurs</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filtrer par statut</label>
                <select
                  value={filterStatus}
                  onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="all">{t('all_statuses')}</option>
                  <option value="active">{t('active')}</option>
                  <option value="inactive">{t('inactive')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"style={{ width:"100%"  }}>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
                <span className="ml-4 text-lg text-gray-600">{t('loading')}</span>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <div className="text-red-500 text-lg font-medium">{error}</div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-blue-600 to-blue-700">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">{t('first_name')}</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">{t('last_name')}</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">{t('email')}</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Rôle</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Date d'inscription</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">{t('status')}</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">{t('actions')}</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentUsers.length > 0 ? (
                        currentUsers.map((user, index) => (
                          <tr key={user._id} className={`hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{user.firstName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600">{user.lastName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600">{user.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                                {getRoleLabel(user.role)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${user.active !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                {user.active !== false ? t('active') : t('inactive')}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => handleEditClick(user)} 
                                  className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                                  title={t('edit')}
                                >
                                  <EditIcon />
                                </button>
                                <button 
                                  onClick={() => handleDeleteClick(user)} 
                                  className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                                  title={t('delete')}
                                >
                                  <DeleteIcon />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="px-6 py-20 text-center">
                            <div className="text-gray-500">
                              <svg className="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                              </svg>
                              <p className="text-lg font-medium">Aucun utilisateur trouvé</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                    <div className="flex items-center">
                      <p className="text-sm text-gray-700">
                        Affichage de <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> à{' '}
                        <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> sur{' '}
                        <span className="font-medium">{filteredUsers.length}</span> résultats
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        {t('previous')}
                      </button>
                      <div className="flex space-x-1">
                        {[...Array(totalPages)].map((_, index) => {
                          const page = index + 1;
                          if (page === currentPage) {
                            return (
                              <span key={page} className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg">
                                {page}
                              </span>
                            );
                          }
                          if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                            return (
                              <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                              >
                                {page}
                              </button>
                            );
                          }
                          if (page === currentPage - 2 || page === currentPage + 2) {
                            return <span key={page} className="px-2 py-2 text-gray-400">...</span>;
                          }
                          return null;
                        })}
                      </div>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        {t('next')}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

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
        </main>
      </div>
    </div>
  );
};

export default AdminUser;
