import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  CardContent,
  Divider,
  Chip,
  IconButton,
  CircularProgress,
  Collapse,
  Fade,
  Zoom,
  useTheme,
} from '@mui/material';
import {
  Send,
  Refresh,
  Code,
  PlayArrow,
  Pause,
  SkipNext,
  Psychology,
  Storage,
  Lightbulb,
  ArrowForward,
  Check,
} from '@mui/icons-material';

const McpFlowVisualizer = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCode, setShowCode] = useState(true);
  const [showExplanation, setShowExplanation] = useState(true);
  const playTimerRef = useRef(null);
  
  // Sample request and response data for visualization
  const samplePrompt = "Translate to Spanish: I would like to order a coffee, please.";
  
  const flowSteps = [
    {
      title: "Client Request",
      description: "The client sends a request to the MCP server with a prompt and optional parameters.",
      request: {
        endpoint: "/mcp/generate",
        method: "POST",
        body: {
          prompt: samplePrompt,
          context_type: "conversation",
          model: "spanish-learning-model",
          max_tokens: 100
        }
      },
      response: null,
      icon: <Send color="primary" />,
      color: theme.palette.primary.main
    },
    {
      title: "Context Retrieval",
      description: "The MCP server retrieves or generates appropriate context based on the request parameters.",
      request: {
        endpoint: "/mcp/context",
        method: "POST",
        body: {
          context_type: "conversation",
          operation: "get",
          categories: ["restaurant", "ordering"],
          difficulty_level: "intermediate"
        }
      },
      response: {
        object: "context",
        content: "# Spanish Restaurant Phrases\n\n## Ordering\n\n### coffee\n- **Translation:** café\n- **Difficulty:** beginner\n\n**Examples:**\n- Spanish: Me gustaría un café, por favor.\n  English: I would like a coffee, please.\n\n- Spanish: ¿Puedo pedir un café?\n  English: Can I order a coffee?\n\n### order\n- **Translation:** pedir\n- **Difficulty:** beginner\n\n**Examples:**\n- Spanish: Quiero pedir algo de beber.\n  English: I want to order something to drink.\n",
        metadata: {
          type: "conversation",
          source: "spanish-learning-mcp",
          token_count: 156,
          categories: ["restaurant", "ordering"],
          difficulty_level: "intermediate"
        }
      },
      icon: <Storage color="secondary" />,
      color: theme.palette.secondary.main
    },
    {
      title: "AI Model Processing",
      description: "The AI model processes the request with the provided context to generate a response.",
      request: {
        internal: true,
        body: {
          model: "claude-3-opus-20240229",
          prompt: "<context># Spanish Restaurant Phrases\n\n## Ordering\n\n### coffee\n- **Translation:** café\n- **Difficulty:** beginner\n\n**Examples:**\n- Spanish: Me gustaría un café, por favor.\n  English: I would like a coffee, please.\n\n- Spanish: ¿Puedo pedir un café?\n  English: Can I order a coffee?\n\n### order\n- **Translation:** pedir\n- **Difficulty:** beginner\n\n**Examples:**\n- Spanish: Quiero pedir algo de beber.\n  English: I want to order something to drink.</context>\n\nTranslate to Spanish: I would like to order a coffee, please.",
          max_tokens: 100,
          temperature: 0.7
        }
      },
      response: {
        internal: true,
        completion: "Me gustaría pedir un café, por favor."
      },
      icon: <Psychology style={{ color: theme.palette.info.main }} />,
      color: theme.palette.info.main
    },
    {
      title: "Response Generation",
      description: "The MCP server returns the AI-generated response to the client.",
      request: null,
      response: {
        object: "generation",
        model: "spanish-learning-model",
        choices: [
          {
            text: "Me gustaría pedir un café, por favor.",
            finish_reason: "stop"
          }
        ],
        usage: {
          prompt_tokens: 180,
          completion_tokens: 8,
          total_tokens: 188
        },
        session_id: "session_1234567890"
      },
      icon: <Lightbulb style={{ color: theme.palette.success.main }} />,
      color: theme.palette.success.main
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        setActiveStep((prevStep) => {
          const nextStep = prevStep + 1;
          if (nextStep >= flowSteps.length) {
            setIsPlaying(false);
            return 0; // Loop back to the beginning
          }
          return nextStep;
        });
      }, 3000); // Advance every 3 seconds
    } else if (playTimerRef.current) {
      clearInterval(playTimerRef.current);
    }

    return () => {
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
      }
    };
  }, [isPlaying, flowSteps.length]);

  const handleNext = () => {
    setActiveStep((prevStep) => (prevStep + 1) % flowSteps.length);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => (prevStep - 1 + flowSteps.length) % flowSteps.length);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Format JSON for display
  const formatJson = (json) => {
    return JSON.stringify(json, null, 2);
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 4, mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          MCP Flow Visualization
        </Typography>
        <Typography variant="body1" color="text.secondary">
          This interactive visualization demonstrates how the Model Context Protocol works in a Spanish learning application.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={isPlaying ? <Pause /> : <PlayArrow />}
          onClick={togglePlayPause}
          sx={{ mr: 1 }}
        >
          {isPlaying ? 'Pause' : 'Auto-Play'}
        </Button>
        <Button
          variant="outlined"
          startIcon={<SkipNext />}
          onClick={handleNext}
          sx={{ mr: 1 }}
        >
          Next Step
        </Button>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={handleReset}
          sx={{ mr: 1 }}
        >
          Reset
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant={showCode ? 'contained' : 'outlined'}
          size="small"
          onClick={() => setShowCode(!showCode)}
          sx={{ mr: 1 }}
        >
          {showCode ? 'Hide Code' : 'Show Code'}
        </Button>
        <Button
          variant={showExplanation ? 'contained' : 'outlined'}
          size="small"
          onClick={() => setShowExplanation(!showExplanation)}
        >
          {showExplanation ? 'Hide Details' : 'Show Details'}
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Card variant="outlined" sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
          <CardContent>
            <Typography variant="subtitle2" gutterBottom>
              Sample Prompt:
            </Typography>
            <Typography variant="h6">
              "{samplePrompt}"
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Stepper activeStep={activeStep} orientation="vertical">
        {flowSteps.map((step, index) => (
          <Step key={index} expanded={activeStep === index}>
            <StepLabel
              StepIconProps={{
                icon: (
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      bgcolor: step.color,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: '#fff',
                    }}
                  >
                    {activeStep > index ? (
                      <Check fontSize="small" />
                    ) : (
                      step.icon
                    )}
                  </Box>
                ),
              }}
            >
              <Typography variant="h6">{step.title}</Typography>
            </StepLabel>
            <StepContent>
              <Collapse in={showExplanation}>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {step.description}
                </Typography>
              </Collapse>

              <Collapse in={showCode}>
                {/* Request */}
                {step.request && (
                  <Fade in={true} timeout={500}>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Chip
                          label={step.request.method || "INTERNAL"}
                          size="small"
                          color="primary"
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="subtitle2" color="text.secondary">
                          {step.request.endpoint || "AI Model Processing"}
                        </Typography>
                      </Box>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 1.5,
                          bgcolor: 'rgba(0, 0, 0, 0.03)',
                          fontFamily: 'monospace',
                          fontSize: '0.8rem',
                          maxHeight: 200,
                          overflow: 'auto',
                        }}
                      >
                        <pre style={{ margin: 0 }}>{formatJson(step.request.body)}</pre>
                      </Paper>
                    </Box>
                  </Fade>
                )}

                {/* Response */}
                {step.response && (
                  <Fade in={true} timeout={800}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Chip
                          label="RESPONSE"
                          size="small"
                          color="success"
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="subtitle2" color="text.secondary">
                          {step.response.object || "Internal Processing"}
                        </Typography>
                      </Box>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 1.5,
                          bgcolor: 'rgba(0, 0, 0, 0.03)',
                          fontFamily: 'monospace',
                          fontSize: '0.8rem',
                          maxHeight: 200,
                          overflow: 'auto',
                        }}
                      >
                        <pre style={{ margin: 0 }}>
                          {step.response.internal
                            ? step.response.completion
                            : formatJson(step.response)}
                        </pre>
                      </Paper>
                    </Box>
                  </Fade>
                )}
              </Collapse>

              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mr: 1 }}
                  endIcon={<ArrowForward />}
                >
                  {index === flowSteps.length - 1 ? 'Restart' : 'Next Step'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Previous
                </Button>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {flowSteps.map((step, index) => (
            <React.Fragment key={index}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: index === activeStep ? step.color : 'rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: index === activeStep ? '#fff' : 'text.secondary',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  border: index === activeStep ? `2px solid ${step.color}` : 'none',
                  boxShadow: index === activeStep ? `0 0 10px ${step.color}40` : 'none',
                }}
                onClick={() => setActiveStep(index)}
              >
                {step.icon}
              </Box>
              {index < flowSteps.length - 1 && (
                <Box
                  sx={{
                    height: 2,
                    width: 40,
                    bgcolor: index < activeStep ? step.color : 'rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s',
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default McpFlowVisualizer;