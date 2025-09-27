import fastifySchedule from "@fastify/schedule";
import fp from "fastify-plugin";
const { SimpleIntervalJob, AsyncTask } = require("toad-scheduler");

const pluginName = "cron-plugin";

export default fp(
	async (fastify) => {
		const task = new AsyncTask(
			"update-news",
			async () => {
				const url = `${fastify.config.SERVER_URL}/news?force=1`;
				console.log(url);
				try {
					const response = await fetch(url);
					console.log("News updated:", response.ok);
				} catch (error) {
					console.error("Error fetching news:", error);
				}
			},
			(err) => {
				console.error("Task failed:", err);
			},
		);

		const job = new SimpleIntervalJob({ hours: 5 }, task);

		fastify.register(fastifySchedule);

		fastify.ready().then(() => {
			fastify.scheduler.addSimpleIntervalJob(job);
			console.log("News update task scheduled every minute");
		});

		fastify.pluginLoaded(pluginName);
	},
	{
		name: pluginName,
	},
);
