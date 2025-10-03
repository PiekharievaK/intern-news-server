import type { FastifyInstance } from "fastify";
import clickhouse from "./plugins/clickHousePlugin.plugin";
import { statsQueryRoute } from "./routes/getStats.route";
import { addStatsRoute } from "./routes/postStats.route";

export default function (fastify: FastifyInstance) {
	statsQueryRoute(fastify);
	addStatsRoute(fastify);
	fastify.register(clickhouse);
	fastify.pluginLoaded("Stats");
}
