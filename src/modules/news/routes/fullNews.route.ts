import type { FastifyInstance } from "fastify";
import { schema } from "../schemas/fullNews.schema";
import type { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { newsController } from "../utils/news.controller";

export async function getFullNewsRoute(fastify: FastifyInstance) {
	const route = fastify.withTypeProvider<JsonSchemaToTsProvider>();

	route.get("/:id", { schema }, async (request, reply) =>
		newsController(fastify, request, reply),
	);
}
