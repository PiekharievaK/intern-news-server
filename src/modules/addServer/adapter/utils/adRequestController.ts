import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { AuctionRequest } from "../types/didTypes";

export const adRequestController = async (
	fastify: FastifyInstance,
	request: FastifyRequest<{ Body: AuctionRequest }>,
	reply: FastifyReply,
) => {
	fastify.log.info("Auction Request received");

	const bids = request.body?.bids;
	if (!Array.isArray(bids) || bids.length === 0) {
		return reply.badRequest("No bids provided");
	}

	const responses = [];

	for (const bid of bids) {
		const matchedSize = parseSizes(bid.sizes);
		if (!matchedSize) continue;

		const [width, height] = matchedSize;

		const lineItem = await fastify.prisma.lineItem.findFirst({
			where: {
				size: {
					equals: [width, height],
				},
			},
		});

		if (!lineItem) continue;

		responses.push({
			requestId: bid.requestId,
			cpm: lineItem.minCPM,
			width,
			height,
			creativeId: lineItem.id,
			currency: "USD",
			netRevenue: true,
			ttl: 300,
			mediaType: "banner",
			ad: `<img src="${lineItem.creativePath}" width="${width}" height="${height}" />`,
		});
	}

	return reply.status(200).send({ body: { bids: responses } });
};

function parseSizes(sizes: (string | number)[]): [number, number] | null {
	if (sizes.length !== 2) return null;

	const w = typeof sizes[0] === "string" ? Number(sizes[0]) : sizes[0];
	const h = typeof sizes[1] === "string" ? Number(sizes[1]) : sizes[1];

	if (Number.isNaN(w) || Number.isNaN(h)) return null;

	return [w, h];
}
