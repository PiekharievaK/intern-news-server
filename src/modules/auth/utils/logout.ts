import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

export async function logoutController(
  fastify: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const userId = (request.user as { userId: string }).userId;

    // fastify.assert(userId, 401, "Unauthorized");
    if (userId) {
      await fastify.prisma.user.update({
        where: { id: userId },
        data: { token: null },
      });
    }

    // reply.clearCookie("token", {
    // 	path: "/",
    // });

    return reply.status(200).send({ message: "Logged out successfully" });
  } catch (error) {
    request.log.error(error);
    return reply.internalServerError(error.message || "Internal Server Error");
  }
}
