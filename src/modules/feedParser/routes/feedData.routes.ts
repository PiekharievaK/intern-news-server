import type { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import type { FastifyInstance } from "fastify";
import { schema } from "../schemas/feedData.schema";
import { getFeedHandler } from "../utils/feed.controller";

export async function getFeedDataRoutes(fastify: FastifyInstance) {
	const route = fastify.withTypeProvider<JsonSchemaToTsProvider>();

	route.get("/feed", { schema }, async (request, reply) => {
		return getFeedHandler(fastify, request, reply);
	});
}
