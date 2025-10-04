import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { LoginBody } from "../types/auth";
import { verifyPassword } from "../services/password";
import { findUserByEmail } from "../services/user";

export async function loginController(
	fastify: FastifyInstance,
	request: FastifyRequest<{ Body: LoginBody }>,
	reply: FastifyReply,
) {
	const { email, password } = request.body;

	try {
		const user = await findUserByEmail(fastify.prisma, email);
		fastify.assert(user, 400, "Invalid email or password");

		const passwordMatch = await verifyPassword(password, user.password || "");
		fastify.assert(passwordMatch, 400, "Invalid email or password");

		const token = fastify.jwt.sign(
			{ userId: user.id, email: user.email },
			{ expiresIn: "1h" },
		);

		await fastify.prisma.user.update({
			where: { id: user.id },
			data: { token },
		});

		return reply.status(200).send({ login: user.login, token: token });
	} catch (error) {
		request.log.error(error);

		return reply.internalServerError(error.message || "Internal Server Error");
	}
}
