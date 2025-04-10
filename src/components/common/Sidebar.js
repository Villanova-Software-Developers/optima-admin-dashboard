import GroupWorkIcon from '@mui/icons-material/GroupWork'
import ArticleIcon from '@mui/icons-material/Article';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HistoryIcon from '@mui/icons-material/History';
import PeopleIcon from '@mui/icons-material/People';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useTheme
} from '@mui/material';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const menuItems = [
  { 
    label: 'Dashboard', 
    path: '/', 
    icon: <DashboardIcon /> 
  },
  { 
    label: 'Users', 
    path: '/users', 
    icon: <PeopleIcon /> 
  },
  { 
    label: 'Posts', 
    path: '/posts', 
    icon: <ArticleIcon /> 
  },
  { 
    label: 'Admin Logs', 
    path: '/logs', 
    icon: <HistoryIcon /> 
  },
  {
    label: 'Community Tasks',
    path: '/community-tasks',
    icon: <GroupWorkIcon />
  }
];

const Sidebar = ({ mobileOpen, onClose, variant = 'permanent' }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
    if (variant === 'temporary') {
      onClose();
    }
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': {
                backgroundColor: theme.palette.action.selected,
                borderLeft: `4px solid ${theme.palette.primary.main}`,
              },
              '&.Mui-selected:hover': {
                backgroundColor: theme.palette.action.selected,
              },
              pl: location.pathname === item.path ? 2 : 3, // Adjust padding when selected
            }}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Desktop drawer */}
      <Drawer
        variant={variant}
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;