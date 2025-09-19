import type { FastifyInstance } from "fastify";
import { schema } from "../schemas/fullNews.schema";
import { newsController } from "../utils/news.controller";

export async function getFullNewsRoute(fastify: FastifyInstance) {
	fastify.get(
		"/news/:id",
		{
			schema,
		},
		async (request, reply) => newsController(fastify, request, reply),
	);
}
