/**
 * AIPanel.tsx
 * Panel colapsable del lado derecho para chat con IA
 *
 * Características:
 * - Panel deslizable desde la derecha
 * - Historial de mensajes usuario/IA
 * - Input para prompts
 * - Indicador de escritura
 * - Scroll automático
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Avatar,
  CircularProgress,
  Paper,
  Fade,
  Tabs,
  Tab
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Close, Send, SmartToy, Person, Functions } from '@mui/icons-material';
import { sendPromptToAI, queryWolfram } from '../hooks/useApi';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

interface AIPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIPanel: React.FC<AIPanelProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // 0 = AI Chat, 1 = Wolfram
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  // Scroll automático al final cuando hay nuevos mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let response: string;

      if (activeTab === 0) {
        // AI Chat
        response = await sendPromptToAI(userMessage.text);
      } else {
        // Wolfram Query
        const wolframResult = await queryWolfram(userMessage.text);
        response = `**Consulta:** ${wolframResult.query}\n\n**Resultado:** ${wolframResult.result}`;
      }

      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, responseMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: `Error: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Fade in={isOpen} timeout={300}>
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100vh',
          width: '400px',
          zIndex: 1200,
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(5,5,5,0.92)',
          borderRadius: 0,
          borderLeft: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(14px)',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            backgroundColor: 'rgba(15,15,15,0.9)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 32, height: 32 }}>
              {activeTab === 0 ? <SmartToy sx={{ fontSize: 18 }} /> : <Functions sx={{ fontSize: 18 }} />}
            </Avatar>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
              {activeTab === 0 ? 'Asistente IA' : 'Wolfram Alpha'}
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{ color: 'rgba(255,255,255,0.7)' }}
          >
            <Close />
          </IconButton>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: 'rgba(15,15,15,0.9)' }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{
              '& .MuiTab-root': {
                color: 'rgba(255,255,255,0.7)',
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: theme.palette.primary.main,
              },
            }}
          >
            <Tab label="Chat IA" />
            <Tab label="Wolfram" />
          </Tabs>
        </Box>

        {/* Messages Area */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {messages.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              {activeTab === 0 ? (
                <>
                  <SmartToy sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    ¡Hola! Soy tu asistente de IA
                  </Typography>
                  <Typography variant="body2">
                    Pregúntame sobre cálculo multivariado, matemáticas o cualquier tema
                  </Typography>
                </>
              ) : (
                <>
                  <Functions sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    Wolfram Alpha
                  </Typography>
                  <Typography variant="body2">
                    Consulta cálculos simbólicos avanzados
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, fontSize: '0.8rem' }}>
                    Ejemplos: "integrate sin(x)", "solve x^2 + 2x + 1 = 0"
                  </Typography>
                </>
              )}
            </Box>
          ) : (
            messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  gap: 1,
                  alignItems: 'flex-start',
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                  bgcolor: message.role === 'ai' ? theme.palette.primary.main : theme.palette.secondary.main,
                    flexShrink: 0,
                  }}
                >
                  {message.role === 'ai' ? (
                    <SmartToy sx={{ fontSize: 16 }} />
                  ) : (
                    <Person sx={{ fontSize: 16 }} />
                  )}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Paper
                    sx={{
                      p: 2,
                    backgroundColor: message.role === 'ai' ? 'rgba(20,20,20,0.9)' : 'rgba(6,182,212,0.12)',
                    border: `1px solid ${message.role === 'ai' ? 'rgba(59,130,246,0.35)' : 'rgba(6,182,212,0.4)'}`,
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'white',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}
                    >
                      {message.text}
                    </Typography>
                  </Paper>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'rgba(255,255,255,0.5)',
                      mt: 0.5,
                      display: 'block',
                    }}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </Typography>
                </Box>
              </Box>
            ))
          )}

          {/* Loading indicator */}
          {isLoading && (
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'flex-start',
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: theme.palette.primary.main,
                  flexShrink: 0,
                }}
              >
                <SmartToy sx={{ fontSize: 16 }} />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Paper
                  sx={{
                    p: 2,
                    backgroundColor: 'rgba(20,20,20,0.9)',
                    border: '1px solid rgba(59,130,246,0.35)',
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={16} sx={{ color: theme.palette.primary.main }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Pensando...
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Box>
          )}

          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area */}
        <Box
          sx={{
            p: 2,
            borderTop: '1px solid rgba(255,255,255,0.1)',
            backgroundColor: 'rgba(15,15,15,0.92)',
          }}
        >
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              disabled={isLoading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(5,5,5,0.9)',
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.15)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255,255,255,0.35)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
                '& .MuiInputBase-input::placeholder': {
                  color: 'rgba(255,255,255,0.5)',
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              sx={{
                minWidth: '50px',
                height: '56px',
                backgroundColor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
                '&:disabled': {
                  backgroundColor: 'rgba(59,130,246,0.3)',
                },
              }}
            >
              <Send />
            </Button>
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255,255,255,0.5)',
              mt: 1,
              display: 'block',
            }}
          >
            {activeTab === 0
              ? "Presiona Enter para enviar, Shift+Enter para nueva línea"
              : "Ejemplos: 'integrate sin(x)', 'solve x^2 + 2x + 1 = 0', 'd/dx x^3'"
            }
          </Typography>
        </Box>
      </Paper>
    </Fade>
  );
};

export default AIPanel;
