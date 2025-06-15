import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Grid, 
  Card, 
  CardContent,
  AppBar,
  Toolbar
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleDashboardRedirect = () => {
    if (user?.role === 'student') {
      navigate('/student-dashboard');
    } else if (user?.role === 'alumni') {
      navigate('/alumni-dashboard');
    } else if (user?.role === 'admin') {
      navigate('/admin-dashboard');
    }
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Alumni Connect
          </Typography>
          {user ? (
            <Box>
              <Button color="inherit" onClick={handleDashboardRedirect}>
                Dashboard
              </Button>
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </Box>
          ) : (
            <Box>
              <Button color="inherit" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate('/register')}>
                Register
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to Alumni Connect
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            Bridging the Campus-to-Career Gap
          </Typography>
          <Typography variant="body1" paragraph>
            Connect with alumni, find mentors, and accelerate your career journey
            through our university-focused networking platform.
          </Typography>
        </Box>

        <Grid container spacing={4} mb={6}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  For Students
                </Typography>
                <Typography variant="body1">
                  Connect with alumni in your field, get career advice, 
                  and access exclusive opportunities.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  For Alumni
                </Typography>
                <Typography variant="body1">
                  Give back to your alma mater by mentoring students 
                  and sharing your professional experience.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Real-time Connection
                </Typography>
                <Typography variant="body1">
                  Chat, video calls, and scheduled meetings make 
                  networking seamless and effective.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {!user && (
          <Box textAlign="center">
            <Button 
              variant="contained" 
              size="large" 
              onClick={() => navigate('/register')}
              sx={{ mr: 2 }}
            >
              Get Started
            </Button>
            <Button 
              variant="outlined" 
              size="large" 
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </Box>
        )}
      </Container>
    </div>
  );
};

export default HomePage;
