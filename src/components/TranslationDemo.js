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
  Close
} from '@mui/icons-material';
import axios from 'axios';
import JsonView from '@uiw/react-json-view';
import { labels } from '../labels';

const TranslationDemo = ({ userId, sessionId }) => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [direction, setDirection] = useState('english-to-spanish');
  const [contextType, setContextType] = useState('mixed');
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState(null);
  const [showContext, setShowContext] = useState(false);
  const [translations, setTranslations] = useState([]);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

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
      setError(labels.translation.errors.fetchContext + (err.response?.data?.message || err.message));
      return null;
    }
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      setError(labels.translation.errors.emptyText);
      return;
    }

    setLoading(true);
    setError('');
    try {
      await fetchContext();
      const targetLanguage = direction === 'english-to-spanish' ? 'spanish' : 'english';

      const response = await axios.post('/api/translate', {
        text: sourceText,
        targetLanguage,
        userId,
        sessionId,
        contextType
      });

      setTranslatedText(response.data.translatedText);
      setApiResponse(response.data);
      
      setTranslations([
        {
          original: sourceText,
          translated: response.data.translatedText,
          direction,
          timestamp: new Date().toISOString(),
          aiGenerated: response.data.aiGenerated,
          model: response.data.model
        },
        ...translations.slice(0, 4)
      ]);

    } catch (err) {
      console.error('Translation error:', err);
      setError(labels.translation.errors.translation + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const highlightContext = (contextContent) => {
    if (!contextContent || !sourceText) return contextContent;
    
    const words = sourceText.toLowerCase().split(/\s+/);
    let highlightedContent = contextContent;
    
    words.forEach(word => {
      if (word.length > 3) {
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
                {direction === 'english-to-spanish' 
                  ? labels.translation.directions.englishToSpanish 
                  : labels.translation.directions.spanishToEnglish}
              </Typography>
              
              <Button 
                variant="outlined" 
                startIcon={<SwapHoriz />}
                onClick={handleDirectionChange}
                size="small"
              >
                {labels.translation.buttons.swap}
              </Button>
            </Box>
            
            <TextField
              label={labels.translation.labels.input}
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
                <InputLabel>{labels.translation.labels.contextType}</InputLabel>
                <Select
                  value={contextType}
                  label={labels.translation.labels.contextType}
                  onChange={(e) => setContextType(e.target.value)}
                  size="small"
                >
                  {labels.contextTypes.types.map(type => (
                    <MenuItem key={type.name} value={type.name}>{type.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Button 
                variant="contained" 
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Translate />}
                onClick={handleTranslate}
                disabled={loading || !sourceText.trim()}
                sx={{ flexGrow: 1 }}
              >
                {labels.translation.buttons.translate}
              </Button>
            </Box>
            
            <Typography variant="subtitle1" gutterBottom>
              {labels.translation.labels.result}
            </Typography>
            
            <Card variant="outlined" sx={{ flexGrow: 1, mb: 2, bgcolor: '#f5f5f5' }}>
              <CardContent>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Typography variant="body1">
                    {translatedText || labels.translation.labels.placeholder}
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
                label={labels.translation.labels.showContext}
              />
              
              <FormControlLabel
                control={
                  <Switch 
                    checked={showJson}
                    onChange={() => setShowJson(!showJson)}
                    color="primary"
                  />
                }
                label={labels.translation.labels.showApiResponse}
              />
            </Box>
            
            {showJson && apiResponse && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {labels.translation.labels.apiResponse}
                </Typography>
                <Paper variant="outlined" sx={{ p: 1, maxHeight: 200, overflow: 'auto' }}>
                  <JsonView 
                    value={apiResponse} 
                    collapsed={2} 
                    displayDataTypes={false}
                    displayObjectSize={false}
                  />
                </Paper>
              </Box>
            )}
          </Paper>
        </Grid>
        
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
            {showContext && (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Info color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {`${labels.translation.labels.context} (${contextType})`}
                  </Typography>
                  <Chip 
                    label={context ? labels.translation.labels.retrieved : labels.translation.labels.notLoaded} 
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
                      {labels.translation.labels.contextPlaceholder}
                    </Typography>
                  )}
                </Paper>
              </>
            )}
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <History color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">
                {labels.translation.labels.history}
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
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <Typography
                                component="span"
                                variant="caption"
                                color="text.secondary"
                              >
                                {item.direction === 'english-to-spanish' 
                                  ? labels.translation.directions.englishToSpanish 
                                  : labels.translation.directions.spanishToEnglish} • {
                                  new Date(item.timestamp).toLocaleTimeString()
                                }
                              </Typography>
                              <Chip
                                label={item.aiGenerated ? `🤖 ${item.model}` : '📝 Fallback'}
                                size="small"
                                color={item.aiGenerated ? 'success' : 'default'}
                                variant="outlined"
                                sx={{ height: 18, fontSize: '0.7rem' }}
                              />
                            </Box>
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
                    primary={labels.translation.labels.noTranslations}
                    secondary={labels.translation.labels.noTranslationsDesc}
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
