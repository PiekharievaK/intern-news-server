import type { FastifyInstance } from "fastify";
import getFeedDataRoutes from "./routes/feedData.routes";
import getFullNewsRoute from "./routes/fullNews.route";

export default function (fastify: FastifyInstance) {
	getFeedDataRoutes(fastify);
	getFullNewsRoute(fastify);
	fastify.pluginLoaded("News");
}
