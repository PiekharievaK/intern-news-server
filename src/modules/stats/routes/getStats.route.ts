import { FastifyInstance } from "fastify";
import { getStatsController } from "../utils/getStatsController";
import { schema } from "../schemas/schema";

export const statsQueryRoute = async (fastify: FastifyInstance) => {
	fastify.get("/", { schema }, async (request, reply) =>
		getStatsController(fastify, request, reply),
	);
};
