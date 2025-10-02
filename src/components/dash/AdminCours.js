import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import CreeCours from "../Teacher/CreeCours";
import Modal from "react-modal";
import Sidebar from "./Sidebar";
import AdminCoursSection2 from "./AdminCoursSection2";

Modal.setAppElement("#root");

function AdminCourses() {
  const { t } = useTranslation();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState(t('all')); // "Tous", "En attente", "Validé", "Refusé"
  const [selectedCourses, setSelectedCourses] = useState(new Set());
  const [editingCourse, setEditingCourse] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;   const [previewCourse, setPreviewCourse] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch("http://localhost:3000/api/courses");
        if (!res.ok) throw new Error(t('error_loading_courses'));
        const data = await res.json();
        setCourses(data);
      } catch (error) {
        console.error(t('error_loading_courses'), error);
        setErrorMessage(t('error_loading_courses'));
      } finally {
        setLoading(false);
      }
    }

    async function fetchTeachers() {
      try {
        const res = await fetch("http://localhost:3000/api/users");
        if (!res.ok) throw new Error('Error loading teachers');
        const users = await res.json();
        // Filter only users with role 'teacher'
        const teacherUsers = users.filter(user => user.role === 'teacher');
        setTeachers(teacherUsers);
      } catch (error) {
        console.error('Error loading teachers:', error);
      }
    }

    fetchCourses();
    fetchTeachers();
  }, [t]);
  const handleCourseSaved = (data) => {
    const updatedCourse = data.course || data;
    if (editingCourse) {
      setCourses((prev) =>
        prev.map((course) =>
          course._id === updatedCourse._id ? updatedCourse : course
        )
      );
      setSuccessMessage(t('course_updated_successfully'));
    } else {
      setCourses((prev) => [...prev, updatedCourse]);
      setSuccessMessage(t('course_created_successfully'));
    }
    setShowForm(false);
    setEditingCourse(null);
    setSelectedTeacherId(""); // Reset teacher selection
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm(t('confirm_delete_course'))) return;
    try {
      const res = await fetch(`http://localhost:3000/api/courses/${courseId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(t('error_deleting_course'));
      setCourses((prev) => prev.filter((course) => course._id !== courseId));
      setSuccessMessage(t('course_deleted_successfully'));
    } catch (error) {
      console.error(t('error_deleting_course'), error);
      setErrorMessage(t('error_deleting_course'));
    }
  };

  const handleBatchDelete = async () => {
    if (selectedCourses.size === 0) {
      alert(t('select_at_least_one_course'));
      return;
    }
    if (!window.confirm(t('confirm_delete_selected_courses')))
      return;
    try {
      for (let courseId of selectedCourses) {
        const res = await fetch(`http://localhost:3000/api/courses/${courseId}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error(t('error_deleting_selected_courses'));
      }
      setCourses((prev) => prev.filter((course) => !selectedCourses.has(course._id)));
      setSelectedCourses(new Set());
      setSuccessMessage(t('selected_courses_deleted_successfully'));
    } catch (error) {
      console.error(t('error_deleting_selected_courses'), error);
      setErrorMessage(t('error_deleting_selected_courses'));
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterStatus = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  const filteredCourses = courses.filter((course) => {
    const matchSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === t('all') || course.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const toggleCourseSelection = (courseId) => {
    const newSelected = new Set(selectedCourses);
    newSelected.has(courseId) ? newSelected.delete(courseId) : newSelected.add(courseId);
    setSelectedCourses(newSelected);
  };

  const handleExportCSV = () => {
    const header = [t('ID'), t('name'), t('domain'), t('NbMicroCour'), t('status')];
    const rows = filteredCourses.map((course) => [
      course._id,
      course.name,
      course.domaine,
      course.NbMicroCour,
      course.status || "N/A",
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      header.join(",") +
      "\n" +
      rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "courses_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const openPreview = (course) => {
    setPreviewCourse(course);
  };

  const openMicroCourses = (course) => {
    localStorage.setItem("courseId", course._id);
    window.location.href = "/CreeTecherMicroCours";
  };
  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setSelectedTeacherId(""); // Reset teacher selection for editing
    setShowForm(true);
  };

  const handleConsultCourse = (course) => {
    // Fonction pour consulter les détails du cours
    setPreviewCourse(course);
  };

  const closePreview = () => setPreviewCourse(null);

  const handleValidateCourse = async (courseId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/courses/${courseId}/validate`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ validation: "validated" }), // Ensure the correct value is sent
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || t('error_validating_course'));
      }

      const updatedCourse = await res.json();
      setCourses((prev) =>
        prev.map((course) =>
          course._id === updatedCourse.course._id ? updatedCourse.course : course
        )
      );
      setSuccessMessage(t('course_validated_successfully'));
    } catch (error) {
      console.error(t('error_validating_course'), error);
      setErrorMessage(error.message || t('error_validating_course'));
    }
  };

  const handleRefuseCourse = async (courseId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/courses/${courseId}/validate`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ validation: "refused" }), // Ensure the correct field is sent
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || t('error_refusing_course'));
      }

      const updatedCourse = await res.json();
      setCourses((prev) =>
        prev.map((course) =>
          course._id === updatedCourse.course._id ? updatedCourse.course : course
        )
      );
      setSuccessMessage(t('course_refused_successfully'));
    } catch (error) {
      console.error(t('error_refusing_course'), error);
      setErrorMessage(error.message || t('error_refusing_course'));
    }
  };

  const handleRequestModification = async (courseId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/courses/${courseId}/validate`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ validation: "modification_requested" }), // Ensure the correct field is sent
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || t('error_requesting_modification'));
      }

      const updatedCourse = await res.json();
      setCourses((prev) =>
        prev.map((course) =>
          course._id === updatedCourse.course._id ? updatedCourse.course : course
        )
      );
      setSuccessMessage(t('modification_requested_successfully'));
    } catch (error) {
      console.error(t('error_requesting_modification'), error);
      setErrorMessage(error.message || t('error_requesting_modification'));
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="flex">
        <Sidebar />
        <section className="flex-1 ml-64 p-8">
          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('course_management')}</h1>
                <p className="text-gray-600">{t('manage_organize_courses')}</p>
              </div>
              <div className="flex gap-3">                <button
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  onClick={() => {
                    setShowForm(!showForm);
                    setEditingCourse(null);
                    setSelectedTeacherId(""); // Reset teacher selection when creating new course
                  }}
                >
                  {showForm ? t('close') : t('create_new_course')}
                </button>
                <button 
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  onClick={() => setShowHelp(!showHelp)}
                >
                  {t('help')}
                </button>
              </div>
            </div>
          </div>          
          {/* Success/Error Messages */}
          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-4 rounded-xl mb-6 flex items-center gap-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl mb-6 flex items-center gap-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {errorMessage}
            </div>
          )}
          
          {/* Help Panel */}
          {showHelp && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                {t('help_and_support')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-blue-800">
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{t('use_search_bar')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{t('use_status_filter')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{t('select_multiple_courses')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{t('click_preview')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{t('use_export_csv')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{t('use_validate_refuse_modify')}</span>
                </div>
              </div>
            </div>
          )}          
          {/* Course Creation Form */}
          {showForm && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-8">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {editingCourse ? 'Modifier le cours' : 'Créer un nouveau cours'}
                </h3>
                <p className="text-blue-100 mt-1">
                  {editingCourse ? 'Modifiez les informations du cours' : 'Remplissez les informations pour créer un nouveau cours'}
                </p>
              </div>
                {/* Form Content */}
              <div className="p-6 bg-gray-50">
                {/* Teacher Selection for Admin */}
                {!editingCourse && (
                  <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sélectionner un professeur *
                    </label>
                    <select
                      value={selectedTeacherId}
                      onChange={(e) => setSelectedTeacherId(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    >
                      <option value="">Choisir un professeur...</option>
                      {teachers.map((teacher) => (
                        <option key={teacher._id} value={teacher._id}>
                          {teacher.firstName} {teacher.lastName} ({teacher.email})
                        </option>
                      ))}
                    </select>
                    {!selectedTeacherId && (
                      <p className="text-red-500 text-sm mt-1">
                        Vous devez sélectionner un professeur pour créer le cours.
                      </p>
                    )}
                  </div>
                )}
                
                <CreeCours
                  onCourseCreated={handleCourseSaved}
                  initialCourse={editingCourse}
                  teacherId={editingCourse ? editingCourse.teacher : selectedTeacherId}
                />
              </div>
            </div>
          )}
          
          {/* Filters and Search */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rechercher un cours</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t('search_course')}
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Filtrer par statut</label>
                <select 
                  value={filterStatus} 
                  onChange={handleFilterStatus}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value={t('all')}>{t('all')}</option>
                  <option value={t('pending')}>{t('pending')}</option>
                  <option value={t('validated')}>{t('validated')}</option>
                  <option value={t('refused')}>{t('refused')}</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={handleExportCSV}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {t('export_csv')}
                </button>
                {selectedCourses.size > 0 && (
                  <button 
                    onClick={handleBatchDelete}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {t('delete_selected')} ({selectedCourses.size})
                  </button>
                )}
              </div>
            </div>
          </div>          
          {/* Courses Content */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
              <span className="ml-4 text-lg text-gray-600">{t('loading')}</span>
            </div>
          ) : (
            <div>
              {/* Courses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {currentCourses.length === 0 ? (
                  <div className="col-span-full text-center py-20">
                    <svg className="mx-auto h-24 w-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <p className="text-gray-500 text-lg">{t('no_courses_found')}</p>
                  </div>
                ) : (
                  currentCourses.map((course) => {
                    const imageUrl =
                      course.image && course.image.startsWith("http")
                        ? course.image
                        : `http://localhost:3000${course.image}`;
                    
                    const getStatusColor = (status) => {
                      switch(status) {
                        case 'validated': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
                        case 'refused': return 'bg-red-100 text-red-800 border-red-200';
                        case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
                        default: return 'bg-gray-100 text-gray-800 border-gray-200';
                      }
                    };

                    return (
                      <div key={course._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group">
                        {/* Course Image */}
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={imageUrl}
                            alt={course.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 left-3">
                            <input
                              type="checkbox"
                              checked={selectedCourses.has(course._id)}
                              onChange={() => toggleCourseSelection(course._id)}
                              className="w-5 h-5 text-blue-600 border-2 border-white rounded focus:ring-blue-500 focus:ring-2"
                            />
                          </div>
                          <div className="absolute top-3 right-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(course.validation)}`}>
                              {course.validation || 'pending'}
                            </span>
                          </div>
                        </div>
                        
                        {/* Course Content */}
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{course.name}</h3>
                          <div className="flex flex-col gap-2 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                              <span>{course.domaine}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                              <span>{course.NbMicroCour} micro-cours</span>
                            </div>
                          </div>
                            {/* Action Buttons */}
                          <div className="flex flex-col gap-2">
                            {/* Validation Buttons - Only show for non-validated courses */}
                            {course.validation !== "validated" && (
                              <>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleValidateCourse(course._id)}
                                    className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm"
                                  >
                                    {t('validate')}
                                  </button>
                                  <button
                                    onClick={() => handleRefuseCourse(course._id)}
                                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm"
                                  >
                                    {t('refuse')}
                                  </button>
                                </div>
                                <button
                                  onClick={() => handleRequestModification(course._id)}
                                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm"
                                >
                                  {t('modify')}
                                </button>
                              </>
                            )}
                            
                            {/* Course Already Validated Message */}
                            {course.validation === "validated" && (
                              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-xl text-center font-medium text-sm mb-2">
                                {t('course_already_validated')}
                              </div>
                            )}
                            
                            {/* Admin Action Buttons - Always visible */}
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleConsultCourse(course)}
                                className="flex-1 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 text-xs flex items-center justify-center gap-1"
                                title="Consulter le cours"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                Consulter
                              </button>
                              <button
                                onClick={() => handleEditCourse(course)}
                                className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 text-xs flex items-center justify-center gap-1"
                                title="Modifier le cours"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Modifier
                              </button>
                              <button
                                onClick={() => openMicroCourses(course)}
                                className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 text-xs flex items-center justify-center gap-1"
                                title="Accéder aux MicroCours"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                MicroCours
                              </button>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleDelete(course._id)}
                                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm flex items-center justify-center gap-1"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Supprimer
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>              
              {/* Pagination */}
              <div className="flex items-center justify-center gap-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <button 
                  onClick={handlePrev} 
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {t('previous')}
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Page</span>
                  <span className="px-3 py-1 bg-blue-600 text-white rounded-lg font-medium">
                    {currentPage}
                  </span>
                  <span className="text-gray-600">sur {totalPages}</span>
                </div>
                <button 
                  onClick={handleNext} 
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {t('next')}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}          
          {/* Course Preview Modal */}
          <Modal
            isOpen={!!previewCourse}
            onRequestClose={closePreview}
            contentLabel={t('course_preview')}
            className="max-w-2xl mx-auto mt-20 bg-white rounded-2xl shadow-2xl outline-none overflow-hidden"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50"
          >
            {previewCourse && (
              <div>
                {/* Modal Header */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={
                      previewCourse.image && previewCourse.image.startsWith("http")
                        ? previewCourse.image
                        : `http://localhost:3000${previewCourse.image}`
                    }
                    alt={previewCourse.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={closePreview}
                    className="absolute top-4 right-4 w-8 h-8 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full flex items-center justify-center transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Modal Content */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">{previewCourse.name}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-600">{t('domain')}</p>
                        <p className="font-medium text-gray-800">{previewCourse.domaine}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-600">{t('number_of_micro_courses')}</p>
                        <p className="font-medium text-gray-800">{previewCourse.NbMicroCour}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg md:col-span-2">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-600">{t('status')}</p>
                        <p className="font-medium text-gray-800">{previewCourse.status || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={closePreview} 
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    {t('close')}
                  </button>
                </div>
              </div>
            )}
          </Modal>
        </section>
      </div>
      <AdminCoursSection2/>
    </div>
  );
}

export default AdminCourses;
