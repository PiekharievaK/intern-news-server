import {
	FastifyInstance,
	RawServerDefault,
	FastifyBaseLogger,
	FastifyTypeProviderDefault,
} from "fastify";
import { formRoute } from "./lineItem/routes/getForm";
import { saveLineItem } from "./lineItem/routes/saveForm";

export default async function addServer(fastify: FastifyInstance) {
	formRoute(fastify);
	saveLineItem(fastify);
	fastify.pluginLoaded("Line-Item");
}
