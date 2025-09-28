import type { FastifyInstance } from "fastify";
import { signupRoute } from "./routes/signupRoute";
import { loginRoute } from "./routes/loginRoute";
import { logoutRoute } from "./routes/logoutRoute";

export default async function authModule(fastify: FastifyInstance) {
	signupRoute(fastify);
	loginRoute(fastify);
	logoutRoute(fastify);
	fastify.pluginLoaded("Auth");
}
