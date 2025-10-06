import type { FastifyInstance } from "fastify";
import { statsQueryRoute } from "./routes/getStats.route";
import { addStatsRoute } from "./routes/postStats.route";

export default function (fastify: FastifyInstance) {
	statsQueryRoute(fastify);
	addStatsRoute(fastify);
	fastify.pluginLoaded("Stats");
}
