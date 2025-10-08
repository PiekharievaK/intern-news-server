import cors from "@fastify/cors";
import fp from "fastify-plugin";
import type { FastifyPluginAsync } from "fastify";

const corsPlugin: FastifyPluginAsync = fp(async (fastify, _opts) => {
	const pluginName = "cors-plugin";

	await fastify.register(cors, {
		origin: true,
		credentials: true,
		methods: ["GET", "POST", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	});

	fastify.pluginLoaded(pluginName);
});

export default corsPlugin;
