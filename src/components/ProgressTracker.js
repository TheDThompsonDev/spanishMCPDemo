import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Divider,
  LinearProgress,
  CircularProgress,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tab,
  Tabs,
  useTheme,
} from '@mui/material';
import {
  School,
  Translate,
  RecordVoiceOver,
  Hearing,
  MenuBook,
  Create,
  TrendingUp,
  EmojiEvents,
  LocalFireDepartment,
  CheckCircle,
  Refresh,
  CalendarToday,
  Timer,
  Psychology,
  BarChart,
  Lightbulb,
  Star,
  StarBorder,
  StarHalf,
} from '@mui/icons-material';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend, CategoryScale, LinearScale, BarElement, Title, RadialLinearScale, PointElement, LineElement } from 'chart.js';
import { Pie, Bar, Radar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  ChartTooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  RadialLinearScale, 
  PointElement, 
  LineElement
);

const ProgressTracker = ({ userId }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [simulateProgress, setSimulateProgress] = useState(true); // For demo purposes

  // Simulated progress data for demo
  const simulatedProgress = {
    level: "intermediate",
    vocabularyMastered: 120,
    grammarMastered: 15,
    streakDays: 7,
    totalSessions: 25,
    totalTimeSpent: 7200, // in seconds
    accuracy: 78,
    skillLevels: {
      vocabulary: 0.65,
      grammar: 0.58,
      listening: 0.42,
      speaking: 0.35,
      reading: 0.70,
      writing: 0.48
    },
    recentProgress: [
      { date: '2025-05-20', vocabularyLearned: 8, timeSpent: 1200 },
      { date: '2025-05-21', vocabularyLearned: 12, timeSpent: 1500 },
      { date: '2025-05-22', vocabularyLearned: 5, timeSpent: 900 },
      { date: '2025-05-23', vocabularyLearned: 15, timeSpent: 1800 },
      { date: '2025-05-24', vocabularyLearned: 10, timeSpent: 1200 },
      { date: '2025-05-25', vocabularyLearned: 18, timeSpent: 2100 },
      { date: '2025-05-26', vocabularyLearned: 14, timeSpent: 1800 }
    ],
    recommendations: [
      { type: 'vocabulary', word: 'conseguir', translation: 'to obtain/get', difficulty: 'intermediate' },
      { type: 'grammar', title: 'Subjunctive Mood', difficulty: 'intermediate' },
      { type: 'practice', title: 'Restaurant Conversations', difficulty: 'intermediate' }
    ],
    achievements: [
      { title: '7-Day Streak', description: 'Practiced for 7 consecutive days', completed: true, icon: <LocalFireDepartment /> },
      { title: '100 Words Mastered', description: 'Learned 100 Spanish vocabulary words', completed: true, icon: <Translate /> },
      { title: 'Grammar Expert', description: 'Mastered 20 grammar concepts', completed: false, progress: 0.75, icon: <School /> }
    ]
  };

  // Fetch user progress data
  useEffect(() => {
    const fetchProgress = async () => {
      setLoading(true);
      setError('');
      
      try {
        if (simulateProgress) {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1500));
          setProgress(simulatedProgress);
        } else {
          const response = await axios.get('/api/progress', {
            headers: {
              'user-id': userId
            }
          });
          setProgress(response.data.progress);
        }
      } catch (err) {
        console.error('Error fetching progress:', err);
        setError('Failed to fetch progress data: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    
    fetchProgress();
  }, [userId, simulateProgress]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleRefresh = () => {
    setProgress(null);
    setLoading(true);
    
    // Simulate refresh with slight changes to data
    setTimeout(() => {
      const updatedProgress = { ...simulatedProgress };
      updatedProgress.vocabularyMastered += 3;
      updatedProgress.accuracy += 1;
      updatedProgress.skillLevels.vocabulary += 0.02;
      updatedProgress.skillLevels.grammar += 0.01;
      setProgress(updatedProgress);
      setLoading(false);
    }, 1500);
  };

  // Format time duration as HH:MM
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  // Create skill radar chart data
  const createSkillRadarData = () => {
    if (!progress) return null;
    
    return {
      labels: Object.keys(progress.skillLevels).map(skill => 
        skill.charAt(0).toUpperCase() + skill.slice(1)
      ),
      datasets: [
        {
          label: 'Skill Levels',
          data: Object.values(progress.skillLevels).map(value => Math.round(value * 100)),
          backgroundColor: 'rgba(46, 49, 146, 0.2)',
          borderColor: theme.palette.primary.main,
          borderWidth: 2,
          pointBackgroundColor: theme.palette.primary.main,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: theme.palette.primary.main
        }
      ]
    };
  };

  // Create progress bar chart data
  const createProgressBarData = () => {
    if (!progress || !progress.recentProgress) return null;
    
    return {
      labels: progress.recentProgress.map(day => {
        const date = new Date(day.date);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
      }),
      datasets: [
        {
          label: 'Vocabulary Learned',
          data: progress.recentProgress.map(day => day.vocabularyLearned),
          backgroundColor: theme.palette.secondary.main,
          borderColor: theme.palette.secondary.dark,
          borderWidth: 1
        }
      ]
    };
  };

  // Render loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
        <CircularProgress size={60} sx={{ mb: 3 }} />
        <Typography variant="h6" color="text.secondary">
          Loading progress data...
        </Typography>
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  // Render progress data
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Learning Progress
        </Typography>
        <Button 
          startIcon={<Refresh />} 
          variant="outlined" 
          onClick={handleRefresh}
        >
          Refresh
        </Button>
      </Box>
      
      {/* Progress Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <School color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  Level
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ mb: 1, textTransform: 'capitalize' }}>
                {progress?.level || 'Beginner'}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={progress?.level === 'beginner' ? 30 : progress?.level === 'intermediate' ? 65 : 90} 
                sx={{ height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Translate color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  Vocabulary
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ mb: 1 }}>
                {progress?.vocabularyMastered || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Words mastered
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocalFireDepartment sx={{ mr: 1, color: theme.palette.warning.main }} />
                <Typography variant="h6" color="text.secondary">
                  Streak
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ mb: 1 }}>
                {progress?.streakDays || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Consecutive days
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUp sx={{ mr: 1, color: theme.palette.success.main }} />
                <Typography variant="h6" color="text.secondary">
                  Accuracy
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ mb: 1 }}>
                {progress?.accuracy || 0}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Overall performance
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Tabs for different progress views */}
      <Box sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Skills Overview" icon={<BarChart />} iconPosition="start" />
          <Tab label="Recent Activity" icon={<TrendingUp />} iconPosition="start" />
          <Tab label="Recommendations" icon={<Lightbulb />} iconPosition="start" />
          <Tab label="Achievements" icon={<EmojiEvents />} iconPosition="start" />
        </Tabs>
      </Box>
      
      {/* Skills Overview Tab */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Skill Levels
              </Typography>
              <Box sx={{ height: 350 }}>
                {progress && <Radar data={createSkillRadarData()} options={{
                  scales: {
                    r: {
                      min: 0,
                      max: 100,
                      ticks: {
                        stepSize: 20
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }} />}
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Skill Breakdown
              </Typography>
              <List>
                {progress && Object.entries(progress.skillLevels).map(([skill, level]) => (
                  <ListItem key={skill}>
                    <ListItemIcon>
                      {skill === 'vocabulary' && <Translate color="primary" />}
                      {skill === 'grammar' && <School color="secondary" />}
                      {skill === 'listening' && <Hearing sx={{ color: theme.palette.info.main }} />}
                      {skill === 'speaking' && <RecordVoiceOver sx={{ color: theme.palette.warning.main }} />}
                      {skill === 'reading' && <MenuBook sx={{ color: theme.palette.success.main }} />}
                      {skill === 'writing' && <Create sx={{ color: theme.palette.error.main }} />}
                    </ListItemIcon>
                    <ListItemText 
                      primary={skill.charAt(0).toUpperCase() + skill.slice(1)} 
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={level * 100} 
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                            <Typography variant="body2" color="text.secondary">
                              {Math.round(level * 100)}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {level < 0.3 ? 'Beginner' : level < 0.6 ? 'Intermediate' : 'Advanced'}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      )}
      
      {/* Recent Activity Tab */}
      {tabValue === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper elevation={1} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Weekly Progress
              </Typography>
              <Box sx={{ height: 350 }}>
                {progress && <Bar data={createProgressBarData()} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Vocabulary Words'
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      display: false
                    },
                    title: {
                      display: true,
                      text: 'Vocabulary Learned This Week'
                    }
                  }
                }} />}
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Activity Summary
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <School color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Total Sessions" 
                    secondary={progress?.totalSessions || 0}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Timer color="secondary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Total Time Spent" 
                    secondary={formatDuration(progress?.totalTimeSpent || 0)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Translate sx={{ color: theme.palette.info.main }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Vocabulary Mastered" 
                    secondary={progress?.vocabularyMastered || 0}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Psychology sx={{ color: theme.palette.success.main }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Grammar Concepts Mastered" 
                    secondary={progress?.grammarMastered || 0}
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      )}
      
      {/* Recommendations Tab */}
      {tabValue === 2 && (
        <Grid container spacing={3}>
          {progress?.recommendations?.map((recommendation, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {recommendation.type === 'vocabulary' && (
                      <Translate sx={{ mr: 1, color: theme.palette.primary.main }} />
                    )}
                    {recommendation.type === 'grammar' && (
                      <School sx={{ mr: 1, color: theme.palette.secondary.main }} />
                    )}
                    {recommendation.type === 'practice' && (
                      <RecordVoiceOver sx={{ mr: 1, color: theme.palette.info.main }} />
                    )}
                    <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                      {recommendation.type}
                    </Typography>
                  </Box>
                  
                  <Typography variant="subtitle1" gutterBottom>
                    {recommendation.word || recommendation.title}
                  </Typography>
                  
                  {recommendation.translation && (
                    <Typography variant="body1" color="text.secondary" paragraph>
                      {recommendation.translation}
                    </Typography>
                  )}
                  
                  <Chip 
                    label={recommendation.difficulty} 
                    size="small" 
                    color={
                      recommendation.difficulty === 'beginner' ? 'success' : 
                      recommendation.difficulty === 'intermediate' ? 'warning' : 
                      'error'
                    }
                    sx={{ textTransform: 'capitalize' }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Achievements Tab */}
      {tabValue === 3 && (
        <Grid container spacing={3}>
          {progress?.achievements?.map((achievement, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 3, 
                  height: '100%',
                  position: 'relative',
                  opacity: achievement.completed ? 1 : 0.7,
                  border: achievement.completed ? `1px solid ${theme.palette.success.main}` : 'none'
                }}
              >
                {achievement.completed && (
                  <Chip 
                    label="Completed" 
                    color="success" 
                    size="small"
                    icon={<CheckCircle />}
                    sx={{ 
                      position: 'absolute', 
                      top: 12, 
                      right: 12 
                    }}
                  />
                )}
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box 
                    sx={{ 
                      mr: 2,
                      color: achievement.completed ? theme.palette.success.main : 'text.secondary',
                      display: 'flex'
                    }}
                  >
                    {achievement.icon}
                  </Box>
                  <Typography variant="h6">
                    {achievement.title}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  {achievement.description}
                </Typography>
                
                {!achievement.completed && achievement.progress !== undefined && (
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        Progress
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {Math.round(achievement.progress * 100)}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={achievement.progress * 100} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ProgressTracker;