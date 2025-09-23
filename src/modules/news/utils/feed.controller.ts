import type { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { parseFeed } from "../services/feedParser.service";

export const getFeedHandler = async (
	fastify: FastifyInstance,
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	const query = request.query as { url?: string; force?: string };
	const url = query.url ?? fastify.config.DEFAULT_FEED_URL;
	const force = query.force === "1";

	try {
		if (!force) {
			const cachedPreviews = await fastify.prisma.newsPreview.findMany({
				where: { sourceUrl: url },
			});

			if (cachedPreviews.length > 0) {
				return reply.send(cachedPreviews);
			}
		}

		const parsedItems = await parseFeed(url);

		fastify.assert(parsedItems, 400, "Failed to parse feed");

		for (const item of parsedItems) {
			await fastify.prisma.newsPreview.upsert({
				where: { newsUrl: item.newsUrl },
				update: {
					title: item.title,
					image: item.image ?? "",
					content: item.content ?? "",
					sourceUrl: item.sourceUrl,
				},
				create: {
					title: item.title,
					image: item.image ?? "",
					newsUrl: item.newsUrl,
					content: item.content ?? "",
					sourceUrl: item.sourceUrl,
				},
			});
		}

		const allPreviews = await fastify.prisma.newsPreview.findMany({
			where: { sourceUrl: url },
		});

		return reply.send(allPreviews);
	} catch (error) {
		fastify.log.error(error);
		return reply.internalServerError("Failed to fetch or save feed");
	}
};
