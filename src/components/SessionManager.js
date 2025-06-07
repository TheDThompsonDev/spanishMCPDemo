import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  CircularProgress,
  Alert,
  LinearProgress,
  Badge,
  Stack,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Timeline,
  TimelineItem,
  TimelineContent,
  TimelineSeparator,
  TimelineConnector,
  TimelineDot,
} from '@mui/material';
import {
  PlayArrow,
  Stop,
  Refresh,
  Check,
  Close,
  Info,
  QuestionAnswer,
  TextSnippet,
  Timer,
  QueryStats,
  Warning,
  Error as ErrorIcon,
  BarChart,
  DataUsage,
  Add,
  LightbulbOutlined
} from '@mui/icons-material';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, ChartTooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const SESSION_TYPES = [
  { value: 'general', label: 'General Learning', description: 'General Spanish learning session' },
  { value: 'vocabulary', label: 'Vocabulary Practice', description: 'Focus on vocabulary acquisition' },
  { value: 'grammar', label: 'Grammar Practice', description: 'Focus on grammar rules and usage' },
  { value: 'conversation', label: 'Conversation Practice', description: 'Practice speaking and listening skills' },
  { value: 'assessment', label: 'Skill Assessment', description: 'Evaluate current Spanish proficiency' }
];

const ACTIVITY_ICONS = {
  context: <Info color="primary" />,
  query: <QuestionAnswer color="secondary" />,
  response: <TextSnippet color="success" />,
  question: <LightbulbOutlined color="warning" />,
  error: <ErrorIcon color="error" />
};

