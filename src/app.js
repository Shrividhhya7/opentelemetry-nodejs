require('./instrumentation.js');
require("dotenv").config();

const express = require('express');
const { rollDice } = require('./dice');
const { trace, metrics } = require('@opentelemetry/api');

const tracer = trace.getTracer('dice-server', '0.1.0');
const meter = metrics.getMeter('dice-server', '0.1.0');

const app = express();
const port = 3000;

// ✅ Create histogram once at startup
const requestDurationHistogram = meter.createHistogram('roll_request.duration.ms', {
  description: 'Duration of dice roll HTTP requests in milliseconds',
});

app.get('/', (req, res) => {
  const span = tracer.startSpan('GET /');
  console.log('📥 GET /');
  res.send('🎲 Welcome to the Dice API!');
  span.end();
});

app.get('/roll', (req, res) => {
  const span = tracer.startSpan('GET /roll');

  const startTime = Date.now(); // ✅ Start measuring duration

  const sides = parseInt(req.query.sides) || 6;
  const result = rollDice(sides);

  const duration = Date.now() - startTime; // ✅ End measuring duration
  requestDurationHistogram.record(duration, {
    'http.route': '/roll',
    'dice.sides': sides,
  });

  console.log(`🎲 Rolled a D${sides} → ${result}`);
  res.json({ sides, result });

  span.setAttribute('http.query.sides', sides);
  span.setAttribute('http.duration.ms', duration); // optional
  span.end();
});

app.listen(port, () => {
  console.log(`🚀 Dice app running at http://localhost:${port}`);
});
