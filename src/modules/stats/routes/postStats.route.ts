import { FastifyInstance } from "fastify";
import { adStatsController } from "../utils/addStatsController";

export const addStatsRoute = async (fastify: FastifyInstance) => {
	fastify.post("/", async (request, reply) =>
		adStatsController(fastify, request, reply),
	);
};
