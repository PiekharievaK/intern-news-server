import type { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { parseFeed } from "../services/feedParser.service";

export const getFeedHandler = async (
	fastify: FastifyInstance,
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	const query = request.query as {
		url?: string;
		force?: string;
		page?: string;
	};
	const url = query.url ?? fastify.config.DEFAULT_FEED_URL;
	const force = query.force === "1";
	const page = Number(query.page) || 1;
	const itemsPerPage = 5;

	fastify.log.info(`Request params: ${request.params}`);

	try {
		if (!force) {
			const cachedPreviews = await fastify.prisma.newsPreview.findMany({
				where: { sourceUrl: url },
			});

			if (cachedPreviews.length > 0) {
				const start = (page - 1) * itemsPerPage;
				const end = start + itemsPerPage;
				const pagedCache = cachedPreviews.slice(start, end);

				return reply.status(200).send({
					items: pagedCache,
					totalCount: cachedPreviews.length,
				});
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

		fastify.log.info("Fetch news success");

		const allPreviews = await fastify.prisma.newsPreview.findMany({
			where: { sourceUrl: url },
		});

		const start = 0;
		const end = start + itemsPerPage;
		const allByPage = allPreviews.slice(start, end);

		return reply.status(200).send({ items: allByPage, totalCount: allPreviews.length });
	} catch (error) {
		fastify.log.error(error);
		return reply.internalServerError("Failed to fetch or save feed");
	}
};
