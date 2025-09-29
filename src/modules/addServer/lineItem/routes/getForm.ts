import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { formController } from "../utils/formController";

export const formRoute = (fastify: FastifyInstance) =>{
  fastify.get(
    "/form",
    // { preValidation: [fastify.authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      await formController(fastify, request, reply);
    }
  );
}
