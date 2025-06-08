import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  IconButton,
  Tab,
  Tabs,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Send,
  Code,
  Api,
  ContentCopy,
  Check,
  Translate,
  School,
  Psychology
} from '@mui/icons-material';
import JsonView from '@uiw/react-json-view';
import { labels } from '../labels';

const ApiExplorer = ({ userId, sessionId }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  
  const [prompt, setPrompt] = useState(labels.apiEndpoints.defaultValues.prompt);
  const [contextType, setContextType] = useState('mixed');
  const [translateText, setTranslateText] = useState(labels.apiEndpoints.defaultValues.translateText);
  const [translateTarget, setTranslateTarget] = useState('spanish');
  const [conjugateVerb, setConjugateVerb] = useState(labels.apiEndpoints.defaultValues.conjugateVerb);
  const [conjugateTense, setConjugateTense] = useState('present');
  const [queryText, setQueryText] = useState(labels.apiEndpoints.defaultValues.queryText);

  const simulatedResponses = {
    models: {
      ...labels.apiExplorer.simulatedResponses.models
    },
    context: {
      ...labels.apiExplorer.simulatedResponses.context
    },
    generate: {
      ...labels.apiExplorer.simulatedResponses.generate,
      session_id: sessionId || "session_1234567890"
    },
    translate: {
      ...labels.apiExplorer.simulatedResponses.translate,
      sessionId: sessionId || "session_1234567890"
    },
    conjugate: {
      ...labels.apiExplorer.simulatedResponses.conjugate,
      sessionId: sessionId || "session_1234567890"
    },
    query: {
      ...labels.apiExplorer.simulatedResponses.query,
      sessionId: sessionId || "session_1234567890"
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    setResponse(null);
    setError('');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleRequest = (endpoint) => {
    setLoading(true);
    setError('');
    setResponse(null);
    
    setTimeout(() => {
      setLoading(false);
      
      switch (endpoint) {
        case 'models':
          setResponse(simulatedResponses.models);
          break;
        case 'context':
          setResponse(simulatedResponses.context);
          break;
        case 'generate':
          setResponse(simulatedResponses.generate);
          break;
        case 'translate':
          setResponse(simulatedResponses.translate);
          break;
        case 'conjugate':
          setResponse(simulatedResponses.conjugate);
          break;
        case 'query':
          setResponse(simulatedResponses.query);
          break;
        default:
          setError(labels.apiExplorer.errors.unknownEndpoint);
      }
    }, 1000);
  };


  const renderEndpointForm = () => {
    switch (tabIndex) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              {labels.apiEndpoints.endpoints.models.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {labels.apiEndpoints.endpoints.models.description}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
              onClick={() => handleRequest('models')}
              disabled={loading}
            >
              {labels.apiEndpoints.endpoints.models.buttonText}
            </Button>
          </Box>
        );
      
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              {labels.apiEndpoints.endpoints.context.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {labels.apiEndpoints.endpoints.context.description}
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>{labels.apiExplorer.labels.contextType}</InputLabel>
                  <Select
                    value={contextType}
                    label={labels.apiExplorer.labels.contextType}
                    onChange={(e) => setContextType(e.target.value)}
                  >
                    {labels.contextTypes.types.map(type => (
                      <MenuItem key={type.name} value={type.name}>{type.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
              onClick={() => handleRequest('context')}
              disabled={loading}
            >
              {labels.apiEndpoints.endpoints.context.buttonText}
            </Button>
          </Box>
        );
      
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              {labels.apiEndpoints.endpoints.generate.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {labels.apiEndpoints.endpoints.generate.description}
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <TextField
                  label={labels.apiExplorer.labels.prompt}
                  fullWidth
                  multiline
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>{labels.apiExplorer.labels.contextType}</InputLabel>
                  <Select
                    value={contextType}
                    label={labels.apiExplorer.labels.contextType}
                    onChange={(e) => setContextType(e.target.value)}
                  >
                    {labels.contextTypes.types.map(type => (
                      <MenuItem key={type.name} value={type.name}>{type.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
              onClick={() => handleRequest('generate')}
              disabled={loading || !prompt.trim()}
            >
              {labels.apiEndpoints.endpoints.generate.buttonText}
            </Button>
          </Box>
        );
      
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              {labels.apiEndpoints.endpoints.translate.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {labels.apiEndpoints.endpoints.translate.description}
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <TextField
                  label={labels.apiExplorer.labels.textToTranslate}
                  fullWidth
                  multiline
                  rows={3}
                  value={translateText}
                  onChange={(e) => setTranslateText(e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>{labels.apiExplorer.labels.targetLanguage}</InputLabel>
                  <Select
                    value={translateTarget}
                    label={labels.apiExplorer.labels.targetLanguage}
                    onChange={(e) => setTranslateTarget(e.target.value)}
                  >
                    <MenuItem value="spanish">{labels.apiExplorer.languages.spanish}</MenuItem>
                    <MenuItem value="english">{labels.apiExplorer.languages.english}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
              onClick={() => handleRequest('translate')}
              disabled={loading || !translateText.trim()}
            >
              {labels.apiEndpoints.endpoints.translate.buttonText}
            </Button>
          </Box>
        );
      
      case 4:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              {labels.apiEndpoints.endpoints.conjugate.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {labels.apiEndpoints.endpoints.conjugate.description}
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={labels.apiExplorer.labels.verb}
                  fullWidth
                  value={conjugateVerb}
                  onChange={(e) => setConjugateVerb(e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>{labels.apiExplorer.labels.tense}</InputLabel>
                  <Select
                    value={conjugateTense}
                    label={labels.apiExplorer.labels.tense}
                    onChange={(e) => setConjugateTense(e.target.value)}
                  >
                    <MenuItem value="present">{labels.apiExplorer.tenses.present}</MenuItem>
                    <MenuItem value="preterite">{labels.apiExplorer.tenses.preterite}</MenuItem>
                    <MenuItem value="imperfect">{labels.apiExplorer.tenses.imperfect}</MenuItem>
                    <MenuItem value="future">{labels.apiExplorer.tenses.future}</MenuItem>
                    <MenuItem value="conditional">{labels.apiExplorer.tenses.conditional}</MenuItem>
                    <MenuItem value="subjunctive">{labels.apiExplorer.tenses.subjunctive}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
              onClick={() => handleRequest('conjugate')}
              disabled={loading || !conjugateVerb.trim()}
            >
              {labels.apiEndpoints.endpoints.conjugate.buttonText}
            </Button>
          </Box>
        );
      
      case 5:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              {labels.apiEndpoints.endpoints.query.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {labels.apiEndpoints.endpoints.query.description}
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <TextField
                  label={labels.apiExplorer.labels.query}
                  fullWidth
                  multiline
                  rows={3}
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>{labels.apiExplorer.labels.contextType}</InputLabel>
                  <Select
                    value={contextType}
                    label={labels.apiExplorer.labels.contextType}
                    onChange={(e) => setContextType(e.target.value)}
                  >
                    {labels.contextTypes.types.map(type => (
                      <MenuItem key={type.name} value={type.name}>{type.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
              onClick={() => handleRequest('query')}
              disabled={loading || !queryText.trim()}
            >
              {labels.apiEndpoints.endpoints.query.buttonText}
            </Button>
          </Box>
        );
      
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}
        >
          <Tab icon={<Api />} label={labels.apiExplorer.tabs.models} />
          <Tab icon={<Code />} label={labels.apiExplorer.tabs.context} />
          <Tab icon={<Send />} label={labels.apiExplorer.tabs.generate} />
          <Tab icon={<Translate />} label={labels.apiExplorer.tabs.translate} />
          <Tab icon={<School />} label={labels.apiExplorer.tabs.conjugate} />
          <Tab icon={<Psychology />} label={labels.apiExplorer.tabs.query} />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {renderEndpointForm()}
          
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {response && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {labels.apiExplorer.labels.response}
                  </Typography>
                  <IconButton
                    onClick={() => copyToClipboard(JSON.stringify(response, null, 2))}
                    size="small"
                  >
                    {copied ? <Check /> : <ContentCopy />}
                  </IconButton>
                </Box>
                <JsonView value={response} style={{ fontSize: '0.9rem' }} />
              </CardContent>
            </Card>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default ApiExplorer;