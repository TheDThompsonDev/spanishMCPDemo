require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY;
if (hasAnthropicKey) {
  console.log('✅ Anthropic API key found - Real AI translations enabled');
} else {
  console.log('⚠️  No Anthropic API key found - Using mock translations');
}


const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

const vocabularyData = {
  greeting: [
    {
      id: 'vocab_greeting_hola',
      word: 'hola',
      translation: 'hello',
      difficulty: 'beginner',
      pronunciation: '/ˈo.la/',
      phonetic: 'OH-lah',
      part_of_speech: 'interjection',
      gender: null,
      etymology: 'From Latin salūs ("health, greeting")',
      frequency: 'very_high',
      register: 'neutral',
      examples: [
        {
          spanish: '¡Hola! ¿Cómo estás?',
          english: 'Hello! How are you?',
          context: 'informal_greeting',
          notes: 'Most common greeting in Spanish'
        },
        {
          spanish: 'Hola, buenos días',
          english: 'Hello, good morning',
          context: 'polite_greeting',
          notes: 'Can be combined with time-specific greetings'
        }
      ],
      related_words: ['saludar', 'saludo', 'buenos días'],
      cultural_notes: 'Used universally across Spanish-speaking countries',
      common_mistakes: ['Confusing with "ola" (wave)', 'Overusing in formal contexts'],
      usage_tips: 'Appropriate for any time of day and any formality level'
    },
    {
      id: 'vocab_greeting_adios',
      word: 'adiós',
      translation: 'goodbye',
      difficulty: 'beginner',
      pronunciation: '/aˈðjos/',
      phonetic: 'ah-THYOHS',
      part_of_speech: 'interjection',
      gender: null,
      etymology: 'From "a Dios" meaning "to God"',
      frequency: 'very_high',
      register: 'neutral',
      examples: [
        {
          spanish: 'Adiós, nos vemos mañana',
          english: 'Goodbye, see you tomorrow',
          context: 'casual_farewell',
          notes: 'Standard farewell for temporary separation'
        },
        {
          spanish: 'Adiós, que tengas buen día',
          english: 'Goodbye, have a good day',
          context: 'polite_farewell',
          notes: 'Adding well-wishes makes it more polite'
        }
      ],
      related_words: ['hasta luego', 'hasta pronto', 'despedirse'],
      cultural_notes: 'More final than "hasta luego" - implies longer separation',
      common_mistakes: ['Using when you\'ll see the person soon', 'Pronunciation of "ós" ending'],
      usage_tips: 'Use when you won\'t see the person for a while'
    },
    {
      id: 'vocab_greeting_buenas_tardes',
      word: 'buenas tardes',
      translation: 'good afternoon',
      difficulty: 'beginner',
      pronunciation: '/ˈbwe.nas ˈtar.des/',
      phonetic: 'BWAY-nahs TAR-dehs',
      part_of_speech: 'phrase',
      gender: 'feminine_plural',
      etymology: 'Literally "good afternoons"',
      frequency: 'high',
      register: 'polite',
      examples: [
        {
          spanish: 'Buenas tardes, señora López',
          english: 'Good afternoon, Mrs. López',
          context: 'formal_greeting',
          notes: 'Used with titles shows respect'
        },
        {
          spanish: 'Buenas tardes a todos',
          english: 'Good afternoon everyone',
          context: 'group_greeting',
          notes: 'Common way to greet a group'
        }
      ],
      related_words: ['buenos días', 'buenas noches', 'tarde'],
      cultural_notes: 'Used approximately from 2 PM to 8 PM',
      common_mistakes: ['Using "buena" instead of "buenas"', 'Wrong time of day'],
      usage_tips: 'Always plural - "buenas" not "buena"'
    }
  ],
  verb: [
    {
      id: 'vocab_verb_hablar',
      word: 'hablar',
      translation: 'to speak',
      difficulty: 'beginner',
      pronunciation: '/aˈβlar/',
      phonetic: 'ah-BLAR',
      part_of_speech: 'verb',
      verb_type: 'regular_ar',
      etymology: 'From Latin fābulārī ("to speak, talk")',
      frequency: 'very_high',
      register: 'neutral',
      conjugation_pattern: 'regular',
      present_forms: {
        yo: 'hablo',
        tú: 'hablas',
        él: 'habla',
        nosotros: 'hablamos',
        vosotros: 'habláis',
        ellos: 'hablan'
      },
      examples: [
        {
          spanish: 'Yo hablo español todos los días',
          english: 'I speak Spanish every day',
          context: 'daily_routine',
          notes: 'Present tense for habitual actions'
        },
        {
          spanish: 'Ella habla muy bien inglés',
          english: 'She speaks English very well',
          context: 'ability_description',
          notes: 'Using adverbs to describe proficiency'
        }
      ],
      related_words: ['conversar', 'charlar', 'platicar', 'idioma'],
      cultural_notes: 'Most common verb for speaking - used across all regions',
      common_mistakes: ['Irregular conjugation assumption', 'Confused with "habitar"'],
      usage_tips: 'Can be followed by languages without preposition: "hablo español"'
    },
    {
      id: 'vocab_verb_comer',
      word: 'comer',
      translation: 'to eat',
      difficulty: 'beginner',
      pronunciation: '/koˈmer/',
      phonetic: 'koh-MEHR',
      part_of_speech: 'verb',
      verb_type: 'regular_er',
      etymology: 'From Latin comedere ("to eat up")',
      frequency: 'very_high',
      register: 'neutral',
      conjugation_pattern: 'regular',
      present_forms: {
        yo: 'como',
        tú: 'comes',
        él: 'come',
        nosotros: 'comemos',
        vosotros: 'coméis',
        ellos: 'comen'
      },
      examples: [
        {
          spanish: 'Voy a comer pasta esta noche',
          english: 'I\'m going to eat pasta tonight',
          context: 'future_plans',
          notes: 'Using "ir a" for near future'
        },
        {
          spanish: 'Comemos juntos todos los domingos',
          english: 'We eat together every Sunday',
          context: 'family_tradition',
          notes: 'Present tense for regular activities'
        }
      ],
      related_words: ['comida', 'almorzar', 'cenar', 'desayunar'],
      cultural_notes: 'Mealtimes vary significantly across Spanish-speaking countries',
      common_mistakes: ['Confusing with "como" (how/like)', 'Wrong meal time assumptions'],
      usage_tips: 'Can be used transitively (comer algo) or intransitively (solo comer)'
    }
  ],
  food: [
    {
      id: 'vocab_food_cafe',
      word: 'café',
      translation: 'coffee',
      difficulty: 'beginner',
      pronunciation: '/kaˈfe/',
      phonetic: 'kah-FEH',
      part_of_speech: 'noun',
      gender: 'masculine',
      plural: 'cafés',
      etymology: 'From Arabic qahwah via Turkish kahve',
      frequency: 'very_high',
      register: 'neutral',
      examples: [
        {
          spanish: 'Me gusta el café con leche',
          english: 'I like coffee with milk',
          context: 'preference_expression',
          notes: 'Using "gustar" with definite article'
        },
        {
          spanish: 'Un café, por favor',
          english: 'A coffee, please',
          context: 'ordering_drink',
          notes: 'Common phrase when ordering'
        }
      ],
      related_words: ['cafetería', 'cafeína', 'cafetal', 'barista'],
      cultural_notes: 'Coffee culture varies: strong espresso in Spain, sweeter in Latin America',
      common_mistakes: ['Feminine article usage', 'Assuming all coffee is the same'],
      regional_variants: {
        mexico: 'café de olla (with cinnamon)',
        colombia: 'tinto (black coffee)',
        spain: 'cortado (with a little milk)'
      },
      usage_tips: 'Masculine noun - "el café", "un café"'
    }
  ]
};

