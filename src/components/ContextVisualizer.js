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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  LinearProgress,
  TextField,
  IconButton,
  Tooltip,
  Badge,
  Stack,
  Slider,
  Autocomplete
} from '@mui/material';
import {
  ExpandMore,
  Refresh,
  Cached,
  Warning,
  Layers,
  DataUsage,
  Category,
  School,
  Speed,
  Code,
  Storage
} from '@mui/icons-material';
import axios from 'axios';
import ReactJson from 'react-json-view';

// Sample category options
const CATEGORIES = {
  vocabulary: ['greeting', 'verb', 'noun', 'adjective', 'adverb', 'preposition', 'food', 'travel', 'family'],
  grammar: ['verb_tense', 'conjugation', 'adjectives', 'verb_usage', 'verb_form', 'pronouns']
};

const DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced'];

// Visualization colors
const CONTEXT_COLORS = {
  vocabulary: '#4caf50',
  grammar: '#2196f3',
  conversation: '#9c27b0',
  mixed: '#ff9800',
  personalized: '#f44336',
  exercise: '#8bc34a',
  assessment: '#795548'
};

const ContextVisualizer = ({ userId, sessionId }) => {
  const [contextType, setContextType] = useState('mixed');
  const [categories, setCategories] = useState([]);
  const [difficultyLevel, setDifficultyLevel] = useState('beginner');
  const [maxItems, setMaxItems] = useState(5);
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState(null);
  const [cachedStatus, setCachedStatus] = useState(false);
  const [cacheTTL, setCacheTTL] = useState(null);
  const [contextTokenCount, setContextTokenCount] = useState(0);
  const [showJsonView, setShowJsonView] = useState(false);
  const [contextParts, setContextParts] = useState({});
  const [generationTime, setGenerationTime] = useState(0);
  const [parsingContext, setParsingContext] = useState(false);
  const [highlightedSection, setHighlightedSection] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([]);

  // Update available categories when context type changes
  useEffect(() => {
    if (contextType in CATEGORIES) {
      setAvailableCategories(CATEGORIES[contextType]);
    } else {
      setAvailableCategories([]);
    }
    // Reset selected categories when type changes
    setCategories([]);
  }, [contextType]);

  // Helper to parse the context into sections
  const parseContextIntoSections = (content) => {
    if (!content) return {};
    
    setParsingContext(true);
    
    try {
      // Simplified parser for demonstration purposes
      // A real implementation would parse markdown/content more thoroughly
      const sections = {};
      let currentSection = 'main';
      let currentSubsection = null;
      
      // Split by lines and process
      const lines = content.split('\n');
      let buffer = [];
      
      lines.forEach(line => {
        if (line.startsWith('# ')) {
          // New main section
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
          // New subsection
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
      
      // Add the last section
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
    } finally {
      setParsingContext(false);
    }
  };

  // Function to get context from the MCP server
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
        access_tier: 'premium', // For demo purposes
        session_id: sessionId,
        include_custom_lists: true
      });
      
      const endTime = performance.now();
      setGenerationTime(Math.round(endTime - startTime));
      
      // Check if the response contains a cache indicator
      if (response.headers['x-cache-hit']) {
        setCachedStatus(true);
        if (response.headers['x-cache-ttl']) {
          setCacheTTL(parseInt(response.headers['x-cache-ttl'], 10));
        }
      }
      
      // Set context
      setContext(response.data);
      
      // Parse token count
      if (response.data.metadata && response.data.metadata.token_count) {
        setContextTokenCount(response.data.metadata.token_count);
      } else {
        // Approximate tokens if not provided
        setContextTokenCount(Math.round(response.data.content.length / 4));
      }
      
      // Parse context content into sections
      parseContextIntoSections(response.data.content);
      
    } catch (error) {
      console.error('Error fetching context:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate composition percentages for visualization
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
    
    // Convert to percentages
    Object.keys(composition).forEach(key => {
      composition[key] = Math.round((composition[key] / total) * 100);
    });
    
    return composition;
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Context Configuration
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Context Type</InputLabel>
                <Select
                  value={contextType}
                  label="Context Type"
                  onChange={(e) => setContextType(e.target.value)}
                >
                  <MenuItem value="mixed">Mixed</MenuItem>
                  <MenuItem value="vocabulary">Vocabulary</MenuItem>
                  <MenuItem value="grammar">Grammar</MenuItem>
                  <MenuItem value="conversation">Conversation</MenuItem>
                  <MenuItem value="personalized">Personalized</MenuItem>
                  <MenuItem value="exercise">Exercise</MenuItem>
                  <MenuItem value="assessment">Assessment</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Difficulty Level</InputLabel>
                <Select
                  value={difficultyLevel}
                  label="Difficulty Level"
                  onChange={(e) => setDifficultyLevel(e.target.value)}
                >
                  {DIFFICULTY_LEVELS.map(level => (
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
                    label="Categories"
                    placeholder="Select categories"
                  />
                )}
                sx={{ mb: 2 }}
                disabled={availableCategories.length === 0}
              />
              
              <Box sx={{ mb: 2 }}>
                <Typography gutterBottom>
                  Max Items: {maxItems}
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
              >
                Generate Context
              </Button>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>
              Context Metrics
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Token Count
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
                      Generation Time
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
                      Cache Status
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Cached 
                        sx={{ 
                          mr: 1, 
                          color: cachedStatus ? 'success.main' : 'text.disabled' 
                        }} 
                      />
                      <Typography variant="h5">
                        {cachedStatus ? 'HIT' : 'MISS'}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Sections
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
                Context Visualization
              </Typography>
              
              <Tooltip title="Toggle JSON View">
                <IconButton onClick={() => setShowJsonView(!showJsonView)}>
                  <Code />
                </IconButton>
              </Tooltip>
            </Box>
            
            {loading ? (
              <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CircularProgress sx={{ mb: 2 }} />
                <Typography>Generating Context...</Typography>
                <LinearProgress sx={{ width: '100%', mt: 2 }} />
              </Box>
            ) : !context ? (
              <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Alert severity="info" sx={{ width: '100%' }}>
                  Configure and generate context to visualize how MCP works
                </Alert>
              </Box>
            ) : showJsonView ? (
              <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                <ReactJson 
                  src={context} 
                  collapsed={1} 
                  displayDataTypes={false}
                  enableClipboard={false}
                  name={false}
                />
              </Box>
            ) : (
              <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Context Type: 
                    <Chip 
                      label={context.metadata?.type || contextType} 
                      sx={{ 
                        ml: 1, 
                        bgcolor: CONTEXT_COLORS[contextType] || '#757575',
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
                        No categories selected
                      </Typography>
                    )}
                  </Box>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Context Composition:
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
                            borderRadius: 1,
                            bgcolor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: CONTEXT_COLORS[contextType] || 'primary.main'
                            }
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Context Content:
                  </Typography>
                  
                  {Object.keys(contextParts).length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No content available
                    </Typography>
                  ) : (
                    Object.keys(contextParts).map(section => (
                      <Accordion 
                        key={section}
                        expanded={highlightedSection === section}
                        onChange={() => setHighlightedSection(highlightedSection === section ? null : section)}
                      >
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {section.toLowerCase().includes('vocabulary') ? (
                              <Category sx={{ mr: 1, color: CONTEXT_COLORS.vocabulary }} />
                            ) : section.toLowerCase().includes('grammar') ? (
                              <School sx={{ mr: 1, color: CONTEXT_COLORS.grammar }} />
                            ) : (
                              <Storage sx={{ mr: 1, color: CONTEXT_COLORS.mixed }} />
                            )}
                            <Typography>{section}</Typography>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          {typeof contextParts[section] === 'string' ? (
                            <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>
                              {contextParts[section]}
                            </pre>
                          ) : (
                            Object.keys(contextParts[section]).map(subsection => (
                              <Box key={subsection} sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                  {subsection}
                                </Typography>
                                <pre style={{ 
                                  whiteSpace: 'pre-wrap', 
                                  fontSize: '0.9rem', 
                                  padding: '0.5rem', 
                                  background: '#f5f5f5', 
                                  borderRadius: '4px'
                                }}>
                                  {contextParts[section][subsection]}
                                </pre>
                              </Box>
                            ))
                          )}
                        </AccordionDetails>
                      </Accordion>
                    ))
                  )}
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

