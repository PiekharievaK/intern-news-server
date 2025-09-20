import { join } from "path";
import AutoLoad from "@fastify/autoload";
import type { FastifyInstance } from "fastify";

export default async function (fastify: FastifyInstance) {
	await fastify.register(AutoLoad, {
		dir: join(__dirname, "routes"),
	});

	fastify.routeLoaded("News");
}
