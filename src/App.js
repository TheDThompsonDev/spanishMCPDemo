import React, { useState, useEffect } from 'react';
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
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Fade,
  Zoom,
  Slide,
  useMediaQuery,
  Chip,
  Avatar,
  Badge,
  Tooltip
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
  AccountCircle,
  Logout,
  ArrowBack,
  Notifications,
  Settings,
  DarkMode,
  LightMode,
  PlayArrow,
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

function App() {
  const [tabIndex, setTabIndex] = useState(0);
  const [userId, setUserId] = useState('demo_user_123');
  const [sessionId, setSessionId] = useState(null);
  const [showLanding, setShowLanding] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Tabs configuration
  const tabs = [
    { label: "Dashboard", icon: <Dashboard />, color: theme.palette.primary.main },
    { label: "Translation", icon: <Translate />, color: theme.palette.secondary.main },
    { label: "Context", icon: <Psychology />, color: theme.palette.info.main },
    { label: "MCP Flow", icon: <Api />, color: theme.palette.success.main },
    { label: "Sessions", icon: <School />, color: theme.palette.warning.main },
    { label: "Progress", icon: <QueryStats />, color: theme.palette.error.main },
    { label: "API Explorer", icon: <Code />, color: "#9c27b0" }
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

  // Dashboard component - a simple overview of the demo
  const Dashboard = () => (
    <Box>
      <Typography variant="h4" gutterBottom>
        Spanish Learning MCP Dashboard
      </Typography>
      <Typography variant="body1" paragraph>
        Welcome to the Spanish Learning MCP Demo. This interactive demo showcases how the Model Context Protocol
        enhances Spanish language learning through context-aware AI interactions.
      </Typography>
      
      <McpFlowVisualizer />
      
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Available Demo Features
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
              {tab.label === "Translation" && "Translate text between English and Spanish"}
              {tab.label === "Context" && "Visualize context generation for AI interactions"}
              {tab.label === "MCP Flow" && "Interactive visualization of the MCP protocol flow"}
              {tab.label === "Sessions" && "Manage learning sessions and track activities"}
              {tab.label === "Progress" && "Track learning progress and skill development"}
              {tab.label === "API Explorer" && "Explore and test the MCP API endpoints"}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );

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
            {/* App Bar */}
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
                    Spanish Learning MCP
                  </Typography>
                </Box>
                
                <Box sx={{ flexGrow: 1 }} />
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {sessionId && (
                    <Chip 
                      label={`Session: ${sessionId.substring(0, 8)}...`}
                      size="small"
                      color="secondary"
                      sx={{ mr: 2 }}
                    />
                  )}
                  
                  <Tooltip title="User Profile">
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
                  
                  <Tooltip title="Back to Landing Page">
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
            
            {/* Mobile Drawer */}
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
                  <Typography variant="h6">Spanish Learning MCP</Typography>
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
                    <ListItemText primary="Back to Home" />
                  </ListItem>
                </List>
              </Box>
            </Drawer>
            
            {/* Main Content */}
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
                  {/* Render active tab content */}
                  <Box sx={{ mt: 1 }}>
                    {tabIndex === 0 && <Dashboard />}
                    {tabIndex === 1 && <TranslationDemo userId={userId} sessionId={sessionId} />}
                    {tabIndex === 2 && <ContextVisualizer userId={userId} sessionId={sessionId} />}
                    {tabIndex === 3 && <McpFlowVisualizer />}
                    {tabIndex === 4 && <SessionManager userId={userId} onSessionCreated={handleSessionCreated} />}
                    {tabIndex === 5 && <ProgressTracker userId={userId} />}
                    {tabIndex === 6 && <ApiExplorer userId={userId} sessionId={sessionId} />}
                  </Box>
                </Paper>
              </Zoom>
            </Container>
            
            {/* Footer */}
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
                  Spanish Learning MCP Demo — Model Context Protocol Implementation
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
