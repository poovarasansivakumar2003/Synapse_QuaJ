import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge
} from '@mui/material';
import {
  AccountCircle,
  Menu as MenuIcon,
  Dashboard,
  Chat,
  VideoCall,
  People,
  School,
  Notifications,
  Settings
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import NotificationSystem from './NotificationSystem';

const Layout = ({ children, title }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getMenuItems = () => {
    const baseItems = [
      { text: 'Dashboard', icon: <Dashboard />, path: `/${user?.role}-dashboard` },
      { text: 'Messages', icon: <Chat />, path: '/chat' },
      { text: 'Meetings', icon: <VideoCall />, path: '/meetings' },
    ];

    if (user?.role === 'student') {
      baseItems.push(
        { text: 'Find Alumni', icon: <People />, path: '/find-alumni' }
      );
    } else if (user?.role === 'alumni') {
      baseItems.push(
        { text: 'Students', icon: <School />, path: '/students' }
      );
    } else if (user?.role === 'admin') {
      baseItems.push(
        { text: 'User Management', icon: <People />, path: '/admin/users' },
        { text: 'Content Management', icon: <School />, path: '/admin/content' }
      );
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title || 'Alumni Connect'}
          </Typography>
          
          <NotificationSystem />
          
          <IconButton color="inherit" onClick={handleMenuClick}>
            <AccountCircle />
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
              Profile
            </MenuItem>
            <MenuItem onClick={() => { navigate('/settings'); handleMenuClose(); }}>
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={logout}>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 250 }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">
              {user?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
            </Typography>
          </Box>
          
          <Divider />
          
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.path}
                selected={location.pathname === item.path}
                onClick={() => {
                  navigate(item.path);
                  setDrawerOpen(false);
                }}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
