import GroupWorkIcon from '@mui/icons-material/GroupWork';
import ArticleIcon from '@mui/icons-material/Article';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HistoryIcon from '@mui/icons-material/History';
import PeopleIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useTheme,
  Collapse,
  ListItemButton
} from '@mui/material';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

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
    label: 'Community',
    icon: <GroupWorkIcon />,
    children: [
      {
        label: 'Tasks',
        path: '/community-tasks',
        icon: <GroupWorkIcon />
      },
      {
        label: 'Categories',
        path: '/categories',
        icon: <CategoryIcon />
      }
    ]
  }
];

const Sidebar = ({ mobileOpen, onClose, variant = 'permanent' }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [openSubMenus, setOpenSubMenus] = useState({});

  const handleNavigation = (path) => {
    navigate(path);
    if (variant === 'temporary') {
      onClose();
    }
  };

  const handleToggleSubMenu = (label) => {
    setOpenSubMenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  // Check if any child of the item is selected
  const isItemActive = (item) => {
    if (item.path) {
      return location.pathname === item.path;
    }
    
    if (item.children) {
      return item.children.some(child => location.pathname === child.path);
    }
    
    return false;
  };

  const renderMenuItem = (item) => {
    const isActive = isItemActive(item);
    
    // If the item has children (it's a submenu)
    if (item.children) {
      const isOpen = openSubMenus[item.label] || 
                   item.children.some(child => location.pathname === child.path);
      
      return (
        <React.Fragment key={item.label}>
          <ListItemButton
            onClick={() => handleToggleSubMenu(item.label)}
            sx={{
              pl: 3,
              '&.Mui-selected': {
                backgroundColor: theme.palette.action.selected,
              },
              '&.Mui-selected:hover': {
                backgroundColor: theme.palette.action.selected,
              },
            }}
            selected={isActive}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
            {isOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map(child => (
                <ListItemButton
                  key={child.path}
                  onClick={() => handleNavigation(child.path)}
                  selected={location.pathname === child.path}
                  sx={{
                    pl: 6,
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.action.selected,
                      borderLeft: `4px solid ${theme.palette.primary.main}`,
                    },
                    '&.Mui-selected:hover': {
                      backgroundColor: theme.palette.action.selected,
                    },
                  }}
                >
                  <ListItemIcon>
                    {child.icon}
                  </ListItemIcon>
                  <ListItemText primary={child.label} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        </React.Fragment>
      );
    }
    
    // Regular menu item with no children
    return (
      <ListItem 
        button 
        key={item.path}
        onClick={() => handleNavigation(item.path)}
        selected={isActive}
        sx={{
          '&.Mui-selected': {
            backgroundColor: theme.palette.action.selected,
            borderLeft: `4px solid ${theme.palette.primary.main}`,
          },
          '&.Mui-selected:hover': {
            backgroundColor: theme.palette.action.selected,
          },
          pl: isActive ? 2 : 3, // Adjust padding when selected
        }}
      >
        <ListItemIcon>
          {item.icon}
        </ListItemIcon>
        <ListItemText primary={item.label} />
      </ListItem>
    );
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {menuItems.map(renderMenuItem)}
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