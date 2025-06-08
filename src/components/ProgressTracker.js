import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  CircularProgress,
  Button,
  Chip,
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
  Timer,
  Psychology,
  BarChart,
  Lightbulb,
} from '@mui/icons-material';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend, CategoryScale, LinearScale, BarElement, Title, RadialLinearScale, PointElement, LineElement } from 'chart.js';
import { Bar, Radar } from 'react-chartjs-2';
import { labels } from '../labels';

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
  const [simulateProgress] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      setLoading(true);
      setError('');
      
      try {
        if (simulateProgress) {
          await new Promise(resolve => setTimeout(resolve, 1500));
          setProgress(labels.progressTracker.simulatedData);
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
        setError(labels.progressTracker.error + (err.response?.data?.message || err.message));
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
    
    setTimeout(() => {
      const updatedProgress = { ...labels.progressTracker.simulatedData };
      updatedProgress.vocabularyMastered += 3;
      updatedProgress.accuracy += 1;
      updatedProgress.skillLevels.vocabulary += 0.02;
      updatedProgress.skillLevels.grammar += 0.01;
      setProgress(updatedProgress);
      setLoading(false);
    }, 1500);
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const createSkillRadarData = () => {
    if (!progress) return null;
    
    return {
      labels: Object.keys(progress.skillLevels).map(skill => 
        skill.charAt(0).toUpperCase() + skill.slice(1)
      ),
      datasets: [
        {
          label: labels.progressTracker.tabs.skillsOverview.skillLevels,
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

  const createProgressBarData = () => {
    if (!progress || !progress.recentProgress) return null;
    
    return {
      labels: progress.recentProgress.map(day => {
        const date = new Date(day.date);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
      }),
      datasets: [
        {
          label: labels.progressTracker.tabs.recentActivity.chart.yAxis,
          data: progress.recentProgress.map(day => day.vocabularyLearned),
          backgroundColor: theme.palette.secondary.main,
          borderColor: theme.palette.secondary.dark,
          borderWidth: 1
        }
      ]
    };
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
        <CircularProgress size={60} sx={{ mb: 3 }} />
        <Typography variant="h6" color="text.secondary">
          {labels.progressTracker.loading}
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {labels.progressTracker.title}
        </Typography>
        <Button 
          startIcon={<Refresh />} 
          variant="outlined" 
          onClick={handleRefresh}
        >
          {labels.progressTracker.buttons.refresh}
        </Button>
      </Box>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <School color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  {labels.progressTracker.cards.level.title}
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ mb: 1, textTransform: 'capitalize' }}>
                {progress?.level || labels.progressTracker.cards.level.beginner}
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
                  {labels.progressTracker.cards.vocabulary.title}
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ mb: 1 }}>
                {progress?.vocabularyMastered || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {labels.progressTracker.cards.vocabulary.subtitle}
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
                  {labels.progressTracker.cards.streak.title}
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ mb: 1 }}>
                {progress?.streakDays || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {labels.progressTracker.cards.streak.subtitle}
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
                  {labels.progressTracker.cards.accuracy.title}
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ mb: 1 }}>
                {progress?.accuracy || 0}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {labels.progressTracker.cards.accuracy.subtitle}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Box sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label={labels.progressTracker.tabs.skillsOverview.label} icon={<BarChart />} iconPosition="start" />
          <Tab label={labels.progressTracker.tabs.recentActivity.label} icon={<TrendingUp />} iconPosition="start" />
          <Tab label={labels.progressTracker.tabs.recommendations.label} icon={<Lightbulb />} iconPosition="start" />
          <Tab label={labels.progressTracker.tabs.achievements.label} icon={<EmojiEvents />} iconPosition="start" />
        </Tabs>
      </Box>
      
      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                {labels.progressTracker.tabs.skillsOverview.skillLevels}
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
                {labels.progressTracker.tabs.skillsOverview.skillBreakdown}
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
                              {level < 0.3 ? labels.progressTracker.tabs.skillsOverview.levels.beginner : 
                               level < 0.6 ? labels.progressTracker.tabs.skillsOverview.levels.intermediate : 
                               labels.progressTracker.tabs.skillsOverview.levels.advanced}
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
      
      {tabValue === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper elevation={1} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {labels.progressTracker.tabs.recentActivity.weeklyProgress}
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
                        text: labels.progressTracker.tabs.recentActivity.chart.yAxis
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      display: false
                    },
                    title: {
                      display: true,
                      text: labels.progressTracker.tabs.recentActivity.chart.title
                    }
                  }
                }} />}
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                {labels.progressTracker.tabs.recentActivity.activitySummary}
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <School color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={labels.progressTracker.tabs.recentActivity.summary.totalSessions} 
                    secondary={progress?.totalSessions || 0}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Timer color="secondary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={labels.progressTracker.tabs.recentActivity.summary.totalTime} 
                    secondary={formatDuration(progress?.totalTimeSpent || 0)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Translate sx={{ color: theme.palette.info.main }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={labels.progressTracker.tabs.recentActivity.summary.vocabularyMastered} 
                    secondary={progress?.vocabularyMastered || 0}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Psychology sx={{ color: theme.palette.success.main }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={labels.progressTracker.tabs.recentActivity.summary.grammarMastered} 
                    secondary={progress?.grammarMastered || 0}
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      )}
      
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