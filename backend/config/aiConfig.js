const OpenAI = require('openai');

// Initialize OpenAI client with error handling
let openai;
try {
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here') {
        openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
        console.log('✅ OpenAI client initialized successfully');
    } else {
        console.log('⚠️  OpenAI API key not provided. AI features will be disabled.');
        openai = null;
    }
} catch (error) {
    console.error('❌ Error initializing OpenAI client:', error.message);
    openai = null;
}

// AI Configuration
const aiConfig = {
    model: 'gpt-3.5-turbo',
    maxTokens: 1000,
    temperature: 0.7,
    systemPrompt: `You are StudyBuddy AI, a friendly and knowledgeable learning assistant. Your role is to help students understand concepts, provide study guidance, and support their learning journey. You should:

1. Be encouraging and supportive
2. Break down complex concepts into simple terms
3. Provide practical examples and analogies
4. Suggest study techniques and strategies
5. Offer step-by-step explanations
6. Recommend additional resources when appropriate
7. Adapt explanations based on the student's level
8. Ask clarifying questions to better understand needs

Always maintain a positive, patient, and helpful tone. Focus on helping students truly understand concepts rather than just memorizing facts.`
};

// Generate AI response with fallback
const generateAIResponse = async (message, context = [], userProfile = {}, retrievedContext = []) => {
  if (!openai) {
    return {
      message: "AI features are currently disabled. Please add your OpenAI API key to the .env file to enable AI assistance.",
      metadata: {
        model: 'disabled',
        tokensUsed: 0,
        confidence: 0,
        suggestedTopics: [],
        followUpQuestions: [],
        error: "OpenAI API key not configured"
      }
    };
  }

  try {
    // Build system prompt with retrieved context
    let systemPrompt = aiConfig.systemPrompt;

    if (retrievedContext && retrievedContext.length > 0) {
      systemPrompt += "\n\nRelevant context from your knowledge base:\n";
      retrievedContext.forEach((chunk, index) => {
        systemPrompt += `[${index + 1}] ${chunk.content} (Source: ${chunk.documentName})\n`;
      });
      systemPrompt += "\nUse this context to provide accurate, detailed answers. Cite sources when referencing specific information.";
    } else {
      systemPrompt += "\n\nNo relevant context found in your knowledge base. Answer based on general knowledge and suggest uploading relevant materials.";
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      ...context.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.message
      })),
      { role: 'user', content: message }
    ];

    const response = await openai.chat.completions.create({
      model: aiConfig.model,
      messages: messages,
      max_tokens: aiConfig.maxTokens,
      temperature: aiConfig.temperature,
    });

    return {
      message: response.choices[0].message.content,
      metadata: {
        model: aiConfig.model,
        tokensUsed: response.usage.total_tokens,
        confidence: 0.9,
        suggestedTopics: extractSuggestedTopics(response.choices[0].message.content),
        followUpQuestions: extractFollowUpQuestions(response.choices[0].message.content),
        retrievedContext: retrievedContext.map(chunk => ({
          content: chunk.content,
          documentName: chunk.documentName,
          similarity: chunk.similarity
        }))
      }
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);

    // Provide helpful error messages
    let errorMessage = "I'm having trouble connecting to the AI service. ";
    if (error.status === 401) {
      errorMessage += "Please check your OpenAI API key in the .env file.";
    } else if (error.status === 429) {
      errorMessage += "Rate limit exceeded. Please try again later.";
    } else {
      errorMessage += "Please try again or contact support if the issue persists.";
    }

    return {
      message: errorMessage,
      metadata: {
        model: aiConfig.model,
        tokensUsed: 0,
        confidence: 0,
        suggestedTopics: [],
        followUpQuestions: [],
        error: error.message
      }
    };
  }
};

// Helper function to extract suggested topics
function extractSuggestedTopics(response) {
    const topics = [];
    const topicKeywords = ['learn', 'study', 'understand', 'concept', 'topic', 'subject'];
    
    topicKeywords.forEach(keyword => {
        if (response.toLowerCase().includes(keyword)) {
            topics.push(`Explore ${keyword} further`);
        }
    });
    
    return topics.slice(0, 3);
}

// Helper function to extract follow-up questions
function extractFollowUpQuestions(response) {
    return [
        "Would you like me to explain this in more detail?",
        "Can you tell me more about what you're studying?",
        "Would you like to see some practice problems?"
    ];
}

module.exports = {
    generateAIResponse,
    aiConfig,
    isAIEnabled: () => !!openai
};
