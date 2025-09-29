import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { adRequestController } from "../utils/adRequestController";
import { AuctionRequest } from "../types/didTypes";

export async function adAdapterRoutes(fastify: FastifyInstance) {
	fastify.post(
		"/auction",
		async (
			request: FastifyRequest<{ Body: AuctionRequest }>,
			reply: FastifyReply,
		) => {
			await adRequestController(fastify, request, reply);
		},
	);
}
