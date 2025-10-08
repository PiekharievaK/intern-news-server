import cors from "@fastify/cors";
import fp from "fastify-plugin";
import type { FastifyPluginAsync } from "fastify";

const corsPlugin: FastifyPluginAsync = fp(async (fastify, _opts) => {
	const pluginName = "cors-plugin";

	await fastify.register(cors, {
		origin: (origin, cb) => {
			const allowedOrigins = [
				"http://localhost:5173",
				"http://localhost:3001",
				"https://intern-news.vercel.app",
				"https://intern-news-server-1.vercel.app"
			];

			if (!origin || allowedOrigins.includes(origin)) {
				cb(null, true);
			} else {
				cb(new Error("Not allowed by CORS"), false);
			}
		},
		credentials: true,
		methods: ["GET", "POST", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	});

	fastify.pluginLoaded(pluginName);
});

export default corsPlugin;
