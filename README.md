### 📘 Introduction
# 🎲 Dice API with OpenTelemetry

A simple Node.js app using Express that:

- Rolls a dice via API endpoints
- Implements **manual OpenTelemetry instrumentation**
- Exports **traces**, **metrics**, and **logs** to **Azure Application Insights**
- Includes rich semantic metadata

## 🚀 Features

| Type    | Enabled | Exported via                                 |
| ------- | ------- | ----------------------------------------------|
| Traces  | ✅       | Azure Monitor Trace Exporter                 |
| Metrics | ✅       | Azure Monitor Metric Exporter                |
| Logs    | ✅       | Azure Monitor Log Exporter                   |

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


## 🔧 Install & Run

### 📦 Install dependencies

npm install

### ▶️ Start the Project

node src/app.js

### 🧪 Test the endpoints

  - `GET http://localhost:3000/` → Welcome page
  - `GET http://localhost:3000/roll` → Roll a 6-sided dice
  - `GET http://localhost:3000/roll?sides=20` → Roll a 20-sided dice


## 🌐 Azure Application Insights Integration

This app uses the following exporters from `@azure/monitor-opentelemetry-exporter`:

  - `AzureMonitorTraceExporter`
  - `AzureMonitorMetricExporter`
  - `AzureMonitorLogExporter`

Telemetry is tagged with a resource using:

resourceFromAttributes({
  'service.name': 'dice-roll',
  'service.version': '0.1.0',
});


## 📡 Notes

  - No auto-instrumentation is used — this app uses manual spans, counters, and histograms.
  - Replace the connection string in `instrumentation.js` with your own Application Insights key.
  - Graceful shutdown is handled via `SIGTERM`.


### 📊 Data in Azure Monitor

All the traces and dependencies are visible in **Transaction Search** within Application Insights.

![Transaction Search](../opentelemetry-nodejs/img/transaction_search_1.png)  
![Transaction Search](../opentelemetry-nodejs/img/transaction_search_2.png)

Metrics are visible in the **Metrics** section of Application Insights.

![Metrics](../opentelemetry-nodejs/img/custom_metrics_1.jpg)  
![Metrics](../opentelemetry-nodejs/img/custom_metrics_2.png)

**Custom Metrics**, **Exceptions**, and **Logs** can also be viewed in log tables using **KQL queries** like:

```kusto
customMetrics
| where name == "dice.rolls.total"

traces
| where message contains "dice"

```

![Traces](../opentelemetry-nodejs/img/traces_1.png)

![Traces](../opentelemetry-nodejs/img/traces_2.png)  

![CustomMetrics](../opentelemetry-nodejs/img/custom_metrics_1.png)
![CustomMetrics](../opentelemetry-nodejs/img/custom_metrics_1.png)