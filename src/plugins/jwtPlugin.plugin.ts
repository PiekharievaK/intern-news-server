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
			try {
				await request.jwtVerify();
			} catch (err) {
				reply.unauthorized(err);
			}
		},
	);

	fastify.pluginLoaded(pluginName);
});
