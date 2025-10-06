import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { parsePage } from "../services/pageParser";

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
			return reply.notFound("Preview not found");
		}

		const parsed = await parsePage(preview.newsUrl, preview.sourceUrl);

		if (!parsed) {
			return reply.badRequest("Unable to parse the news page");
		}

		return reply.status(200).send({
			id,
			title: parsed.title,
			image: parsed.image ?? "",
			pubDate: parsed.pubDate ?? new Date().toISOString(),
			sourceUrl: parsed.sourceUrl,
			newsUrl: parsed.newsUrl,
			content: parsed.content ?? "",
			previewId: preview.id,
			createdAt: new Date().toISOString(),
		});
	} catch (error) {
		request.log.error(error);
		return reply.internalServerError("Failed to load or parse news article");
	}
};
