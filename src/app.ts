import { join } from "node:path";
import AutoLoad from "@fastify/autoload";
import Fastify, { type FastifyServerOptions } from "fastify";
import configPlugin from "./config";

export type AppOptions = Partial<FastifyServerOptions>;

async function buildApp(options: AppOptions = {}) {
  const fastify = Fastify({ logger: true });
  await fastify.register(configPlugin);

  try {
    fastify.decorate("pluginLoaded", (pluginName: string) => {
      fastify.log.info(`✔️ Plugin loaded: ${pluginName}`);
    });

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
    fastify.decorate("routeLoaded", (routeName: string) => {
      fastify.log.info(`✔️ Route loaded: ${routeName}`);
    });

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
