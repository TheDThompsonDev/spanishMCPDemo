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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  PlayArrow,
  Stop,
  Info,
  QuestionAnswer,
  TextSnippet,
  Timer,
  QueryStats,
  Error as ErrorIcon,
  DataUsage,
  LightbulbOutlined
} from '@mui/icons-material';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { labels } from '../labels';

ChartJS.register(ArcElement, ChartTooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

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

  const fetchSessionDetails = React.useCallback(async () => {
    if (!activeSession) return;
    
    try {
      const response = await axios.get(`/api/session/${activeSession.sessionId}`, {
        headers: {
          'user-id': userId
        }
      });
      
      if (response.data.session) {
        setSessionActivities(response.data.session.activities || []);
        updateSessionStats(response.data.session);
      }
    } catch (err) {
      console.error('Error fetching session details:', err);
      if (err.response?.status === 404) {
        setActiveSession(null);
      }
    }
  }, [activeSession, userId]);

  useEffect(() => {
    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
      if (simulationRef.current) clearInterval(simulationRef.current);
    };
  }, [refreshInterval]);

  useEffect(() => {
    if (activeSession) {
      fetchSessionDetails();
      const interval = setInterval(() => {
        fetchSessionDetails();
      }, 5000);
      setRefreshInterval(interval);
      return () => clearInterval(interval);
    } else {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
      }
    }
  }, [activeSession, refreshInterval, fetchSessionDetails]);

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
    
    setSkillProgress(session.skillsProgress || {
      vocabulary: session.type === 'vocabulary' ? 0.6 : 0.2,
      grammar: session.type === 'grammar' ? 0.7 : 0.3,
      speaking: session.type === 'conversation' ? 0.5 : 0.1,
      listening: session.type === 'conversation' ? 0.5 : 0.1
    });
  };

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
      
      if (onSessionCreated) {
        onSessionCreated(response.data.sessionId);
      }
      
      if (simulateActivity) {
        startActivitySimulation(response.data.sessionId);
      }
      
    } catch (err) {
      console.error('Error starting session:', err);
      setError(labels.sessionManager.labels.errors.startFailed + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

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
      
      if (simulationRef.current) {
        clearInterval(simulationRef.current);
        simulationRef.current = null;
      }
      
      updateSessionStats({
        ...activeSession,
        endTime: new Date().toISOString(),
        activities: sessionActivities,
        score: response.data.score
      });
      
      setActiveSession(null);
      
    } catch (err) {
      console.error('Error ending session:', err);
      setError(labels.sessionManager.labels.errors.endFailed + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
      setConfirmEndDialog(false);
    }
  };

  const startActivitySimulation = (sessionId) => {
    if (simulationRef.current) {
      clearInterval(simulationRef.current);
    }
    
    const activityTypes = ['context', 'query', 'response'];
    let count = 0;
    
    simulationRef.current = setInterval(() => {
      count++;
      const activityType = activityTypes[count % activityTypes.length];
      
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
      
      setSessionStats(prev => ({
        ...prev,
        activityCount: prev.activityCount + 1
      }));
      
      if (count >= 20) {
        clearInterval(simulationRef.current);
        simulationRef.current = null;
      }
    }, 3000);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimestamp = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString();
  };

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
            '#2196f3',
            '#ff9800',
            '#4caf50',
            '#f44336',
            '#9c27b0'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  const createSkillChartData = () => {
    return {
      labels: Object.keys(skillProgress).map(skill => 
        skill.charAt(0).toUpperCase() + skill.slice(1)
      ),
      datasets: [
        {
          label: labels.sessionManager.labels.skillProgress.title,
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
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              {labels.sessionManager.labels.sessionControl}
            </Typography>
            
            {!activeSession ? (
              <>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>{labels.sessionManager.labels.sessionType}</InputLabel>
                  <Select
                    value={sessionType}
                    label={labels.sessionManager.labels.sessionType}
                    onChange={(e) => {
                      setSessionType(e.target.value);
                      setShowLessonIdInput(
                        e.target.value === 'vocabulary' || 
                        e.target.value === 'grammar'
                      );
                    }}
                    disabled={loading}
                  >
                    {labels.sessionManager.sessionTypes.map(type => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                {showLessonIdInput && (
                  <TextField
                    label={labels.sessionManager.labels.lessonId.label}
                    fullWidth
                    value={lessonId}
                    onChange={(e) => setLessonId(e.target.value)}
                    sx={{ mb: 2 }}
                    disabled={loading}
                    helperText={labels.sessionManager.labels.lessonId.helper}
                  />
                )}
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    {labels.sessionManager.sessionTypes.find(t => t.value === sessionType)?.description || ''}
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
                    {labels.sessionManager.labels.buttons.start}
                  </Button>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    {labels.sessionManager.labels.simulateActivity.label}
                  </Typography>
                  <Chip 
                    label={simulateActivity ? labels.sessionManager.labels.simulateActivity.on : labels.sessionManager.labels.simulateActivity.off}
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
                      {labels.sessionManager.labels.activeSession.title}
                    </Typography>
                    <Typography variant="h5" component="div">
                      {labels.sessionManager.sessionTypes.find(t => t.value === activeSession.type)?.label || activeSession.type}
                    </Typography>
                    <Typography color="text.secondary">
                      {labels.sessionManager.labels.activeSession.id}{activeSession.sessionId.substring(0, 12)}...
                    </Typography>
                    <Typography variant="body2">
                      {labels.sessionManager.labels.activeSession.started}{new Date(activeSession.startTime).toLocaleTimeString()}
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      {labels.sessionManager.labels.duration.title}
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
                      {labels.sessionManager.labels.activityCount.title}
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
                  {labels.sessionManager.labels.buttons.end}
                </Button>
              </>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              {labels.sessionManager.labels.activity.title}
            </Typography>
            
            {!activeSession ? (
              <Box sx={{ p: 4, textAlign: 'center', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {labels.sessionManager.labels.activity.noSession.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {labels.sessionManager.labels.activity.noSession.description}
                </Typography>
              </Box>
            ) : (
              <>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Chip 
                    icon={<DataUsage />}
                    label={`${sessionActivities.length}${labels.sessionManager.labels.activity.count}`}
                    color="primary"
                    variant="outlined"
                    sx={{ mr: 1 }}
                  />
                </Box>
                
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          {labels.sessionManager.labels.activity.breakdown}
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
                                {labels.sessionManager.labels.activity.noActivities}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          {labels.sessionManager.labels.skillProgress.title}
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
                  {labels.sessionManager.labels.activity.timeline}
                </Typography>
                
                <Box sx={{ flexGrow: 1, overflow: 'auto', maxHeight: 300 }}>
                  {sessionActivities.length === 0 ? (
                    <Alert severity="info">
                      {labels.sessionManager.labels.activity.noActivitiesYet}
                    </Alert>
                  ) : (
                    <List>
                      {sessionActivities.slice().reverse().map((activity, index) => (
                        <ListItem key={index} sx={{ mb: 2 }}>
                          <ListItemIcon>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                bgcolor: activity.type === 'error' ? 'error.main' :
                                         activity.type === 'query' ? 'secondary.main' :
                                         activity.type === 'response' ? 'success.main' :
                                         'primary.main',
                                color: 'white'
                              }}
                            >
                              {ACTIVITY_ICONS[activity.type] || <Info />}
                            </Box>
                          </ListItemIcon>
                          <ListItemText
                            primary={activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                            secondary={
                              <>
                                <Typography variant="body2" component="div">
                                  {activity.type === 'query' ? (
                                    activity.query?.substring(0, 50) + (activity.query?.length > 50 ? '...' : '')
                                  ) : activity.type === 'response' ? (
                                    activity.response?.substring(0, 50) + (activity.response?.length > 50 ? '...' : '')
                                  ) : activity.type === 'context' ? (
                                    `Context type: ${activity.contextType || 'mixed'}`
                                  ) : (
                                    activity.error || activity.details || labels.sessionManager.labels.activity.logged
                                  )}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {formatTimestamp(activity.timestamp)}
                                </Typography>
                              </>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Box>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      <Dialog
        open={confirmEndDialog}
        onClose={() => setConfirmEndDialog(false)}
      >
        <DialogTitle>{labels.sessionManager.labels.endDialog.title}</DialogTitle>
        <DialogContent>
          <Typography>
            {labels.sessionManager.labels.endDialog.message}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmEndDialog(false)}>{labels.sessionManager.labels.buttons.cancel}</Button>
          <Button onClick={endSession} color="error" autoFocus>
            {labels.sessionManager.labels.buttons.end}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SessionManager;
