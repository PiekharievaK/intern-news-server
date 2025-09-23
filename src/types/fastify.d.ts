import type { Config } from "../config/schema";

declare module "fastify" {
	interface FastifyInstance {
		config: Config;
		pluginLoaded: (pluginName: string) => void;
		pluginError: (pluginName: string, error: unknown) => void;
		authenticate: (
			request: import("fastify").FastifyRequest,
			reply: import("fastify").FastifyReply,
		) => Promise<void>;
	}
}
