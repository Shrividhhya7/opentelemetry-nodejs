const { NodeSDK } = require('@opentelemetry/sdk-node');
const {
  AzureMonitorTraceExporter,
  AzureMonitorMetricExporter,
  AzureMonitorLogExporter,
} = require('@azure/monitor-opentelemetry-exporter');

const { PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');
const { LoggerProvider, BatchLogRecordProcessor } = require('@opentelemetry/sdk-logs');
const { resourceFromAttributes } = require('@opentelemetry/resources');
const {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} = require('@opentelemetry/semantic-conventions');
const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');

// ✅ Optional: Enable OpenTelemetry internal debug logging
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

// ✅ Define your Application Insights connection string directly here
const connectionString = 'InstrumentationKey=xxxxxxxd59a7e;IngestionEndpoint=https://southindia-0.in.applicationinsights.azure.com/;LiveEndpoint=https://southindia.livediagnostics.monitor.azure.com/;ApplicationId=xxxxxxx';

// ✅ Create exporters
const traceExporter = new AzureMonitorTraceExporter({ connectionString });
const metricExporter = new AzureMonitorMetricExporter({ connectionString });
const logExporter = new AzureMonitorLogExporter({ connectionString });

// ✅ Define resource metadata
const resource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]: 'dice-roll',
  [ATTR_SERVICE_VERSION]: '0.1.0',
});

// ✅ Logger provider with log exporter
const loggerProvider = new LoggerProvider({
  resource,
  logRecordProcessors: [new BatchLogRecordProcessor(logExporter)],
});


// ✅ Configure and start the OpenTelemetry Node SDK
const sdk = new NodeSDK({
  resource,
  traceExporter,
  metricReader: new PeriodicExportingMetricReader({ exporter: metricExporter }),
  loggerProvider,
  // No auto-instrumentation – using manual only
});

(async () => {
  try {
    await sdk.start();
    console.log('✅ OpenTelemetry sending data to Azure Application Insights');
  } catch (err) {
    console.error('❌ OpenTelemetry initialization failed:', err);
  }
})();

// ✅ Graceful shutdown on SIGTERM
process.on('SIGTERM', async () => {
  await sdk.shutdown();
  console.log('🛑 OpenTelemetry shut down gracefully');
});