const grammarData = {
  verb_tense: [
    {
      id: 'grammar_present_tense',
      concept: 'Present Tense (Presente)',
      difficulty: 'beginner',
      category: 'verb_conjugation',
      explanation: 'Used for current actions, habitual actions, and general truths',
      detailed_rules: [
        'Regular -AR verbs: drop -ar, add -o, -as, -a, -amos, -áis, -an',
        'Regular -ER verbs: drop -er, add -o, -es, -e, -emos, -éis, -en',
        'Regular -IR verbs: drop -ir, add -o, -es, -e, -imos, -ís, -en'
      ],
      usage_contexts: [
        'Current actions: "Estoy estudiando" (I am studying)',
        'Habitual actions: "Trabajo todos los días" (I work every day)',
        'General truths: "El agua hierve a 100°C" (Water boils at 100°C)',
        'Future events: "Mañana viajo" (Tomorrow I travel)'
      ],
      examples: [
        {
          spanish: 'Yo hablo español',
          english: 'I speak Spanish',
          rule_applied: 'hablar (-ar) → habl + o',
          notes: 'First person singular regular -ar verb'
        },
        {
          spanish: 'Tú comes fruta',
          english: 'You eat fruit',
          rule_applied: 'comer (-er) → com + es',
          notes: 'Second person singular regular -er verb'
        },
        {
          spanish: 'Nosotros vivimos aquí',
          english: 'We live here',
          rule_applied: 'vivir (-ir) → viv + imos',
          notes: 'First person plural regular -ir verb'
        }
      ],
      irregular_verbs: ['ser', 'estar', 'ir', 'tener', 'hacer', 'decir'],
      common_mistakes: [
        'Assuming all verbs are regular',
        'Confusing -er and -ir endings',
        'Forgetting accent marks in vosotros forms'
      ],
      practice_tips: [
        'Start with regular verbs before tackling irregulars',
        'Practice with common daily activities',
        'Use time expressions to reinforce present tense usage'
      ]
    },
    {
      id: 'grammar_preterite_tense',
      concept: 'Preterite Tense (Pretérito)',
      difficulty: 'intermediate',
      category: 'verb_conjugation',
      explanation: 'Used for completed actions in the past with specific time frames',
      detailed_rules: [
        'Regular -AR verbs: add -é, -aste, -ó, -amos, -asteis, -aron',
        'Regular -ER/-IR verbs: add -í, -iste, -ió, -imos, -isteis, -ieron',
        'Many irregular verbs have unique stem changes'
      ],
      usage_contexts: [
        'Completed past actions: "Ayer estudié" (Yesterday I studied)',
        'Sequential past events: "Llegué, comí, dormí" (I arrived, ate, slept)',
        'Specific time references: "En 2020 viajé" (In 2020 I traveled)'
      ],
      examples: [
        {
          spanish: 'Yo hablé con María ayer',
          english: 'I spoke with María yesterday',
          rule_applied: 'hablar → hablé (regular -ar)',
          notes: 'Accent mark on first person singular'
        },
        {
          spanish: 'Tú comiste pizza anoche',
          english: 'You ate pizza last night',
          rule_applied: 'comer → comiste (regular -er)',
          notes: 'No accent mark on second person'
        }
      ],
      irregular_verbs: ['ser/ir (fue)', 'estar (estuvo)', 'tener (tuvo)', 'hacer (hizo)'],
      common_mistakes: [
        'Forgetting accent marks',
        'Confusing with imperfect tense',
        'Using wrong endings for -er/-ir verbs'
      ],
      practice_tips: [
        'Practice with specific time expressions',
        'Learn irregular verbs through repetition',
        'Contrast with imperfect to understand usage'
      ]
    }
  ],
  conjugation: [
    {
      id: 'grammar_ar_verbs',
      concept: 'Regular -AR Verbs',
      difficulty: 'beginner',
      category: 'verb_patterns',
      explanation: 'Most common verb type in Spanish, representing about 90% of all verbs',
      pattern_structure: {
        infinitive: 'verb + ar',
        stem: 'infinitive minus -ar',
        endings: {
          present: ['-o', '-as', '-a', '-amos', '-áis', '-an'],
          preterite: ['-é', '-aste', '-ó', '-amos', '-asteis', '-aron']
        }
      },
      examples: [
        {
          verb: 'hablar',
          conjugations: {
            present: ['hablo', 'hablas', 'habla', 'hablamos', 'habláis', 'hablan'],
            preterite: ['hablé', 'hablaste', 'habló', 'hablamos', 'hablasteis', 'hablaron']
          },
          usage_note: 'Most frequently used -ar verb'
        },
        {
          verb: 'estudiar',
          conjugations: {
            present: ['estudio', 'estudias', 'estudia', 'estudiamos', 'estudiáis', 'estudian'],
            preterite: ['estudié', 'estudiaste', 'estudió', 'estudiamos', 'estudiasteis', 'estudiaron']
          },
          usage_note: 'Common academic verb'
        }
      ],
      common_ar_verbs: [
        'hablar (to speak)', 'estudiar (to study)', 'trabajar (to work)',
        'caminar (to walk)', 'cocinar (to cook)', 'escuchar (to listen)',
        'mirar (to look)', 'comprar (to buy)', 'viajar (to travel)'
      ],
      memory_tips: [
        'Think "car" for -ar verbs - they\'re the most common',
        'Present tense: only "yo" and "él/ella" forms are irregular in stress',
        'Preterite: watch out for accent marks on "yo" and "él/ella"'
      ],
      common_mistakes: [
        'Using -er/-ir endings with -ar verbs',
        'Forgetting accent marks in preterite',
        'Assuming all -ar verbs are regular (some have stem changes)'
      ]
    }
  ]
};

