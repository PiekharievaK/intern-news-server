import { diag, DiagLogger, DiagLogLevel } from "@opentelemetry/api";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { ConsoleSpanExporter } from "@opentelemetry/sdk-trace-node";
import {
	PeriodicExportingMetricReader,
	ConsoleMetricExporter,
} from "@opentelemetry/sdk-metrics";
import { FastifyOtelInstrumentation } from "@fastify/otel";
import { FsInstrumentation } from "@opentelemetry/instrumentation-fs";
import { PrismaInstrumentation } from "@prisma/instrumentation";
import { MongoDBInstrumentation } from "@opentelemetry/instrumentation-mongodb";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import pino from "pino";

const logger = pino({
	level: "info",
	transport: {
		target: "pino-pretty",
		options: {
			colorize: true,
		},
	},
});

const pinoLogger: DiagLogger = {
	debug: (msg: string) => logger.debug(msg),
	info: (msg: string) => logger.info(msg),
	warn: (msg: string) => logger.warn(msg),
	error: (msg: string) => logger.error(msg),
	verbose: (msg: string) => logger.trace(msg),
};

export async function initOpenTelemetry() {
	const isProd = process.env.NODE_ENV === "production";

	if (!isProd) {
		logger.info("OpenTelemetry is disabled in non-production environment");
		return;
	}

	diag.setLogger(pinoLogger, DiagLogLevel.INFO);
	const sdk = new NodeSDK({
		traceExporter: new ConsoleSpanExporter(),
		metricReader: new PeriodicExportingMetricReader({
			exporter: new ConsoleMetricExporter(),
			exportIntervalMillis: 600000,
		}),
		instrumentations: [
			new FastifyOtelInstrumentation({
				servername: "intern-news-server",
				registerOnInitialization: true,
				ignorePaths: (opts) => opts.url.includes("/health"),
			}),
			new FsInstrumentation(),
			new HttpInstrumentation(),
			new MongoDBInstrumentation(),
			new PrismaInstrumentation(),
		],
		serviceName: "intern-news-server",
	});

	try {
		await sdk.start();
		logger.info("OpenTelemetry SDK started");
	} catch (e) {
		logger.error(`Error starting OpenTelemetry SDK: ${e}`);
	}

	return sdk;
}
