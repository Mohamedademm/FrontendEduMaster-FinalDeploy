// AdminUserStatistique.js
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
import { useTranslation } from 'react-i18next';

const AdminUserStatistique = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    roles: {},
    registrationsByWeek: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/users");
        const userData = response.data;
        
        const totalUsers = userData.length;
        const activeUsers = userData.filter(user => user.active !== false).length;
        const inactiveUsers = totalUsers - activeUsers;
        
        const roles = userData.reduce((acc, user) => {
          const role = user.role || "N/A";
          acc[role] = (acc[role] || 0) + 1;
          return acc;
        }, {});
        
        // Compute registrations per week
        const registrationsByWeek = userData.reduce((acc, user) => {
          const date = new Date(user.createdAt);
          const day = date.getDay();
          const diff = date.getDate() - (day === 0 ? 6 : day - 1);
          const weekStart = new Date(date.setDate(diff));
          const weekKey = weekStart.toLocaleDateString();
          acc[weekKey] = (acc[weekKey] || 0) + 1;
          return acc;
        }, {});
        
        setStats({
          totalUsers,
          activeUsers,
          inactiveUsers,
          roles,
          registrationsByWeek,
        });
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement des statistiques :", err);
        setError(t('error_loading_users'));
        setLoading(false);
      }
    };
    fetchUserStats();
  }, [t]);

  const roleData = Object.keys(stats.roles).map((role, index) => ({
    name: role,
    value: stats.roles[role],
    color: ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"][index % 4],
  }));

  const registrationData = Object.keys(stats.registrationsByWeek).map((week) => ({
    week,
    count: stats.registrationsByWeek[week],
  }));

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
          <CircularProgress />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <Typography color="error" align="center">
          {error}
        </Typography>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.dark' }}>
        {t('user_statistics')}
      </Typography>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <Typography variant="h6" className="mb-2">{t('total_users')}</Typography>
            <Typography variant="h4" className="font-bold">{stats.totalUsers}</Typography>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <Typography variant="h6" className="mb-2">{t('active_users')}</Typography>
            <Typography variant="h4" className="font-bold">{stats.activeUsers}</Typography>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-6">
            <Typography variant="h6" className="mb-2">{t('inactive_users')}</Typography>
            <Typography variant="h4" className="font-bold">{stats.inactiveUsers}</Typography>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Typography variant="h6" align="center" gutterBottom className="font-semibold text-gray-700">
            {t('role_distribution')}
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={roleData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {roleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div>
          <Typography variant="h6" align="center" gutterBottom className="font-semibold text-gray-700">
            {t('registrations_per_week')}
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={registrationData}>
              <XAxis dataKey="week" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminUserStatistique;
