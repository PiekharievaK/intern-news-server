import cors from "@fastify/cors";
import fp from "fastify-plugin";
import type { FastifyPluginAsync } from "fastify";

const corsPlugin: FastifyPluginAsync = fp(async (fastify, _opts) => {
	const pluginName = "cors-plugin";

	await fastify.register(cors, {
		origin: (origin, cb) => {
			const allowedOrigins = [
				"http://localhost:5173",
				"intern-news.vercel.app",
			];
			if (!origin || allowedOrigins.includes(origin)) {
				cb(null, true);
			} else {
				cb(new Error("Not allowed by CORS"), false);
			}
		},
		credentials: true,
	});

	fastify.pluginLoaded(pluginName);
});

export default corsPlugin;