function generateContextContent(contextType, categories = [], difficultyLevel = 'beginner', maxItems = 5) {
  let content = `# Spanish ${contextType.charAt(0).toUpperCase() + contextType.slice(1)} Reference\n\n`;
  
  if (contextType === 'vocabulary' || contextType === 'mixed') {
    const vocabCategories = categories.length > 0 ? categories : Object.keys(vocabularyData);
    
    vocabCategories.forEach(category => {
      if (vocabularyData[category]) {
        content += `## ${category.charAt(0).toUpperCase() + category.slice(1)}\n\n`;
        
        const items = vocabularyData[category]
          .filter(item => item.difficulty === difficultyLevel || difficultyLevel === 'mixed')
          .slice(0, Math.ceil(maxItems / vocabCategories.length));
        
        items.forEach(item => {
          content += `### ${item.word}\n`;
          content += `- **Translation:** ${item.translation}\n`;
          content += `- **Difficulty:** ${item.difficulty}\n`;
          
          if (item.pronunciation) {
            content += `- **Pronunciation:** ${item.pronunciation}\n`;
          }
          if (item.part_of_speech) {
            content += `- **Part of Speech:** ${item.part_of_speech}\n`;
          }
          if (item.frequency) {
            content += `- **Frequency:** ${item.frequency}\n`;
          }
          
          content += `\n**Examples:**\n`;
          item.examples.forEach(example => {
            if (typeof example === 'string') {
              content += `- ${example}\n`;
            } else if (example && example.spanish && example.english) {
              content += `- **Spanish:** ${example.spanish}\n`;
              content += `  **English:** ${example.english}\n`;
              if (example.context) {
                content += `  **Context:** ${example.context}\n`;
              }
              if (example.notes) {
                content += `  **Notes:** ${example.notes}\n`;
              }
              content += `\n`;
            }
          });
          
          if (item.cultural_notes) {
            content += `**Cultural Notes:** ${item.cultural_notes}\n\n`;
          }
          if (item.usage_tips) {
            content += `**Usage Tips:** ${item.usage_tips}\n\n`;
          }
          if (item.common_mistakes && item.common_mistakes.length > 0) {
            content += `**Common Mistakes:**\n`;
            item.common_mistakes.forEach(mistake => {
              content += `- ${mistake}\n`;
            });
            content += `\n`;
          }
        });
      }
    });
  }
  
  if (contextType === 'grammar' || contextType === 'mixed') {
    const grammarCategories = categories.length > 0 ? categories : Object.keys(grammarData);
    
    grammarCategories.forEach(category => {
      if (grammarData[category]) {
        content += `## ${category.replace('_', ' ').charAt(0).toUpperCase() + category.replace('_', ' ').slice(1)}\n\n`;
        
        const items = grammarData[category].slice(0, Math.ceil(maxItems / grammarCategories.length));
        
        items.forEach(item => {
          content += `### ${item.concept}\n`;
          content += `${item.explanation}\n\n`;
          
          // Handle enhanced grammar data structure
          if (item.detailed_rules && item.detailed_rules.length > 0) {
            content += `**Rules:**\n`;
            item.detailed_rules.forEach(rule => {
              content += `- ${rule}\n`;
            });
            content += `\n`;
          }
          
          if (item.usage_contexts && item.usage_contexts.length > 0) {
            content += `**Usage Contexts:**\n`;
            item.usage_contexts.forEach(context => {
              content += `- ${context}\n`;
            });
            content += `\n`;
          }
          
          content += `**Examples:**\n`;
          item.examples.forEach(example => {
            // Handle both old string format and new object format
            if (typeof example === 'string') {
              content += `- ${example}\n`;
            } else if (example && example.spanish && example.english) {
              content += `- **Spanish:** ${example.spanish}\n`;
              content += `  **English:** ${example.english}\n`;
              if (example.rule_applied) {
                content += `  **Rule:** ${example.rule_applied}\n`;
              }
              if (example.notes) {
                content += `  **Notes:** ${example.notes}\n`;
              }
              content += `\n`;
            }
          });
          
          if (item.common_mistakes && item.common_mistakes.length > 0) {
            content += `**Common Mistakes:**\n`;
            item.common_mistakes.forEach(mistake => {
              content += `- ${mistake}\n`;
            });
            content += `\n`;
          }
          
          if (item.practice_tips && item.practice_tips.length > 0) {
            content += `**Practice Tips:**\n`;
            item.practice_tips.forEach(tip => {
              content += `- ${tip}\n`;
            });
            content += `\n`;
          }
        });
      }
    });
  }
  
  if (contextType === 'conversation') {
    content += `## Common Phrases\n\n`;
    content += `### Restaurant Ordering\n`;
    content += `- **Spanish:** Me gustaría pedir un café, por favor.\n`;
    content += `- **English:** I would like to order a coffee, please.\n\n`;
    content += `### Greetings\n`;
    content += `- **Spanish:** Buenos días, ¿cómo está usted?\n`;
    content += `- **English:** Good morning, how are you?\n\n`;
  }
  
  return content;
}

