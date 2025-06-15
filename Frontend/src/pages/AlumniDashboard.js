import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider
} from '@mui/material';
import {
  AccountCircle,
  Chat,
  VideoCall,
  School,
  TrendingUp
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const AlumniDashboard = () => {
  const [students, setStudents] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [availableForMentoring, setAvailableForMentoring] = useState(false);
  const [stats, setStats] = useState({
    totalConnections: 0,
    totalMeetings: 0,
    studentsHelped: 0
  });
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
    fetchMeetings();
    setAvailableForMentoring(user?.preferences?.availableForMentoring || false);
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/students');
      setStudents(response.data);
      setStats(prev => ({ ...prev, totalConnections: response.data.length }));
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchMeetings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/meetings');
      setMeetings(response.data);
      setStats(prev => ({ 
        ...prev, 
        totalMeetings: response.data.length,
        studentsHelped: new Set(response.data.map(m => m.participant._id)).size
      }));
    } catch (error) {
      console.error('Error fetching meetings:', error);
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const startChat = async (studentId) => {
    try {
      const response = await axios.post('http://localhost:5000/api/chat/start', {
        participantId: studentId
      });
      navigate('/chat', { state: { chatId: response.data._id } });
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  const handleMentoringToggle = async (event) => {
    const newValue = event.target.checked;
    setAvailableForMentoring(newValue);
    
    try {
      await axios.put('http://localhost:5000/api/users/profile', {
        'preferences.availableForMentoring': newValue
      });
    } catch (error) {
      console.error('Error updating mentoring status:', error);
    }
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Alumni Dashboard
          </Typography>
          <IconButton
            color="inherit"
            onClick={handleMenuClick}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
            <MenuItem onClick={() => navigate('/chat')}>Messages</MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Welcome Section */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h4" gutterBottom>
                    Welcome back, {user?.name}!
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {user?.profile?.jobTitle} at {user?.profile?.currentCompany}
                  </Typography>
                </Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={availableForMentoring}
                      onChange={handleMentoringToggle}
                    />
                  }
                  label="Available for Mentoring"
                />
              </Box>
            </Paper>
          </Grid>

          {/* Stats Cards */}
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <School color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4">
                      {stats.studentsHelped}
                    </Typography>
                    <Typography color="text.secondary">
                      Students Helped
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <VideoCall color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4">
                      {stats.totalMeetings}
                    </Typography>
                    <Typography color="text.secondary">
                      Total Meetings
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <TrendingUp color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4">
                      {stats.totalConnections}
                    </Typography>
                    <Typography color="text.secondary">
                      Connections
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Upcoming Meetings */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Upcoming Meetings
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {meetings.filter(m => m.status === 'scheduled').slice(0, 3).map((meeting) => (
                <Box key={meeting._id} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1">
                    {meeting.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    with {meeting.participant.name}
                  </Typography>
                  <Typography variant="body2">
                    {new Date(meeting.scheduledTime).toLocaleString()}
                  </Typography>
                  <Button size="small" sx={{ mt: 1 }}>
                    Join Meeting
                  </Button>
                </Box>
              ))}
            </Paper>
          </Grid>

          {/* Recent Students */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Students Seeking Guidance
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {students.slice(0, 5).map((student) => (
                <Box key={student._id} sx={{ mb: 2 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ mr: 2 }}>
                        {student.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1">
                          {student.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {student.profile.course} - {student.profile.graduationYear}
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      <IconButton 
                        size="small" 
                        onClick={() => startChat(student._id)}
                      >
                        <Chat />
                      </IconButton>
                    </Box>
                  </Box>
                  <Divider sx={{ mt: 1 }} />
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default AlumniDashboard;
