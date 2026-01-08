import React from 'react';
import { Box, Container, Grid, Typography, Link, Paper, Stack } from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: FacebookIcon, url: '#', label: 'Facebook', color: '#1877F2' },
    { icon: TwitterIcon, url: '#', label: 'Twitter', color: '#1DA1F2' },
    { icon: LinkedInIcon, url: '#', label: 'LinkedIn', color: '#0A66C2' },
    { icon: InstagramIcon, url: '#', label: 'Instagram', color: '#E4405F' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        marginTop: '60px',
        paddingTop: '40px',
        paddingBottom: '20px',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ marginBottom: '40px' }}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: '16px' }}>
              🏥 Healthcare Management
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, marginBottom: '16px' }}>
              Comprehensive healthcare management system for efficient patient care and hospital operations.
            </Typography>
            <Stack direction="row" spacing={1}>
              {socialLinks.map((social) => {
                const SocialIcon = social.icon;
                return (
                  <Link
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.15)',
                      color: 'white',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: social.color,
                        transform: 'translateY(-3px)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                      },
                    }}
                  >
                    <SocialIcon sx={{ fontSize: '1.3rem' }} />
                  </Link>
                );
              })}
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: '16px' }}>
              Quick Links
            </Typography>
            <Stack spacing={1}>
              {['Dashboard', 'Patients', 'Doctors', 'Appointments', 'Billing'].map((link) => (
                <Link
                  key={link}
                  href="#"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.85)',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: '#ffeb3b',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  • {link}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Support */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: '16px' }}>
              Support
            </Typography>
            <Stack spacing={1}>
              {['Documentation', 'API Reference', 'FAQ', 'Contact Support', 'Bug Report'].map((link) => (
                <Link
                  key={link}
                  href="#"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.85)',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: '#ffeb3b',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  • {link}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: '16px' }}>
              Contact Info
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon sx={{ fontSize: '1.2rem', opacity: 0.8 }} />
                <Typography variant="body2">+1 (555) 123-4567</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon sx={{ fontSize: '1.2rem', opacity: 0.8 }} />
                <Link
                  href="mailto:support@healthcare.com"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.85)',
                    textDecoration: 'none',
                    '&:hover': { color: '#ffeb3b' },
                  }}
                >
                  support@healthcare.com
                </Link>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <LocationIcon sx={{ fontSize: '1.2rem', opacity: 0.8, marginTop: '2px' }} />
                <Typography variant="body2">
                  123 Medical Plaza, Healthcare City, HC 12345
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        {/* Divider */}
        <Box sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)', paddingTop: '20px' }}>
          {/* Stats Bar */}
          <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
            <Grid item xs={6} sm={3}>
              <Paper
                sx={{
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  500+
                </Typography>
                <Typography variant="caption">Active Patients</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper
                sx={{
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  150+
                </Typography>
                <Typography variant="caption">Certified Doctors</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper
                sx={{
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  99.8%
                </Typography>
                <Typography variant="caption">Uptime</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper
                sx={{
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  24/7
                </Typography>
                <Typography variant="caption">Support</Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Bottom Bar */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              © {currentYear} Healthcare Management System. All rights reserved.
            </Typography>
            <Stack direction="row" spacing={3}>
              <Link href="#" sx={{ color: 'rgba(255, 255, 255, 0.85)', textDecoration: 'none', '&:hover': { color: '#ffeb3b' } }}>
                Privacy Policy
              </Link>
              <Link href="#" sx={{ color: 'rgba(255, 255, 255, 0.85)', textDecoration: 'none', '&:hover': { color: '#ffeb3b' } }}>
                Terms of Service
              </Link>
              <Link href="#" sx={{ color: 'rgba(255, 255, 255, 0.85)', textDecoration: 'none', '&:hover': { color: '#ffeb3b' } }}>
                Cookie Policy
              </Link>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
