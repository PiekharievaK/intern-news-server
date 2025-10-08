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
			const tokenFromCookie = request.cookies?.token;

			if (!tokenFromCookie) {
				return reply.unauthorized("Token not found in cookies");
			}

			try {
				const decoded = await fastify.jwt.verify(tokenFromCookie);
				request.user = decoded;
			} catch (err: any) {
				if (err) {
					const decoded: any = fastify.jwt.decode(tokenFromCookie);
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

					reply.clearCookie("token", {
						httpOnly: true,
						sameSite: "none",
						path: "/",
						secure: true,
					});

					return reply
						.status(401)
						.send({ message: "Session expired. You have been logged out." });
				}

				return reply.unauthorized("Invalid token");
			}
		},
	);

	fastify.pluginLoaded(pluginName);
});
