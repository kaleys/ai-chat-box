import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  List,
  ListItem,
  Avatar,
  Fade,
  Chip,
  CircularProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import MarkdownRenderer from './MarkdownRenderer';
import { useChat } from '../hooks/useChat';

const ChatInterface: React.FC = () => {
  const { messages, isTyping, sendMessage } = useChat();
  const [inputValue, setInputValue] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Paper
        elevation={24}
        sx={{
          height: '95vh',
          width: '100%',
          maxWidth: '900px',
          borderRadius: 3,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          backdropFilter: 'blur(10px)',
          background: 'rgba(255, 255, 255, 0.95)'
        }}
      >
        {/* 标题栏 */}
        <Box
          sx={{
            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
            color: 'white',
            p: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Avatar
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              width: 48,
              height: 48
            }}
          >
            <SmartToyIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h5" component="h1" fontWeight="bold">
              AI 聊天助手
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              智能对话，随时为您服务
            </Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <Chip
              label="API Ready"
              size="small"
              sx={{
                bgcolor: '#10b981',
                color: 'white',
                fontWeight: 'bold'
              }}
            />
          </Box>
        </Box>
        
        {/* 聊天记录区域 */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            py: 2,
            px: 3,
            background: '#f8fafc'
          }}
        >
          <List sx={{ pb: 2 }}>
            {messages.map((message) => (
              <Fade in={true} timeout={500} key={message.id}>
                <ListItem
                  sx={{
                    display: 'flex',
                    justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                    mb: 3,
                    px: message.isUser ? 1 : 0, // AI消息不限制左右边距
                    flexDirection: 'column',
                    alignItems: message.isUser ? 'flex-end' : 'flex-start'
                  }}
                >
                  {/* 用户消息 - 保持气泡样式 */}
                  {message.isUser ? (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        gap: 1,
                        maxWidth: '70%',
                        flexDirection: 'row-reverse'
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: '#667eea',
                          width: 32,
                          height: 32
                        }}
                      >
                        <PersonIcon fontSize="small" />
                      </Avatar>
                      <Paper
                        elevation={2}
                        sx={{
                          p: 2,
                          bgcolor: '#667eea',
                          color: 'white',
                          borderRadius: '20px 20px 4px 20px',
                          position: 'relative',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            right: -8,
                            width: 0,
                            height: 0,
                            borderStyle: 'solid',
                            borderWidth: '0 0 16px 16px',
                            borderColor: 'transparent transparent #667eea transparent'
                          }
                        }}
                      >
                        <Box sx={{ mb: 0.5 }}>
                          <MarkdownRenderer 
                            content={message.text} 
                            isUser={message.isUser} 
                          />
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{
                            opacity: 0.8,
                            fontSize: '0.7rem'
                          }}
                        >
                          {message.timestamp.toLocaleTimeString('zh-CN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>
                      </Paper>
                    </Box>
                  ) : (
                    /* AI消息 - 移除气泡框，使用全宽布局 */
                    <Box
                      sx={{
                        width: '100%',
                        display: 'flex',
                        gap: 2,
                        alignItems: 'flex-start'
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: '#10b981',
                          width: 32,
                          height: 32,
                          flexShrink: 0,
                          mt: 0.5
                        }}
                      >
                        <SmartToyIcon fontSize="small" />
                      </Avatar>
                      <Box
                        sx={{
                          flex: 1,
                          minWidth: 0, // 防止flex item收缩问题
                          overflow: 'hidden' // 防止内容溢出
                        }}
                      >
                        <MarkdownRenderer 
                          content={message.text} 
                          isUser={message.isUser} 
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            opacity: 0.6,
                            fontSize: '0.7rem',
                            mt: 1,
                            display: 'block'
                          }}
                        >
                          {message.timestamp.toLocaleTimeString('zh-CN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </ListItem>
              </Fade>
            ))}
            
            {/* 打字指示器 */}
            {isTyping && (
              <Fade in={true}>
                <ListItem sx={{ justifyContent: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar
                      sx={{
                        bgcolor: '#10b981',
                        width: 32,
                        height: 32
                      }}
                    >
                      <SmartToyIcon fontSize="small" />
                    </Avatar>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 2,
                        bgcolor: 'white',
                        borderRadius: '20px 20px 20px 4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <CircularProgress size={16} sx={{ color: '#10b981' }} />
                      <Typography variant="body2" color="text.secondary">
                        AI正在思考中...
                      </Typography>
                    </Paper>
                  </Box>
                </ListItem>
              </Fade>
            )}
            
            <div ref={messagesEndRef} />
          </List>
        </Box>

        {/* 输入区域 */}
        <Box
          sx={{
            p: 3,
            borderTop: '1px solid #e2e8f0',
            background: 'white'
          }}
        >
          <Paper
            elevation={2}
            sx={{
              borderRadius: '25px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <TextField
                fullWidth
                multiline
                maxRows={4}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入您的消息..."
                variant="standard"
                disabled={isTyping}
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    p: 2,
                    fontSize: '1rem',
                    '& .MuiInputBase-input::placeholder': {
                      color: '#94a3b8',
                      opacity: 1
                    }
                  }
                }}
              />
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                sx={{
                  m: 1,
                  bgcolor: '#667eea',
                  color: 'white',
                  width: 48,
                  height: 48,
                  '&:hover': {
                    bgcolor: '#5a67d8'
                  },
                  '&:disabled': {
                    bgcolor: '#cbd5e0',
                    color: '#a0aec0'
                  }
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Paper>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatInterface;