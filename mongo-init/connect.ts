import type { MongoClient } from "mongodb";

export async function waitForMongo(client: MongoClient) {
	const maxRetries = 3;
	let retries = 0;

	while (retries < maxRetries) {
		try {
			await client.connect();
			console.log("✅ MongoDB is up!");
			return;
		} catch (error) {
			retries++;
			console.log(
				`⏳ Waiting for MongoDB... ${error} (${retries}/${maxRetries})`,
			);
			await new Promise((r) => setTimeout(r, 2000));
		}
	}

	throw new Error("❌ MongoDB did not start in time");
}
