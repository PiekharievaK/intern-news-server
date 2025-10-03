import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { addToCache } from "../services/statsBuffer";

export const adStatsController = (
	fastify: FastifyInstance,
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	const events = request.body as Array<{
		eventType: string;
		timestamp: number;
		details?: Record<string, any>;
	}>;

	if (!Array.isArray(events)) {
		return reply.code(400).send({ error: "Invalid payload" });
	}

	for (const event of events) {
		addToCache(event, fastify);
	}

	return reply.code(200).send({ status: "ok" });
};
