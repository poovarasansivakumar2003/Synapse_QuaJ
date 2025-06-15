import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  IconButton
} from '@mui/material';
import {
  Videocam,
  VideocamOff,
  Mic,
  MicOff,
  ScreenShare,
  StopScreenShare,
  CallEnd,
  ArrowBack
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useMeeting } from '../contexts/MeetingContext';

const MeetingPage = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    stream,
    remoteStream,
    videoEnabled,
    audioEnabled,
    screenSharing,
    localVideoRef,
    remoteVideoRef,
    joinMeeting,
    leaveMeeting,
    toggleVideo,
    toggleAudio,
    startScreenShare,
    stopScreenShare
  } = useMeeting();

  useEffect(() => {
    if (meetingId) {
      joinMeeting(meetingId);
    }

    return () => {
      leaveMeeting();
    };
  }, [meetingId, joinMeeting, leaveMeeting]);

  const handleEndCall = () => {
    leaveMeeting();
  };

  return (
    <Container maxWidth="lg" sx={{ height: '100vh', p: 2 }}>
      <Grid container spacing={2} sx={{ height: '100%' }}>
        {/* Main Video Area */}
        <Grid item xs={12} md={9}>
          <Paper sx={{ height: '100%', position: 'relative', backgroundColor: 'black' }}>
            {/* Back Button */}
            <IconButton
              sx={{ position: 'absolute', top: 16, left: 16, color: 'white', zIndex: 1 }}
              onClick={() => navigate('/meetings')}
            >
              <ArrowBack />
            </IconButton>

            {/* Remote Video */}
            {remoteStream ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}
              >
                <Typography variant="h5">
                  Waiting for other participants...
                </Typography>
              </Box>
            )}
            
            {/* Local Video (Picture-in-Picture) */}
            <Paper
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                width: 200,
                height: 150,
                overflow: 'hidden',
                backgroundColor: 'grey.900'
              }}
            >
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </Paper>

            {/* Meeting Controls */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 2,
                backgroundColor: 'rgba(0,0,0,0.5)',
                borderRadius: 2,
                p: 1
              }}
            >
              <IconButton
                onClick={toggleVideo}
                sx={{ 
                  color: 'white',
                  backgroundColor: videoEnabled ? 'transparent' : 'error.main'
                }}
              >
                {videoEnabled ? <Videocam /> : <VideocamOff />}
              </IconButton>
              
              <IconButton
                onClick={toggleAudio}
                sx={{ 
                  color: 'white',
                  backgroundColor: audioEnabled ? 'transparent' : 'error.main'
                }}
              >
                {audioEnabled ? <Mic /> : <MicOff />}
              </IconButton>
              
              <IconButton
                onClick={screenSharing ? stopScreenShare : startScreenShare}
                sx={{ color: 'white' }}
              >
                {screenSharing ? <StopScreenShare /> : <ScreenShare />}
              </IconButton>
              
              <IconButton
                onClick={handleEndCall}
                sx={{ backgroundColor: 'error.main', color: 'white' }}
              >
                <CallEnd />
              </IconButton>
            </Box>
          </Paper>
        </Grid>

        {/* Control Panel */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ height: '100%', p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Meeting Controls
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                Meeting ID: {meetingId}
              </Typography>
              <Typography variant="body2">
                Host: {user?.name}
              </Typography>
            </Box>
            
            {/* Detailed Control Buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant={videoEnabled ? 'contained' : 'outlined'}
                startIcon={videoEnabled ? <Videocam /> : <VideocamOff />}
                onClick={toggleVideo}
                fullWidth
              >
                {videoEnabled ? 'Turn Off Video' : 'Turn On Video'}
              </Button>
              
              <Button
                variant={audioEnabled ? 'contained' : 'outlined'}
                startIcon={audioEnabled ? <Mic /> : <MicOff />}
                onClick={toggleAudio}
                fullWidth
              >
                {audioEnabled ? 'Mute' : 'Unmute'}
              </Button>
              
              <Button
                variant={screenSharing ? 'contained' : 'outlined'}
                startIcon={screenSharing ? <StopScreenShare /> : <ScreenShare />}
                onClick={screenSharing ? stopScreenShare : startScreenShare}
                fullWidth
              >
                {screenSharing ? 'Stop Sharing' : 'Share Screen'}
              </Button>
              
              <Button
                variant="contained"
                color="error"
                startIcon={<CallEnd />}
                onClick={handleEndCall}
                fullWidth
              >
                End Call
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MeetingPage;