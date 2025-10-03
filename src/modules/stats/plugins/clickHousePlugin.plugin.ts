import fp from "fastify-plugin";
import { createClient } from "@clickhouse/client";
import type { FastifyPluginAsync } from "fastify";

const clickhousePlugin: FastifyPluginAsync = async (fastify) => {
	const clickhouse = createClient({
		url: fastify.config.CLICK_URL,
		username: fastify.config.CLICK_USER,
		password: fastify.config.CLICK_PASSWORD,
	});
	const rows = await clickhouse.query({
		query: "SELECT 1",
		format: "JSONEachRow",
	});
	console.log("Result: ", await rows.json());

	fastify.decorate("clickhouse", clickhouse);
};

export default fp(clickhousePlugin);

declare module "fastify" {
	interface FastifyInstance {
		clickhouse: ReturnType<typeof createClient>;
	}
}
