// AdminTeacherStatistique.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "../ui/card";
import { CircularProgress, Typography } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import "../../Css/dash/AdminTeacher.css";
import { useTranslation } from 'react-i18next';

const AdminTeacherStatistique = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalTeachers: 0,
    activeTeachers: 0,
    inactiveTeachers: 0,
    subjects: {},
    registrationsByWeek: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeacherStats = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/users");
        const teacherData = response.data.filter(
          (user) => user.role === "teacher"
        );
        const totalTeachers = teacherData.length;
        const activeTeachers = teacherData.filter(
          (t) => t.active !== false
        ).length;
        const inactiveTeachers = totalTeachers - activeTeachers;
        const subjects = teacherData.reduce((acc, teacher) => {
          const subject = teacher.subject || "N/A";
          acc[subject] = (acc[subject] || 0) + 1;
          return acc;
        }, {});
        // Compute registrations per week.
        const registrationsByWeek = teacherData.reduce((acc, teacher) => {
          const date = new Date(teacher.createdAt);
          // Adjust to get Monday as the first day of the week.
          const day = date.getDay();
          const diff = date.getDate() - (day === 0 ? 6 : day - 1);
          const weekStart = new Date(date.setDate(diff));
          // Format the week start date as a string (e.g., "MM/DD/YYYY")
          const weekKey = weekStart.toLocaleDateString();
          acc[weekKey] = (acc[weekKey] || 0) + 1;
          return acc;
        }, {});
        setStats({
          totalTeachers,
          activeTeachers,
          inactiveTeachers,
          subjects,
          registrationsByWeek,
        });
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement des statistiques :", err);
        setError(t('error_loading_teachers'));
        setLoading(false);
      }
    };
    fetchTeacherStats();
  }, [t]);

  const subjectData = Object.keys(stats.subjects).map((subject, index) => ({
    name: subject,
    value: stats.subjects[subject],
    color: ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EFF"][index % 5],
  }));

  const registrationData = Object.keys(stats.registrationsByWeek).map((week) => ({
    week,
    count: stats.registrationsByWeek[week],
  }));

  return (
    <div className="AdminCours">
      <section className="admin-container" style={{ padding: "20px" }}>
        <Typography variant="h4" align="center" gutterBottom>
          {t('teacher_statistics')}
        </Typography>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
            <CircularProgress />
          </div>
        ) : error ? (
          <Typography color="error" align="center">
            {error}
          </Typography>
        ) : (
          <>
            <div
              className="stats-container"
              style={{
                display: "flex",
                justifyContent: "space-around",
                marginBottom: "20px",
              }}
            >
              <Card className="stat-card">
                <CardContent>
                  <Typography variant="h6">{t('total_teachers')}</Typography>
                  <Typography variant="h5">{stats.totalTeachers}</Typography>
                </CardContent>
              </Card>
              <Card className="stat-card">
                <CardContent>
                  <Typography variant="h6">{t('active_teachers')}</Typography>
                  <Typography variant="h5">{stats.activeTeachers}</Typography>
                </CardContent>
              </Card>
              <Card className="stat-card">
                <CardContent>
                  <Typography variant="h6">{t('inactive_teachers')}</Typography>
                  <Typography variant="h5">{stats.inactiveTeachers}</Typography>
                </CardContent>
              </Card>
            </div>
            <div
              className="charts-container"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "20px",
                marginTop: "20px",
              }}
            >
              <div className="chart" style={{ flex: 1, minWidth: "300px" }}>
                <Typography variant="h6" align="center" gutterBottom>
                  {t('subject_distribution')}
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={subjectData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={80}
                      label
                    >
                      {subjectData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="chart" style={{ flex: 1, minWidth: "300px" }}>
                <Typography variant="h6" align="center" gutterBottom>
                  {t('registrations_per_week')}
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={registrationData}>
                    <XAxis dataKey="week" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" />
                    <Tooltip />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default AdminTeacherStatistique;
