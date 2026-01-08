import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Link,
} from '@mui/material';
import { useAuthStore } from '@stores/authStore';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password should be of minimum 6 characters length')
    .required('Password is required'),
});

const registerValidationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  username: Yup.string()
    .min(3, 'Username should be at least 3 characters')
    .required('Username is required'),
  full_name: Yup.string()
    .required('Full name is required'),
  password: Yup.string()
    .min(6, 'Password should be of minimum 6 characters length')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
    .required('Confirm password is required'),
});

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, error: authError } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isRegister = location.pathname === '/register';

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      full_name: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: isRegister ? registerValidationSchema : loginValidationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        if (isRegister) {
          await register(values.email, values.username, values.full_name, values.password);
          navigate('/dashboard');
        } else {
          await login(values.email, values.password);
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Auth error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Typography component="h1" variant="h4" sx={{ mb: 3 }}>
          Healthcare Management System
        </Typography>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h2" variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
            {isRegister ? 'Create Account' : 'Sign In'}
          </Typography>

          {authError && <Alert severity="error">{authError}</Alert>}

          <form onSubmit={formik.handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />

            {isRegister && (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.username && Boolean(formik.errors.username)}
                  helperText={formik.touched.username && formik.errors.username}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="full_name"
                  label="Full Name"
                  name="full_name"
                  autoComplete="name"
                  value={formik.values.full_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.full_name && Boolean(formik.errors.full_name)}
                  helperText={formik.touched.full_name && formik.errors.full_name}
                />
              </>
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />

            {isRegister && (
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              />
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting}
            >
              {isRegister ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              {isRegister ? 'Already have an account? ' : "Don't have an account? "}
              <Link href={isRegister ? '/login' : '/register'} underline="hover">
                {isRegister ? 'Sign In' : 'Sign Up'}
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
