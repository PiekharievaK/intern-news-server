import { MongoClient } from "mongodb";
import { waitForMongo } from "./connect";
import { initIndexes } from "./indexes";

async function initDB() {
	const uri = process.env.DATABASE_URL || "mongodb://localhost:27017";
	const client = new MongoClient(uri);
	try {
		await waitForMongo(client);
		await initIndexes(client);
		console.log("✅ Full DB config success");
	} catch (err) {
		console.error("❌ Error config:", err);
		process.exit(1);
	} finally {
		await client.close();
	}
}

initDB();
