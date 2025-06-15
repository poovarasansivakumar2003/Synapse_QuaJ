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
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tab,
  Tabs
} from '@mui/material';
import {
  VideoCall,
  Schedule,
  Cancel,
  CheckCircle
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useAuth } from '../contexts/AuthContext';
import { meetingsAPI, usersAPI } from '../services/api';
import { MEETING_STATUS } from '../utils/constants';
import Layout from '../components/Layout';

const MeetingsPage = () => {
  const [meetings, setMeetings] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    description: '',
    participantId: '',
    scheduledTime: new Date(),
    duration: 60
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMeetings();
    fetchUsers();
  }, []);

  const fetchMeetings = async () => {
    try {
      const response = await meetingsAPI.getMeetings();
      setMeetings(response.data);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = user.role === 'student' 
        ? await usersAPI.getAlumni()
        : await usersAPI.getStudents();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleScheduleMeeting = async () => {
    try {
      await meetingsAPI.scheduleMeeting(newMeeting);
      setDialogOpen(false);
      setNewMeeting({
        title: '',
        description: '',
        participantId: '',
        scheduledTime: new Date(),
        duration: 60
      });
      fetchMeetings();
    } catch (error) {
      console.error('Error scheduling meeting:', error);
    }
  };

  const handleStatusUpdate = async (meetingId, status) => {
    try {
      await meetingsAPI.updateMeetingStatus(meetingId, status);
      fetchMeetings();
    } catch (error) {
      console.error('Error updating meeting status:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      [MEETING_STATUS.SCHEDULED]: 'info',
      [MEETING_STATUS.ONGOING]: 'warning',
      [MEETING_STATUS.COMPLETED]: 'success',
      [MEETING_STATUS.CANCELLED]: 'error'
    };
    return colors[status] || 'default';
  };

  const filterMeetings = (status) => {
    if (status === 'all') return meetings;
    return meetings.filter(meeting => meeting.status === status);
  };

  const getTabMeetings = () => {
    const tabs = ['all', 'scheduled', 'completed'];
    return filterMeetings(tabs[tabValue]);
  };

  return (
    <Layout title="Meetings">
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">
            My Meetings
          </Typography>
          <Button
            variant="contained"
            startIcon={<Schedule />}
            onClick={() => setDialogOpen(true)}
          >
            Schedule Meeting
          </Button>
        </Box>

        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="All Meetings" />
            <Tab label="Scheduled" />
            <Tab label="Completed" />
          </Tabs>
        </Paper>

        <Grid container spacing={3}>
          {getTabMeetings().map((meeting) => {
            const otherParticipant = meeting.organizer._id === user.id 
              ? meeting.participant 
              : meeting.organizer;
            
            return (
              <Grid item xs={12} md={6} key={meeting._id}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Typography variant="h6">
                        {meeting.title}
                      </Typography>
                      <Chip
                        label={meeting.status}
                        color={getStatusColor(meeting.status)}
                        size="small"
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      with {otherParticipant.name}
                    </Typography>

                    <Typography variant="body2" paragraph>
                      {meeting.description}
                    </Typography>

                    <Typography variant="body2">
                      <strong>Date:</strong> {new Date(meeting.scheduledTime).toLocaleString()}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Duration:</strong> {meeting.duration} minutes
                    </Typography>
                  </CardContent>

                  <CardActions>
                    {meeting.status === MEETING_STATUS.SCHEDULED && (
                      <>
                        <Button
                          size="small"
                          startIcon={<VideoCall />}
                          onClick={() => navigate(`/meeting/${meeting._id}`)}
                        >
                          Join
                        </Button>
                        <Button
                          size="small"
                          startIcon={<Cancel />}
                          color="error"
                          onClick={() => handleStatusUpdate(meeting._id, MEETING_STATUS.CANCELLED)}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                    {meeting.status === MEETING_STATUS.COMPLETED && (
                      <Button
                        size="small"
                        startIcon={<CheckCircle />}
                        color="success"
                        disabled
                      >
                        Completed
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Schedule Meeting Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Schedule New Meeting</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Meeting Title"
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Participant</InputLabel>
                  <Select
                    value={newMeeting.participantId}
                    onChange={(e) => setNewMeeting({...newMeeting, participantId: e.target.value})}
                  >
                    {users.map(user => (
                      <MenuItem key={user._id} value={user._id}>
                        {user.name} - {user.profile.jobTitle || user.profile.course}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Meeting Date & Time"
                    value={newMeeting.scheduledTime}
                    onChange={(newValue) => setNewMeeting({...newMeeting, scheduledTime: newValue})}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Duration (minutes)</InputLabel>
                  <Select
                    value={newMeeting.duration}
                    onChange={(e) => setNewMeeting({...newMeeting, duration: e.target.value})}
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
                  rows={3}
                  label="Description"
                  value={newMeeting.description}
                  onChange={(e) => setNewMeeting({...newMeeting, description: e.target.value})}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleScheduleMeeting} variant="contained">
              Schedule Meeting
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default MeetingsPage;
