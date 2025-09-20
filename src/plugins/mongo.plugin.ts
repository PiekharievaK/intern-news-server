import fp from "fastify-plugin";
import { MongoClient } from "mongodb";
import { initIndexes } from "../config/dbIndexes";

const pluginName = "db-indexes-plugin";

export default fp(
  async (fastify) => {
    const mongoUrl = fastify.config.DATABASE_URL;

    const client = new MongoClient(mongoUrl);
    await client.connect();

    await initIndexes(client);

	fastify.pluginLoaded(pluginName);
    await client.close();
  },
  {
    name: pluginName,
  }
);
