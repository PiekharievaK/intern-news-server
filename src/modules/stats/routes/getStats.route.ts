import { FastifyInstance } from "fastify";
import { getStatsController } from "../utils/getStatsController";

export const statsQueryRoute = async (fastify: FastifyInstance) => {
	fastify.get("/", async (request, reply) =>
		getStatsController(fastify, request, reply),
	);
};
