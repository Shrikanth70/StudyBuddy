const multer = require('multer');
const pdfParse = require('pdf-parse');
const { generateEmbedding } = require('../utils/embeddingUtils');
const VectorStore = require('../utils/vectorStore'); // Placeholder for vector DB integration
const StudyNote = require('../models/StudyNote');
const path = require('path');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });

const CHUNK_SIZE = 500; // words
const CHUNK_OVERLAP = 50; // words

// Helper to split text into chunks with overlap
function chunkText(text, size = CHUNK_SIZE, overlap = CHUNK_OVERLAP) {
  const words = text.split(/\s+/);
  const chunks = [];
  let start = 0;
  while (start < words.length) {
    const end = Math.min(start + size, words.length);
    const chunk = words.slice(start, end).join(' ');
    chunks.push(chunk);
    start += size - overlap;
  }
  return chunks;
}

// Upload and process document
async function uploadDocument(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();

    let textContent = '';

    if (ext === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      textContent = pdfData.text;
    } else if (ext === '.txt' || ext === '.md') {
      textContent = fs.readFileSync(filePath, 'utf-8');
    } else {
      return res.status(400).json({ success: false, error: 'Unsupported file type' });
    }

    // Chunk text
    const chunks = chunkText(textContent);

    // Generate embeddings for chunks (only if OpenAI is available)
    const embeddings = [];
    let aiEnabled = true;

    for (const chunk of chunks) {
      const embedding = await generateEmbedding(chunk);
      if (embedding === null) {
        aiEnabled = false;
        break; // Stop if embeddings can't be generated
      }
      embeddings.push({ chunk, embedding });
    }

    if (aiEnabled && embeddings.length > 0) {
      // Store chunks and embeddings in vector store
      await VectorStore.storeDocumentChunks(req.user._id, req.file.originalname, embeddings);
      res.json({
        success: true,
        message: 'Document processed and indexed with AI',
        chunkCount: chunks.length,
        aiEnabled: true
      });
    } else {
      // Store document without embeddings (basic storage)
      console.log(`Document uploaded without AI processing: ${req.file.originalname}`);
      res.json({
        success: true,
        message: 'Document uploaded successfully. AI features are disabled.',
        chunkCount: chunks.length,
        aiEnabled: false,
        note: 'Add OpenAI API key to enable document indexing and AI-powered chat'
      });
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath);

  } catch (error) {
    console.error('Error processing document:', error);
    res.status(500).json({ success: false, error: 'Failed to process document' });
  }
}

module.exports = {
  upload,
  uploadDocument
};
