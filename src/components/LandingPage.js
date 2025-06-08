import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  useTheme,
  Fade,
  Zoom,
} from '@mui/material';
import {
  Psychology,
  Translate,
  School,
  QueryStats,
  Api,
  ExpandMore,
  ExpandLess,
  PlayArrow,
} from '@mui/icons-material';
import { labels } from '../labels';

const LandingPage = ({ onStartDemo }) => {
  const theme = useTheme();
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const mcpFeatures = [
    {
      title: labels.features.items[0].title,
      description: labels.features.items[0].description,
      icon: <Psychology fontSize="large" color="primary" />,
      color: theme.palette.primary.main,
    },
    {
      title: labels.features.items[1].title,
      description: labels.features.items[1].description,
      icon: <School fontSize="large" color="secondary" />,
      color: theme.palette.secondary.main,
    },
    {
      title: labels.features.items[2].title,
      description: labels.features.items[2].description,
      icon: <QueryStats fontSize="large" style={{ color: theme.palette.success.main }} />,
      color: theme.palette.success.main,
    },
    {
      title: labels.features.items[3].title,
      description: labels.features.items[3].description,
      icon: <Translate fontSize="large" style={{ color: theme.palette.info.main }} />,
      color: theme.palette.info.main,
    },
  ];

  return (
    <Box sx={{ pb: 8 }}>
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
                    {labels.hero.title}
                  </Typography>
                  <Typography variant="h5" sx={{ mb: 4, fontWeight: 400 }}>
                    {labels.hero.subtitle}
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
                    {labels.hero.startDemo}
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
                      {labels.hero.modelContextProtocol}
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
                        {labels.hero.requestExample}
                      </Box>
                    </Box>
                    <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />
                    <Typography variant="overline" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      {labels.landingPage.hero.response}
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
                      {labels.hero.responseExample}
                    </Box>
                  </Box>
                </Box>
              </Zoom>
            </Grid>
          </Grid>
        </Container>
      </Paper>

      <Container maxWidth="lg">
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" gutterBottom align="center">
            {labels.mcpSection.title}
          </Typography>
          <Typography variant="subtitle1" align="center" color="white" sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}>
            {labels.mcpSection.subtitle}
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
                  {labels.mcpSection.howItWorks.title}
                </Typography>
                <Typography variant="body1" paragraph>
                  {labels.mcpSection.howItWorks.description1}
                </Typography>
                <Typography variant="body1" paragraph>
                  {labels.mcpSection.howItWorks.description2}
                </Typography>
                
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    {labels.mcpSection.howItWorks.benefits.title}
                  </Typography>
                  <Box component="ul" sx={{ pl: 2 }}>
                    {labels.mcpSection.howItWorks.benefits.items.map((item, index) => (
                      <Typography key={index} component="li" variant="body1" sx={{ mb: index < labels.mcpSection.howItWorks.benefits.items.length - 1 ? 1 : 0 }}>
                        {item}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ height: '100%' }}>
                  <Stepper orientation="vertical" nonLinear activeStep={-1}>
                    {labels.mcpProtocolSteps.map((step, index) => (
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

        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" gutterBottom align="center">
            {labels.features.title}
          </Typography>
          <Typography variant="subtitle1" align="center" color="white" sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}>
            {labels.features.subtitle}
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

        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" gutterBottom align="center">
            {labels.contextTypes.title}
          </Typography>
          <Typography variant="subtitle1" align="center" color="white" sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}>
            {labels.contextTypes.subtitle}
          </Typography>
          
          <Grid container spacing={2}>
            {labels.contextTypes.types.map((type, index) => (
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
                      {labels.landingPage.contextTypes.contextTypeLabel}
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

        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" gutterBottom align="center">
            {labels.apiEndpoints.title}
          </Typography>
          <Typography variant="subtitle1" align="center" color="white" sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}>
            {labels.apiEndpoints.subtitle}
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
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
                  <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                    {labels.landingPage.apiEndpoints.sections.mcp.title}
                  </Typography>
                  {expandedSection === 'mcp' ? <ExpandLess /> : <ExpandMore />}
                </Box>
                {expandedSection === 'mcp' && (
                  <Box sx={{ p: 3, bgcolor: 'background.paper' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Card variant="outlined" sx={{ height: '100%' }}>
                          <CardContent>
                            <Typography variant="h6" color="primary" gutterBottom>
                              {labels.landingPage.apiEndpoints.sections.mcp.endpoints.models.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {labels.landingPage.apiEndpoints.sections.mcp.endpoints.models.description}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Card variant="outlined" sx={{ height: '100%' }}>
                          <CardContent>
                            <Typography variant="h6" color="primary" gutterBottom>
                              {labels.landingPage.apiEndpoints.sections.mcp.endpoints.context.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {labels.landingPage.apiEndpoints.sections.mcp.endpoints.context.description}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Card variant="outlined" sx={{ height: '100%' }}>
                          <CardContent>
                            <Typography variant="h6" color="primary" gutterBottom>
                              {labels.landingPage.apiEndpoints.sections.mcp.endpoints.generate.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {labels.landingPage.apiEndpoints.sections.mcp.endpoints.generate.description}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
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
                  <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                    {labels.landingPage.apiEndpoints.sections.spanish.title}
                  </Typography>
                  {expandedSection === 'spanish' ? <ExpandLess /> : <ExpandMore />}
                </Box>
                {expandedSection === 'spanish' && (
                  <Box sx={{ p: 3, bgcolor: 'background.paper' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Card variant="outlined" sx={{ height: '100%' }}>
                          <CardContent>
                            <Typography variant="h6" color="secondary" gutterBottom>
                              {labels.landingPage.apiEndpoints.sections.spanish.endpoints.translate.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {labels.landingPage.apiEndpoints.sections.spanish.endpoints.translate.description}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Card variant="outlined" sx={{ height: '100%' }}>
                          <CardContent>
                            <Typography variant="h6" color="secondary" gutterBottom>
                              {labels.landingPage.apiEndpoints.sections.spanish.endpoints.conjugate.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {labels.landingPage.apiEndpoints.sections.spanish.endpoints.conjugate.description}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;