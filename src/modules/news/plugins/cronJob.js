import fastifySchedule from "@fastify/schedule";
import fp from "fastify-plugin";
import { getFeedHandler } from "../utils/feed.controller";
const { SimpleIntervalJob, AsyncTask } = require("toad-scheduler");

const pluginName = "cron-plugin";

export default fp(
	async (fastify) => {
		const task = new AsyncTask(
			"update-news",
			async () => {
				try {
					await getFeedHandler(fastify, { query: { force: 1 } });
					fastify.log.info("News updated:");
				} catch (error) {
					fastify.log.error(error, "Error fetching news:");
				}
			},
			(err) => {
				fastify.log.error(err, "Task failed:");
			},
		);

		const job = new SimpleIntervalJob({ hours: 5 }, task);

		fastify.register(fastifySchedule);

		fastify.ready().then(() => {
			fastify.scheduler.addSimpleIntervalJob(job);
			fastify.log.info("News update task scheduled every 5 hours");
		});

		fastify.pluginLoaded(pluginName);
	},
	{
		name: pluginName,
	},
);