// MCP Protocol Endpoints
// List available models
app.get('/mcp/models', (req, res) => {
  res.json({
    object: "model_list",
    data: [
      {
        id: "spanish-learning-model",
        name: "Spanish Learning Model",
        version: "1.0.0",
        capabilities: {
          context_window: 16000,
          supports_context_manipulation: true,
          supports_streaming: false,
          supported_context_types: [
            "vocabulary", "grammar", "mixed", "conversation",
            "exercise", "assessment", "personalized"
          ]
        }
      }
    ],
    server_version: "1.0.0"
  });
});

//Context manipulation
app.post('/mcp/context', (req, res) => {
  const { 
    context_type = 'mixed', 
    operation = 'get', 
    categories = [], 
    difficulty_level = 'beginner',
    max_items = 5 
  } = req.body;
  
  const content = generateContextContent(context_type, categories, difficulty_level, max_items);
  setTimeout(() => {
    res.json({
      object: "context",
      content: content,
      metadata: {
        type: context_type,
        source: "spanish-learning-mcp",
        token_count: Math.round(content.length / 4),
        categories: categories,
        difficulty_level: difficulty_level,
        max_items: max_items
      }
    });
  }, Math.random() * 500 + 200); // 200-700ms delay
});

//Generate text with context using Claude AI
app.post('/mcp/generate', async (req, res) => {
  const { prompt, context_type = 'mixed', model = 'spanish-learning-model' } = req.body;
  
  let generatedText = prompt;
  let aiGenerated = false;
  if (hasAnthropicKey) {
    try {
      console.log(`🤖 Using Claude AI for MCP generation: "${prompt}"`);
      const contextContent = generateContextContent(context_type, [], 'beginner', 5);
      
      const systemPrompt = `You are an expert Spanish language teacher and AI assistant specialized in Spanish learning. You help users with translations, grammar explanations, vocabulary, and language learning guidance.

Learning Context:
${contextContent}

Guidelines:
- Provide accurate and educational responses
- For translations, be natural and culturally appropriate
- Explain grammar concepts clearly when asked
- Provide examples and context when helpful
- Keep responses concise but informative
- Use the learning context to inform your responses`;

      const message = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 300,
        temperature: 0.4,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      });
      
      generatedText = message.content[0].text.trim();
      aiGenerated = true;
      console.log(`✅ Claude generation successful`);
      
    } catch (error) {
      console.error('❌ Claude API error:', error.message);
    }
  }
  
  if (!aiGenerated) {
    console.log(`📝 Using fallback generation for: "${prompt}"`);
    
    if (prompt.toLowerCase().includes('translate to spanish')) {
      const textToTranslate = prompt.replace(/translate to spanish:?\s*/i, '').trim();
      
      const translations = {
        'hello': 'hola',
        'how are you': '¿cómo estás?',
        'goodbye': 'adiós',
        'thank you': 'gracias',
        'please': 'por favor',
        'i would like to order a coffee, please': 'me gustaría pedir un café, por favor',
        'good morning': 'buenos días',
        'good afternoon': 'buenas tardes',
        'good evening': 'buenas noches'
      };
      
      generatedText = translations[textToTranslate.toLowerCase()] || `[Translation of: ${textToTranslate}]`;
    }
  }
  const delay = aiGenerated ? Math.random() * 2000 + 1000 : Math.random() * 1000 + 500;
  
  setTimeout(() => {
    res.json({
      object: "generation",
      model: aiGenerated ? 'claude-3-5-sonnet' : model,
      choices: [
        {
          text: generatedText,
          finish_reason: "stop"
        }
      ],
      usage: {
        prompt_tokens: Math.round(prompt.length / 4),
        completion_tokens: Math.round(generatedText.length / 4),
        total_tokens: Math.round((prompt.length + generatedText.length) / 4)
      },
      session_id: req.headers['session-id'] || 'demo_session',
      aiGenerated: aiGenerated
    });
  }, delay);
});

