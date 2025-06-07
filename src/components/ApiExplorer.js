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
  Divider,
  Chip,
  IconButton,
  Tooltip,
  Tab,
  Tabs,
  CircularProgress,
  Alert,
  useTheme,
} from '@mui/material';
import {
  Send,
  Code,
  Api,
  ContentCopy,
  Check,
  Refresh,
} from '@mui/icons-material';
import ReactJson from 'react-json-view';

const ApiExplorer = ({ userId, sessionId }) => {
  const theme = useTheme();
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Form states
  const [prompt, setPrompt] = useState('Translate to Spanish: Hello, how are you?');
  const [contextType, setContextType] = useState('mixed');
  const [translateText, setTranslateText] = useState('Hello, how are you?');
  const [translateTarget, setTranslateTarget] = useState('spanish');
  const [conjugateVerb, setConjugateVerb] = useState('hablar');
  const [conjugateTense, setConjugateTense] = useState('present');
  const [queryText, setQueryText] = useState('What is the difference between ser and estar?');

  // Simulated API responses
  const simulatedResponses = {
    models: {
      object: "model_list",
      data: [
        {
          id: "spanish-learning-model",
          name: "Spanish Learning Model",
          version: "1.0.0",
          capabilities: {
            context_window: 16000,
            supports_context_manipulation: true,
            supports_streaming: false,
            supported_context_types: [
              "vocabulary", "grammar", "mixed", "conversation",
              "exercise", "assessment", "personalized"
            ]
          }
        }
      ],
      server_version: "1.0.0"
    },
    context: {
      object: "context",
      content: "# Spanish Vocabulary Reference\n\n## Greetings\n\n### hola\n- **Translation:** hello\n- **Difficulty:** beginner\n\n**Examples:**\n- Spanish: ¡Hola! ¿Cómo estás?\n  English: Hello! How are you?\n\n- Spanish: Hola a todos.\n  English: Hello everyone.\n\n",
      metadata: {
        type: "vocabulary",
        source: "spanish-learning-mcp",
        token_count: 89,
        categories: ["greeting"],
        difficulty_level: "beginner"
      }
    },
    generate: {
      object: "generation",
      model: "spanish-learning-model",
      choices: [
        {
          text: "Hola, ¿cómo estás?",
          finish_reason: "stop"
        }
      ],
      usage: {
        prompt_tokens: 10,
        completion_tokens: 7,
        total_tokens: 17
      },
      session_id: sessionId || "session_1234567890"
    },
    translate: {
      originalText: "Hello, how are you?",
      translatedText: "Hola, ¿cómo estás?",
      targetLanguage: "spanish",
      sourceLanguage: "english",
      sessionId: sessionId || "session_1234567890"
    },
    conjugate: {
      verb: "hablar",
      tense: "present",
      conjugation: "yo hablo\ntú hablas\nél/ella/usted habla\nnosotros/as hablamos\nvosotros/as habláis\nellos/ellas/ustedes hablan",
      sessionId: sessionId || "session_1234567890"
    },
    query: {
      query: "What is the difference between ser and estar?",
      response: "In Spanish, both 'ser' and 'estar' mean 'to be' in English, but they are used in different contexts. 'Ser' is used for permanent or inherent characteristics, while 'estar' is used for temporary states or conditions.",
      contextType: "grammar",
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
    
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      
      // Return simulated response based on endpoint
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
          setError('Unknown endpoint');
      }
    }, 1000);
  };

  // Format code for display
  const formatCode = (endpoint, data = {}) => {
    let code = '';
    
    switch (endpoint) {
      case 'models':
        code = `// GET /mcp/models
fetch('/mcp/models')
  .then(response => response.json())
  .then(data => console.log(data));`;
        break;
      case 'context':
        code = `// POST /mcp/context
fetch('/mcp/context', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'user-id': '${userId}'
  },
  body: JSON.stringify({
    context_type: '${contextType}',
    operation: 'get',
    difficulty_level: 'beginner'
  })
})
  .then(response => response.json())
  .then(data => console.log(data));`;
        break;
      case 'generate':
        code = `// POST /mcp/generate
fetch('/mcp/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'user-id': '${userId}'
  },
  body: JSON.stringify({
    prompt: '${prompt}',
    context_type: '${contextType}',
    model: 'spanish-learning-model'
  })
})
  .then(response => response.json())
  .then(data => console.log(data));`;
        break;
      case 'translate':
        code = `// POST /api/translate
fetch('/api/translate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'user-id': '${userId}'
  },
  body: JSON.stringify({
    text: '${translateText}',
    targetLanguage: '${translateTarget}'
  })
})
  .then(response => response.json())
  .then(data => console.log(data));`;
        break;
      case 'conjugate':
        code = `// POST /api/conjugate
fetch('/api/conjugate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'user-id': '${userId}'
  },
  body: JSON.stringify({
    verb: '${conjugateVerb}',
    tense: '${conjugateTense}'
  })
})
  .then(response => response.json())
  .then(data => console.log(data));`;
        break;
      case 'query':
        code = `// POST /api/query
fetch('/api/query', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'user-id': '${userId}'
  },
  body: JSON.stringify({
    query: '${queryText}',
    contextType: '${contextType}'
  })
})
  .then(response => response.json())
  .then(data => console.log(data));`;
        break;
      default:
        code = '// No code available';
    }
    
    return code;
  };

  const renderEndpointForm = () => {
    switch (tabIndex) {
      case 0: // Models
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              GET /mcp/models
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Lists available models and their capabilities.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
              onClick={() => handleRequest('models')}
              disabled={loading}
            >
              Send Request
            </Button>
          </Box>
        );
      
      case 1: // Context
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              POST /mcp/context
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Retrieves or manipulates context for AI interactions.
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Context Type</InputLabel>
                  <Select
                    value={contextType}
                    label="Context Type"
                    onChange={(e) => setContextType(e.target.value)}
                  >
                    <MenuItem value="mixed">Mixed</MenuItem>
                    <MenuItem value="vocabulary">Vocabulary</MenuItem>
                    <MenuItem value="grammar">Grammar</MenuItem>
                    <MenuItem value="conversation">Conversation</MenuItem>
                    <MenuItem value="personalized">Personalized</MenuItem>
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
              Send Request
            </Button>
          </Box>
        );
      
      case 2: // Generate
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              POST /mcp/generate
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Generates text using the AI model with context.
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <TextField
                  label="Prompt"
                  fullWidth
                  multiline
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Context Type</InputLabel>
                  <Select
                    value={contextType}
                    label="Context Type"
                    onChange={(e) => setContextType(e.target.value)}
                  >
                    <MenuItem value="mixed">Mixed</MenuItem>
                    <MenuItem value="vocabulary">Vocabulary</MenuItem>
                    <MenuItem value="grammar">Grammar</MenuItem>
                    <MenuItem value="conversation">Conversation</MenuItem>
                    <MenuItem value="personalized">Personalized</MenuItem>
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
              Send Request
            </Button>
          </Box>
        );
      
      case 3: // Translate
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              POST /api/translate
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Translates text between English and Spanish.
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <TextField
                  label="Text to Translate"
                  fullWidth
                  multiline
                  rows={3}
                  value={translateText}
                  onChange={(e) => setTranslateText(e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Target Language</InputLabel>
                  <Select
                    value={translateTarget}
                    label="Target Language"
                    onChange={(e) => setTranslateTarget(e.target.value)}
                  >
                    <MenuItem value="spanish">Spanish</MenuItem>
                    <MenuItem value="english">English</MenuItem>
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
              Translate
            </Button>
          </Box>
        );
      
      case 4: // Conjugate
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              POST /api/conjugate
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Provides verb conjugations in different tenses.
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Verb"
                  fullWidth
                  value={conjugateVerb}
                  onChange={(e) => setConjugateVerb(e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Tense</InputLabel>
                  <Select
                    value={conjugateTense}
                    label="Tense"
                    onChange={(e) => setConjugateTense(e.target.value)}
                  >
                    <MenuItem value="present">Present</MenuItem>
                    <MenuItem value="preterite">Preterite</MenuItem>
                    <MenuItem value="imperfect">Imperfect</MenuItem>
                    <MenuItem value="future">Future</MenuItem>
                    <MenuItem value="conditional">Conditional</MenuItem>
                    <MenuItem value="subjunctive">Subjunctive</MenuItem>
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
              Conjugate
            </Button>
          </Box>
        );
      
      case 5: // Query
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              POST /api/query
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              General query endpoint for Spanish learning questions.
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <TextField
                  label="Query"
                  fullWidth
                  multiline
                  rows={3}
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Context Type</InputLabel>
                  <Select
                    value={contextType}
                    label="Context Type"
                    onChange={(e) => setContextType(e.target.value)}
                  >
                    <MenuItem value="mixed">Mixed</MenuItem>
                    <MenuItem value="vocabulary">Vocabulary</MenuItem>
                    <MenuItem value="grammar">Grammar</MenuItem>
                    <MenuItem value="conversation">Conversation</MenuItem>
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
              Send Query
            </Button>
          </Box>
        );
      
      default:
        return null;
    }
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          MCP API Explorer
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Explore and test the Spanish Learning MCP API endpoints.
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {/* Left side - API Endpoints */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              API Endpoints
            </Typography>
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              orientation="vertical"
              variant="scrollable"
              sx={{ borderRight: 1, borderColor: 'divider' }}
            >
              <Tab label="MCP Models" />
              <Tab label="MCP Context" />
              <Tab label="MCP Generate" />
              <Tab label="Translate" />
              <Tab label="Conjugate" />
              <Tab label="Query" />
            </Tabs>
          </Paper>
        </Grid>
        
        {/* Right side - Request Form and Response */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            {renderEndpointForm()}
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Request Code:
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  bgcolor: 'rgba(0, 0, 0, 0.03)',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  position: 'relative'
                }}
              >
                <Tooltip title="Copy Code">
                  <IconButton
                    size="small"
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                    onClick={() => copyToClipboard(formatCode(
                      tabIndex === 0 ? 'models' :
                      tabIndex === 1 ? 'context' :
                      tabIndex === 2 ? 'generate' :
                      tabIndex === 3 ? 'translate' :
                      tabIndex === 4 ? 'conjugate' : 'query'
                    ))}
                  >
                    {copied ? <Check /> : <ContentCopy />}
                  </IconButton>
                </Tooltip>
                <pre style={{ margin: 0, maxHeight: 200, overflow: 'auto' }}>
                  {formatCode(
                    tabIndex === 0 ? 'models' :
                    tabIndex === 1 ? 'context' :
                    tabIndex === 2 ? 'generate' :
                    tabIndex === 3 ? 'translate' :
                    tabIndex === 4 ? 'conjugate' : 'query'
                  )}
                </pre>
              </Paper>
            </Box>
          </Paper>
          
          {/* Response Section */}
          {(loading || response) && (
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Response
              </Typography>
              
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : response ? (
                <Box>
                  <Chip
                    label={`Status: 200 OK`}
                    color="success"
                    size="small"
                    sx={{ mb: 2 }}
                  />
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      bgcolor: 'rgba(0, 0, 0, 0.03)',
                      maxHeight: 400,
                      overflow: 'auto'
                    }}
                  >
                    <ReactJson
                      src={response}
                      theme="rjv-default"
                      displayDataTypes={false}
                      name={false}
                      collapsed={1}
                    />
                  </Paper>
                </Box>
              ) : null}
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ApiExplorer;