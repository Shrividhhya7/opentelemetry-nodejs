const { trace, SpanStatusCode, metrics } = require('@opentelemetry/api');

const tracer = trace.getTracer('dice-lib');
const meter = metrics.getMeter('dice-lib');

// ✅ Create the counter once (with description and optional attributes)
const rollCounter = meter.createCounter('dice.rolls.total', {
  description: 'Counts total number of dice rolls',
});

function rollOnce(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function rollDice(sides = 6) {
  return tracer.startActiveSpan('rollTheDice', (span) => {
    const result = rollOnce(1, sides);

    // ✅ Record the count with useful attributes
    rollCounter.add(1, {
      'dice.sides': sides,
      'dice.result': result,
    });

    // ✅ Add span attributes and events
    span.setAttribute('dice.sides', sides);
    span.setAttribute('dice.result', result);
    span.addEvent('Dice rolled', {
      sides,
      result,
    });

    // ✅ Simulate error and record it
    try {
      throw new Error('Oops, a fake error');
    } catch (ex) {
      span.recordException(ex);
      span.setStatus({ code: SpanStatusCode.ERROR, message: ex.message });
    }

    span.end();
    return result;
  });
}

module.exports = { rollDice };
