import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import type { AuctionRequest } from "../types/didTypes";

export const adRequestController = async (
	fastify: FastifyInstance,
	request: FastifyRequest<{ Body: string }>,
	reply: FastifyReply,
) => {
	const parsedBody: AuctionRequest = JSON.parse(request.body);
	const bids = parsedBody.bids;

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
			ad: `<img src="${fastify.config.SERVER_URL}${lineItem.creativePath}" width="${width}" height="${height}" />`,
		});
	}

	return reply.status(200).send({ body: { bids: responses } });
};

function parseSizes(sizes: unknown): [number, number] | null {
	if (!sizes) return null;

	if (typeof sizes === "string" && sizes.includes("x")) {
		const [w, h] = sizes.split("x").map(Number);
		if (Number.isNaN(w) || Number.isNaN(h)) return null;
		return [w, h];
	}

	if (
		Array.isArray(sizes) &&
		sizes.length > 0 &&
		typeof sizes[0] === "string" &&
		sizes[0].includes("x")
	) {
		const [w, h] = sizes[0].split("x").map(Number);
		if (Number.isNaN(w) || Number.isNaN(h)) return null;
		return [w, h];
	}

	if (
		Array.isArray(sizes) &&
		sizes.length === 2 &&
		(typeof sizes[0] === "string" || typeof sizes[0] === "number") &&
		(typeof sizes[1] === "string" || typeof sizes[1] === "number")
	) {
		const w = typeof sizes[0] === "string" ? Number(sizes[0]) : sizes[0];
		const h = typeof sizes[1] === "string" ? Number(sizes[1]) : sizes[1];
		if (Number.isNaN(w) || Number.isNaN(h)) return null;
		return [w, h];
	}

	return null;
}
