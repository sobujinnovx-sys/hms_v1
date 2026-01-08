import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import { useAuthStore } from '@stores/authStore';

// Sample data
const recentAppointments = [
  { id: 1, patient: 'John Doe', doctor: 'Dr. Smith', date: '2026-01-10', status: 'Scheduled' },
  { id: 2, patient: 'Jane Smith', doctor: 'Dr. Johnson', date: '2026-01-11', status: 'Completed' },
  { id: 3, patient: 'Mike Johnson', doctor: 'Dr. Smith', date: '2026-01-12', status: 'Scheduled' },
  { id: 4, patient: 'Sarah Davis', doctor: 'Dr. Johnson', date: '2026-01-13', status: 'Pending' },
];

const departmentStats = [
  { name: 'Cardiology', patients: 120, color: '#667eea' },
  { name: 'Neurology', patients: 95, color: '#764ba2' },
  { name: 'Orthopedic', patients: 85, color: '#f093fb' },
  { name: 'Pediatrics', patients: 110, color: '#4facfe' },
  { name: 'Dermatology', patients: 70, color: '#00f2fe' },
];

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: string;
  color: string;
  trend?: { value: number; isPositive: boolean };
}> = ({ title, value, icon, color, trend }) => (
  <Card
    sx={{
      background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
      border: `2px solid ${color}30`,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: `0 12px 24px ${color}30`,
      },
    }}
  >
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color }}>
            {value}
          </Typography>
          {trend && (
            <Typography
              variant="caption"
              sx={{
                color: trend.isPositive ? '#4caf50' : '#f44336',
                fontWeight: 600,
                marginTop: '8px',
                display: 'block',
              }}
            >
              {trend.isPositive ? '↑' : '↓'} {trend.value}% from last month
            </Typography>
          )}
        </Box>
        <Typography sx={{ fontSize: '2.5rem' }}>{icon}</Typography>
      </Box>
    </CardContent>
  </Card>
);

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [stats] = useState({
    totalPatients: 512,
    totalDoctors: 48,
    appointments: 245,
    revenue: 125400,
  });

  useEffect(() => {
    console.log('Dashboard loaded');
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'Scheduled':
        return 'info';
      case 'Pending':
        return 'warning';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Welcome Section */}
      <Paper
        sx={{
          padding: '32px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          marginBottom: '32px',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, marginBottom: '8px' }}>
          Welcome back, {user?.full_name}! 👋
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Here's what's happening in your healthcare system today.
        </Typography>
      </Paper>

      {/* Key Stats */}
      <Grid container spacing={3} sx={{ marginBottom: '32px' }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Patients"
            value={stats.totalPatients}
            icon="👥"
            color="#667eea"
            trend={{ value: 12, isPositive: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Doctors"
            value={stats.totalDoctors}
            icon="👨‍⚕️"
            color="#764ba2"
            trend={{ value: 3, isPositive: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Appointments Today"
            value={stats.appointments}
            icon="📅"
            color="#f093fb"
            trend={{ value: 8, isPositive: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Monthly Revenue"
            value={`$${(stats.revenue / 1000).toFixed(1)}K`}
            icon="💰"
            color="#4facfe"
            trend={{ value: 15, isPositive: true }}
          />
        </Grid>
      </Grid>

      {/* Department Statistics */}
      <Grid container spacing={3} sx={{ marginBottom: '32px' }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ padding: '24px', height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: '24px' }}>
              🏥 Department Patient Distribution
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {departmentStats.map((dept) => (
                <Box key={dept.name}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {dept.name}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: dept.color }}>
                      {dept.patients} patients
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(dept.patients / 120) * 100}
                    sx={{
                      height: '8px',
                      borderRadius: '4px',
                      backgroundColor: `${dept.color}20`,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: dept.color,
                        borderRadius: '4px',
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>

        {/* Billing Summary */}
        <Grid item xs={12} md={6}>
          <Card sx={{ padding: '24px', height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: '24px' }}>
              💳 Billing Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Paper
                  sx={{
                    padding: '16px',
                    background: 'linear-gradient(135deg, #43e97b20 0%, #43e97b10 100%)',
                    border: '2px solid #43e97b30',
                    borderRadius: '12px',
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 600, opacity: 0.8 }}>
                    Paid Bills
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#43e97b', marginTop: '8px' }}>
                    $45.2K
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper
                  sx={{
                    padding: '16px',
                    background: 'linear-gradient(135deg, #ffa72620 0%, #ffa72610 100%)',
                    border: '2px solid #ffa72630',
                    borderRadius: '12px',
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 600, opacity: 0.8 }}>
                    Pending Bills
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#ffa726', marginTop: '8px' }}>
                    $12.8K
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper
                  sx={{
                    padding: '16px',
                    background: 'linear-gradient(135deg, #ef535020 0%, #ef535010 100%)',
                    border: '2px solid #ef535030',
                    borderRadius: '12px',
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 600, opacity: 0.8 }}>
                    Overdue Bills
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#ef5350', marginTop: '8px' }}>
                    $3.4K
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper
                  sx={{
                    padding: '16px',
                    background: 'linear-gradient(135deg, #4facfe20 0%, #4facfe10 100%)',
                    border: '2px solid #4facfe30',
                    borderRadius: '12px',
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 600, opacity: 0.8 }}>
                    Total Revenue
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#4facfe', marginTop: '8px' }}>
                    $61.4K
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Appointments */}
      <Grid container spacing={3} sx={{ marginBottom: '32px' }}>
        <Grid item xs={12}>
          <Card sx={{ padding: '24px' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: '24px' }}>
              📅 Recent Appointments
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Patient</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Doctor</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>{appointment.patient}</TableCell>
                      <TableCell>{appointment.doctor}</TableCell>
                      <TableCell>{appointment.date}</TableCell>
                      <TableCell>
                        <Chip
                          label={appointment.status}
                          color={getStatusColor(appointment.status) as any}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>

      {/* Performance Metrics */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ padding: '24px' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: '24px' }}>
              📈 System Performance Metrics
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ marginBottom: '24px' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Server Uptime
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#4caf50' }}>
                      99.8%
                    </Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={99.8} sx={{ height: '8px', borderRadius: '4px' }} />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ marginBottom: '24px' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      API Response Time
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#4caf50' }}>
                      145ms
                    </Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={85} sx={{ height: '8px', borderRadius: '4px' }} />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ marginBottom: '24px' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Database Efficiency
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#4caf50' }}>
                      92%
                    </Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={92} sx={{ height: '8px', borderRadius: '4px' }} />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ marginBottom: '24px' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Cache Hits
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#4caf50' }}>
                      88%
                    </Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={88} sx={{ height: '8px', borderRadius: '4px' }} />
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
