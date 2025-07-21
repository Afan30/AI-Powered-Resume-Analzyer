const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const resumeRoutes = require('./Routes/resumeRoutes');
const jobRoutes = require('./Routes/jobRoutes');

dotenv.config();

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  dbName: 'Ai-Resume'
}).then(() => console.log(' MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  });

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/resumes', resumeRoutes);
app.use('/api/jobs', jobRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on http://localhost:${PORT}`));
