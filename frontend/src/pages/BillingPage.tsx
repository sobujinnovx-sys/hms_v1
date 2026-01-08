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
  Chip,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '@services/api';

const billValidationSchema = Yup.object({
  patient_id: Yup.number().required('Patient ID is required'),
  amount: Yup.number().required('Amount is required').positive(),
  tax: Yup.number().required('Tax is required'),
  description: Yup.string().required('Description is required'),
});

const paymentValidationSchema = Yup.object({
  bill_id: Yup.number().required('Bill ID is required'),
  amount: Yup.number().required('Amount is required').positive(),
  payment_method: Yup.string().required('Payment method is required'),
});

const statusColors: any = {
  pending: 'warning',
  paid: 'success',
  overdue: 'error',
};

export const BillingPage: React.FC = () => {
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openBillDialog, setOpenBillDialog] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/v1/billing/bills');
      setBills(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch bills');
    } finally {
      setLoading(false);
    }
  };

  const billFormik = useFormik({
    initialValues: {
      patient_id: '',
      amount: '',
      tax: '',
      description: '',
    },
    validationSchema: billValidationSchema,
    onSubmit: async (values) => {
      try {
        await api.post('/api/v1/billing/bills', values);
        setOpenBillDialog(false);
        billFormik.resetForm();
        fetchBills();
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to create bill');
      }
    },
  });

  const paymentFormik = useFormik({
    initialValues: {
      bill_id: '',
      amount: '',
      payment_method: '',
    },
    validationSchema: paymentValidationSchema,
    onSubmit: async (values) => {
      try {
        await api.post(`/api/v1/billing/bills/${values.bill_id}/payments`, {
          amount: values.amount,
          payment_method: values.payment_method,
        });
        setOpenPaymentDialog(false);
        paymentFormik.resetForm();
        fetchBills();
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to record payment');
      }
    },
  });

  const handleDeleteBill = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        await api.delete(`/api/v1/billing/bills/${id}`);
        fetchBills();
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to delete bill');
      }
    }
  };

  const totalBilled = bills.reduce((sum, bill) => sum + (bill.amount || 0), 0);
  const totalPaid = bills.reduce((sum, bill) => sum + (bill.status === 'paid' ? bill.amount : 0), 0);
  const totalPending = totalBilled - totalPaid;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Billing & Payments
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Billed
              </Typography>
              <Typography variant="h5">${totalBilled.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Paid
              </Typography>
              <Typography variant="h5" sx={{ color: 'green' }}>${totalPaid.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending Payment
              </Typography>
              <Typography variant="h5" sx={{ color: 'orange' }}>${totalPending.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Bills
              </Typography>
              <Typography variant="h5">{bills.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button variant="contained" onClick={() => setOpenBillDialog(true)}>
          Create Bill
        </Button>
        <Button variant="contained" color="success" onClick={() => setOpenPaymentDialog(true)}>
          Record Payment
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
                <TableCell><strong>Bill #</strong></TableCell>
                <TableCell><strong>Patient</strong></TableCell>
                <TableCell align="right"><strong>Amount</strong></TableCell>
                <TableCell align="right"><strong>Tax</strong></TableCell>
                <TableCell align="right"><strong>Total</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bills.map((bill) => (
                <TableRow key={bill.id} hover>
                  <TableCell>{bill.bill_number}</TableCell>
                  <TableCell>{bill.patient?.full_name || 'N/A'}</TableCell>
                  <TableCell align="right">${bill.amount?.toFixed(2) || '0.00'}</TableCell>
                  <TableCell align="right">${bill.tax?.toFixed(2) || '0.00'}</TableCell>
                  <TableCell align="right">
                    <strong>${((bill.amount || 0) + (bill.tax || 0)).toFixed(2)}</strong>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={bill.status}
                      color={statusColors[bill.status] || 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{bill.description}</TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDeleteBill(bill.id)}
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

      {/* Create Bill Dialog */}
      <Dialog open={openBillDialog} onClose={() => setOpenBillDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Bill</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Patient ID"
            name="patient_id"
            type="number"
            margin="normal"
            value={billFormik.values.patient_id}
            onChange={billFormik.handleChange}
            onBlur={billFormik.handleBlur}
            error={billFormik.touched.patient_id && Boolean(billFormik.errors.patient_id)}
            helperText={billFormik.touched.patient_id && billFormik.errors.patient_id}
          />
          <TextField
            fullWidth
            label="Amount"
            name="amount"
            type="number"
            margin="normal"
            inputProps={{ step: '0.01' }}
            value={billFormik.values.amount}
            onChange={billFormik.handleChange}
            onBlur={billFormik.handleBlur}
            error={billFormik.touched.amount && Boolean(billFormik.errors.amount)}
            helperText={billFormik.touched.amount && billFormik.errors.amount}
          />
          <TextField
            fullWidth
            label="Tax"
            name="tax"
            type="number"
            margin="normal"
            inputProps={{ step: '0.01' }}
            value={billFormik.values.tax}
            onChange={billFormik.handleChange}
            onBlur={billFormik.handleBlur}
            error={billFormik.touched.tax && Boolean(billFormik.errors.tax)}
            helperText={billFormik.touched.tax && billFormik.errors.tax}
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            margin="normal"
            multiline
            rows={3}
            value={billFormik.values.description}
            onChange={billFormik.handleChange}
            onBlur={billFormik.handleBlur}
            error={billFormik.touched.description && Boolean(billFormik.errors.description)}
            helperText={billFormik.touched.description && billFormik.errors.description}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBillDialog(false)}>Cancel</Button>
          <Button onClick={() => billFormik.handleSubmit()} variant="contained">
            Create Bill
          </Button>
        </DialogActions>
      </Dialog>

      {/* Record Payment Dialog */}
      <Dialog open={openPaymentDialog} onClose={() => setOpenPaymentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Record Payment</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Bill ID"
            name="bill_id"
            type="number"
            margin="normal"
            value={paymentFormik.values.bill_id}
            onChange={paymentFormik.handleChange}
            onBlur={paymentFormik.handleBlur}
            error={paymentFormik.touched.bill_id && Boolean(paymentFormik.errors.bill_id)}
            helperText={paymentFormik.touched.bill_id && paymentFormik.errors.bill_id}
          />
          <TextField
            fullWidth
            label="Amount"
            name="amount"
            type="number"
            margin="normal"
            inputProps={{ step: '0.01' }}
            value={paymentFormik.values.amount}
            onChange={paymentFormik.handleChange}
            onBlur={paymentFormik.handleBlur}
            error={paymentFormik.touched.amount && Boolean(paymentFormik.errors.amount)}
            helperText={paymentFormik.touched.amount && paymentFormik.errors.amount}
          />
          <TextField
            fullWidth
            label="Payment Method"
            name="payment_method"
            margin="normal"
            placeholder="e.g., Credit Card, Cash, Check"
            value={paymentFormik.values.payment_method}
            onChange={paymentFormik.handleChange}
            onBlur={paymentFormik.handleBlur}
            error={paymentFormik.touched.payment_method && Boolean(paymentFormik.errors.payment_method)}
            helperText={paymentFormik.touched.payment_method && paymentFormik.errors.payment_method}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPaymentDialog(false)}>Cancel</Button>
          <Button onClick={() => paymentFormik.handleSubmit()} variant="contained" color="success">
            Record Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
