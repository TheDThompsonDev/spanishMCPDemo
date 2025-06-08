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
  Chip,
  Collapse,
  Fade,
  useTheme,
} from '@mui/material';
import {
  Send,
  Refresh,
  PlayArrow,
  Pause,
  SkipNext,
  Psychology,
  Storage,
  Lightbulb,
  ArrowForward,
  Check,
} from '@mui/icons-material';
import { labels } from '../labels';

const McpFlowVisualizer = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true);
  const playTimerRef = useRef(null);

  const flowSteps = [
    {
      ...labels.mcpFlow.steps[0],
      icon: <Send color="primary" />,
      color: theme.palette.primary.main
    },
    {
      ...labels.mcpFlow.steps[1],
      icon: <Storage color="secondary" />,
      color: theme.palette.secondary.main
    },
    {
      ...labels.mcpFlow.steps[2],
      icon: <Psychology style={{ color: theme.palette.info.main }} />,
      color: theme.palette.info.main
    },
    {
      ...labels.mcpFlow.steps[3],
      icon: <Lightbulb style={{ color: theme.palette.success.main }} />,
      color: theme.palette.success.main
    }
  ];

  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        setActiveStep((prevStep) => {
          const nextStep = prevStep + 1;
          if (nextStep >= flowSteps.length) {
            setIsPlaying(false);
            return 0;
          }
          return nextStep;
        });
      }, 3000);
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

  const formatJson = (json) => {
    return JSON.stringify(json, null, 2);
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 4, mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {labels.mcpFlow.title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {labels.mcpFlow.subtitle}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={isPlaying ? <Pause /> : <PlayArrow />}
          onClick={togglePlayPause}
          sx={{ mr: 1 }}
        >
          {isPlaying ? labels.mcpFlow.buttons.pause : labels.mcpFlow.buttons.play}
        </Button>
        <Button
          variant="outlined"
          startIcon={<SkipNext />}
          onClick={handleNext}
          sx={{ mr: 1 }}
        >
          {labels.mcpFlow.buttons.next}
        </Button>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={handleReset}
          sx={{ mr: 1 }}
        >
          {labels.mcpFlow.buttons.reset}
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant={showCode ? 'contained' : 'outlined'}
          size="small"
          onClick={() => setShowCode(!showCode)}
          sx={{ mr: 1 }}
        >
          {showCode ? labels.mcpFlow.buttons.hideCode : labels.mcpFlow.buttons.showCode}
        </Button>
        <Button
          variant={showExplanation ? 'contained' : 'outlined'}
          size="small"
          onClick={() => setShowExplanation(!showExplanation)}
        >
          {showExplanation ? labels.mcpFlow.buttons.hideDetails : labels.mcpFlow.buttons.showDetails}
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Card variant="outlined" sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
          <CardContent>
            <Typography variant="subtitle2" gutterBottom>
              {labels.mcpFlow.labels.samplePrompt}
            </Typography>
            <Typography variant="h6">
              "{labels.mcpFlow.samplePrompt}"
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
                {step.request && (
                  <Fade in={true} timeout={500}>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Chip
                          label={step.request.method || labels.mcpFlow.labels.method}
                          size="small"
                          color="primary"
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="subtitle2" color="text.secondary">
                          {step.request.endpoint || labels.mcpFlow.labels.internalProcessing}
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

                {step.response && (
                  <Fade in={true} timeout={800}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Chip
                          label={labels.mcpFlow.labels.response}
                          size="small"
                          color="success"
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="subtitle2" color="text.secondary">
                          {step.response.object || labels.mcpFlow.labels.internalProcessing}
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
                  {index === flowSteps.length - 1 ? labels.mcpFlow.buttons.restart : labels.mcpFlow.buttons.next}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  {labels.mcpFlow.buttons.previous}
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