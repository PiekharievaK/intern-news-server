import type { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import type { FastifyInstance } from "fastify";
import { schema } from "../schemas/feedData.schema";
import { getFeedHandler } from "../utils/feed.controller";

export default async function getFeedDataRoutes(fastify: FastifyInstance) {
	const route = fastify.withTypeProvider<JsonSchemaToTsProvider>();

	route.get("/", { schema }, async (request, reply) =>
		getFeedHandler(fastify, request, reply),
	);
}
