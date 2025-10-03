import cors from "@fastify/cors";
import fp from "fastify-plugin";
import type { FastifyPluginAsync } from "fastify";

const corsPlugin: FastifyPluginAsync = fp(async (fastify, _opts) => {
	const pluginName = "cors-plugin";

	await fastify.register(cors, {
		origin: (origin, callback) => {
			if (!origin || origin === "http://localhost:5173") {
				callback(null, true);
				return;
			}

			callback(new Error("Not allowed by CORS"), false);
		},
		credentials: true,
	});

	fastify.pluginLoaded(pluginName);
});

export default corsPlugin;
