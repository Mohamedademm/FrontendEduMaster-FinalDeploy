// AdminTeacher.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from 'react-i18next';
import AdminTeacherStatistique from "./AdminTeacherStatistique";
import { ToastContainer, toast } from "react-toastify";
import { CSVLink } from "react-csv";
import "react-toastify/dist/ReactToastify.css";
import Button from "../ui/Button";
import Sidebar from "./Sidebar";
import ReCAPTCHA from "react-google-recaptcha";
import "../../Css/dash/AdminTeacher.css";

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

const AddTeacherIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
  </svg>
);

const ExportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const AdminTeacher = () => {
  const { t } = useTranslation();
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSubject, setFilterSubject] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isEditing, setIsEditing] = useState(false);
  const [teacherToEdit, setTeacherToEdit] = useState(null);
  const [editTeacher, setEditTeacher] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [isAdding, setIsAdding] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    subject: "",
  });
  const [recaptchaValue, setRecaptchaValue] = useState(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        // On essaie d'abord de récupérer depuis localStorage
        const storedTeachers = localStorage.getItem("teachers");
        if (storedTeachers) {
          setTeachers(JSON.parse(storedTeachers));
        }
        // Puis on récupère depuis l'API pour avoir les données à jour
        const response = await axios.get("http://localhost:3000/api/users");
        const teacherData = response.data.filter(
          (user) => user.role === "teacher"
        );
        setTeachers(teacherData);
        localStorage.setItem("teachers", JSON.stringify(teacherData));
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement des enseignants :", err);
        setError(t('error_loading_teachers'));
        setLoading(false);
      }
    };
    fetchTeachers();
  }, [t]);

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active"
        ? teacher.active !== false
        : teacher.active === false);
    const matchesSubject =
      filterSubject === "all" ||
      (teacher.subject &&
        teacher.subject.toLowerCase() === filterSubject.toLowerCase());
    return matchesSearch && matchesStatus && matchesSubject;
  });

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  const currentTeachers = filteredTeachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Suppression via confirmation native
  const handleDeleteClick = async (teacher) => {
    const confirmDelete = window.confirm(
      t('confirm_delete_teacher', { teacher: `${teacher.firstName} ${teacher.lastName}` })
    );
    if (!confirmDelete) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/users/${teacher._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(t('teacher_deleted_successfully'));
      const updatedTeachers = teachers.filter((t) => t._id !== teacher._id);
      setTeachers(updatedTeachers);
      localStorage.setItem("teachers", JSON.stringify(updatedTeachers));
    } catch (err) {
      console.error("Erreur lors de la suppression de l'enseignant :", err);
      toast.error(t('error_deleting_teacher'));
    }
  };

  const handleEditClick = (teacher) => {
    setTeacherToEdit(teacher);
    setEditTeacher({
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      email: teacher.email,
    });
    setIsEditing(true); // On cache le tableau et on affiche le formulaire inline
  };

  const confirmEdit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:3000/api/users/${teacherToEdit._id}`,
        {
          firstName: editTeacher.firstName,
          lastName: editTeacher.lastName,
          email: editTeacher.email,
          role: "teacher",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(t('teacher_updated_successfully'));
      const updatedTeachers = teachers.map((t) =>
        t._id === teacherToEdit._id ? { ...t, ...response.data } : t
      );
      setTeachers(updatedTeachers);
      localStorage.setItem("teachers", JSON.stringify(updatedTeachers));
      setIsEditing(false);
      setTeacherToEdit(null);
    } catch (err) {
      console.error("Erreur lors de la modification de l'enseignant :", err);
      toast.error(t('error_updating_teacher'));
    }
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    
    // Validation côté client
    if (!newTeacher.firstName.trim() || !newTeacher.lastName.trim() || 
        !newTeacher.email.trim() || !newTeacher.password.trim() || 
        !newTeacher.subject.trim()) {
      toast.error("Tous les champs sont obligatoires");
      return;
    }

    if (newTeacher.password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newTeacher.email)) {
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
        firstName: newTeacher.firstName.trim(),
        lastName: newTeacher.lastName.trim(),
        email: newTeacher.email.trim(),
        password: newTeacher.password,
        role: "teacher",
        subject: newTeacher.subject,
        recaptchaToken: recaptchaValue
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      toast.success("Enseignant ajouté avec succès");
      
      // Rafraîchir la liste des enseignants depuis le serveur
      const teachersResponse = await axios.get("http://localhost:3000/api/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const teacherData = teachersResponse.data.filter((user) => user.role === "teacher");
      setTeachers(teacherData);
      localStorage.setItem("teachers", JSON.stringify(teacherData));
      
      setIsAdding(false);
      setNewTeacher({ firstName: "", lastName: "", email: "", password: "", subject: "" });
      setRecaptchaValue(null);
      
    } catch (err) {
      console.error("Erreur complète:", err);
      
      if (err.response) {
        const errorData = err.response.data;
        
        switch(errorData.field) {
          case 'recaptcha':
            toast.error("Erreur de validation reCAPTCHA");
            break;
          case 'password':
            toast.error(errorData.message || "Problème avec le mot de passe");
            break;
          case 'general':
            toast.error(errorData.message || "Erreur lors de la création du compte");
            break;
          default:
            if (err.response.status === 400) {
              toast.error(errorData.message || "Données invalides");
            } else if (err.response.status === 401) {
              toast.error("Non autorisé. Veuillez vous reconnecter.");
            } else if (err.response.status === 403) {
              toast.error("Accès refusé. Permissions insuffisantes.");
            } else {
              toast.error(errorData.message || "Erreur du serveur");
            }
        }
      } else if (err.request) {
        toast.error("Impossible de contacter le serveur. Vérifiez votre connexion.");
      } else {
        toast.error("Erreur de configuration: " + err.message);
      }
    }
  };

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
  };

  const csvData = filteredTeachers.map((teacher) => ({
    Prénom: teacher.firstName,
    Nom: teacher.lastName,
    Email: teacher.email,
    Matière: teacher.subject || "N/A",
    DateInscription: new Date(teacher.createdAt).toLocaleDateString(),
    Statut: teacher.active !== false ? t('active') : t('inactive'),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 p-8" style={{ width:"80%" }}>
          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('teacher_management')}</h1>
                <p className="text-gray-600">Gérez et organisez vos enseignants avec facilité</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsAdding(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <AddTeacherIcon />
                  Ajouter un enseignant
                </button>
                <button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2">
                  <ExportIcon />
                  <CSVLink
                    data={csvData}
                    filename={"enseignants.csv"}
                    className="text-white no-underline"
                  >
                    {t('export_csv')}
                  </CSVLink>
                </button>
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <AdminTeacherStatistique />

          {/* Add Teacher Modal */}
          {isAdding && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
              <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Ajouter un enseignant</h2>
                  <p className="text-gray-600">Ajoutez un nouvel enseignant à la plateforme</p>
                </div>
                <form onSubmit={handleAddTeacher} className="space-y-4">
                  <div>
                    <label htmlFor="newFirstName" className="block text-sm font-medium text-gray-700 mb-2">{t('first_name')}</label>
                    <input
                      type="text"
                      id="newFirstName"
                      value={newTeacher.firstName}
                      onChange={(e) => setNewTeacher({ ...newTeacher, firstName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="newLastName" className="block text-sm font-medium text-gray-700 mb-2">{t('last_name')}</label>
                    <input
                      type="text"
                      id="newLastName"
                      value={newTeacher.lastName}
                      onChange={(e) => setNewTeacher({ ...newTeacher, lastName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700 mb-2">{t('email')}</label>
                    <input
                      type="email"
                      id="newEmail"
                      value={newTeacher.email}
                      onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
                    <input
                      type="password"
                      id="newPassword"
                      value={newTeacher.password}
                      onChange={(e) => setNewTeacher({ ...newTeacher, password: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                      minLength="6"
                    />
                  </div>
                  <div>
                    <label htmlFor="newSubject" className="block text-sm font-medium text-gray-700 mb-2">Matière</label>
                    <select
                      id="newSubject"
                      value={newTeacher.subject}
                      onChange={(e) => setNewTeacher({ ...newTeacher, subject: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    >
                      <option value="">Sélectionner une matière</option>
                      <option value="math">Mathématiques</option>
                      <option value="physics">Physique</option>
                      <option value="chemistry">Chimie</option>
                      <option value="biology">Biologie</option>
                      <option value="computer_science">Informatique</option>
                      <option value="english">Anglais</option>
                      <option value="french">Français</option>
                      <option value="history">Histoire</option>
                      <option value="geography">Géographie</option>
                      <option value="other">Autre</option>
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
                        setNewTeacher({ firstName: "", lastName: "", email: "", password: "", subject: "" }); 
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
                      Ajouter
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Modal */}
          {isEditing && teacherToEdit && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
              <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">{t('edit_teacher')}</h2>
                  <p className="text-gray-600">Modifiez les informations de l'enseignant</p>
                </div>
                <form onSubmit={confirmEdit} className="space-y-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">{t('first_name')}</label>
                    <input
                      type="text"
                      id="firstName"
                      value={editTeacher.firstName}
                      onChange={(e) => setEditTeacher({ ...editTeacher, firstName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">{t('last_name')}</label>
                    <input
                      type="text"
                      id="lastName"
                      value={editTeacher.lastName}
                      onChange={(e) => setEditTeacher({ ...editTeacher, lastName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">{t('email')}</label>
                    <input
                      type="email"
                      id="email"
                      value={editTeacher.email}
                      onChange={(e) => setEditTeacher({ ...editTeacher, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => { setIsEditing(false); setTeacherToEdit(null); }}
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

          {/* Filters and Search */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rechercher un enseignant</label>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filtrer par matière</label>
                <select
                  value={filterSubject}
                  onChange={(e) => { setFilterSubject(e.target.value); setCurrentPage(1); }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="all">{t('all_subjects')}</option>
                  <option value="math">{t('math')}</option>
                  <option value="physics">{t('physics')}</option>
                  <option value="chemistry">{t('chemistry')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Teachers Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">{t('subject')}</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">{t('registration_date')}</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">{t('status')}</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">{t('actions')}</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentTeachers.length > 0 ? (
                        currentTeachers.map((teacher, index) => (
                          <tr key={teacher._id} className={`hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{teacher.firstName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600">{teacher.lastName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600">{teacher.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600">{teacher.subject || "N/A"}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600">{new Date(teacher.createdAt).toLocaleDateString()}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${teacher.active !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                {teacher.active !== false ? t('active') : t('inactive')}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => handleEditClick(teacher)} 
                                  className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                                  title={t('edit')}
                                >
                                  <EditIcon />
                                </button>
                                <button 
                                  onClick={() => handleDeleteClick(teacher)} 
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
                              <p className="text-lg font-medium">{t('no_teachers_found')}</p>
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
                        <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredTeachers.length)}</span> sur{' '}
                        <span className="font-medium">{filteredTeachers.length}</span> résultats
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

export default AdminTeacher;
