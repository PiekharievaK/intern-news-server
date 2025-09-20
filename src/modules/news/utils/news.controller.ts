import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export const newsController = async (
	fastify: FastifyInstance,
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	const { id } = request.params as { id: string };

	try {
		const preview = await fastify.prisma.newsPreview.findUnique({
			where: { id },
		});
		if (!preview) {
			return reply.status(404).send({ error: "Preview not found" });
		}

		const full = await fastify.prisma.newsFull.findUnique({
			where: { newsUrl: preview.newsUrl },
		});

		if (!full) {
			console.log("Failed to parse full news");
		}

		return reply.send(full);
	} catch (error) {
		request.log.error(error);
		return reply.status(500).send({ error: "Failed to fetch full news" });
	}
};
