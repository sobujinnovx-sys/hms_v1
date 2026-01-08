import React from 'react';
import { Box } from '@mui/material';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <Header />

      {/* Main Content with Sidebar and Footer */}
      <Box sx={{ display: 'flex', flex: 1, marginTop: '64px' }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Page Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            padding: '24px',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            overflowY: 'auto',
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ flex: 1 }}>{children}</Box>
          <Footer />
        </Box>
      </Box>
    </Box>
  );
};
