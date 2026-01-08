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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '@services/api';

const validationSchema = Yup.object({
  patient_id: Yup.number().required('Patient ID is required'),
  doctor_id: Yup.number().required('Doctor ID is required'),
  appointment_date: Yup.string().required('Date is required'),
  appointment_time: Yup.string().required('Time is required'),
  reason: Yup.string().required('Reason is required'),
  status: Yup.string().required('Status is required'),
});

const statusColors: any = {
  scheduled: 'info',
  completed: 'success',
  cancelled: 'error',
  no_show: 'warning',
};

export const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/v1/appointments');
      setAppointments(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      patient_id: '',
      doctor_id: '',
      appointment_date: '',
      appointment_time: '',
      reason: '',
      status: 'scheduled',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await api.post('/api/v1/appointments', values);
        setOpenDialog(false);
        formik.resetForm();
        fetchAppointments();
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to create appointment');
      }
    },
  });

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await api.delete(`/api/v1/appointments/${id}`);
        fetchAppointments();
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to delete appointment');
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Appointments
        </Typography>
        <Button variant="contained" onClick={() => setOpenDialog(true)}>
          Schedule Appointment
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
                <TableCell><strong>Patient</strong></TableCell>
                <TableCell><strong>Doctor</strong></TableCell>
                <TableCell><strong>Date & Time</strong></TableCell>
                <TableCell><strong>Reason</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id} hover>
                  <TableCell>{appointment.patient?.full_name || 'N/A'}</TableCell>
                  <TableCell>{appointment.doctor?.user?.full_name || 'N/A'}</TableCell>
                  <TableCell>
                    {new Date(appointment.appointment_date).toLocaleDateString()} {appointment.appointment_time}
                  </TableCell>
                  <TableCell>{appointment.reason}</TableCell>
                  <TableCell>
                    <Chip
                      label={appointment.status}
                      color={statusColors[appointment.status] || 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDelete(appointment.id)}
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
        <DialogTitle>Schedule Appointment</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Patient ID"
            name="patient_id"
            type="number"
            margin="normal"
            value={formik.values.patient_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.patient_id && Boolean(formik.errors.patient_id)}
            helperText={formik.touched.patient_id && formik.errors.patient_id}
          />
          <TextField
            fullWidth
            label="Doctor ID"
            name="doctor_id"
            type="number"
            margin="normal"
            value={formik.values.doctor_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.doctor_id && Boolean(formik.errors.doctor_id)}
            helperText={formik.touched.doctor_id && formik.errors.doctor_id}
          />
          <TextField
            fullWidth
            label="Date"
            name="appointment_date"
            type="date"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={formik.values.appointment_date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.appointment_date && Boolean(formik.errors.appointment_date)}
            helperText={formik.touched.appointment_date && formik.errors.appointment_date}
          />
          <TextField
            fullWidth
            label="Time"
            name="appointment_time"
            margin="normal"
            value={formik.values.appointment_time}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.appointment_time && Boolean(formik.errors.appointment_time)}
            helperText={formik.touched.appointment_time && formik.errors.appointment_time}
          />
          <TextField
            fullWidth
            label="Reason"
            name="reason"
            margin="normal"
            value={formik.values.reason}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.reason && Boolean(formik.errors.reason)}
            helperText={formik.touched.reason && formik.errors.reason}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <MenuItem value="scheduled">Scheduled</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
              <MenuItem value="no_show">No Show</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={() => formik.handleSubmit()} variant="contained">
            Schedule
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
