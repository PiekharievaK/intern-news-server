import cookie from "@fastify/cookie";
import fp from "fastify-plugin";

const pluginName = "cookie-plugin";

export const  tempOffCoccies =  fp(
	async (fastify) => {
		fastify.register(cookie, {
			secret: fastify.config.JWT_SECRET,
			parseOptions: {},
		});

		fastify.pluginLoaded(pluginName);
	},
	{
		name: pluginName,
	},
);
