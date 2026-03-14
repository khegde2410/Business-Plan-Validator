require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // Assuming node-fetch is installed, but since it's not in package.json, might need to add

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.post('/api/validate', async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    return res.status(500).json({ error: 'Anthropic API key not configured. Please set ANTHROPIC_API_KEY in your .env file.' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', response.status, errorText);
      throw new Error(`Anthropic API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error proxying to Anthropic:', error);
    res.status(500).json({ error: 'Failed to process validation request.' });
  }
});

app.get('/api/health', (req, res) => {
  const apiKeyConfigured = process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'YOUR_API_KEY_HERE';
  res.json({ status: 'ok', apiKeyConfigured });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API key configured: ${process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'YOUR_API_KEY_HERE' ? 'Yes' : 'No'}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});