import { FastifyInstance } from "fastify";

type StatEvent = {
	eventType: string;
	timestamp: number;
	details?: Record<string, any>;
};

const CACHE: StatEvent[] = [];
const MAX_CACHE_SIZE = 50;
const MAX_TIMEOUT = 5000;
let timer: NodeJS.Timeout | null = null;

export function addToCache(event: StatEvent, fastify: FastifyInstance) {
	CACHE.push(event);

	if (CACHE.length >= MAX_CACHE_SIZE) {
		flushCache(fastify);
	} else if (!timer) {
		timer = setTimeout(() => flushCache(fastify), MAX_TIMEOUT);
	}
}

export async function flushCache(fastify: FastifyInstance) {
	if (timer) {
		clearTimeout(timer);
		timer = null;
	}

	if (CACHE.length === 0) return;

	const batch = [...CACHE];
	CACHE.length = 0;

	const values = batch.map((event) => {
		const { details = {}, eventType, timestamp } = event;
		const baseEvent = {
			eventType,
			timestamp: new Date(timestamp).toISOString(),
			details: JSON.stringify(details || {}),
		};

		if (eventType === "bidWon") {
			return {
				...baseEvent,
				auctionId: details.auctionId,
				bidderCode: details.bidderCode,
				creativeId: details.creativeId,
			};
		} else if (eventType === "bidRequested") {
			return {
				...baseEvent,
				auctionId: details.auctionId,
				bidderRequests: JSON.stringify(details.bidderRequests || []),
			};
		} else if (eventType === "bidResponse") {
			return {
				...baseEvent,
				auctionId: details.auctionId,
				bidResponse: JSON.stringify(details.bidResponse || {}),
			};
		} else if (eventType === "auctionInit" || eventType === "auctionEnd") {
			return {
				...baseEvent,
				auctionId: details.auctionId,
			};
		}

		return baseEvent;
	});

	try {
		await fastify.clickhouse.insert({
			table: fastify.config.CLICK_TABLE,
			values,
			format: "JSONEachRow",
		});

		fastify.log.info(`Flushed ${batch.length} events to ClickHouse`);
	} catch (error) {
		fastify.log.error("Error while flushing events to ClickHouse:", error);
	}
}
