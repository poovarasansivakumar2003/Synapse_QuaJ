import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  LinearProgress
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  Close
} from '@mui/icons-material';

const VideoPlayer = ({ open, onClose, video }) => {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const percent = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(percent);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!video) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { height: '80vh' }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{video.title}</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ position: 'relative', backgroundColor: 'black' }}>
          <video
            ref={videoRef}
            width="100%"
            height="400px"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            style={{ objectFit: 'contain' }}
          >
            <source src={video.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Video Controls */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
              p: 1
            }}
          >
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ mb: 1 }}
            />
            
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center">
                <IconButton onClick={togglePlay} sx={{ color: 'white' }}>
                  {playing ? <Pause /> : <PlayArrow />}
                </IconButton>
                
                <IconButton onClick={toggleMute} sx={{ color: 'white' }}>
                  {muted ? <VolumeOff /> : <VolumeUp />}
                </IconButton>
                
                <Typography variant="body2" sx={{ color: 'white', ml: 1 }}>
                  {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
                </Typography>
              </Box>
              
              <IconButton sx={{ color: 'white' }}>
                <Fullscreen />
              </IconButton>
            </Box>
          </Box>
        </Box>
        
        {/* Video Info */}
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            {video.title}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" paragraph>
            By {video.instructor.name} • {video.instructor.company}
          </Typography>
          
          <Typography variant="body1">
            {video.description}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayer;
