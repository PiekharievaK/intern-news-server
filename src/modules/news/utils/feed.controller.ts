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

	fastify.log.info(`Request params: ${JSON.stringify(request.query)}`);

	try {
		if (force) {
			await fastify.prisma.newsPreview.deleteMany({
				where: {
					sourceUrl: url,
				},
			});
		} else {
			await fastify.prisma.newsPreview.deleteMany({
				where: {
					sourceUrl: {
						not: url,
					},
				},
			});
		}

		const parsedItems = await parseFeed(url);
		fastify.assert(parsedItems, 400, "Failed to parse feed");

		fastify.log.info(`Parsed ${parsedItems.length} items from the feed.`);

		const transaction = fastify.prisma.$transaction(
			parsedItems.map((item) => {
				return fastify.prisma.newsPreview.upsert({
					where: { newsUrl: item.newsUrl },
					update: {},
					create: {
						title: item.title,
						image: item.image ?? "",
						newsUrl: item.newsUrl,
						content: item.content ?? "",
						pubDate: item.pubDate,
						sourceUrl: item.sourceUrl,
					},
				});
			}),
		);

		await transaction;

		fastify.log.info("Fetch and update news success");

		const allPreviews = await fastify.prisma.newsPreview.findMany({
			where: { sourceUrl: url },
			orderBy: {
				pubDate: "desc",
			},
		});

		const start = (page - 1) * itemsPerPage;
		const end = start + itemsPerPage;
		const allByPage = allPreviews.slice(start, end);

		return reply
			.status(200)
			.send({ items: allByPage, totalCount: allPreviews.length });
	} catch (error) {
		fastify.log.error("Error during feed fetch/update:", error);
		return reply.internalServerError("Failed to fetch or save feed");
	}
};