// Spanish Learning API Endpoints
// Real AI Translation with Claude
app.post('/api/translate', async (req, res) => {
  const { text, targetLanguage, userId, sessionId, contextType = 'mixed' } = req.body;
  const fallbackTranslations = {
    spanish: {
      'hello': 'hola',
      'how are you': '¿cómo estás?',
      'goodbye': 'adiós',
      'thank you': 'gracias',
      'please': 'por favor',
      'hello, how are you?': 'hola, ¿cómo estás?',
      'i would like to order a coffee, please': 'me gustaría pedir un café, por favor',
      'good morning': 'buenos días',
      'what is your name?': '¿cómo te llamas?',
      'my name is': 'me llamo',
      'nice to meet you': 'mucho gusto'
    },
    english: {
      'hola': 'hello',
      '¿cómo estás?': 'how are you?',
      'adiós': 'goodbye',
      'gracias': 'thank you',
      'por favor': 'please',
      'me gustaría pedir un café, por favor': 'i would like to order a coffee, please',
      'buenos días': 'good morning'
    }
  };
  
  let translatedText = null;
  let aiGenerated = false;
  if (hasAnthropicKey) {
    try {
      console.log(`🤖 Using Claude AI for translation: "${text}" -> ${targetLanguage}`);
      const contextContent = generateContextContent(contextType, [], 'beginner', 3);
      
      const systemPrompt = `You are an expert Spanish language teacher and translator. Your task is to provide accurate, natural translations between English and Spanish.

Context for better translation:
${contextContent}

Guidelines:
- Provide natural, conversational translations
- Consider cultural context and appropriate formality levels
- For Spanish translations, include proper accents and punctuation
- Keep the tone and intent of the original text
- If multiple translations are possible, choose the most common/natural one
- Respond with ONLY the translation, no explanations or additional text`;

      const userPrompt = `Translate this text to ${targetLanguage}:\n\n"${text}"`;
      
      const message = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 200,
        temperature: 0.3,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: userPrompt
          }
        ]
      });
      
      translatedText = message.content[0].text.trim();
      aiGenerated = true;
      console.log(`✅ Claude translation successful: "${translatedText}"`);
      
    } catch (error) {
      console.error('❌ Claude API error:', error.message);
    }
  }
  
  if (!translatedText) {
    console.log(`📝 Using fallback translation for: "${text}"`);
    const targetTranslations = fallbackTranslations[targetLanguage] || {};
    translatedText = targetTranslations[text.toLowerCase()] || `[${targetLanguage === 'spanish' ? 'Spanish' : 'English'} translation of: ${text}]`;
  }
  
  const delay = aiGenerated ? Math.random() * 2000 + 1000 : Math.random() * 800 + 300;
  
  setTimeout(() => {
    res.json({
      originalText: text,
      translatedText: translatedText,
      targetLanguage: targetLanguage,
      sourceLanguage: targetLanguage === 'spanish' ? 'english' : 'spanish',
      userId: userId,
      sessionId: sessionId || 'demo_session',
      aiGenerated: aiGenerated,
      model: aiGenerated ? 'claude-3-5-sonnet' : 'fallback',
      contextType: contextType
    });
  }, delay);
});

