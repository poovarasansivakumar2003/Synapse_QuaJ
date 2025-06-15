import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  IconButton,
  Typography,
  Avatar
} from '@mui/material';
import {
  Call,
  CallEnd,
  Videocam,
  VideocamOff,
  Mic,
  MicOff
} from '@mui/icons-material';
import Peer from 'simple-peer';
import useSocket from '../hooks/useSocket';

const VideoCallModal = ({ open, onClose, caller, isReceivingCall, callAccepted }) => {
  const [stream, setStream] = useState(null);
  const [callEnded, setCallEnded] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [peer, setPeer] = useState(null);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const socket = useSocket();

  useEffect(() => {
    if (open) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((currentStream) => {
          setStream(currentStream);
          if (myVideo.current) {
            myVideo.current.srcObject = currentStream;
          }
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [open]);

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream });
    
    peer.on('signal', (data) => {
      socket.emit('answer-call', { signal: data, to: caller });
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
    socket.emit('call-ended', { to: caller });
    onClose();
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks()[0].enabled = !videoEnabled;
      setVideoEnabled(!videoEnabled);
    }
  };

  const toggleAudio = () => {
    if (stream) {
      stream.getAudioTracks()[0].enabled = !audioEnabled;
      setAudioEnabled(!audioEnabled);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { height: '80vh' }
      }}
    >
      <DialogContent sx={{ p: 0, position: 'relative', backgroundColor: 'black' }}>
        {/* Remote Video */}
        <Box sx={{ width: '100%', height: '100%' }}>
          {callAccepted && !callEnded ? (
            <video
              playsInline
              ref={userVideo}
              autoPlay
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}
            >
              <Avatar sx={{ width: 80, height: 80, mb: 2 }}>
                {caller?.name?.charAt(0)}
              </Avatar>
              <Typography variant="h6">
                {isReceivingCall ? `${caller.name} is calling...` : 'Connecting...'}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Local Video (Picture-in-Picture) */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 200,
            height: 150,
            borderRadius: 1,
            overflow: 'hidden'
          }}
        >
          <video
            playsInline
            muted
            ref={myVideo}
            autoPlay
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>

        {/* Controls */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 2
          }}
        >
          <IconButton
            sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
            onClick={toggleVideo}
          >
            {videoEnabled ? <Videocam /> : <VideocamOff />}
          </IconButton>
          
          <IconButton
            sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
            onClick={toggleAudio}
          >
            {audioEnabled ? <Mic /> : <MicOff />}
          </IconButton>

          {isReceivingCall && !callAccepted ? (
            <IconButton
              sx={{ backgroundColor: 'green', color: 'white' }}
              onClick={answerCall}
            >
              <Call />
            </IconButton>
          ) : null}

          <IconButton
            sx={{ backgroundColor: 'red', color: 'white' }}
            onClick={leaveCall}
          >
            <CallEnd />
          </IconButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default VideoCallModal;
