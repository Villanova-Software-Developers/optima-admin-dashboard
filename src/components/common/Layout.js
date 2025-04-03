// src/components/common/Layout.js
import React from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Navbar at the top */}
      <Navbar onDrawerToggle={handleDrawerToggle} />
      
      {/* Sidebar navigation */}
      <Sidebar 
        mobileOpen={mobileOpen} 
        onClose={handleDrawerToggle}
        variant={isMobile ? 'temporary' : 'permanent'}
      />
      
      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          mt: 8, // Space for the navbar
          overflow: 'auto',
          backgroundColor: theme.palette.background.default,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;