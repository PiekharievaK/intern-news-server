import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { signupController } from "../utils/signup";
import type { SignupBody } from "../types/auth";
import { schema } from "../schemas/signup.schema";

export async function signupRoute(fastify: FastifyInstance) {
	fastify.post(
		"/signup",
		{ schema },
		async (
			request: FastifyRequest<{ Body: SignupBody }>,
			reply: FastifyReply,
		) => {
			await signupController(fastify, request, reply);
		},
	);
}