const SessionManager = ({ userId, onSessionCreated }) => {
  const [sessionType, setSessionType] = useState('general');
  const [activeSession, setActiveSession] = useState(null);
  const [sessionActivities, setSessionActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lessonId, setLessonId] = useState('');
  const [showLessonIdInput, setShowLessonIdInput] = useState(false);
  const [confirmEndDialog, setConfirmEndDialog] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    duration: 0,
    activityCount: 0,
    correctAnswers: 0,
    incorrectAnswers: 0
  });
  const [skillProgress, setSkillProgress] = useState({
    vocabulary: 0,
    grammar: 0,
    speaking: 0,
    listening: 0
  });
  const [refreshInterval, setRefreshInterval] = useState(null);
  const [simulateActivity, setSimulateActivity] = useState(false);
  const simulationRef = useRef(null);

  // Clean up the refresh interval when component unmounts
  useEffect(() => {
    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
      if (simulationRef.current) clearInterval(simulationRef.current);
    };
  }, [refreshInterval]);

  // Fetch session details on active session change
  useEffect(() => {
    if (activeSession) {
      fetchSessionDetails();
      
      // Set up a refresh interval
      const interval = setInterval(() => {
        fetchSessionDetails();
      }, 5000); // Refresh every 5 seconds
      
      setRefreshInterval(interval);
      
      return () => clearInterval(interval);
    } else {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
      }
    }
  }, [activeSession]);

  // Fetch session details from the server
  const fetchSessionDetails = async () => {
    if (!activeSession) return;
    
    try {
      const response = await axios.get(`/api/session/${activeSession.sessionId}`, {
        headers: {
          'user-id': userId
        }
      });
      
      // Update session data
      if (response.data.session) {
        setSessionActivities(response.data.session.activities || []);
        
        // Update stats
        updateSessionStats(response.data.session);
      }
    } catch (err) {
      console.error('Error fetching session details:', err);
      
      // Don't set error as this is a background refresh
      if (err.response?.status === 404) {
        // Session might have ended
        setActiveSession(null);
      }
    }
  };

  // Update session statistics
  const updateSessionStats = (session) => {
    if (!session) return;
    
    const now = new Date();
    const startTime = new Date(session.startTime);
    const durationSeconds = session.endTime 
      ? (new Date(session.endTime) - startTime) / 1000
      : (now - startTime) / 1000;
    
    setSessionStats({
      duration: Math.round(durationSeconds),
      activityCount: session.activities?.length || 0,
      correctAnswers: session.correctAnswers || 0,
      incorrectAnswers: session.incorrectAnswers || 0
    });
    
    // Update skill progress from session or use default values
    setSkillProgress(session.skillsProgress || {
      vocabulary: session.type === 'vocabulary' ? 0.6 : 0.2,
      grammar: session.type === 'grammar' ? 0.7 : 0.3,
      speaking: session.type === 'conversation' ? 0.5 : 0.1,
      listening: session.type === 'conversation' ? 0.5 : 0.1
    });
  };

  // Start a new learning session
  const startSession = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('/api/session/start', {
        type: sessionType,
        lessonId: lessonId || undefined
      }, {
        headers: {
          'user-id': userId
        }
      });
      
      const newSession = {
        sessionId: response.data.sessionId,
        type: response.data.type,
        startTime: response.data.startTime
      };
      
      setActiveSession(newSession);
      
      // Notify parent component
      if (onSessionCreated) {
        onSessionCreated(response.data.sessionId);
      }
      
      // Start simulated activity if needed (for demo purposes)
      if (simulateActivity) {
        startActivitySimulation(response.data.sessionId);
      }
      
    } catch (err) {
      console.error('Error starting session:', err);
      setError('Failed to start session: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  // End the current session
  const endSession = async () => {
    if (!activeSession) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('/api/session/end', {
        sessionId: activeSession.sessionId
      }, {
        headers: {
          'user-id': userId
        }
      });
      
      // Stop simulation if running
      if (simulationRef.current) {
        clearInterval(simulationRef.current);
        simulationRef.current = null;
      }
      
      // Update with final stats
      updateSessionStats({
        ...activeSession,
        endTime: new Date().toISOString(),
        activities: sessionActivities,
        score: response.data.score
      });
      
      // Clear active session
      setActiveSession(null);
      
    } catch (err) {
      console.error('Error ending session:', err);
      setError('Failed to end session: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
      setConfirmEndDialog(false);
    }
  };

  // Start simulated activity for demo purposes
  const startActivitySimulation = (sessionId) => {
    if (simulationRef.current) {
      clearInterval(simulationRef.current);
    }
    
    const activityTypes = ['context', 'query', 'response'];
    let count = 0;
    
    simulationRef.current = setInterval(() => {
      count++;
      const activityType = activityTypes[count % activityTypes.length];
      
      // Add a simulated activity
      const newActivity = {
        type: activityType,
        timestamp: new Date().toISOString()
      };
      
      if (activityType === 'query') {
        newActivity.query = 'Simulated question about Spanish ' + count;
      } else if (activityType === 'response') {
        newActivity.response = 'Simulated response about Spanish learning';
      } else if (activityType === 'context') {
        newActivity.contextType = 'mixed';
      }
      
      setSessionActivities(prev => [...prev, newActivity]);
      
      // Update stats
      setSessionStats(prev => ({
        ...prev,
        activityCount: prev.activityCount + 1
      }));
      
      // Stop after 20 activities
      if (count >= 20) {
        clearInterval(simulationRef.current);
        simulationRef.current = null;
      }
    }, 3000); // Add a new activity every 3 seconds
  };

  // Format time duration as MM:SS
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Format timestamp to HH:MM:SS
  const formatTimestamp = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString();
  };

  // Create chart data for activity breakdown
  const createActivityChartData = () => {
    const activityCounts = sessionActivities.reduce((acc, activity) => {
      acc[activity.type] = (acc[activity.type] || 0) + 1;
      return acc;
    }, {});
    
    return {
      labels: Object.keys(activityCounts).map(type => 
        type.charAt(0).toUpperCase() + type.slice(1)
      ),
      datasets: [
        {
          data: Object.values(activityCounts),
          backgroundColor: [
            '#2196f3', // context
            '#ff9800', // query
            '#4caf50', // response
            '#f44336', // error
            '#9c27b0'  // other
          ],
          borderWidth: 1
        }
      ]
    };
  };

  // Create chart data for skill progress
  const createSkillChartData = () => {
    return {
      labels: Object.keys(skillProgress).map(skill => 
        skill.charAt(0).toUpperCase() + skill.slice(1)
      ),
      datasets: [
        {
          label: 'Skill Progress',
          data: Object.values(skillProgress).map(value => Math.round(value * 100)),
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* Session Control Panel */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Session Control
            </Typography>
            
            {!activeSession ? (
              <>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Session Type</InputLabel>
                  <Select
                    value={sessionType}
                    label="Session Type"
                    onChange={(e) => {
                      setSessionType(e.target.value);
                      setShowLessonIdInput(
                        e.target.value === 'vocabulary' || 
                        e.target.value === 'grammar'
                      );
                    }}
                    disabled={loading}
                  >
                    {SESSION_TYPES.map(type => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                {showLessonIdInput && (
                  <TextField
                    label="Lesson ID (Optional)"
                    fullWidth
                    value={lessonId}
                    onChange={(e) => setLessonId(e.target.value)}
                    sx={{ mb: 2 }}
                    disabled={loading}
                    helperText="Enter specific lesson ID if available"
                  />
                )}
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    {SESSION_TYPES.find(t => t.value === sessionType)?.description || ''}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    startIcon={loading ? <CircularProgress size={20} /> : <PlayArrow />}
                    onClick={startSession}
                    disabled={loading}
                  >
                    Start Session
                  </Button>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Tooltip title="For demo purposes only - generates simulated activities">
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      Simulate Activity
                    </Typography>
                  </Tooltip>
                  <Chip 
                    label={simulateActivity ? "On" : "Off"}
                    color={simulateActivity ? "success" : "default"}
                    onClick={() => setSimulateActivity(!simulateActivity)}
                    size="small"
                  />
                </Box>
              </>
            ) : (
              <>
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Active Session
                    </Typography>
                    <Typography variant="h5" component="div">
                      {SESSION_TYPES.find(t => t.value === activeSession.type)?.label || activeSession.type}
                    </Typography>
                    <Typography color="text.secondary">
                      ID: {activeSession.sessionId.substring(0, 12)}...
                    </Typography>
                    <Typography variant="body2">
                      Started: {new Date(activeSession.startTime).toLocaleTimeString()}
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Session Duration
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Timer sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h5">
                        {formatDuration(sessionStats.duration)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
                
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Activity Count
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <QueryStats sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h5">
                        {sessionStats.activityCount}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
                
                <Button 
                  variant="contained" 
                  color="error" 
                  fullWidth 
                  startIcon={loading ? <CircularProgress size={20} /> : <Stop />}
                  onClick={() => setConfirmEndDialog(true)}
                  disabled={loading}
                >
                  End Session
                </Button>
              </>
            )}
          </Paper>
        </Grid>
        
        {/* Session Activity & Visualization */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Session Activity
            </Typography>
            
            {!activeSession ? (
              <Box sx={{ p: 4, textAlign: 'center', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  No active session. Start a session to track learning activities.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sessions help maintain context across interactions and track progress.
                </Typography>
              </Box>
            ) : (
              <>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Chip 
                    icon={<DataUsage />}
                    label={`${sessionActivities.length} Activities`}
                    color="primary"
                    variant="outlined"
                    sx={{ mr: 1 }}
                  />
                </Box>
                
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  {/* Activity breakdown chart */}
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          Activity Breakdown
                        </Typography>
                        <Box sx={{ height: 200, display: 'flex', justifyContent: 'center' }}>
                          {sessionActivities.length > 0 ? (
                            <Pie 
                              data={createActivityChartData()} 
                              options={{
                                plugins: {
                                  legend: {
                                    position: 'bottom'
                                  }
                                },
                                maintainAspectRatio: false
                              }}
                            />
                          ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Typography variant="body2" color="text.secondary">
                                No activities yet
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  {/* Skill progress chart */}
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          Skill Progress
                        </Typography>
                        <Box sx={{ height: 200 }}>
                          <Bar 
                            data={createSkillChartData()} 
                            options={{
                              indexAxis: 'y',
                              scales: {
                                x: {
                                  beginAtZero: true,
                                  max: 100
                                }
                              },
                              plugins: {
                                legend: {
                                  display: false
                                }
                              },
                              maintainAspectRatio: false
                            }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle1" gutterBottom>
                  Activity Timeline
                </Typography>
                
                <Box sx={{ flexGrow: 1, overflow: 'auto', maxHeight: 300 }}>
                  {sessionActivities.length === 0 ? (
                    <Alert severity="info">
                      No activities yet. Interact with the system to generate activity.
                    </Alert>
                  ) : (
                    <Timeline position="alternate">
                      {sessionActivities.slice().reverse().map((activity, index) => (
                        <TimelineItem key={index}>
                          <TimelineSeparator>
                            <TimelineDot color={
                              activity.type === 'error' ? 'error' :
                              activity.type === 'query' ? 'secondary' :
                              activity.type === 'response' ? 'success' :
                              'primary'
                            }>
                              {ACTIVITY_ICONS[activity.type] || <Info />}
                            </TimelineDot>
                            {index < sessionActivities.length - 1 && <TimelineConnector />}
                          </TimelineSeparator>
                          <TimelineContent>
                            <Typography variant="subtitle2">
                              {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                            </Typography>
                            <Typography variant="body2">
                              {activity.type === 'query' ? (
                                activity.query?.substring(0, 50) + (activity.query?.length > 50 ? '...' : '')
                              ) : activity.type === 'response' ? (
                                activity.response?.substring(0, 50) + (activity.response?.length > 50 ? '...' : '')
                              ) : activity.type === 'context' ? (
                                `Context type: ${activity.contextType || 'mixed'}`
                              ) : (
                                activity.error || activity.details || 'Activity logged'
                              )}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatTimestamp(activity.timestamp)}
                            </Typography>
                          </TimelineContent>
                        </TimelineItem>
                      ))}
                    </Timeline>
                  )}
                </Box>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Confirm end session dialog */}
      <Dialog
        open={confirmEndDialog}
        onClose={() => setConfirmEndDialog(false)}
      >
        <DialogTitle>End Learning Session?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to end this learning session? All progress will be saved.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmEndDialog(false)}>Cancel</Button>
          <Button onClick={endSession} color="error" autoFocus>
            End Session
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SessionManager;

