import staticPlugin from "@fastify/static";
import fp from "fastify-plugin";
import path from "path";

const pluginName = "static-files-plugin";

export default fp(
	async (fastify) => {
		fastify.register(staticPlugin, {
			root: path.join(process.cwd(), "uploads"),
			prefix: "/uploads/",
		});

		fastify.pluginLoaded(pluginName);
	},
	{
		name: pluginName,
	},
);
