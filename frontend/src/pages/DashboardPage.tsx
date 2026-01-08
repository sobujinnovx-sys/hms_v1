import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  LinearProgress,
} from '@mui/material';
import { useAuthStore } from '@stores/authStore';

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

      {/* Quick Stats Grid */}
      <Grid container spacing={3} sx={{ marginBottom: '32px' }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ padding: '24px' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: '24px' }}>
              📊 Appointment Statistics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#667eea' }}>
                    156
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'textSecondary' }}>
                    Scheduled
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#43e97b' }}>
                    72
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'textSecondary' }}>
                    Completed
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#ffa726' }}>
                    12
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'textSecondary' }}>
                    Pending
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#ef5350' }}>
                    5
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'textSecondary' }}>
                    Cancelled
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ padding: '24px' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: '24px' }}>
              💳 Billing Status
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#43e97b' }}>
                    $45K
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'textSecondary' }}>
                    Paid
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#ffa726' }}>
                    $28K
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'textSecondary' }}>
                    Pending
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#ef5350' }}>
                    $8.5K
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'textSecondary' }}>
                    Overdue
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#667eea' }}>
                    42
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'textSecondary' }}>
                    Bills
                  </Typography>
                </Box>
              </Grid>
            </Grid>
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
