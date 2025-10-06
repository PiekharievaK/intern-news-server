import { createClient } from "@clickhouse/client";
import fp from "fastify-plugin";

export default fp(async (fastify, _opts) => {
	const pluginName = "clickhouse-plugin";

	const clickhouse = createClient({
		url: fastify.config.CLICK_URL,
		username: fastify.config.CLICK_USER,
		password: fastify.config.CLICK_PASSWORD,
	});

	try {
		await clickhouse.query({
			query: "SELECT 1",
			format: "JSONEachRow",
		});

		fastify.pluginLoaded(pluginName);
		fastify.decorate("clickhouse", clickhouse);
		fastify.log.info("Successfully connected to ClickHouse");
	} catch (error) {
		fastify.log.error(error, "Error connecting to ClickHouse:");
		throw new Error("ClickHouse connection failed");
	}
});

declare module "fastify" {
	interface FastifyInstance {
		clickhouse: ReturnType<typeof createClient>;
	}
}
