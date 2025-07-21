const express = require('express');
const axios = require('axios');
const Job = require('../Models/Job');
const Resume = require('../Models/Resume');
const Match = require('../Models/Match');

const router = express.Router();

// ✅ Cosine similarity function
function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
  return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0;
}

// ✅ Create Job API
router.post('/create', async (req, res) => {
  try {
    const { title, description, postedBy } = req.body;

    // ✅ Get Embedding from Gemini
    const embeddingRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key=${process.env.GOOGLE_AI_KEY}`,
      {
        content: { parts: [{ text: description }] }
      }
    );

    const vector = embeddingRes.data.embedding.values;

    const job = new Job({ title, description, postedBy, vector });
    await job.save();

    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Match Candidates API
router.get('/:jobId/match', async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job || !job.vector.length) {
      return res.status(404).json({ error: 'Job or job vector not found' });
    }

    const resumes = await Resume.find();
    if (!resumes.length) {
      return res.status(404).json({ error: 'No resumes found' });
    }

    const matches = [];

    for (const resume of resumes) {
      if (resume.vector.length) {
        const score = cosineSimilarity(job.vector, resume.vector);
        matches.push({ resumeId: resume._id, score });

        // ✅ Save match in DB
        await Match.create({ jobId, resumeId: resume._id, score });
      }
    }

    // ✅ Sort matches by score (highest first)
    matches.sort((a, b) => b.score - a.score);

    res.json({ success: true, matches });
  } catch (err) {
    console.error('Match Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ postedAt: -1 }); // latest first
    res.json({ success: true, jobs });
  } catch (err) {
    console.error('Error fetching jobs:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
