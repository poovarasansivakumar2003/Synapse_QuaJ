import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  AppBar,
  Toolbar,
  Divider,
  InputAdornment
} from '@mui/material';
import {
  Send,
  ArrowBack,
  VideoCall,
  Phone
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import io from 'socket.io-client';

const ChatPage = () => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(process.env.REACT_APP_BACKEND_URL);
    setSocket(newSocket);

    fetchChats();

    // If chat ID is passed from navigation
    if (location.state?.chatId) {
      loadChat(location.state.chatId);
    }

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (socket && activeChat) {
      socket.emit('join-room', activeChat._id);
      
      socket.on('receive-message', (message) => {
        setMessages(prev => [...prev, message]);
      });

      return () => {
        socket.off('receive-message');
      };
    }
  }, [socket, activeChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChats = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/chat`);
      setChats(response.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const loadChat = async (chatId) => {
    try {
      const chat = chats.find(c => c._id === chatId);
      if (chat) {
        setActiveChat(chat);
        setMessages(chat.messages || []);
      }
    } catch (error) {
      console.error('Error loading chat:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeChat) return;

    const messageData = {
      roomId: activeChat._id,
      sender: user.id,
      content: newMessage,
      timestamp: new Date()
    };

    try {
      // Send via socket
      socket.emit('send-message', messageData);
      
      // Save to database
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/chat/${activeChat._id}/message`, {
        content: newMessage
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getOtherParticipant = (chat) => {
    return chat.participants.find(p => p._id !== user.id);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate(-1)}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {activeChat ? `Chat with ${getOtherParticipant(activeChat)?.name}` : 'Messages'}
          </Typography>
          {activeChat && (
            <Box>
              <IconButton color="inherit">
                <Phone />
              </IconButton>
              <IconButton color="inherit">
                <VideoCall />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ height: 'calc(100vh - 64px)', p: 0 }}>
        <Grid container sx={{ height: '100%' }}>
          {/* Chat List */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ height: '100%', overflow: 'auto' }}>
              <Box p={2}>
                <Typography variant="h6">Conversations</Typography>
              </Box>
              <Divider />
              <List>
                {chats.map((chat) => {
                  const otherParticipant = getOtherParticipant(chat);
                  return (
                    <ListItem
                      key={chat._id}
                      button
                      selected={activeChat?._id === chat._id}
                      onClick={() => loadChat(chat._id)}
                    >
                      <ListItemAvatar>
                        <Avatar>
                          {otherParticipant?.name?.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={otherParticipant?.name}
                        secondary={chat.messages?.[chat.messages.length - 1]?.content?.substring(0, 50)}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Paper>
          </Grid>

          {/* Chat Area */}
          <Grid item xs={12} md={8}>
            {activeChat ? (
              <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Messages */}
                <Box sx={{ flexGrow: 1, overflow: 'auto', p: 1 }}>
                  {messages.map((message, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        justifyContent: message.sender === user.id ? 'flex-end' : 'flex-start',
                        mb: 1
                      }}
                    >
                      <Paper
                        sx={{
                          p: 1,
                          maxWidth: '70%',
                          backgroundColor: message.sender === user.id ? 'primary.main' : 'grey.200',
                          color: message.sender === user.id ? 'white' : 'black'
                        }}
                      >
                        <Typography variant="body1">
                          {message.content}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </Typography>
                      </Paper>
                    </Box>
                  ))}
                  <div ref={messagesEndRef} />
                </Box>

                {/* Message Input */}
                <Divider />
                <Box p={2}>
                  <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            color="primary"
                            onClick={sendMessage}
                            disabled={!newMessage.trim()}
                          >
                            <Send />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>
              </Paper>
            ) : (
              <Paper sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  Select a conversation to start messaging
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default ChatPage;
