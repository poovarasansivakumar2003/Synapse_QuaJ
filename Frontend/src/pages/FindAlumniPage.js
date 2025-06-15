import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Pagination
} from '@mui/material';
import {
  Search,
  Chat,
  VideoCall,
  FilterList
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { usersAPI, chatAPI } from '../services/api';
import { COURSES, SKILLS } from '../utils/constants';
import Layout from '../components/Layout';

const FindAlumniPage = () => {
  const [alumni, setAlumni] = useState([]);
  const [filteredAlumni, setFilteredAlumni] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    course: '',
    company: '',
    skills: []
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 9;

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAlumni();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters, alumni]);

  const fetchAlumni = async () => {
    setLoading(true);
    try {
      const response = await usersAPI.getAlumni();
      setAlumni(response.data);
    } catch (error) {
      console.error('Error fetching alumni:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = alumni.filter(alum => {
      const matchesSearch = 
        alum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alum.profile.currentCompany?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alum.profile.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCourse = !filters.course || alum.profile.course === filters.course;
      const matchesCompany = !filters.company || 
        alum.profile.currentCompany?.toLowerCase().includes(filters.company.toLowerCase());
      
      const matchesSkills = filters.skills.length === 0 || 
        filters.skills.some(skill => alum.profile.skills?.includes(skill));

      return matchesSearch && matchesCourse && matchesCompany && matchesSkills;
    });

    setFilteredAlumni(filtered);
    setPage(1);
  };

  const startChat = async (alumniId) => {
    try {
      const response = await chatAPI.startChat(alumniId);
      navigate('/chat', { state: { chatId: response.data._id } });
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  const scheduleMeeting = (alumniId) => {
    navigate('/schedule-meeting', { state: { alumniId } });
  };

  const paginatedAlumni = filteredAlumni.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Layout title="Find Alumni">
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Connect with Alumni
        </Typography>

        {/* Search and Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
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
            </Grid>

            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Course</InputLabel>
                <Select
                  value={filters.course}
                  onChange={(e) => setFilters({...filters, course: e.target.value})}
                >
                  <MenuItem value="">All Courses</MenuItem>
                  {COURSES.map(course => (
                    <MenuItem key={course} value={course}>{course}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Company"
                value={filters.company}
                onChange={(e) => setFilters({...filters, company: e.target.value})}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => setFilters({ course: '', company: '', skills: [] })}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Results */}
        <Box mb={2}>
          <Typography variant="h6">
            {filteredAlumni.length} alumni found
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {paginatedAlumni.map((alum) => (
            <Grid item xs={12} sm={6} md={4} key={alum._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ mr: 2, width: 56, height: 56 }}>
                      {alum.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {alum.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Class of {alum.profile.graduationYear}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="subtitle1" gutterBottom>
                    {alum.profile.jobTitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {alum.profile.currentCompany}
                  </Typography>

                  <Typography variant="body2" paragraph>
                    {alum.profile.bio?.substring(0, 100)}
                    {alum.profile.bio?.length > 100 && '...'}
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
                    {alum.profile.skills?.length > 3 && (
                      <Chip
                        label={`+${alum.profile.skills.length - 3} more`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>

                  {alum.preferences?.availableForMentoring && (
                    <Chip
                      label="Available for Mentoring"
                      color="success"
                      size="small"
                    />
                  )}
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

        {/* Pagination */}
        {filteredAlumni.length > itemsPerPage && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={Math.ceil(filteredAlumni.length / itemsPerPage)}
              page={page}
              onChange={(e, newPage) => setPage(newPage)}
              color="primary"
            />
          </Box>
        )}
      </Container>
    </Layout>
  );
};

export default FindAlumniPage;
