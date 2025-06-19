require('./instrumentation.js');

const express = require('express');
const { rollDice } = require('./dice');
const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');

// Optional: show internal OTel diagnostics
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  console.log('📥 GET /');
  res.send('🎲 Welcome to the Dice API!');
});

app.get('/roll', (req, res) => {
  const sides = parseInt(req.query.sides) || 6;
  const result = rollDice(sides);
  console.log(`🎲 Rolled a D${sides} → ${result}`);
  res.json({ sides, result });
});

app.listen(port, () => {
  console.log(`🚀 Dice app running at http://localhost:${port}`);
});