import React, { useState } from 'react';
import {
  CssBaseline, 
  ThemeProvider, 
  Container, 
  Box, 
  AppBar, 
  Toolbar, 
  Typography,
  Tabs,
  Tab,
  Paper,
  Divider,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Fade,
  Zoom,
  useMediaQuery,
  Chip,
  Avatar,
  Tooltip,
  Grid,
  Card,
  CardContent,
  Alert
} from '@mui/material';
import {
  Translate,
  Psychology,
  School,
  QueryStats,
  Api,
  Menu as MenuIcon,
  Home,
  Code,
  Dashboard
} from '@mui/icons-material';
import theme from './styles/theme';
import ContextVisualizer from './components/ContextVisualizer';
import TranslationDemo from './components/TranslationDemo';
import ProgressTracker from './components/ProgressTracker';
import SessionManager from './components/SessionManager';
import ApiExplorer from './components/ApiExplorer';
import LandingPage from './components/LandingPage';
import McpFlowVisualizer from './components/McpFlowVisualizer';
import { labels } from './labels';

function App() {
  const [tabIndex, setTabIndex] = useState(0);
  const [userId] = useState('demo_user_123');
  const [sessionId, setSessionId] = useState(null);
  const [showLanding, setShowLanding] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const tabs = [
    { label: labels.app.tabs[0].label, icon: <Dashboard />, color: labels.app.tabs[0].color },
    { label: labels.app.tabs[1].label, icon: <Translate />, color: labels.app.tabs[1].color },
    { label: labels.app.tabs[2].label, icon: <Psychology />, color: labels.app.tabs[2].color },
    { label: labels.app.tabs[3].label, icon: <Api />, color: labels.app.tabs[3].color },
    { label: labels.app.tabs[4].label, icon: <School />, color: labels.app.tabs[4].color },
    { label: labels.app.tabs[5].label, icon: <QueryStats />, color: labels.app.tabs[5].color },
    { label: labels.app.tabs[6].label, icon: <Code />, color: labels.app.tabs[6].color }
  ];

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleSessionCreated = (newSessionId) => {
    setSessionId(newSessionId);
  };

  const handleStartDemo = () => {
    setShowLanding(false);
  };

  const handleBackToLanding = () => {
    setShowLanding(true);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {showLanding ? (
        <Fade in={showLanding}>
          <Box>
            <LandingPage onStartDemo={handleStartDemo} />
          </Box>
        </Fade>
      ) : (
        <Fade in={!showLanding}>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="static" color="primary" elevation={2}>
              <Toolbar>
                {isMobile && (
                  <IconButton 
                    edge="start" 
                    color="inherit" 
                    aria-label="menu"
                    onClick={toggleDrawer}
                    sx={{ mr: 1 }}
                  >
                    <MenuIcon />
                  </IconButton>
                )}
                
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                  onClick={handleBackToLanding}
                >
                  <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
                    {labels.app.title}
                  </Typography>
                </Box>
                
                <Box sx={{ flexGrow: 1 }} />
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {sessionId && (
                    <Chip 
                      label={`${labels.app.session.label}${sessionId.substring(0, 8)}...`}
                      size="small"
                      color="secondary"
                      sx={{ mr: 2 }}
                    />
                  )}
                  
                  <Tooltip title={labels.app.tooltips.userProfile}>
                    <Chip
                      avatar={<Avatar>{userId.charAt(0).toUpperCase()}</Avatar>}
                      label={userId}
                      variant="outlined"
                      sx={{ 
                        color: 'white', 
                        borderColor: 'rgba(255,255,255,0.3)',
                        mr: 1
                      }}
                    />
                  </Tooltip>
                  
                  <Tooltip title={labels.app.tooltips.backToLanding}>
                    <IconButton color="inherit" onClick={handleBackToLanding}>
                      <Home />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Toolbar>
              
              {!isMobile && (
                <Tabs
                  value={tabIndex}
                  onChange={handleTabChange}
                  indicatorColor="secondary"
                  textColor="inherit"
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{ px: 2 }}
                >
                  {tabs.map((tab, index) => (
                    <Tab 
                      key={index}
                      label={tab.label} 
                      icon={tab.icon} 
                      iconPosition="start"
                    />
                  ))}
                </Tabs>
              )}
            </AppBar>
            
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={toggleDrawer}
            >
              <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={toggleDrawer}
              >
                <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                  <Typography variant="h6">{labels.app.title}</Typography>
                </Box>
                <List>
                  {tabs.map((tab, index) => (
                    <ListItem 
                      button 
                      key={index}
                      selected={tabIndex === index}
                      onClick={() => setTabIndex(index)}
                      sx={{
                        borderLeft: tabIndex === index ? `4px solid ${tab.color}` : 'none',
                        bgcolor: tabIndex === index ? 'rgba(0, 0, 0, 0.04)' : 'transparent'
                      }}
                    >
                      <ListItemIcon sx={{ color: tab.color }}>
                        {tab.icon}
                      </ListItemIcon>
                      <ListItemText primary={tab.label} />
                    </ListItem>
                  ))}
                </List>
                <Divider />
                <List>
                  <ListItem button onClick={handleBackToLanding}>
                    <ListItemIcon>
                      <Home />
                    </ListItemIcon>
                    <ListItemText primary={labels.app.drawer.backToHome} />
                  </ListItem>
                </List>
              </Box>
            </Drawer>
            
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
              <Zoom in={true} style={{ transitionDelay: '300ms' }}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: { xs: 2, md: 3 }, 
                    borderRadius: 3,
                    minHeight: '80vh'
                  }}
                >
                  <Box sx={{ mt: 1 }}>
                    {tabIndex === 0 && (
                      <Box>
                        <Typography variant="h4" gutterBottom>
                          {labels.app.dashboard.title}
                        </Typography>
                        <Typography variant="body1" paragraph>
                          {labels.app.dashboard.welcome}
                        </Typography>
                        
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                          <Grid item xs={12} md={4}>
                            <Card elevation={2}>
                              <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                  <Psychology color="primary" sx={{ mr: 1 }} />
                                  <Typography variant="h6">MCP Protocol</Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                  The Model Context Protocol standardizes how AI applications interact with context sources,
                                  enabling richer and more accurate AI responses for Spanish learning.
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Card elevation={2}>
                              <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                  <Translate color="secondary" sx={{ mr: 1 }} />
                                  <Typography variant="h6">AI Translation</Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                  Experience real-time translation powered by Claude AI with contextual understanding
                                  of Spanish language patterns and cultural nuances.
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Card elevation={2}>
                              <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                  <QueryStats color="success" sx={{ mr: 1 }} />
                                  <Typography variant="h6">Learning Analytics</Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                  Track your progress with detailed analytics, skill assessments, and personalized
                                  learning recommendations.
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        </Grid>
                        
                        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                          {labels.app.dashboard.features.title}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                          {tabs.slice(1).map((tab, index) => (
                            <Paper 
                              key={index}
                              elevation={2}
                              sx={{ 
                                p: 2, 
                                width: 220, 
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                  transform: 'translateY(-5px)',
                                  boxShadow: theme.shadows[8]
                                },
                                borderTop: `4px solid ${tab.color}`
                              }}
                              onClick={() => setTabIndex(index + 1)}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Box 
                                  sx={{ 
                                    mr: 1.5, 
                                    color: tab.color,
                                    display: 'flex'
                                  }}
                                >
                                  {tab.icon}
                                </Box>
                                <Typography variant="h6">
                                  {tab.label}
                                </Typography>
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                {tab.label === labels.app.tabs[1].label && labels.app.dashboard.features.descriptions.translation}
                                {tab.label === labels.app.tabs[2].label && labels.app.dashboard.features.descriptions.context}
                                {tab.label === labels.app.tabs[3].label && labels.app.dashboard.features.descriptions.mcpFlow}
                                {tab.label === labels.app.tabs[4].label && labels.app.dashboard.features.descriptions.sessions}
                                {tab.label === labels.app.tabs[5].label && labels.app.dashboard.features.descriptions.progress}
                                {tab.label === labels.app.tabs[6].label && labels.app.dashboard.features.descriptions.apiExplorer}
                              </Typography>
                            </Paper>
                          ))}
                        </Box>
                      </Box>
                    )}
                    {tabIndex === 1 && <TranslationDemo userId={userId} sessionId={sessionId} />}
                    {tabIndex === 2 && <ContextVisualizer userId={userId} sessionId={sessionId} />}
                    {tabIndex === 3 && (
                      <Box>
                        <Typography variant="h4" gutterBottom>
                          MCP Protocol Flow Visualization
                        </Typography>
                        <Typography variant="body1" paragraph>
                          Explore how the Model Context Protocol works step-by-step. This interactive visualization
                          shows the complete flow from user request to AI-powered response.
                        </Typography>
                        
                        <Alert severity="info" sx={{ mb: 3 }}>
                          <Typography variant="body2">
                            💡 <strong>Tip:</strong> Click the play button to auto-advance through each step, or use the navigation
                            buttons to explore at your own pace. Toggle the code examples to see the actual API requests and responses.
                          </Typography>
                        </Alert>
                        
                        <McpFlowVisualizer />
                        
                        <Paper elevation={1} sx={{ p: 3, mt: 4, bgcolor: 'background.default' }}>
                          <Typography variant="h6" gutterBottom>
                            Understanding the MCP Flow
                          </Typography>
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle1" gutterBottom color="primary">
                                Why MCP Matters
                              </Typography>
                              <Typography variant="body2" paragraph>
                                The Model Context Protocol standardizes how AI applications access and utilize context,
                                making interactions more accurate, relevant, and educational.
                              </Typography>
                              <Typography variant="subtitle1" gutterBottom color="primary">
                                Key Benefits
                              </Typography>
                              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                                <Typography component="li" variant="body2">Enhanced AI accuracy through relevant context</Typography>
                                <Typography component="li" variant="body2">Standardized protocol for context management</Typography>
                                <Typography component="li" variant="body2">Efficient context caching and reuse</Typography>
                                <Typography component="li" variant="body2">Personalized learning experiences</Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle1" gutterBottom color="primary">
                                In Spanish Learning
                              </Typography>
                              <Typography variant="body2" paragraph>
                                MCP enables the AI to understand your learning level, previous mistakes, cultural preferences,
                                and specific areas you're working on.
                              </Typography>
                              <Typography variant="subtitle1" gutterBottom color="primary">
                                Context Types
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {['Vocabulary', 'Grammar', 'Conversation', 'Cultural', 'Personalized'].map((type) => (
                                  <Chip key={type} label={type} size="small" variant="outlined" />
                                ))}
                              </Box>
                            </Grid>
                          </Grid>
                        </Paper>
                      </Box>
                    )}
                    {tabIndex === 4 && <SessionManager userId={userId} onSessionCreated={handleSessionCreated} />}
                    {tabIndex === 5 && <ProgressTracker userId={userId} />}
                    {tabIndex === 6 && <ApiExplorer userId={userId} sessionId={sessionId} />}
                  </Box>
                </Paper>
              </Zoom>
            </Container>
            
            <Box 
              component="footer" 
              sx={{ 
                py: 2, 
                px: 2, 
                mt: 'auto', 
                bgcolor: 'background.paper',
                borderTop: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Container maxWidth="lg">
                <Typography variant="body2" color="text.secondary" align="center">
                  {labels.app.footer.text}
                </Typography>
              </Container>
            </Box>
          </Box>
        </Fade>
      )}
    </ThemeProvider>
  );
}

export default App;
