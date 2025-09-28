import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { loginController } from "../utils/login";
import type { LoginBody } from "../types/auth";
import { schema } from "../schemas/login.schema";

export async function loginRoute(fastify: FastifyInstance) {
	fastify.post(
		"/login",
		{ schema },
		async (
			request: FastifyRequest<{ Body: LoginBody }>,
			reply: FastifyReply,
		) => {
			await loginController(fastify, request, reply);
		},
	);
}
