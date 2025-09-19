import { PrismaClient } from "@prisma/client";
import fp from "fastify-plugin";

const pluginName = "prisma-plugin";

export default fp(
	async (fastify) => {
		const prisma = new PrismaClient();

		fastify.decorate("prisma", prisma);

		fastify.addHook("onClose", async () => {
			await prisma.$disconnect();
		});

		fastify.pluginLoaded(pluginName);
	},
	{
		name: pluginName,
	},
);
