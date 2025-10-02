import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../../Css/dash/ManagerInterface.css';
import DSidebar from './Sidebar.js';

const ManagerInterface = () => {
  // Get user id from localStorage
  let managerId = null;
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user._id) {
      managerId = user._id;
    }
  } catch (e) {
    console.warn('Failed to parse user from localStorage', e);
  }

  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ cin: '', level: '' });
  const [editStudent, setEditStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch students
  const fetchStudents = useCallback(async () => {
    if (!managerId) {
      setError('User ID not found. Please login again.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/" + managerId + "/getData/students");
      setStudents(response.data.map(student => ({
        firstName: student.firstName,
        lastName: student.lastName,
        CIN: student.CIN,
        level: student.level,
      })));
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Erreur lors de la récupération des étudiants.');
    } finally {
      setLoading(false);
    }
  }, [managerId]);


  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Add new student
  const handleAddStudent = async () => {
    if (!newStudent.cin || !newStudent.level) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/" + managerId + "/addValidStudents", {
        validStudentCINs: [{ cin: newStudent.cin, level: newStudent.level }],
      });
      setSuccess('Étudiant ajouté avec succès !');
      fetchStudents();
      setNewStudent({ cin: '', level: '' });
    } catch (err) {
      console.error('Error adding student:', err);
      setError("Erreur lors de l'ajout de l'étudiant.");
    }
  };

  // Update student
  const handleUpdateStudent = async () => {
    if (!editStudent.cin || !editStudent.level) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    try {
      await axios.put("http://localhost:3000/api/" + managerId + "/updateValidStudents/" + editStudent.originalCin, {
        cin: editStudent.cin,
        level: editStudent.level,
      });
      setSuccess('Étudiant modifié avec succès !');
      fetchStudents();
      setEditStudent(null);
    } catch (err) {
      console.error('Error updating student:', err);
      setError("Erreur lors de la modification de l'étudiant.");
    }
  };

  // Edit mode handler
  const handleEdit = (student) => {
    setEditStudent({ originalCin: student.CIN, cin: student.CIN, level: student.level });
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditStudent(null);
  };

  return React.createElement(
    "div",
    { className: "manager-interface-container" },
    React.createElement(DSidebar, null),
    React.createElement(
      "div",
      { className: "manager-content-container" },
      React.createElement("h2", { className: "manager-header-title" }, "Interface de Gestion des CIN des \u00C9tudiants"),
      React.createElement(
        "div",
        { className: "manager-form-container manager-card" },
        React.createElement("h3", null, "Ajouter CIN \u00C9tudiant"),
        React.createElement(
          "div",
          { className: "manager-form-group" },
          React.createElement("input", {
            type: "text",
            placeholder: "CIN \u00C9tudiant",
            value: newStudent.cin,
            onChange: function (e) {
              return setNewStudent(Object.assign(Object.assign({}, newStudent), { cin: e.target.value }));
            },
            className: "manager-input-field"
          }),
          React.createElement("input", {
            type: "text",
            placeholder: "Niveau \u00C9tudiant",
            value: newStudent.level,
            onChange: function (e) {
              return setNewStudent(Object.assign(Object.assign({}, newStudent), { level: e.target.value }));
            },
            className: "manager-input-field"
          }),
          React.createElement(
            "button",
            { onClick: handleAddStudent, className: "manager-submit-btn" },
            "Ajouter \xE0 la liste"
          )
        ),
        error && React.createElement("div", { className: "manager-error-message" }, error),
        success && React.createElement("div", { className: "manager-success-message" }, success)
      ),
      loading
        ? React.createElement("p", null, "Chargement des \u00E9tudiants...")
        : React.createElement(
            "div",
            { className: "manager-table-container manager-card" },
            React.createElement("h3", null, "Liste des \u00C9tudiants"),
            React.createElement(
              "table",
              { className: "manager-table" },
              React.createElement(
                "thead",
                null,
                React.createElement(
                  "tr",
                  null,
                  React.createElement("th", null, "#"),
                  React.createElement("th", null, "Nom"),
                  React.createElement("th", null, "Pr\xE9nom"),
                  React.createElement("th", null, "CIN"),
                  React.createElement("th", null, "Action")
                )
              ),
              React.createElement(
                "tbody",
                null,
                students.map(function (student, index) {
                  return React.createElement(
                    "tr",
                    { key: student.CIN },
                    React.createElement("td", null, index + 1),
                    React.createElement("td", null, student.firstName),
                    React.createElement("td", null, student.lastName),
                    React.createElement("td", null, student.CIN),
                    React.createElement(
                      "td",
                      null,
                      React.createElement(
                        "button",
                        { onClick: function () { return handleEdit(student); }, className: "manager-edit-btn" },
                        "Modifier"
                      )
                    )
                  );
                })
              )
            )
          ),
      editStudent &&
        React.createElement(
          "div",
          { className: "manager-edit-container manager-card" },
          React.createElement("h3", null, "Modifier \u00C9tudiant"),
          React.createElement(
            "div",
            { className: "manager-form-group" },
            React.createElement("input", {
              type: "text",
              placeholder: "CIN \u00C9tudiant",
              value: editStudent.cin,
              onChange: function (e) {
                return setEditStudent(Object.assign(Object.assign({}, editStudent), { cin: e.target.value }));
              },
              className: "manager-input-field"
            }),
            React.createElement("input", {
              type: "text",
              placeholder: "Niveau \u00C9tudiant",
              value: editStudent.level,
              onChange: function (e) {
                return setEditStudent(Object.assign(Object.assign({}, editStudent), { level: e.target.value }));
              },
              className: "manager-input-field"
            }),
            React.createElement(
              "button",
              { onClick: handleUpdateStudent, className: "manager-submit-btn" },
              "Modifier"
            ),
            React.createElement(
              "button",
              { onClick: handleCancelEdit, className: "manager-cancel-btn" },
              "Annuler"
            )
          )
        )
    )
  );
};

export default ManagerInterface;