app.post('/api/conjugate', (req, res) => {
  const { verb, tense, userId, sessionId } = req.body;
  
  const conjugations = {
    'hablar': {
      present: 'yo hablo\ntú hablas\nél/ella/usted habla\nnosotros/as hablamos\nvosotros/as habláis\nellos/ellas/ustedes hablan',
      preterite: 'yo hablé\ntú hablaste\nél/ella/usted habló\nnosotros/as hablamos\nvosotros/as hablasteis\nellos/ellas/ustedes hablaron'
    },
    'comer': {
      present: 'yo como\ntú comes\nél/ella/usted come\nnosotros/as comemos\nvosotros/as coméis\nellos/ellas/ustedes comen',
      preterite: 'yo comí\ntú comiste\nél/ella/usted comió\nnosotros/as comimos\nvosotros/as comisteis\nellos/ellas/ustedes comieron'
    },
    'vivir': {
      present: 'yo vivo\ntú vives\nél/ella/usted vive\nnosotros/as vivimos\nvosotros/as vivís\nellos/ellas/ustedes viven',
      preterite: 'yo viví\ntú viviste\nél/ella/usted vivió\nnosotros/as vivimos\nvosotros/as vivisteis\nellos/ellas/ustedes vivieron'
    }
  };
  
  const conjugation = conjugations[verb.toLowerCase()]?.[tense] || `[Conjugation of ${verb} in ${tense} tense]`;
  
  setTimeout(() => {
    res.json({
      verb: verb,
      tense: tense,
      conjugation: conjugation,
      userId: userId,
      sessionId: sessionId || 'demo_session'
    });
  }, Math.random() * 600 + 200);
});

