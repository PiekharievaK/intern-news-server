import type { FastifyInstance } from "fastify";
import { createLineItemController } from "../utils/createCntroller";
import { schema } from "../schemas/form.schema";

export const saveLineItemRoute = (fastify: FastifyInstance) => {
	fastify.post(
		"/save",
		{
			schema,
			// preValidation: [fastify.authenticate]
		},
		async (req, reply) => {
			await createLineItemController(fastify, req, reply);
		},
	);
};
