import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Grid,
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { usersAPI } from '../services/api';
import { COURSES, DEPARTMENTS, SKILLS } from '../utils/constants';
import Layout from '../components/Layout';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    profile: {
      graduationYear: '',
      course: '',
      department: '',
      currentCompany: '',
      jobTitle: '',
      skills: [],
      bio: '',
      linkedinProfile: ''
    },
    preferences: {
      availableForMentoring: false,
      industries: [],
      mentorshipAreas: []
    }
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [skillInput, setSkillInput] = useState('');

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setProfile(user);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('profile.')) {
      const field = name.split('.')[1];
      setProfile(prev => ({
        ...prev,
        profile: { ...prev.profile, [field]: value }
      }));
    } else if (name.includes('preferences.')) {
      const field = name.split('.')[1];
      setProfile(prev => ({
        ...prev,
        preferences: { ...prev.preferences, [field]: value }
      }));
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSkillAdd = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!profile.profile.skills.includes(skillInput.trim())) {
        setProfile(prev => ({
          ...prev,
          profile: {
            ...prev.profile,
            skills: [...prev.profile.skills, skillInput.trim()]
          }
        }));
      }
      setSkillInput('');
    }
  };

  const handleSkillDelete = (skillToDelete) => {
    setProfile(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        skills: prev.profile.skills.filter(skill => skill !== skillToDelete)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await usersAPI.updateProfile(profile);
      setSuccess('Profile updated successfully!');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Profile">
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Profile Settings
          </Typography>

          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Profile Picture */}
              <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <Avatar sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}>
                  {profile.name.charAt(0)}
                </Avatar>
                <Button
                  variant="outlined"
                  startIcon={<PhotoCamera />}
                  sx={{ mb: 2 }}
                >
                  Change Picture
                </Button>
              </Grid>

              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={profile.email}
                  disabled
                />
              </Grid>

              {/* Academic Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Academic Information
                </Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Graduation Year"
                  name="profile.graduationYear"
                  type="number"
                  value={profile.profile.graduationYear}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Course</InputLabel>
                  <Select
                    name="profile.course"
                    value={profile.profile.course}
                    onChange={handleChange}
                  >
                    {COURSES.map(course => (
                      <MenuItem key={course} value={course}>{course}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select
                    name="profile.department"
                    value={profile.profile.department}
                    onChange={handleChange}
                  >
                    {DEPARTMENTS.map(dept => (
                      <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Professional Information (Alumni only) */}
              {user?.role === 'alumni' && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Professional Information
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Current Company"
                      name="profile.currentCompany"
                      value={profile.profile.currentCompany}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Job Title"
                      name="profile.jobTitle"
                      value={profile.profile.jobTitle}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={profile.preferences.availableForMentoring}
                          onChange={(e) => setProfile(prev => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              availableForMentoring: e.target.checked
                            }
                          }))}
                        />
                      }
                      label="Available for Mentoring"
                    />
                  </Grid>
                </>
              )}

              {/* Skills */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Skills (Press Enter to add)"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={handleSkillAdd}
                />
                <Box sx={{ mt: 1 }}>
                  {profile.profile.skills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      onDelete={() => handleSkillDelete(skill)}
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              </Grid>

              {/* Bio */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Bio"
                  name="profile.bio"
                  value={profile.profile.bio}
                  onChange={handleChange}
                />
              </Grid>

              {/* LinkedIn Profile */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="LinkedIn Profile URL"
                  name="profile.linkedinProfile"
                  value={profile.profile.linkedinProfile}
                  onChange={handleChange}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
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

export default ProfilePage;
