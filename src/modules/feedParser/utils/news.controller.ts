import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export const newsController =
	(fastify: unknown, request: unknown, reply: unknown) =>
	async (
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
				// const parsed = await parseFool(preview.newsUrl);
				console.log("aneed to be added to DB");
				//   full = await fastify.prisma.newsFull.create({
				//     data: {
				//       title: parsed.title,
				//       content: parsed.content,
				//       image: parsed.image ?? "",
				//       newsUrl: preview.newsUrl,
				//       sourceUrl: preview.sourceUrl,
				//       previewId: preview.id,
				//     },
				//   });
			}

			return reply.send(full);
		} catch (error) {
			request.log.error(error);
			return reply.status(500).send({ error: "Failed to fetch full news" });
		}
	};