//Spanish Learning Q&A with Claude AI
app.post('/api/query', async (req, res) => {
  const { query, contextType = 'mixed', userId, sessionId } = req.body;
  const fallbackResponses = {
    'what is the difference between ser and estar': 'In Spanish, both "ser" and "estar" mean "to be" in English, but they are used in different contexts. "Ser" is used for permanent or inherent characteristics, while "estar" is used for temporary states or conditions.',
    'how do you conjugate regular ar verbs': 'Regular -ar verbs are conjugated by removing the -ar ending and adding: -o, -as, -a, -amos, -áis, -an for present tense.',
    'what are some common greetings': 'Common Spanish greetings include: Hola (Hello), Buenos días (Good morning), Buenas tardes (Good afternoon), Buenas noches (Good evening/night).',
    'how do you say hello in spanish': 'You say "Hola" for hello in Spanish. It\'s the most common and universal greeting.'
  };
  
  let response = null;
  let aiGenerated = false;
  if (hasAnthropicKey) {
    try {
      console.log(`🤖 Using Claude AI for query: "${query}"`);
      const contextContent = generateContextContent(contextType, [], 'beginner', 5);
      const systemPrompt = `You are an expert Spanish language teacher. Answer questions about Spanish language learning, grammar, vocabulary, culture, and usage. Provide clear, educational responses that help students learn.

Learning Context:
${contextContent}

Guidelines:
- Provide accurate, helpful information about Spanish language learning
- Explain concepts clearly with examples when appropriate
- Be encouraging and supportive
- Use the learning context to inform your responses
- Keep responses educational but concise
- Include Spanish examples with English translations when helpful`;

      const message = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 400,
        temperature: 0.4,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: query
          }
        ]
      });
      
      response = message.content[0].text.trim();
      aiGenerated = true;
      console.log(`✅ Claude query response successful`);
      
    } catch (error) {
      console.error('❌ Claude API error:', error.message);
    }
  }
  if (!response) {
    console.log(`📝 Using fallback response for query: "${query}"`);
    response = fallbackResponses[query.toLowerCase()] || 'I\'m sorry, I don\'t have specific information about that topic. Try asking about Spanish grammar, vocabulary, or common phrases.';
  }
  const delay = aiGenerated ? Math.random() * 2000 + 1000 : Math.random() * 1200 + 400;
  
  setTimeout(() => {
    res.json({
      query: query,
      response: response,
      contextType: contextType,
      userId: userId,
      sessionId: sessionId || 'demo_session',
      aiGenerated: aiGenerated,
      model: aiGenerated ? 'claude-3-5-sonnet' : 'fallback'
    });
  }, delay);
});

