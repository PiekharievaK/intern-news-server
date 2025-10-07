import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import type { SignupBody } from "../types/auth";
import { createUser, findUserByEmail, findUserByLogin } from "../services/user";

export async function signupController(
	fastify: FastifyInstance,
	request: FastifyRequest<{ Body: SignupBody }>,
	reply: FastifyReply,
) {
	const { email, password, login } = request.body;

	try {
		const existingUserByEmail = await findUserByEmail(fastify.prisma, email);
		const existingUserByLogin = await findUserByLogin(fastify.prisma, login);

		fastify.assert(!existingUserByEmail, 400, "This email is already exist");
		fastify.assert(!existingUserByLogin, 400, "Login already taken");
		const user = await createUser(fastify.prisma, email, login, password);

		return reply.status(201).send({ id: user.id, login: user.login });
	} catch (error) {
		request.log.error(error);

		return reply.internalServerError(error.message || "Internal Server Error");
	}
}
