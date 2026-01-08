import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '@services/api';

const validationSchema = Yup.object({
  user_id: Yup.number().required('User ID is required'),
  specialization: Yup.string().required('Specialization is required'),
  license_number: Yup.string().required('License number is required'),
  phone: Yup.string().required('Phone is required'),
  office_hours: Yup.string().required('Office hours are required'),
});

export const DoctorsPage: React.FC = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/v1/doctors');
      setDoctors(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      user_id: '',
      specialization: '',
      license_number: '',
      phone: '',
      office_hours: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await api.post('/api/v1/doctors', values);
        setOpenDialog(false);
        formik.resetForm();
        fetchDoctors();
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to create doctor');
      }
    },
  });

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await api.delete(`/api/v1/doctors/${id}`);
        fetchDoctors();
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to delete doctor');
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Doctors
        </Typography>
        <Button variant="contained" onClick={() => setOpenDialog(true)}>
          Add Doctor
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Specialization</strong></TableCell>
                <TableCell><strong>License</strong></TableCell>
                <TableCell><strong>Phone</strong></TableCell>
                <TableCell><strong>Office Hours</strong></TableCell>
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {doctors.map((doctor) => (
                <TableRow key={doctor.id} hover>
                  <TableCell>{doctor.user?.full_name || 'N/A'}</TableCell>
                  <TableCell>{doctor.specialization}</TableCell>
                  <TableCell>{doctor.license_number}</TableCell>
                  <TableCell>{doctor.phone}</TableCell>
                  <TableCell>{doctor.office_hours}</TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDelete(doctor.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Doctor</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="User ID"
            name="user_id"
            type="number"
            margin="normal"
            value={formik.values.user_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.user_id && Boolean(formik.errors.user_id)}
            helperText={formik.touched.user_id && formik.errors.user_id}
          />
          <TextField
            fullWidth
            label="Specialization"
            name="specialization"
            margin="normal"
            value={formik.values.specialization}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.specialization && Boolean(formik.errors.specialization)}
            helperText={formik.touched.specialization && formik.errors.specialization}
          />
          <TextField
            fullWidth
            label="License Number"
            name="license_number"
            margin="normal"
            value={formik.values.license_number}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.license_number && Boolean(formik.errors.license_number)}
            helperText={formik.touched.license_number && formik.errors.license_number}
          />
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            margin="normal"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
          />
          <TextField
            fullWidth
            label="Office Hours"
            name="office_hours"
            margin="normal"
            value={formik.values.office_hours}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.office_hours && Boolean(formik.errors.office_hours)}
            helperText={formik.touched.office_hours && formik.errors.office_hours}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={() => formik.handleSubmit()} variant="contained">
            Add Doctor
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
