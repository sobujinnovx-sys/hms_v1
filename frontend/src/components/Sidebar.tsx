import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  LocalHospital as DoctorIcon,
  Schedule as ScheduleIcon,
  Receipt as ReceiptIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Assignment as MedicalIcon,
} from '@mui/icons-material';

const DRAWER_WIDTH_EXPANDED = 280;
const DRAWER_WIDTH_COLLAPSED = 80;

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { label: 'Patients', icon: <PeopleIcon />, path: '/patients' },
  { label: 'Doctors', icon: <DoctorIcon />, path: '/doctors' },
  { label: 'Appointments', icon: <ScheduleIcon />, path: '/appointments' },
  { label: 'Billing', icon: <ReceiptIcon />, path: '/billing' },
  { label: 'Medical Records', icon: <MedicalIcon />, path: '/medical-records' },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onMobileClose = () => {} }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const drawerWidth = collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH_EXPANDED;

  const handleNavigate = (path: string) => {
    navigate(path);
    onMobileClose();
  };

  const handleToggle = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const isActive = (path?: string) => path && location.pathname === path;

  const sidebarContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          padding: collapsed ? '16px 8px' : '24px 16px',
          textAlign: 'center',
          background: 'rgba(0, 0, 0, 0.1)',
          borderBottom: '2px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'all 0.3s ease',
        }}
      >
        <Box sx={{ flex: 1, display: collapsed ? 'none' : 'block' }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              letterSpacing: '1px',
              background: 'linear-gradient(45deg, #fff 30%, #e0e0e0 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            🏥 Health
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.7rem' }}>
            Management
          </Typography>
        </Box>
        {collapsed && (
          <Typography sx={{ fontSize: '1.5rem' }}>🏥</Typography>
        )}
        <IconButton
          onClick={() => setCollapsed(!collapsed)}
          sx={{
            color: 'white',
            '&:hover': { background: 'rgba(255, 255, 255, 0.15)' },
          }}
          size="small"
        >
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>

      {/* Navigation List */}
      <List sx={{ flex: 1, paddingY: 2 }}>
        {navItems.map((item) => (
          <React.Fragment key={item.label}>
            <ListItem
              disablePadding
              sx={{
                marginX: 1,
                marginY: 0.5,
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
              }}
            >
              <ListItemButton
                onClick={() => (item.children ? handleToggle(item.label) : handleNavigate(item.path!))}
                sx={{
                  background: isActive(item.path)
                    ? 'rgba(255, 255, 255, 0.25)'
                    : 'transparent',
                  color: 'white',
                  borderLeft: isActive(item.path) ? '4px solid #ffeb3b' : 'none',
                  paddingLeft: isActive(item.path) ? '12px' : '16px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.15)',
                    transform: 'translateX(4px)',
                  },
                  transition: 'all 0.2s ease',
                  minHeight: '48px',
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive(item.path) ? '#ffeb3b' : 'rgba(255, 255, 255, 0.9)',
                    minWidth: collapsed ? '0' : '40px',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!collapsed && (
                  <>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: '0.95rem',
                        fontWeight: isActive(item.path) ? 600 : 500,
                      }}
                    />
                    {item.children && (
                      expandedItems.includes(item.label) ? (
                        <ExpandLessIcon sx={{ fontSize: '1.2rem' }} />
                      ) : (
                        <ExpandMoreIcon sx={{ fontSize: '1.2rem' }} />
                      )
                    )}
                  </>
                )}
              </ListItemButton>
            </ListItem>

            {/* Submenu */}
            {item.children && (
              <Collapse in={expandedItems.includes(item.label)} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ paddingLeft: 2 }}>
                  {item.children.map((child) => (
                    <ListItem
                      key={child.label}
                      disablePadding
                      sx={{
                        marginX: 1,
                        marginY: 0.3,
                        borderRadius: '8px',
                      }}
                    >
                      <ListItemButton
                        onClick={() => handleNavigate(child.path!)}
                        sx={{
                          paddingLeft: '20px',
                          color: 'rgba(255, 255, 255, 0.85)',
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.1)',
                          },
                        }}
                      >
                        <ListItemText
                          primary={child.label}
                          primaryTypographyProps={{ fontSize: '0.9rem' }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>

      {/* Footer Section */}
      <Box
        sx={{
          padding: collapsed ? '12px 8px' : '16px',
          background: 'rgba(0, 0, 0, 0.2)',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          textAlign: 'center',
          display: collapsed ? 'flex' : 'block',
          justifyContent: 'center',
        }}
      >
        {!collapsed && (
          <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', marginBottom: '8px' }}>
            v1.0.0
          </Typography>
        )}
        <Box sx={{ fontSize: collapsed ? '1.3rem' : '1.2rem', letterSpacing: collapsed ? '0' : '8px' }}>
          ⚕️
        </Box>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          marginTop: '64px',
          height: 'calc(100vh - 64px)',
          transition: 'width 0.3s ease',
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  );
};

export const SIDEBAR_WIDTH = DRAWER_WIDTH_EXPANDED;


