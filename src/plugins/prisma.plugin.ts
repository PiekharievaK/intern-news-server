import { PrismaClient } from "@prisma/client";
import fp from "fastify-plugin";

const pluginName = "prisma-plugin";

export default fp(
	async (fastify) => {
		try {
			const prisma = new PrismaClient();

			fastify.decorate("prisma", prisma);

			fastify.addHook("onClose", async () => {
				await prisma.$disconnect();
			});

			fastify.pluginLoaded(pluginName);
		} catch (error) {
			fastify.pluginError(pluginName, error);
		}
	},
	{
		name: pluginName,
	},
);
