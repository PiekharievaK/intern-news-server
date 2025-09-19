import type { MongoClient } from "mongodb";

export async function initIndexes(client: MongoClient) {
	try {
		const db = client.db("news");
		await db
			.collection("NewsPreview")
			.createIndex({ newsUrl: 1 }, { unique: true });
		await db
			.collection("NewsFull")
			.createIndex({ newsUrl: 1 }, { unique: true });
		console.log("✅ Unique index on newsUrl created");
	} catch (err) {
		console.error("❌ Error indexes:", err);
	}
}
