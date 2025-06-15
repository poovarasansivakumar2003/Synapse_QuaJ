import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Grid,
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useAuth } from '../contexts/AuthContext';
import { meetingsAPI, usersAPI } from '../services/api';
import Layout from '../components/Layout';

const ScheduleMeetingPage = () => {
  const [participant, setParticipant] = useState(null);
  const [meeting, setMeeting] = useState({
    title: '',
    description: '',
    scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    duration: 60
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.alumniId) {
      fetchParticipant(location.state.alumniId);
    }
  }, [location.state]);

  const fetchParticipant = async (participantId) => {
    try {
      const response = await usersAPI.getProfile(participantId);
      setParticipant(response.data);
    } catch (error) {
      setError('Failed to load participant details');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await meetingsAPI.scheduleMeeting({
        ...meeting,
        participantId: participant._id
      });
      setSuccess('Meeting scheduled successfully!');
      setTimeout(() => navigate('/meetings'), 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to schedule meeting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Schedule Meeting">
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Schedule Meeting
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          {participant && (
            <Box sx={{ mb: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ mr: 2 }}>
                  {participant.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6">{participant.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {participant.profile.jobTitle} at {participant.profile.currentCompany}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Meeting Title"
                  value={meeting.title}
                  onChange={(e) => setMeeting({...meeting, title: e.target.value})}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Meeting Date & Time"
                    value={meeting.scheduledTime}
                    onChange={(newValue) => setMeeting({...meeting, scheduledTime: newValue})}
                    renderInput={(params) => <TextField {...params} fullWidth required />}
                    minDateTime={new Date()}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Duration</InputLabel>
                  <Select
                    value={meeting.duration}
                    onChange={(e) => setMeeting({...meeting, duration: e.target.value})}
                    required
                  >
                    <MenuItem value={30}>30 minutes</MenuItem>
                    <MenuItem value={60}>1 hour</MenuItem>
                    <MenuItem value={90}>1.5 hours</MenuItem>
                    <MenuItem value={120}>2 hours</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Meeting Description"
                  value={meeting.description}
                  onChange={(e) => setMeeting({...meeting, description: e.target.value})}
                  placeholder="What would you like to discuss in this meeting?"
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                  >
                    {loading ? 'Scheduling...' : 'Schedule Meeting'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Layout>
  );
};

export default ScheduleMeetingPage;
