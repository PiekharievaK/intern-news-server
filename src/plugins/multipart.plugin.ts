import fp from "fastify-plugin";
import multipart from "@fastify/multipart";
const pluginName = "multipart-plugin";

export default fp(
	async (fastify) => {
		try {
			fastify.register(multipart, {
				limits: {
					fileSize: 10 * 1024 * 1024,
				},
			});
		} catch (error) {
			fastify.log.error(error, "Error fetching news:");
		}

		fastify.pluginLoaded(pluginName);
	},
	{
		name: pluginName,
	},
);