const sessions = new Map();
app.post('/api/session/start', (req, res) => {
  const { type, lessonId } = req.body;
  const userId = req.headers['user-id'];
  
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const session = {
    sessionId,
    userId,
    type,
    lessonId,
    startTime: new Date().toISOString(),
    activities: [],
    status: 'active'
  };
  
  sessions.set(sessionId, session);
  
  setTimeout(() => {
    res.json({
      sessionId,
      type,
      startTime: session.startTime,
      status: 'started'
    });
  }, 200);
});
app.post('/api/session/end', (req, res) => {
  const { sessionId } = req.body;
  const userId = req.headers['user-id'];
  
  const session = sessions.get(sessionId);
  
  if (session && session.userId === userId) {
    session.endTime = new Date().toISOString();
    session.status = 'completed';
    
    const score = Math.round(Math.random() * 30 + 70); // 70-100
    session.score = score;
    
    setTimeout(() => {
      res.json({
        sessionId,
        endTime: session.endTime,
        score: score,
        status: 'ended'
      });
    }, 300);
  } else {
    res.status(404).json({ error: 'Session not found' });
  }
});

app.get('/api/session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const userId = req.headers['user-id'];
  
  const session = sessions.get(sessionId);
  
  if (session && session.userId === userId) {
    res.json({ session });
  } else {
    res.status(404).json({ error: 'Session not found' });
  }
});

app.get('/api/progress', (req, res) => {
  const userId = req.headers['user-id'];

  const progress = {
    level: "intermediate",
    vocabularyMastered: Math.floor(Math.random() * 50) + 100,
    grammarMastered: Math.floor(Math.random() * 10) + 15,
    streakDays: Math.floor(Math.random() * 20) + 5,
    totalSessions: Math.floor(Math.random() * 30) + 20,
    totalTimeSpent: Math.floor(Math.random() * 3600) + 7200,
    accuracy: Math.floor(Math.random() * 20) + 75,
    skillLevels: {
      vocabulary: Math.random() * 0.4 + 0.5,
      grammar: Math.random() * 0.4 + 0.4,
      listening: Math.random() * 0.4 + 0.3,
      speaking: Math.random() * 0.4 + 0.2,
      reading: Math.random() * 0.4 + 0.6,
      writing: Math.random() * 0.4 + 0.4
    }
  };
  
  setTimeout(() => {
    res.json({ progress });
  }, Math.random() * 800 + 500);
});

app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'build', 'index.html');
  console.log('Serving index.html from:', indexPath);
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(500).send('Error loading application');
    }
  });
});

app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message
  });
});

app.listen(PORT, (err) => {
  if (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
  console.log(`🚀 Spanish Learning MCP Server running on port ${PORT}`);
  console.log(`📚 Demo frontend available at http://localhost:${PORT}`);
  console.log(`🔗 MCP API endpoints available at http://localhost:${PORT}/mcp/*`);
  console.log(`🎯 Spanish Learning API endpoints available at http://localhost:${PORT}/api/*`);
  console.log(`📁 Serving static files from: ${path.join(__dirname, 'build')}`);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

