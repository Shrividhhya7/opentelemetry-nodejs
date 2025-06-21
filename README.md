```markdown
# 🎲 Dice API with OpenTelemetry

A simple Node.js app using Express that:

- Rolls a dice via API endpoints
- Implements **manual OpenTelemetry instrumentation**
- Exports **traces**, **metrics**, and **logs** to **Azure Application Insights**
- Includes rich semantic metadata

---

## 🚀 Features

| Type    | Enabled | Exported via                                 |
| ------- | ------- | -------------------------------------------- |
| Traces  | ✅       | Azure Monitor Trace Exporter (`Application Insights`) |
| Metrics | ✅       | Azure Monitor Metric Exporter                |
| Logs    | ✅       | Azure Monitor Log Exporter                   |

---

## 🛠 Project Structure

```

.
├── .env                    \# (Optional) for connection string if you use dotenv
├── package.json
├── /src
│   ├── app.js              \# Express app with manual tracing and metrics
│   ├── dice.js             \# Dice logic with span events and exceptions
│   └── instrumentation.js  \# OpenTelemetry SDK setup with Azure exporters

````

---

## 🧰 Dependencies

- `express`
- `@opentelemetry/api`
- `@opentelemetry/sdk-node`
- `@opentelemetry/sdk-trace-node`
- `@opentelemetry/sdk-metrics`
- `@opentelemetry/sdk-logs`
- `@opentelemetry/resources`
- `@azure/monitor-opentelemetry-exporter`

## 🧠 Semantic Attributes

Telemetry includes:

- `service.name`: `dice-roll`
- `service.version`: `0.1.0`
- `http.route`, `dice.sides`, `dice.result`, `http.duration.ms`, and other custom tags
- Exception tracking and span events

---

## 🔧 Install & Run

### 1. 📦 Install dependencies

```bash
npm install
````

### 2\. ▶️ Start the Project

```bash
node src/app.js
```

### 3\. 🧪 Test the endpoints

  - `GET http://localhost:3000/` → Welcome page
  - `GET http://localhost:3000/roll` → Roll a 6-sided dice
  - `GET http://localhost:3000/roll?sides=20` → Roll a 20-sided dice

-----

## 🌐 Azure Application Insights Integration

This app uses the following exporters from `@azure/monitor-opentelemetry-exporter`:

  - `AzureMonitorTraceExporter`
  - `AzureMonitorMetricExporter`
  - `AzureMonitorLogExporter`

Telemetry is tagged with a resource using:

```javascript
resourceFromAttributes({
  'service.name': 'dice-roll',
  'service.version': '0.1.0',
});
```

## 📡 Notes

  - No auto-instrumentation is used — this app uses manual spans, counters, and histograms.
  - Replace the connection string in `instrumentation.js` with your own Application Insights key.
  - Graceful shutdown is handled via `SIGTERM`.

```
```