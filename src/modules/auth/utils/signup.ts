import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import type { SignupBody } from "../types/auth";
import { hashPassword } from "../services/password";

export async function signupController(
	fastify: FastifyInstance,
	request: FastifyRequest<{ Body: SignupBody }>,
	reply: FastifyReply,
) {
	const { email, password, login } = request.body;

	try {
		const existingUserByEmail = await fastify.prisma.user.findUnique({
			where: { email },
		});

		if (existingUserByEmail) {
			return reply.badRequest("Email already registered");
		}

		const existingUserByLogin = await fastify.prisma.user.findUnique({
			where: { login },
		});

		if (existingUserByLogin) {
			return reply.badRequest("Login already taken");
		}

		const hashedPassword = await hashPassword(password);

		const user = await fastify.prisma.user.create({
			data: {
				email,
				login,
				password: hashedPassword,
			},
		});

		return reply.send({ id: user.id, login: user.login });
	} catch (error) {
		request.log.error(error);

		return reply.internalServerError("Internal Server Error");
	}
}
