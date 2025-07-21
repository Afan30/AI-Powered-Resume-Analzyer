const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const axios = require('axios');
const Resume = require('../Models/Resume');
const Job = require('../Models/Job');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// ✅ Function: Call Gemini API with Retry
const getEmbeddingFromGemini = async (text) => {
  if (!text || text.trim().length === 0) throw new Error("Resume text is empty.");
  
  const payload = { content: { parts: [{ text }] } };
  const url = `https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key=${process.env.GOOGLE_AI_KEY}`;

  let attempts = 0;
  while (attempts < 3) {
    try {
      const response = await axios.post(url, payload);
      return response.data.embedding.values;
    } catch (error) {
      attempts++;
      console.error(`Gemini API error (attempt ${attempts}):`, error.response?.data || error.message);
      if (attempts >= 3) throw new Error("Gemini API failed after 3 attempts.");
    }
  }
};

// ✅ Upload Resume API
router.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    console.log('Incoming File:', req.file);
    const buffer = fs.readFileSync(req.file.path);
    const parsed = await pdfParse(buffer);
    console.log('Parsed text length:', parsed.text.length);

    // ✅ Get Embedding (with error handling)
    let vector = [];
    try {
      vector = await getEmbeddingFromGemini(parsed.text);
    } catch (err) {
      console.warn("Gemini API failed, saving resume without embedding.");
    }

    // ✅ Save Resume in MongoDB
    const resume = new Resume({
      name: req.body.name,
      email: req.body.email,
      originalFileName: req.file.originalname,
      parsedText: parsed.text,
      vector
    });

    await resume.save();
    res.json({ success: true, message: vector.length ? "Resume uploaded with embedding" : "Resume uploaded without embedding", resume });
  } catch (err) {
    console.error('Upload Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Optimize Resume API
router.post('/optimize', async (req, res) => {
  try {
    const { resumeId, jobId } = req.body;
    const resume = await Resume.findById(resumeId);
    const job = await Job.findById(jobId);

    if (!resume || !job) return res.status(404).json({ error: 'Resume or Job not found' });

    const GEMINI_MODEL = 'gemini-1.5-flash'; // or gemini-1.5-pro
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GOOGLE_AI_KEY}`;

    const response = await axios.post(GEMINI_URL, {
      contents: [
        {
          parts: [
            {
              text: `
                Improve this resume to match the job description:
                Job: ${job.description}
                Resume: ${resume.parsedText}
              `
            }
          ]
        }
      ]
    });

    const optimizedText =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'AI failed to optimize resume.';

    res.json({ success: true, optimizedText });
  } catch (err) {
    console.error('Optimize Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get All Resumes API
router.get('/', async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ uploadedAt: -1 }); // latest first
    res.json({ success: true, resumes });
  } catch (err) {
    console.error('Error fetching resumes:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
