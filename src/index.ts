import buildApp from "./app";

async function start() {
	const fastify = await buildApp({
		logger: true,
	});

	const port = fastify.config.PORT;
	const host = fastify.config.HOST;

	fastify.listen({ port, host }, (err, address) => {
		if (err) {
			fastify.log.error(err);
			process.exit(1);
		}
		fastify.log.info(`Server running at ${address}`);
	});
}

void start();
