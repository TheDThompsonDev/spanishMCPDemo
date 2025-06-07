import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom,
} from '@mui/material';
import {
  Psychology,
  Translate,
  School,
  QueryStats,
  Api,
  Code,
  ArrowForward,
  ExpandMore,
  ExpandLess,
  Info,
  Lightbulb,
  PlayArrow,
} from '@mui/icons-material';

const LandingPage = ({ onStartDemo }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // MCP features
  const mcpFeatures = [
    {
      title: 'Context-Aware AI',
      description: 'Provides relevant vocabulary, grammar, and learning materials as context to the AI model',
      icon: <Psychology fontSize="large" color="primary" />,
      color: theme.palette.primary.main,
    },
    {
      title: 'Personalized Learning',
      description: 'Adapts to user skill levels and learning progress',
      icon: <School fontSize="large" color="secondary" />,
      color: theme.palette.secondary.main,
    },
    {
      title: 'Progress Tracking',
      description: 'Tracks vocabulary mastery, grammar understanding, and overall learning progress',
      icon: <QueryStats fontSize="large" style={{ color: theme.palette.success.main }} />,
      color: theme.palette.success.main,
    },
    {
      title: 'Translation Services',
      description: 'Provides accurate translations with context-aware understanding',
      icon: <Translate fontSize="large" style={{ color: theme.palette.info.main }} />,
      color: theme.palette.info.main,
    },
  ];

  // MCP protocol steps
  const mcpProtocolSteps = [
    {
      label: 'Client Request',
      description: 'Client sends a request to the MCP server with a prompt and optional parameters',
      code: `POST /mcp/generate
{
  "prompt": "Translate to Spanish: Hello, how are you?",
  "context_type": "vocabulary",
  "model": "spanish-learning-model"
}`
    },
    {
      label: 'Context Retrieval',
      description: 'MCP server retrieves or generates appropriate context based on the request',
      code: `POST /mcp/context
{
  "context_type": "vocabulary",
  "operation": "get",
  "categories": ["greeting"],
  "difficulty_level": "beginner"
}`
    },
    {
      label: 'AI Model Processing',
      description: 'The AI model processes the request with the provided context',
      code: `// Internal processing
{
  "model": "claude-3-opus-20240229",
  "prompt": "<context>...</context>\\nTranslate to Spanish: Hello, how are you?",
  "max_tokens": 1000
}`
    },
    {
      label: 'Response Generation',
      description: 'MCP server returns the AI-generated response to the client',
      code: `// Response
{
  "object": "generation",
  "model": "spanish-learning-model",
  "choices": [
    {
      "text": "Hola, ¿cómo estás?",
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 7,
    "total_tokens": 17
  }
}`
    },
  ];

  // Context types
  const contextTypes = [
    { name: 'vocabulary', color: '#4caf50', description: 'Spanish vocabulary with translations and examples' },
    { name: 'grammar', color: '#2196f3', description: 'Spanish grammar rules and usage' },
    { name: 'mixed', color: '#ff9800', description: 'Combined vocabulary and grammar' },
    { name: 'conversation', color: '#9c27b0', description: 'Conversational phrases and patterns' },
    { name: 'exercise', color: '#8bc34a', description: 'Practice exercises' },
    { name: 'assessment', color: '#795548', description: 'Skill assessment materials' },
    { name: 'personalized', color: '#f44336', description: 'Adaptive content based on user progress' },
  ];

  return (
    <Box sx={{ pb: 8 }}>
      {/* Hero Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'primary.contrastText',
          borderRadius: 0,
          py: 8,
          mb: 6,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            opacity: 0.1,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23ffffff" fill-opacity="1" fill-rule="evenodd"/%3E%3C/svg%3E")',
          }}
        />
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Fade in={true} timeout={1000}>
                <Box>
                  <Typography variant="h1" gutterBottom>
                    Spanish Learning MCP
                  </Typography>
                  <Typography variant="h5" sx={{ mb: 4, fontWeight: 400 }}>
                    A powerful Model Context Protocol implementation for Spanish language learning
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    size="large"
                    onClick={onStartDemo}
                    endIcon={<PlayArrow />}
                    sx={{ 
                      px: 4, 
                      py: 1.5,
                      fontSize: '1.1rem',
                      boxShadow: theme.shadows[8]
                    }}
                  >
                    Start Interactive Demo
                  </Button>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={5}>
              <Zoom in={true} timeout={1500}>
                <Box 
                  sx={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%'
                  }}
                >
                  <Box 
                    sx={{ 
                      width: '100%',
                      maxWidth: 400,
                      height: 300,
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 4,
                      p: 3,
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                      position: 'relative',
                      overflow: 'hidden',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    <Typography variant="overline" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      MODEL CONTEXT PROTOCOL
                    </Typography>
                    <Box sx={{ mt: 2, mb: 3 }}>
                      <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontFamily: 'monospace' }}>
                        POST /mcp/generate
                      </Typography>
                      <Box 
                        sx={{ 
                          mt: 1, 
                          p: 2, 
                          bgcolor: 'rgba(0, 0, 0, 0.3)', 
                          borderRadius: 2,
                          fontFamily: 'monospace',
                          fontSize: '0.9rem',
                          color: 'rgba(255, 255, 255, 0.9)'
                        }}
                      >
                        {`{
  "prompt": "Translate: Hello",
  "context_type": "vocabulary",
  "model": "spanish-learning-model"
}`}
                      </Box>
                    </Box>
                    <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />
                    <Typography variant="overline" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      RESPONSE
                    </Typography>
                    <Box 
                      sx={{ 
                        mt: 1, 
                        p: 2, 
                        bgcolor: 'rgba(0, 0, 0, 0.3)', 
                        borderRadius: 2,
                        fontFamily: 'monospace',
                        fontSize: '0.9rem',
                        color: 'rgba(255, 255, 255, 0.9)'
                      }}
                    >
                      {`{
  "object": "generation",
  "choices": [
    { "text": "Hola" }
  ]
}`}
                    </Box>
                  </Box>
                </Box>
              </Zoom>
            </Grid>
          </Grid>
        </Container>
      </Paper>

      <Container maxWidth="lg">
        {/* What is MCP Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" gutterBottom align="center">
            What is Model Context Protocol?
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}>
            The Model Context Protocol (MCP) is a standardized way for applications to interact with AI models
            by providing relevant context to enhance the quality and relevance of AI-generated responses.
          </Typography>
          
          <Paper 
            elevation={2} 
            sx={{ 
              p: 4, 
              borderRadius: 4, 
              bgcolor: 'background.paper',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom>
                  How MCP Works
                </Typography>
                <Typography variant="body1" paragraph>
                  MCP enables applications to provide specific context to AI models, making their responses more accurate and relevant.
                  For language learning, this means providing vocabulary, grammar rules, and personalized content.
                </Typography>
                <Typography variant="body1" paragraph>
                  The protocol standardizes how context is provided, manipulated, and used across different AI models and applications.
                </Typography>
                
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Key Benefits:
                  </Typography>
                  <Box component="ul" sx={{ pl: 2 }}>
                    <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                      Enhanced AI responses with domain-specific knowledge
                    </Typography>
                    <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                      Standardized interface for context manipulation
                    </Typography>
                    <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                      Improved personalization and adaptation
                    </Typography>
                    <Typography component="li" variant="body1">
                      Efficient context reuse and caching
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ height: '100%' }}>
                  <Stepper orientation="vertical" nonLinear activeStep={-1}>
                    {mcpProtocolSteps.map((step, index) => (
                      <Step key={step.label} expanded>
                        <StepLabel>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {step.label}
                          </Typography>
                        </StepLabel>
                        <StepContent>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {step.description}
                          </Typography>
                          <Paper 
                            variant="outlined" 
                            sx={{ 
                              p: 1.5, 
                              bgcolor: 'rgba(0, 0, 0, 0.03)', 
                              fontFamily: 'monospace',
                              fontSize: '0.8rem',
                              mb: 2,
                              overflow: 'auto'
                            }}
                          >
                            <pre style={{ margin: 0 }}>{step.code}</pre>
                          </Paper>
                        </StepContent>
                      </Step>
                    ))}
                  </Stepper>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Box>

        {/* Features Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" gutterBottom align="center">
            Spanish Learning Features
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}>
            Our MCP implementation specializes in Spanish language learning with features designed to enhance the learning experience.
          </Typography>
          
          <Grid container spacing={3}>
            {mcpFeatures.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: theme.shadows[10]
                      }
                    }}
                  >
                    <Box 
                      sx={{ 
                        p: 2, 
                        display: 'flex', 
                        justifyContent: 'center',
                        alignItems: 'center',
                        bgcolor: 'rgba(0, 0, 0, 0.03)'
                      }}
                    >
                      <Box 
                        sx={{ 
                          width: 60, 
                          height: 60, 
                          borderRadius: '50%', 
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          bgcolor: `${feature.color}15`
                        }}
                      >
                        {feature.icon}
                      </Box>
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom align="center">
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Context Types Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" gutterBottom align="center">
            Context Types
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}>
            The Spanish Learning MCP server supports multiple context types specifically designed for language learning.
          </Typography>
          
          <Grid container spacing={2}>
            {contextTypes.map((type, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    borderLeft: `4px solid ${type.color}`,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateX(5px)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip 
                      label={type.name} 
                      size="small" 
                      sx={{ 
                        bgcolor: type.color,
                        color: '#fff',
                        fontWeight: 600,
                        mr: 1
                      }} 
                    />
                    <Typography variant="subtitle1" fontWeight={600}>
                      Context Type
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {type.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* API Endpoints Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" gutterBottom align="center">
            API Endpoints
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}>
            The Spanish Learning MCP server provides a comprehensive set of API endpoints for language learning applications.
          </Typography>
          
          <Paper elevation={2} sx={{ borderRadius: 4, overflow: 'hidden' }}>
            {/* MCP Protocol Endpoints */}
            <Box 
              sx={{ 
                p: 2, 
                bgcolor: 'primary.main', 
                color: 'primary.contrastText',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer'
              }}
              onClick={() => toggleSection('mcp')}
            >
              <Api sx={{ mr: 1 }} />
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                MCP Protocol Endpoints
              </Typography>
              {expandedSection === 'mcp' ? <ExpandLess /> : <ExpandMore />}
            </Box>
            {expandedSection === 'mcp' && (
              <Box sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        GET /mcp/models
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Lists available models and their capabilities
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        POST /mcp/context
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Manipulates context for AI interactions
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        POST /mcp/generate
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Generates text with provided context
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}
            
            {/* Spanish Learning Endpoints */}
            <Box 
              sx={{ 
                p: 2, 
                bgcolor: 'secondary.main', 
                color: 'secondary.contrastText',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer'
              }}
              onClick={() => toggleSection('spanish')}
            >
              <Translate sx={{ mr: 1 }} />
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Spanish Learning Endpoints
              </Typography>
              {expandedSection === 'spanish' ? <ExpandLess /> : <ExpandMore />}
            </Box>
            {expandedSection === 'spanish' && (
              <Box sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        POST /api/translate
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Translates text between English and Spanish
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        POST /api/conjugate
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Provides verb conjugations in different tenses
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        POST /api/query
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        General query endpoint for Spanish learning questions
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}
            
            {/* Session Management Endpoints */}
            <Box 
              sx={{ 
                p: 2, 
                bgcolor: theme.palette.success.main, 
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer'
              }}
              onClick={() => toggleSection('session')}
            >
              <School sx={{ mr: 1 }} />
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Session Management Endpoints
              </Typography>
              {expandedSection === 'session' ? <ExpandLess /> : <ExpandMore />}
            </Box>
            {expandedSection === 'session' && (
              <Box sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        POST /api/session/start
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Starts a new learning session
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        POST /api/session/end
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Ends an active learning session
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Paper>
        </Box>

        {/* CTA Section */}
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h4" gutterBottom>
            Ready to explore the Spanish Learning MCP?
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            Try our interactive demo to see how the Model Context Protocol enhances Spanish language learning.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={onStartDemo}
            endIcon={<ArrowForward />}
            sx={{ px: 4, py: 1.5 }}
          >
            Start the Demo
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;