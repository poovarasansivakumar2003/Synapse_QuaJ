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
  Chip,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  AccountCircle,
  Chat,
  VideoCall,
  Search,
  PlayArrow
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { videosAPI } from '../services/api';

const StudentDashboard = () => {
  const [alumni, setAlumni] = useState([]);
  const [filteredAlumni, setFilteredAlumni] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAlumni();
    loadRecommendedVideos();
  }, []);

  useEffect(() => {
    const filtered = alumni.filter(alum =>
      alum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alum.profile.currentCompany?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alum.profile.skills?.some(skill => 
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredAlumni(filtered);
  }, [searchTerm, alumni]);

  const fetchAlumni = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching alumni...');
      const response = await axios.get('http://localhost:5000/api/users/alumni', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('Alumni response:', response.data);
      setAlumni(response.data);
      setFilteredAlumni(response.data);
    } catch (error) {
      console.error('Error fetching alumni:', error);
      setError('Failed to load alumni. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendedVideos = async () => {
    try {
      const userCourse = user?.profile?.course || 'Computer Science';
      console.log('Loading videos for course:', userCourse);
      const response = await videosAPI.getVideosByCourse(userCourse);
      console.log('Videos response:', response.data);
      setRecommendedVideos(response.data);
    } catch (error) {
      console.error('Error loading videos:', error);
      // Fallback to mock data with YouTube links
      const mockVideos = [
        {
          _id: '1',
          title: 'Career Paths in Software Engineering',
          thumbnail: 'https://img.youtube.com/vi/g8a0_FoE_0c/maxresdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=g8a0_FoE_0c',
          duration: '15:30',
          instructor: { name: 'John Doe', company: 'Google' },
          description: 'Explore different career paths in software engineering'
        },
        {
          _id: '2',
          title: 'Building Your First Startup',
          thumbnail: 'https://img.youtube.com/vi/ZoqgAy3h4OM/maxresdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=ZoqgAy3h4OM',
          duration: '22:45',
          instructor: { name: 'Jane Smith', company: 'Microsoft' },
          description: 'Learn the basics of starting your own technology company'
        }
      ];
      setRecommendedVideos(mockVideos);
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const startChat = async (alumniId) => {
    try {
      const response = await axios.post('http://localhost:5000/api/chat/start', {
        participantId: alumniId
      });
      navigate('/chat', { state: { chatId: response.data._id } });
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  const scheduleMeeting = (alumniId) => {
    navigate('/schedule-meeting', { state: { alumniId } });
  };

  const openVideo = (videoUrl) => {
    window.open(videoUrl, '_blank');
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Student Dashboard
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
            <Paper sx={{ p: 2 }}>
              <Typography variant="h4" gutterBottom>
                Welcome back, {user?.name}!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Course: {user?.profile?.course || 'Not specified'} | Department: {user?.profile?.department || 'Not specified'}
              </Typography>
            </Paper>
          </Grid>

          {/* Error Alert */}
          {error && (
            <Grid item xs={12}>
              <Alert severity="error" action={
                <Button color="inherit" size="small" onClick={fetchAlumni}>
                  Retry
                </Button>
              }>
                {error}
              </Alert>
            </Grid>
          )}

          {/* Recommended Videos Section */}
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              Recommended Videos for {user?.profile?.course || 'Computer Science'}
            </Typography>
            <Grid container spacing={2}>
              {recommendedVideos.map((video) => (
                <Grid item xs={12} sm={6} md={4} key={video._id || video.id}>
                  <Card sx={{ cursor: 'pointer' }} onClick={() => openVideo(video.videoUrl)}>
                    <Box
                      sx={{
                        position: 'relative',
                        paddingTop: '56.25%', // 16:9 aspect ratio
                        backgroundColor: '#f0f0f0',
                        backgroundImage: video.thumbnail ? `url(${video.thumbnail})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: 'rgba(0,0,0,0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0,
                          transition: 'opacity 0.3s',
                          '&:hover': {
                            opacity: 1
                          }
                        }}
                      >
                        <PlayArrow sx={{ fontSize: 48, color: 'white' }} />
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          position: 'absolute',
                          bottom: 8,
                          right: 8,
                          backgroundColor: 'rgba(0,0,0,0.8)',
                          color: 'white',
                          padding: '2px 6px',
                          borderRadius: 1,
                          fontSize: '0.75rem'
                        }}
                      >
                        {video.duration}
                      </Typography>
                    </Box>
                    <CardContent>
                      <Typography variant="h6" noWrap>
                        {video.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {video.instructor.name} - {video.instructor.company}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {video.description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        startIcon={<PlayArrow />}
                        onClick={(e) => {
                          e.stopPropagation();
                          openVideo(video.videoUrl);
                        }}
                      >
                        Watch Now
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Alumni Network Section */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5">
                Connect with Alumni ({filteredAlumni.length})
              </Typography>
              <TextField
                size="small"
                placeholder="Search alumni..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            
            {loading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : filteredAlumni.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  No alumni found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {alumni.length === 0 
                    ? 'The database might be empty. Please run the seed script.'
                    : 'Try adjusting your search criteria.'
                  }
                </Typography>
                <Button 
                  variant="outlined" 
                  onClick={fetchAlumni} 
                  sx={{ mt: 2 }}
                >
                  Refresh
                </Button>
              </Paper>
            ) : (
              <Grid container spacing={2}>
                {filteredAlumni.map((alum) => (
                  <Grid item xs={12} sm={6} md={4} key={alum._id}>
                    <Card>
                      <CardContent>
                        <Box display="flex" alignItems="center" mb={2}>
                          <Avatar sx={{ mr: 2 }}>
                            {alum.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="h6">
                              {alum.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {alum.profile.jobTitle} at {alum.profile.currentCompany}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Typography variant="body2" paragraph>
                          {alum.profile.bio?.substring(0, 100)}...
                        </Typography>
                        
                        <Box mb={2}>
                          {alum.profile.skills?.slice(0, 3).map((skill, index) => (
                            <Chip
                              key={index}
                              label={skill}
                              size="small"
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                          ))}
                        </Box>
                      </CardContent>
                      
                      <CardActions>
                        <Button
                          size="small"
                          startIcon={<Chat />}
                          onClick={() => startChat(alum._id)}
                        >
                          Message
                        </Button>
                        <Button
                          size="small"
                          startIcon={<VideoCall />}
                          onClick={() => scheduleMeeting(alum._id)}
                        >
                          Meet
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default StudentDashboard;