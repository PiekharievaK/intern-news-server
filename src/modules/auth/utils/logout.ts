import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

export async function logoutController(
	fastify: FastifyInstance,
	request: FastifyRequest,
	reply: FastifyReply,
) {
	try {
		const userId = (request.user as { userId: string }).userId;

		fastify.assert(userId, 401, "Unauthorized");

		await fastify.prisma.user.update({
			where: { id: userId },
			data: { token: null },
		});

		return reply.send({ message: "Logged out successfully" });
	} catch (error) {
		request.log.error(error);

		return reply.internalServerError(error.message || "Internal Server Error");
	}
}
