import type { MongoClient } from "mongodb";

export async function initIndexes(client: MongoClient) {
	const db = client.db("news");

	await db
		.collection("NewsPreview")
		.createIndex({ newsUrl: 1 }, { unique: true });
	await db.collection("NewsFull").createIndex({ newsUrl: 1 }, { unique: true });
}
