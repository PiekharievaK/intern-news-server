import jwt from "@fastify/jwt";
import type { FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

export default fp(async (fastify, _opts) => {
  const token = fastify.config.JWT_SECRET;
  const pluginName = "jwt-plugin";

  if (!token) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  fastify.register(jwt, {
    secret: token,
  });

  fastify.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const tokenFromAuth = request.cookies?.token;
      const mainToken = tokenFromAuth;

      if (!mainToken) {
        return reply.status(200).send({ message: "No token found, but request is successful" });
      }

      try {
        const decoded = await fastify.jwt.verify(mainToken);
        request.user = decoded;
      } catch (err: any) {
        const decoded: any = fastify.jwt.decode(mainToken);
        const userId = decoded?.userId;

        if (userId) {
          try {
            await fastify.prisma.user.update({
              where: { id: userId },
              data: { token: null }, 
            });
          } catch (dbErr) {
            request.log.error("Failed to clear token in DB", dbErr);
          }
        }

        return reply.status(200).send({ message: "Success" });
      }

      return reply.status(200).send({ message: "Token verified successfully" });
    }
  );

  fastify.pluginLoaded(pluginName);
});
