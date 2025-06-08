export const labels = {
  hero: {
    title: "Spanish Learning MCP",
    subtitle: "A powerful Model Context Protocol implementation for Spanish language learning",
    startDemo: "Start Interactive Demo",
    modelContextProtocol: "MODEL CONTEXT PROTOCOL",
    requestExample: `{
  "prompt": "Translate: Hello",
  "context_type": "vocabulary",
  "model": "spanish-learning-model"
}`,
    responseExample: `{
  "object": "generation",
  "choices": [
    { "text": "Hola" }
  ]
}`
  },
  mcpSection: {
    title: "What is Model Context Protocol?",
    subtitle: "The Model Context Protocol (MCP) is a standardized way for applications to interact with AI models by providing relevant context to enhance the quality and relevance of AI-generated responses.",
    howItWorks: {
      title: "How MCP Works",
      description1: "MCP enables applications to provide specific context to AI models, making their responses more accurate and relevant. For language learning, this means providing vocabulary, grammar rules, and personalized content.",
      description2: "The protocol standardizes how context is provided, manipulated, and used across different AI models and applications.",
      benefits: {
        title: "Key Benefits:",
        items: [
          "Enhanced AI responses with domain-specific knowledge",
          "Standardized interface for context manipulation",
          "Improved personalization and adaptation",
          "Efficient context reuse and caching"
        ]
      }
    }
  },
  features: {
    title: "Spanish Learning Features",
    subtitle: "Our MCP implementation specializes in Spanish language learning with features designed to enhance the learning experience.",
    items: [
      {
        title: "Context-Aware AI",
        description: "Provides relevant vocabulary, grammar, and learning materials as context to the AI model"
      },
      {
        title: "Personalized Learning",
        description: "Adapts to user skill levels and learning progress"
      },
      {
        title: "Progress Tracking",
        description: "Tracks vocabulary mastery, grammar understanding, and overall learning progress"
      },
      {
        title: "Translation Services",
        description: "Provides accurate translations with context-aware understanding"
      }
    ]
  },
  mcpProtocolSteps: [
    {
      label: "Resource Discovery",
      description: "The MCP client discovers available learning resources from the server",
      code: `POST /mcp/resources/list
{
  "method": "resources/list",
  "params": {
    "resourceType": "spanish-learning"
  }
}`
    },
    {
      label: "Resource Access",
      description: "The MCP server provides specific learning resources based on the request",
      code: `POST /mcp/resources/read
{
  "method": "resources/read",
  "params": {
    "uri": "spanish://vocabulary/greetings",
    "difficulty": "beginner"
  }
}`
    },
    {
      label: "Tool Execution",
      description: "The MCP server executes a translation tool with the provided context",
      code: `POST /mcp/tools/call
{
  "method": "tools/call",
  "params": {
    "name": "spanish-translator",
    "arguments": {
      "text": "Hello, how are you?",
      "targetLanguage": "spanish",
      "context": "casual_greeting"
    }
  }
}`
    },
    {
      label: "Tool Response",
      description: "The MCP server returns the tool execution result to the client",
      code: `{
  "method": "tools/call",
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Hola, ¿cómo estás?"
      }
    ],
    "metadata": {
      "confidence": 0.95,
      "difficulty": "beginner",
      "alternatives": ["¿Cómo te va?"]
    }
  }
}`
    }
  ],
  contextTypes: {
    title: "Context Types",
    subtitle: "The Spanish Learning MCP server supports multiple context types specifically designed for language learning.",
    types: [
      { name: "vocabulary", color: "#4caf50", description: "Spanish vocabulary with translations and examples" },
      { name: "grammar", color: "#2196f3", description: "Spanish grammar rules and usage" },
      { name: "mixed", color: "#ff9800", description: "Combined vocabulary and grammar" },
      { name: "conversation", color: "#9c27b0", description: "Conversational phrases and patterns" },
      { name: "exercise", color: "#8bc34a", description: "Practice exercises" },
      { name: "assessment", color: "#795548", description: "Skill assessment materials" },
      { name: "personalized", color: "#f44336", description: "Adaptive content based on user progress" }
    ]
  },
  apiEndpoints: {
    title: "API Endpoints",
    subtitle: "The Spanish Learning MCP server provides a comprehensive set of API endpoints for language learning applications.",
    defaultValues: {
      prompt: "Translate to Spanish: Hello, how are you?",
      translateText: "Hello, how are you?",
      conjugateVerb: "hablar",
      queryText: "What is the difference between ser and estar?"
    },
    endpoints: {
      models: {
        title: "GET /mcp/models",
        description: "Lists available models and their capabilities.",
        buttonText: "Send Request"
      },
      context: {
        title: "POST /mcp/context",
        description: "Retrieves or manipulates context for AI interactions.",
        buttonText: "Send Request"
      },
      generate: {
        title: "POST /mcp/generate",
        description: "Generates text using the AI model with context.",
        buttonText: "Send Request"
      },
      translate: {
        title: "POST /api/translate",
        description: "Translates text between English and Spanish.",
        buttonText: "Translate"
      },
      conjugate: {
        title: "POST /api/conjugate",
        description: "Provides verb conjugations in different tenses.",
        buttonText: "Conjugate"
      },
      query: {
        title: "POST /api/query",
        description: "General query endpoint for Spanish learning questions.",
        buttonText: "Send Query"
      }
    }
  },
  translation: {
    directions: {
      englishToSpanish: "English → Spanish",
      spanishToEnglish: "Spanish → English"
    },
    buttons: {
      swap: "Swap",
      translate: "Translate"
    },
    labels: {
      input: "Enter text to translate",
      contextType: "Context Type",
      result: "Translation Result:",
      placeholder: "Translation will appear here",
      showContext: "Show Context",
      showApiResponse: "Show API Response",
      apiResponse: "API Response:",
      context: "Context",
      notLoaded: "Not Loaded",
      retrieved: "Retrieved",
      contextPlaceholder: "Context will be displayed here after translation",
      history: "Translation History",
      noTranslations: "No translations yet",
      noTranslationsDesc: "Translated items will appear here"
    },
    errors: {
      emptyText: "Please enter text to translate",
      fetchContext: "Failed to fetch context: ",
      translation: "Translation failed: "
    }
  },
  contextVisualizer: {
    categories: {
      vocabulary: ["greeting", "verb", "noun", "adjective", "adverb", "preposition", "food", "travel", "family"],
      grammar: ["verb_tense", "conjugation", "adjectives", "verb_usage", "verb_form", "pronouns"]
    },
    difficultyLevels: ["beginner", "intermediate", "advanced"],
    colors: {
      vocabulary: "#4caf50",
      grammar: "#2196f3",
      conversation: "#9c27b0",
      mixed: "#ff9800",
      personalized: "#f44336",
      exercise: "#8bc34a",
      assessment: "#795548"
    },
    labels: {
      configuration: "Context Configuration",
      contextType: "Context Type",
      difficultyLevel: "Difficulty Level",
      categories: "Categories",
      categoriesPlaceholder: "Select categories",
      maxItems: "Max Items",
      generateButton: "Generate Context",
      metrics: "Context Metrics",
      tokenCount: "Token Count",
      generationTime: "Generation Time",
      cacheStatus: "Cache Status",
      sections: "Sections",
      visualization: "Context Visualization",
      jsonView: "Toggle JSON View",
      generating: "Generating Context...",
      configurePrompt: "Configure and generate context to visualize how MCP works",
      contextTypeLabel: "Context Type:",
      noCategories: "No categories selected",
      composition: "Context Composition:"
    }
  },
  mcpFlow: {
    title: "MCP Flow Visualization",
    subtitle: "This interactive visualization demonstrates how the Model Context Protocol works in a Spanish learning application.",
    samplePrompt: "Translate to Spanish: I would like to order a coffee, please.",
    buttons: {
      play: "Auto-Play",
      pause: "Pause",
      next: "Next Step",
      reset: "Reset",
      showCode: "Show Code",
      hideCode: "Hide Code",
      showDetails: "Show Details",
      hideDetails: "Hide Details",
      restart: "Restart",
      previous: "Previous"
    },
    labels: {
      samplePrompt: "Sample Prompt:",
      method: "INTERNAL",
      response: "RESPONSE",
      internalProcessing: "Internal Processing"
    },
    steps: [
      {
        title: "Client Request",
        description: "The client sends a request to the MCP server with a prompt and optional parameters.",
        request: {
          endpoint: "/mcp/generate",
          method: "POST",
          body: {
            prompt: "Translate to Spanish: I would like to order a coffee, please.",
            context_type: "conversation",
            model: "spanish-learning-model",
            max_tokens: 100
          }
        }
      },
      {
        title: "Context Retrieval",
        description: "The MCP server retrieves or generates appropriate context based on the request parameters.",
        request: {
          endpoint: "/mcp/context",
          method: "POST",
          body: {
            context_type: "conversation",
            operation: "get",
            categories: ["restaurant", "ordering"],
            difficulty_level: "intermediate"
          }
        },
        response: {
          object: "context",
          content: "# Spanish Restaurant Phrases\n\n## Ordering\n\n### coffee\n- **Translation:** café\n- **Difficulty:** beginner\n\n**Examples:**\n- Spanish: Me gustaría un café, por favor.\n  English: I would like a coffee, please.\n\n- Spanish: ¿Puedo pedir un café?\n  English: Can I order a coffee?\n\n### order\n- **Translation:** pedir\n- **Difficulty:** beginner\n\n**Examples:**\n- Spanish: Quiero pedir algo de beber.\n  English: I want to order something to drink.\n",
          metadata: {
            type: "conversation",
            source: "spanish-learning-mcp",
            token_count: 156,
            categories: ["restaurant", "ordering"],
            difficulty_level: "intermediate"
          }
        }
      },
      {
        title: "AI Model Processing",
        description: "The AI model processes the request with the provided context to generate a response.",
        request: {
          internal: true,
          body: {
            model: "claude-3-opus-20240229",
            prompt: "<context># Spanish Restaurant Phrases\n\n## Ordering\n\n### coffee\n- **Translation:** café\n- **Difficulty:** beginner\n\n**Examples:**\n- Spanish: Me gustaría un café, por favor.\n  English: I would like a coffee, please.\n\n- Spanish: ¿Puedo pedir un café?\n  English: Can I order a coffee?\n\n### order\n- **Translation:** pedir\n- **Difficulty:** beginner\n\n**Examples:**\n- Spanish: Quiero pedir algo de beber.\n  English: I want to order something to drink.</context>\n\nTranslate to Spanish: I would like to order a coffee, please.",
            max_tokens: 100,
            temperature: 0.7
          }
        },
        response: {
          internal: true,
          completion: "Me gustaría pedir un café, por favor."
        }
      },
      {
        title: "Response Generation",
        description: "The MCP server returns the AI-generated response to the client.",
        response: {
          object: "generation",
          model: "spanish-learning-model",
          choices: [
            {
              text: "Me gustaría pedir un café, por favor.",
              finish_reason: "stop"
            }
          ],
          usage: {
            prompt_tokens: 180,
            completion_tokens: 8,
            total_tokens: 188
          },
          session_id: "session_1234567890"
        }
      }
    ]
  },
  progressTracker: {
    title: "Learning Progress",
    loading: "Loading progress data...",
    error: "Failed to fetch progress data: ",
    buttons: {
      refresh: "Refresh"
    },
    cards: {
      level: {
        title: "Level",
        beginner: "Beginner"
      },
      vocabulary: {
        title: "Vocabulary",
        subtitle: "Words mastered"
      },
      streak: {
        title: "Streak",
        subtitle: "Consecutive days"
      },
      accuracy: {
        title: "Accuracy",
        subtitle: "Overall performance"
      }
    },
    tabs: {
      skillsOverview: {
        label: "Skills Overview",
        skillLevels: "Skill Levels",
        skillBreakdown: "Skill Breakdown",
        levels: {
          beginner: "Beginner",
          intermediate: "Intermediate",
          advanced: "Advanced"
        }
      },
      recentActivity: {
        label: "Recent Activity",
        weeklyProgress: "Weekly Progress",
        activitySummary: "Activity Summary",
        chart: {
          title: "Vocabulary Learned This Week",
          yAxis: "Vocabulary Words"
        },
        summary: {
          totalSessions: "Total Sessions",
          totalTime: "Total Time Spent",
          vocabularyMastered: "Vocabulary Mastered",
          grammarMastered: "Grammar Concepts Mastered"
        }
      },
      recommendations: {
        label: "Recommendations"
      },
      achievements: {
        label: "Achievements"
      }
    },
    simulatedData: {
      level: "intermediate",
      vocabularyMastered: 120,
      grammarMastered: 15,
      streakDays: 7,
      totalSessions: 25,
      totalTimeSpent: 7200,
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
        { title: '7-Day Streak', description: 'Practiced for 7 consecutive days', completed: true },
        { title: '100 Words Mastered', description: 'Learned 100 Spanish vocabulary words', completed: true },
        { title: 'Grammar Expert', description: 'Mastered 20 grammar concepts', completed: false, progress: 0.75 }
      ]
    }
  },
  sessionManager: {
    sessionTypes: [
      { value: 'general', label: 'General Learning', description: 'General Spanish learning session' },
      { value: 'vocabulary', label: 'Vocabulary Practice', description: 'Focus on vocabulary acquisition' },
      { value: 'grammar', label: 'Grammar Practice', description: 'Focus on grammar rules and usage' },
      { value: 'conversation', label: 'Conversation Practice', description: 'Practice speaking and listening skills' },
      { value: 'assessment', label: 'Skill Assessment', description: 'Evaluate current Spanish proficiency' }
    ],
    activityIcons: {
      context: 'info',
      query: 'question',
      response: 'text',
      question: 'lightbulb',
      error: 'error'
    },
    labels: {
      sessionControl: "Session Control",
      sessionType: "Session Type",
      lessonId: {
        label: "Lesson ID (Optional)",
        helper: "Enter specific lesson ID if available"
      },
      simulateActivity: {
        label: "Simulate Activity",
        tooltip: "For demo purposes only - generates simulated activities",
        on: "On",
        off: "Off"
      },
      buttons: {
        start: "Start Session",
        end: "End Session",
        cancel: "Cancel"
      },
      activeSession: {
        title: "Active Session",
        id: "ID: ",
        started: "Started: "
      },
      duration: {
        title: "Session Duration"
      },
      activityCount: {
        title: "Activity Count"
      },
      activity: {
        title: "Session Activity",
        noSession: {
          title: "No active session. Start a session to track learning activities.",
          description: "Sessions help maintain context across interactions and track progress."
        },
        count: " Activities",
        breakdown: "Activity Breakdown",
        noActivities: "No activities yet",
        timeline: "Activity Timeline",
        noActivitiesYet: "No activities yet. Interact with the system to generate activity.",
        logged: "Activity logged"
      },
      skillProgress: {
        title: "Skill Progress"
      },
      endDialog: {
        title: "End Learning Session?",
        message: "Are you sure you want to end this learning session? All progress will be saved."
      },
      errors: {
        startFailed: "Failed to start session: ",
        endFailed: "Failed to end session: "
      }
    }
  },
  app: {
    title: "Spanish Learning MCP",
    tabs: [
      { label: "Dashboard", color: "#2E3192" },
      { label: "Translation", color: "#FF9E1B" },
      { label: "Context", color: "#03A9F4" },
      { label: "MCP Flow", color: "#4CAF50" },
      { label: "Sessions", color: "#FF9800" },
      { label: "Progress", color: "#F44336" },
      { label: "API Explorer", color: "#9c27b0" }
    ],
    dashboard: {
      title: "Spanish Learning MCP Dashboard",
      welcome: "Welcome to the Spanish Learning MCP Demo. This interactive demo showcases how the Model Context Protocol enhances Spanish language learning through context-aware AI interactions.",
      features: {
        title: "Available Demo Features",
        descriptions: {
          translation: "Translate text between English and Spanish",
          context: "Visualize context generation for AI interactions",
          mcpFlow: "Interactive visualization of the MCP protocol flow",
          sessions: "Manage learning sessions and track activities",
          progress: "Track learning progress and skill development",
          apiExplorer: "Explore and test the MCP API endpoints"
        }
      }
    },
    session: {
      label: "Session: "
    },
    tooltips: {
      userProfile: "User Profile",
      backToLanding: "Back to Landing Page"
    },
    drawer: {
      backToHome: "Back to Home"
    },
    footer: {
      text: "Spanish Learning MCP Demo — Model Context Protocol Implementation"
    }
  },
  landingPage: {
    hero: {
      response: "RESPONSE"
    },
    contextTypes: {
      contextTypeLabel: "Context Type"
    },
    apiEndpoints: {
      sections: {
        mcp: {
          title: "MCP Protocol Endpoints",
          endpoints: {
            resources: {
              title: "POST /mcp/resources/list",
              description: "Lists available learning resources including vocabulary, grammar, and exercises."
            },
            resourceRead: {
              title: "POST /mcp/resources/read",
              description: "Reads specific learning resources with contextual metadata."
            },
            tools: {
              title: "POST /mcp/tools/call",
              description: "Executes learning tools like translation and conjugation with context."
            }
          }
        },
        tools: {
          title: "MCP Learning Tools",
          endpoints: {
            translator: {
              title: "spanish-translator",
              description: "Context-aware translation tool between English and Spanish."
            },
            conjugator: {
              title: "verb-conjugator",
              description: "Comprehensive Spanish verb conjugation with contextual examples."
            },
            assessor: {
              title: "skill-assessor",
              description: "Skill assessment tool with personalized learning recommendations."
            }
          }
        },
        session: {
          title: "Session Management Endpoints",
          endpoints: {
            start: {
              title: "POST /api/session/start",
              description: "Starts a new learning session with specified type and lesson parameters."
            },
            end: {
              title: "POST /api/session/end",
              description: "Ends an active learning session and saves progress data."
            },
            progress: {
              title: "GET /api/progress",
              description: "Retrieves detailed learning progress and analytics for the user."
            }
          }
        }
      }
    }
  }
}