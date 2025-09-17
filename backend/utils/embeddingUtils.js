const { OpenAI } = require('openai');

let openai = null;

// Initialize OpenAI client only if API key is provided
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
} else {
  console.warn('⚠️  OpenAI API key not provided. AI features will be disabled.');
}

async function generateEmbedding(text) {
  if (!openai) {
    console.warn('OpenAI client not initialized. Skipping embedding generation.');
    return null;
  }

  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

async function generateQueryEmbedding(query) {
  return await generateEmbedding(query);
}

module.exports = {
  generateEmbedding,
  generateQueryEmbedding
};
