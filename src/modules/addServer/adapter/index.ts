import { FastifyInstance } from "fastify";
import { adAdapterRoutes } from "./routes/adapterRoute";

export default async function addServer(fastify: FastifyInstance) {
	adAdapterRoutes(fastify);
	fastify.pluginLoaded("addServer");
}
