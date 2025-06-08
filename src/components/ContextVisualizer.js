import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Alert,
  LinearProgress,
  TextField,
  IconButton,
  Tooltip,
  Slider,
  Autocomplete
} from '@mui/material';
import {
  Refresh,
  Cached,
  Layers,
  DataUsage,
  Speed,
  Code,
} from '@mui/icons-material';
import axios from 'axios';
import JsonView from '@uiw/react-json-view';
import { labels } from '../labels';

const ContextVisualizer = ({ userId, sessionId }) => {
  const [contextType, setContextType] = useState('mixed');
  const [categories, setCategories] = useState([]);
  const [difficultyLevel, setDifficultyLevel] = useState('beginner');
  const [maxItems, setMaxItems] = useState(5);
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState(null);
  const [cachedStatus, setCachedStatus] = useState(false);
  const [contextTokenCount, setContextTokenCount] = useState(0);
  const [showJsonView, setShowJsonView] = useState(false);
  const [contextParts, setContextParts] = useState({});
  const [generationTime, setGenerationTime] = useState(0);
  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    if (contextType in labels.contextVisualizer.categories) {
      setAvailableCategories(labels.contextVisualizer.categories[contextType]);
    } else {
      setAvailableCategories([]);
    }
    setCategories([]);
  }, [contextType]);

  const parseContextIntoSections = (content) => {
    if (!content) return {};
    
    
    try {
      const sections = {};
      let currentSection = 'main';
      let currentSubsection = null;
      
      const lines = content.split('\n');
      let buffer = [];
      
      lines.forEach(line => {
        if (line.startsWith('# ')) {
          if (buffer.length > 0) {
            if (currentSubsection) {
              if (!sections[currentSection]) sections[currentSection] = {};
              sections[currentSection][currentSubsection] = buffer.join('\n');
            } else {
              sections[currentSection] = buffer.join('\n');
            }
          }
          currentSection = line.substring(2).trim();
          currentSubsection = null;
          buffer = [];
        } else if (line.startsWith('## ')) {
          if (buffer.length > 0) {
            if (currentSubsection) {
              if (!sections[currentSection]) sections[currentSection] = {};
              sections[currentSection][currentSubsection] = buffer.join('\n');
            } else {
              sections[currentSection] = buffer.join('\n');
            }
          }
          currentSubsection = line.substring(3).trim();
          buffer = [];
        } else {
          buffer.push(line);
        }
      });
      
      if (buffer.length > 0) {
        if (currentSubsection) {
          if (!sections[currentSection]) sections[currentSection] = {};
          sections[currentSection][currentSubsection] = buffer.join('\n');
        } else {
          sections[currentSection] = buffer.join('\n');
        }
      }
      
      setContextParts(sections);
    } catch (error) {
      console.error('Error parsing context:', error);
    }
  };

  const getContext = async () => {
    setLoading(true);
    setContext(null);
    setCachedStatus(false);
    setContextTokenCount(0);
    setGenerationTime(0);
    
    const startTime = performance.now();
    
    try {
      const response = await axios.post('/mcp/context', {
        context_type: contextType,
        operation: 'get',
        categories: categories,
        difficulty_level: difficultyLevel,
        user_id: userId,
        max_items: maxItems,
        access_tier: 'premium',
        session_id: sessionId,
        include_custom_lists: true
      });
      
      const endTime = performance.now();
      setGenerationTime(Math.round(endTime - startTime));
      
      if (response.headers['x-cache-hit']) {
        setCachedStatus(true);
      }
      
      setContext(response.data);
      
      if (response.data.metadata && response.data.metadata.token_count) {
        setContextTokenCount(response.data.metadata.token_count);
      } else {
        setContextTokenCount(Math.round(response.data.content.length / 4));
      }
      
      parseContextIntoSections(response.data.content);
      
    } catch (error) {
      console.error('Error fetching context:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateComposition = () => {
    const composition = {};
    let total = 0;
    
    Object.keys(contextParts).forEach(section => {
      if (typeof contextParts[section] === 'string') {
        const length = contextParts[section].length;
        composition[section] = length;
        total += length;
      } else {
        Object.keys(contextParts[section]).forEach(subsection => {
          const length = contextParts[section][subsection].length;
          composition[`${section} - ${subsection}`] = length;
          total += length;
        });
      }
    });
    
    Object.keys(composition).forEach(key => {
      composition[key] = Math.round((composition[key] / total) * 100);
    });
    
    return composition;
  };

  return (
    <Box>
      <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
        <Typography variant="h5" gutterBottom>
          {labels.contextVisualizer.labels.headerTitle}
        </Typography>
        <Typography variant="body1" paragraph>
          {labels.contextVisualizer.labels.headerDescription}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          <Chip label={labels.contextVisualizer.labels.badges.dynamicContent} size="small" variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }} />
          <Chip label={labels.contextVisualizer.labels.badges.contextAware} size="small" variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }} />
          <Chip label={labels.contextVisualizer.labels.badges.realTime} size="small" variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }} />
          <Chip label={labels.contextVisualizer.labels.badges.configurable} size="small" variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }} />
        </Box>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                {labels.contextVisualizer.labels.configuration}
              </Typography>
              <Chip label={labels.contextVisualizer.labels.steps.step1} color="primary" size="small" />
            </Box>
            
            {/* What This Does Explanation */}
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>{labels.contextVisualizer.labels.configurationAlert.title}</strong> {labels.contextVisualizer.labels.configurationAlert.description}
              </Typography>
            </Alert>
            
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>{labels.contextVisualizer.labels.contextType}</InputLabel>
                <Select
                  value={contextType}
                  label={labels.contextVisualizer.labels.contextType}
                  onChange={(e) => setContextType(e.target.value)}
                >
                  {labels.contextTypes.types.map(type => (
                    <MenuItem key={type.name} value={type.name}>{type.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>{labels.contextVisualizer.labels.difficultyLevel}</InputLabel>
                <Select
                  value={difficultyLevel}
                  label={labels.contextVisualizer.labels.difficultyLevel}
                  onChange={(e) => setDifficultyLevel(e.target.value)}
                >
                  {labels.contextVisualizer.difficultyLevels.map(level => (
                    <MenuItem key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Autocomplete
                multiple
                id="categories"
                options={availableCategories}
                value={categories}
                onChange={(event, newValue) => {
                  setCategories(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label={labels.contextVisualizer.labels.categories}
                    placeholder={labels.contextVisualizer.labels.categoriesPlaceholder}
                  />
                )}
                sx={{ mb: 2 }}
                disabled={availableCategories.length === 0}
              />
              
              <Box sx={{ mb: 2 }}>
                <Typography gutterBottom>
                  {`${labels.contextVisualizer.labels.maxItems}: ${maxItems}`}
                </Typography>
                <Slider
                  value={maxItems}
                  onChange={(e, newValue) => setMaxItems(newValue)}
                  min={1}
                  max={20}
                  step={1}
                  marks={[
                    { value: 1, label: '1' },
                    { value: 5, label: '5' },
                    { value: 10, label: '10' },
                    { value: 20, label: '20' }
                  ]}
                />
              </Box>
              
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={getContext}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <Refresh />}
                sx={{ py: 1.5, fontSize: '1.1rem' }}
              >
                {loading ? labels.contextVisualizer.labels.generating : labels.contextVisualizer.labels.generateButtonActive}
              </Button>
              
              {/* Generation Process Explanation */}
              {loading && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    {labels.contextVisualizer.labels.processExplanation.title}
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    {labels.contextVisualizer.labels.processExplanation.steps.map((step, index) => (
                      <Typography key={index} component="li" variant="body2">{step}</Typography>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                {labels.contextVisualizer.labels.metrics}
              </Typography>
              <Chip label={labels.contextVisualizer.labels.steps.step2} color="secondary" size="small" />
            </Box>
            
            <Alert severity="success" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>{labels.contextVisualizer.labels.metricsAlert.title}</strong> {labels.contextVisualizer.labels.metricsAlert.description}
              </Typography>
            </Alert>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      {labels.contextVisualizer.labels.tokenCount}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <DataUsage sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h5">
                        {contextTokenCount || 0}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      {labels.contextVisualizer.labels.generationTime}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Speed sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h5">
                        {generationTime || 0} ms
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      {labels.contextVisualizer.labels.cacheStatus}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Cached 
                        sx={{ 
                          mr: 1, 
                          color: cachedStatus ? 'success.main' : 'text.disabled' 
                        }} 
                      />
                      <Typography variant="h5">
                        {cachedStatus ? labels.contextVisualizer.labels.cacheHit : labels.contextVisualizer.labels.cacheMiss}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      {labels.contextVisualizer.labels.sections}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Layers sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h5">
                        {Object.keys(contextParts).length || 0}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={7}>
          <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                {labels.contextVisualizer.labels.outputTitle}
              </Typography>
              <Chip label={labels.contextVisualizer.labels.steps.step3} color="success" size="small" sx={{ mr: 1 }} />
              
              <Tooltip title={labels.contextVisualizer.labels.jsonView}>
                <IconButton onClick={() => setShowJsonView(!showJsonView)}>
                  <Code />
                </IconButton>
              </Tooltip>
            </Box>
            
            {loading ? (
              <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CircularProgress sx={{ mb: 2 }} />
                <Typography variant="h6" gutterBottom>{labels.contextVisualizer.labels.loadingTitle}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
                  {labels.contextVisualizer.labels.loadingDescription}
                </Typography>
                <LinearProgress sx={{ width: '100%', mt: 2 }} />
                <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 2, width: '100%' }}>
                  <Typography variant="caption" color="text.secondary">
                    {labels.contextVisualizer.labels.loadingNote}
                  </Typography>
                </Box>
              </Box>
            ) : !context ? (
              <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Alert severity="info" sx={{ width: '100%', mb: 3 }}>
                  <Typography variant="body1" gutterBottom>
                    <strong>{labels.contextVisualizer.labels.emptyState.title}</strong>
                  </Typography>
                  <Typography variant="body2">
                    {labels.contextVisualizer.labels.emptyState.description}
                  </Typography>
                </Alert>
                <Box sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2, width: '100%' }}>
                  <Typography variant="subtitle2" gutterBottom>{labels.contextVisualizer.labels.emptyState.previewTitle}</Typography>
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    {labels.contextVisualizer.labels.emptyState.previewItems.map((item, index) => (
                      <Typography key={index} component="li" variant="body2">{item}</Typography>
                    ))}
                  </Box>
                </Box>
              </Box>
            ) : showJsonView ? (
              <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                <JsonView 
                  value={context} 
                  collapsed={1} 
                  displayDataTypes={false}
                  displayObjectSize={false}
                  name={false}
                />
              </Box>
            ) : (
              <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                <Alert severity="success" sx={{ mb: 3 }}>
                  <Typography variant="body2">
                    <strong>{labels.contextVisualizer.labels.successAlert.title}</strong> {labels.contextVisualizer.labels.successAlert.description}
                  </Typography>
                </Alert>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {labels.contextVisualizer.labels.contextTypeLabel}
                    <Chip 
                      label={context.metadata?.type || contextType} 
                      sx={{ 
                        ml: 1, 
                        bgcolor: labels.contextVisualizer.colors[contextType] || '#757575',
                        color: 'white'
                      }} 
                      size="small" 
                    />
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {categories.map((category) => (
                      <Chip 
                        key={category} 
                        label={category} 
                        size="small" 
                        variant="outlined" 
                      />
                    ))}
                    {categories.length === 0 && (
                      <Typography variant="body2" color="text.secondary">
                        {labels.contextVisualizer.labels.noCategories}
                      </Typography>
                    )}
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                      {labels.contextVisualizer.labels.compositionTitle}
                    </Typography>
                    <Chip label={labels.contextVisualizer.labels.compositionChip} size="small" color="primary" variant="outlined" />
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                    {labels.contextVisualizer.labels.compositionDescription}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    {Object.entries(calculateComposition()).map(([section, percentage]) => (
                      <Box key={section} sx={{ mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <Typography variant="body2" sx={{ flexGrow: 1 }}>
                            {section}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {percentage}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={percentage}
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            bgcolor: 'action.hover'
                          }} 
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContextVisualizer;
