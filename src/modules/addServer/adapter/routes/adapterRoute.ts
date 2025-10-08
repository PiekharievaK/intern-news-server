import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { adRequestController } from "../utils/adRequestController";

export async function adAdapterRoutes(fastify: FastifyInstance) {
	fastify.post(
		"/auction",
		async (request: FastifyRequest<{ Body: string }>, reply: FastifyReply) => {
			await adRequestController(fastify, request, reply);
		},
	);
}
