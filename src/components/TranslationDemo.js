import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  IconButton,
  Switch,
  FormControlLabel,
  Alert,
  Collapse
} from '@mui/material';
import { 
  Translate, 
  SwapHoriz, 
  Info,
  History,
  Code,
  Close
} from '@mui/icons-material';
import axios from 'axios';
import ReactJson from 'react-json-view';

const TranslationDemo = ({ userId, sessionId }) => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [direction, setDirection] = useState('english-to-spanish'); // or 'spanish-to-english'
  const [contextType, setContextType] = useState('mixed');
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState(null);
  const [showContext, setShowContext] = useState(false);
  const [translations, setTranslations] = useState([]);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  // Reset error message after 5 seconds
  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleDirectionChange = () => {
    setDirection(direction === 'english-to-spanish' ? 'spanish-to-english' : 'english-to-spanish');
  };

  const fetchContext = async () => {
    try {
      const response = await axios.post('/mcp/context', {
        context_type: contextType,
        operation: 'get',
        user_id: userId
      });
      setContext(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching context:', err);
      setError('Failed to fetch context: ' + (err.response?.data?.message || err.message));
      return null;
    }
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      setError('Please enter text to translate');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // First, get context
      const contextData = await fetchContext();

      // Determine target language
      const targetLanguage = direction === 'english-to-spanish' ? 'spanish' : 'english';

      // Perform translation
      const response = await axios.post('/api/translate', {
        text: sourceText,
        targetLanguage,
        userId,
        sessionId,
        contextType
      });

      setTranslatedText(response.data.translatedText);
      setApiResponse(response.data);
      
      // Add to translation history
      setTranslations([
        {
          original: sourceText,
          translated: response.data.translatedText,
          direction,
          timestamp: new Date().toISOString()
        },
        ...translations.slice(0, 4) // Keep last 5 translations
      ]);

    } catch (err) {
      console.error('Translation error:', err);
      setError('Translation failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Function to highlight key phrases in context
  const highlightContext = (contextContent) => {
    if (!contextContent || !sourceText) return contextContent;
    
    // Simplified highlighting - in a real app, this would be more sophisticated
    const words = sourceText.toLowerCase().split(/\s+/);
    let highlightedContent = contextContent;
    
    words.forEach(word => {
      if (word.length > 3) { // Only highlight meaningful words
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        highlightedContent = highlightedContent.replace(
          regex, 
          match => `<mark style="background-color: #ffeb3b;">${match}</mark>`
        );
      }
    });
    
    return highlightedContent;
  };

  return (
    <Box>
      <Collapse in={showError}>
        <Alert 
          severity="error" 
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setShowError(false)}
            >
              <Close fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      </Collapse>

      <Grid container spacing={3}>
        {/* Left side - Translation input/output */}
        <Grid item xs={12} md={7}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                {direction === 'english-to-spanish' ? 'English → Spanish' : 'Spanish → English'}
              </Typography>
              
              <Button 
                variant="outlined" 
                startIcon={<SwapHoriz />}
                onClick={handleDirectionChange}
                size="small"
              >
                Swap
              </Button>
            </Box>
            
            <TextField
              label="Enter text to translate"
              multiline
              rows={4}
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
            />
            
            <Box sx={{ display: 'flex', mb: 2 }}>
              <FormControl sx={{ minWidth: 200, mr: 2 }}>
                <InputLabel>Context Type</InputLabel>
                <Select
                  value={contextType}
                  label="Context Type"
                  onChange={(e) => setContextType(e.target.value)}
                  size="small"
                >
                  <MenuItem value="mixed">Mixed</MenuItem>
                  <MenuItem value="vocabulary">Vocabulary</MenuItem>
                  <MenuItem value="grammar">Grammar</MenuItem>
                  <MenuItem value="conversation">Conversation</MenuItem>
                  <MenuItem value="personalized">Personalized</MenuItem>
                </Select>
              </FormControl>
              
              <Button 
                variant="contained" 
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Translate />}
                onClick={handleTranslate}
                disabled={loading || !sourceText.trim()}
                sx={{ flexGrow: 1 }}
              >
                Translate
              </Button>
            </Box>
            
            <Typography variant="subtitle1" gutterBottom>
              Translation Result:
            </Typography>
            
            <Card variant="outlined" sx={{ flexGrow: 1, mb: 2, bgcolor: '#f5f5f5' }}>
              <CardContent>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Typography variant="body1">
                    {translatedText || 'Translation will appear here'}
                  </Typography>
                )}
              </CardContent>
            </Card>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={showContext}
                    onChange={() => setShowContext(!showContext)}
                    color="primary"
                  />
                }
                label="Show Context"
              />
              
              <FormControlLabel
                control={
                  <Switch 
                    checked={showJson}
                    onChange={() => setShowJson(!showJson)}
                    color="primary"
                  />
                }
                label="Show API Response"
              />
            </Box>
            
            {showJson && apiResponse && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  API Response:
                </Typography>
                <Paper variant="outlined" sx={{ p: 1, maxHeight: 200, overflow: 'auto' }}>
                  <ReactJson 
                    src={apiResponse} 
                    collapsed={2} 
                    displayDataTypes={false}
                    name={false}
                  />
                </Paper>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Right side - Context and History */}
        <Grid item xs={12} md={5}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Context Panel */}
            {showContext && (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Info color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Context ({contextType})
                  </Typography>
                  <Chip 
                    label={context ? 'Retrieved' : 'Not Loaded'} 
                    color={context ? 'success' : 'default'} 
                    size="small" 
                  />
                </Box>
                
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1,
                    mb: 2,
                    maxHeight: 250,
                    overflow: 'auto',
                    bgcolor: '#f8f9fa'
                  }}
                >
                  {context ? (
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: highlightContext(context.content) 
                      }} 
                    />
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      Context will be displayed here after translation
                    </Typography>
                  )}
                </Paper>
              </>
            )}
            
            {/* Translation History */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <History color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">
                Translation History
              </Typography>
            </Box>
            
            <List 
              sx={{ 
                bgcolor: '#f8f9fa', 
                borderRadius: 1, 
                overflow: 'auto',
                flexGrow: 1,
                minHeight: 200 
              }}
            >
              {translations.length > 0 ? (
                translations.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={
                          <>
                            <Typography 
                              component="span" 
                              variant="body2" 
                              color="text.primary"
                              sx={{ display: 'block', fontWeight: 'bold' }}
                            >
                              {item.original}
                            </Typography>
                            <Typography 
                              component="span" 
                              variant="body2" 
                              color="primary"
                              sx={{ display: 'block' }}
                            >
                              {item.translated}
                            </Typography>
                          </>
                        }
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: 'block' }}
                            >
                              {item.direction === 'english-to-spanish' ? 'EN → ES' : 'ES → EN'} • {
                                new Date(item.timestamp).toLocaleTimeString()
                              }
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {index < translations.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))
              ) : (
                <ListItem>
                  <ListItemText
                    primary="No translations yet"
                    secondary="Translated items will appear here"
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TranslationDemo;

