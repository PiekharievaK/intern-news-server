import type { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { parseFeed } from "../services/feedParser.service";
import dotenv from "dotenv";
dotenv.config();

const DEFAULT_URL = process.env.DEFAULT_FEED_URL || "https://feeds.bbci.co.uk/sport/rss.xml";

export const getFeedHandler = async (
	fastify: FastifyInstance,
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	const query = request.query as { url?: string; force?: string };
	const url = query.url ?? DEFAULT_URL;
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

		for (const item of parsedItems) {
			await fastify.prisma.newsPreview.upsert({
				where: { newsUrl: item.newsUrl },
				update: {
					title: item.title,
					image: item.image ?? "",
					content: item.content ?? "",
					sourceUrl: url,
				},
				create: {
					title: item.title,
					image: item.image ?? "",
					newsUrl: item.newsUrl,
					content: item.content ?? "",
					sourceUrl: url,
				},
			});
		}

		const allPreviews = await fastify.prisma.newsPreview.findMany({
			where: { sourceUrl: url },
		});

		return reply.send(allPreviews);
	} catch (error) {
		fastify.log.error(error);
		return reply.status(500).send({ error: "Failed to fetch or save feed" });
	}
};
