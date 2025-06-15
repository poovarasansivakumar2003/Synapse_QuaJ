import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Grid,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { usersAPI } from '../services/api';
import Layout from '../components/Layout';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      messages: true,
      meetings: true
    },
    privacy: {
      profileVisible: true,
      showEmail: false,
      allowMentoring: false
    },
    preferences: {
      theme: 'light',
      language: 'en'
    }
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const { user } = useAuth();

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await usersAPI.updateProfile({ settings });
      setSuccess('Settings updated successfully!');
    } catch (error) {
      setError('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Settings">
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>

        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Grid container spacing={3}>
          {/* Notification Settings */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Notifications
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.email}
                    onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                  />
                }
                label="Email Notifications"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.messages}
                    onChange={(e) => handleSettingChange('notifications', 'messages', e.target.checked)}
                  />
                }
                label="Message Notifications"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.meetings}
                    onChange={(e) => handleSettingChange('notifications', 'meetings', e.target.checked)}
                  />
                }
                label="Meeting Reminders"
              />
            </Paper>
          </Grid>

          {/* Privacy Settings */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Privacy
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.privacy.profileVisible}
                    onChange={(e) => handleSettingChange('privacy', 'profileVisible', e.target.checked)}
                  />
                }
                label="Make Profile Visible"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.privacy.showEmail}
                    onChange={(e) => handleSettingChange('privacy', 'showEmail', e.target.checked)}
                  />
                }
                label="Show Email to Other Users"
              />
              
              {user?.role === 'alumni' && (
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.privacy.allowMentoring}
                      onChange={(e) => handleSettingChange('privacy', 'allowMentoring', e.target.checked)}
                    />
                  }
                  label="Available for Mentoring"
                />
              )}
            </Paper>
          </Grid>

          {/* Save Button */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default SettingsPage;
