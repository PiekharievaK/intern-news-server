import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import path from "path";
import fs from "fs/promises";

export const formController = async (
	fastify: FastifyInstance,
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	const htmlPath = path.join(process.cwd(), "pages/formPage.html");
	const html = await fs.readFile(htmlPath, "utf-8");

	reply.type("text/html").send(html);
};
