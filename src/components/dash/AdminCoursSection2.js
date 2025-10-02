import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
} from "@mui/material";
import "../../Css/dash/AdminCoursSection2.css";

const AdminCoursSection2 = () => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState([]);
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/courses")
      .then((response) => {
        const data = response.data;
        setCourses(data);

        const uniqueDomains = [...new Set(data.map((course) => course.domaine))];
        setDomains(uniqueDomains);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des cours:", err);
        setError(t('error_loading_courses'));
        setLoading(false);
      });
  }, []);

  const filteredCourses = selectedDomain
    ? courses.filter(
        (course) =>
          course.domaine.toLowerCase() === selectedDomain.toLowerCase()
      )
    : courses;

  return (
    <div className="flex-1 ml-64 p-8">
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, borderRadius: '12px', overflow: 'hidden' }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.dark' }}>
          {t('course_management')} - {t('detailed_list')}
        </Typography>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="domain-select-label">{t('filter_by_domain')}</InputLabel>
          <Select
            labelId="domain-select-label"
            id="domain-select"
            value={selectedDomain}
            label={t('filter_by_domain')}
            onChange={(e) => setSelectedDomain(e.target.value)}
          >
            <MenuItem value="">
              <em>{t('all')}</em>
            </MenuItem>
            {domains.map((domain, index) => (
              <MenuItem key={index} value={domain}>
                {domain}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center" sx={{ py: 3 }}>
            {error}
          </Typography>
        ) : (
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="courses table">
              <TableHead sx={{ backgroundColor: 'primary.main' }}>
                <TableRow>
                  <TableCell sx={{ color: "white", fontWeight: "bold", py: 1.5 }}>
                    {t('course_name')}
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold", py: 1.5 }}>
                    {t('domain')}
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold", py: 1.5, textAlign: 'center' }}>
                    {t('number_of_micro_courses')}
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold", py: 1.5 }}>
                    {t('teacher')}
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold", py: 1.5, textAlign: 'center' }}>
                    {t('image')}
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold", py: 1.5 }}>
                    {t('creation_date')}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow 
                    key={course._id} 
                    hover 
                    sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}
                  >
                    <TableCell sx={{ py: 1.5 }}>{course.name}</TableCell>
                    <TableCell sx={{ py: 1.5 }}>{course.domaine}</TableCell>
                    <TableCell sx={{ py: 1.5, textAlign: 'center' }}>{course.NbMicroCour}</TableCell>
                    <TableCell sx={{ py: 1.5 }}>{course.teacher ? course.teacher.firstName + " " + course.teacher.lastName : "N/A"}</TableCell>
                    <TableCell sx={{ py: 1.5, textAlign: 'center' }}>
                      <img 
                        src={course.image && course.image.startsWith("http") ? course.image : `http://localhost:3000${course.image}`} 
                        alt={course.name} 
                        style={{ width: "80px", height: "auto", borderRadius: "8px", display: 'block', margin: 'auto' }} 
                      />
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      {new Date(course.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredCourses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      {t('no_courses_found')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </div>
  );
};

export default AdminCoursSection2;
