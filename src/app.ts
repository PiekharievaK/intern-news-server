import { join } from "node:path";
import AutoLoad from "@fastify/autoload";
import Fastify, { type FastifyServerOptions } from "fastify";
import configPlugin from "./config";

export type AppOptions = Partial<FastifyServerOptions>;

async function buildApp(options: AppOptions = {}) {
	const fastify = Fastify({ logger: true });
	await fastify.register(configPlugin);

	fastify.decorate("pluginLoaded", (pluginName: string) => {
		fastify.log.info(`✔️ Loaded: ${pluginName}`);
	});
	fastify.decorate("pluginError", (pluginName: string, error) => {
		fastify.log.error(error, `❌ Plugin error: ${pluginName}`);
	});

	try {
		fastify.log.info("🛠️  - Starting to load plugins");

		await fastify.register(AutoLoad, {
			dir: join(__dirname, "plugins"),
			options: options,
			ignorePattern: /^((?!plugin).)*$/,
		});

		fastify.log.info("✅ Plugins loaded successfully");
	} catch (error) {
		fastify.log.error("Error in autoload:", error);
		throw error;
	}

	try {
		fastify.log.info("🔀 - Starting to load routes");

		await fastify.register(AutoLoad, {
			dir: join(__dirname, "modules/"),
		});

		fastify.log.info("✅ Routes loaded successfully");
	} catch (error) {
		fastify.log.error("Error in autoload:", error);
		throw error;
	}

	await fastify.ready();

	return fastify;
}

export default buildApp;
