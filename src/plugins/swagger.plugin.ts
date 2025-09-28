import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";

export default fp(async (fastify, _opts) => {
	const pluginName = "swagger-plugin";
	await fastify.register(swagger, {
		openapi: {
			openapi: "3.0.0",
			info: {
				title: "news-server",
				description: "Auto-generated Swagger docs",
				version: "1.0.0",
			},
			servers: [
				{
					url: fastify.config.SERVER_URL,
				},
			],
		},
	});

	await fastify.register(swaggerUI, {
		routePrefix: "/docs",
		uiConfig: {
			docExpansion: "list",
			deepLinking: true,
		},
		staticCSP: true,
		transformSpecificationClone: true,
	});

	fastify.pluginLoaded(pluginName);
});
