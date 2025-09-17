// Placeholder vector store implementation
// In production, replace with Pinecone, Weaviate, or similar

const fs = require('fs');
const path = require('path');

const VECTOR_STORE_FILE = path.join(__dirname, '../data/vectorStore.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(VECTOR_STORE_FILE))) {
  fs.mkdirSync(path.dirname(VECTOR_STORE_FILE), { recursive: true });
}

// Load existing vector store
let vectorStore = {};
try {
  if (fs.existsSync(VECTOR_STORE_FILE)) {
    vectorStore = JSON.parse(fs.readFileSync(VECTOR_STORE_FILE, 'utf-8'));
  }
} catch (error) {
  console.error('Error loading vector store:', error);
  vectorStore = {};
}

// Cosine similarity calculation
function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (normA * normB);
}

class VectorStore {
  static async storeDocumentChunks(userId, documentName, chunksWithEmbeddings) {
    if (!vectorStore[userId]) {
      vectorStore[userId] = {};
    }

    const docId = `${documentName}_${Date.now()}`;
    vectorStore[userId][docId] = {
      documentName,
      chunks: chunksWithEmbeddings.map((item, index) => ({
        id: `${docId}_chunk_${index}`,
        content: item.chunk,
        embedding: item.embedding,
        index
      })),
      createdAt: new Date().toISOString()
    };

    // Save to file
    fs.writeFileSync(VECTOR_STORE_FILE, JSON.stringify(vectorStore, null, 2));
    return docId;
  }

  static async searchSimilar(userId, queryEmbedding, topK = 5) {
    if (!vectorStore[userId]) {
      return [];
    }

    const results = [];

    for (const [docId, docData] of Object.entries(vectorStore[userId])) {
      for (const chunk of docData.chunks) {
        const similarity = cosineSimilarity(queryEmbedding, chunk.embedding);
        results.push({
          id: chunk.id,
          content: chunk.content,
          similarity,
          documentName: docData.documentName,
          docId
        });
      }
    }

    // Sort by similarity and return top K
    results.sort((a, b) => b.similarity - a.similarity);
    return results.slice(0, topK);
  }

  static async getUserDocuments(userId) {
    if (!vectorStore[userId]) {
      return [];
    }

    return Object.entries(vectorStore[userId]).map(([docId, docData]) => ({
      id: docId,
      name: docData.documentName,
      chunkCount: docData.chunks.length,
      createdAt: docData.createdAt
    }));
  }

  static async deleteDocument(userId, docId) {
    if (vectorStore[userId] && vectorStore[userId][docId]) {
      delete vectorStore[userId][docId];
      fs.writeFileSync(VECTOR_STORE_FILE, JSON.stringify(vectorStore, null, 2));
      return true;
    }
    return false;
  }
}

module.exports = VectorStore;
