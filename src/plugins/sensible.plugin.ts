import sensible from "@fastify/sensible";
import fp from "fastify-plugin";

const pluginName = "sensible-plugin";

export default fp(
	async (fastify) => {
		try {
			await fastify.register(sensible);
			fastify.pluginLoaded(pluginName);
		} catch (error) {
			fastify.pluginError(pluginName, error);
			fastify.log.error(error);
		}
	},
	{
		name: pluginName,
	},
);
