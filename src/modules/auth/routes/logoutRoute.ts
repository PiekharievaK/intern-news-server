import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { logoutController } from "../utils/logout";
import { schema } from "../schemas/logout.schema";

export default async function logoutRoute(fastify: FastifyInstance) {
	fastify.get(
		"/logout",
		{
			schema,
			preValidation: [fastify.authenticate],
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			await logoutController(fastify, request, reply);
		},
	);
}
