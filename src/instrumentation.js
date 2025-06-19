const { NodeSDK } = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-http');
const { PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { Resource } = require('@opentelemetry/resources');
const { ATTR_SERVICE_VERSION, ATTR_SERVICE_NAME,ATTR_CLOUD_PROVIDER,ATTR_CLOUD_REGION } = require('@opentelemetry/semantic-conventions');

const { LoggerProvider } = require('@opentelemetry/sdk-logs');
const { ConsoleLogRecordExporter, SimpleLogRecordProcessor } = require('@opentelemetry/sdk-logs');

// 🧠 Enrich telemetry data with semantic conventions
const resource = new Resource({
  [ATTR_SERVICE_NAME]: 'dice-app',
  [ATTR_SERVICE_VERSION]: '1.0.0',
  [ATTR_CLOUD_PROVIDER]: 'azure',
  [ATTR_CLOUD_REGION]: 'us-east-1'
});

// ✅ Traces
const traceExporter = new OTLPTraceExporter();

// ✅ Metrics
const metricExporter = new OTLPMetricExporter();
const metricReader = new PeriodicExportingMetricReader({
  exporter: metricExporter,
  exportIntervalMillis: 1000
});

// ✅ Logs
const loggerProvider = new LoggerProvider({ resource });
loggerProvider.addLogRecordProcessor(
  new SimpleLogRecordProcessor(new ConsoleLogRecordExporter())
);

// ✅ Node SDK setup
const sdk = new NodeSDK({
  resource,
  traceExporter,
  metricReader,
  instrumentations: [getNodeAutoInstrumentations()]
});

sdk.start()
  .then(() => console.log('✅ OpenTelemetry Initialized'))
  .catch(err => console.error('❌ OTel Init Failed', err));

// ✅ Shutdown on exit
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('✅ OpenTelemetry Shutdown Complete'))
    .catch(err => console.error('❌ Shutdown Error', err))
    .finally(() => process.exit(0));
});
