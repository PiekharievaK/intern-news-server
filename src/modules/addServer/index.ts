import { FastifyInstance } from "fastify";
import { adAdapterRoutes } from "./adapter/routes/adapterRoute";
import { formRoute } from "./lineItem/routes/getForm";
import { saveLineItemRoute } from "./lineItem/routes/saveForm";

export default async function addServer(fastify: FastifyInstance) {
  adAdapterRoutes(fastify);
  formRoute(fastify);
  saveLineItemRoute(fastify);
  fastify.pluginLoaded("addServer");
}
