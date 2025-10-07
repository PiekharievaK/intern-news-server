import type { FromSchema } from "json-schema-to-ts";

export const EnvSchema = {
	type: "object",
	properties: {
		PORT: { type: "number" },
		HOST: { type: "string" },
		DEFAULT_FEED_URL: { type: "string" },
		DATABASE_URL: { type: "string" },
		JWT_SECRET: { type: "string" },
		SERVER_URL: { type: "string" },
		CLICK_USER: { type: "string" },
		CLICK_URL: { type: "string" },
		CLICK_PASSWORD: { type: "string" },
		CLICK_TABLE: { type: "string" },
	},
	required: [
		"PORT",
		"HOST",
		"DEFAULT_FEED_URL",
		"DATABASE_URL",
		"JWT_SECRET",
		"SERVER_URL",
		"CLICK_USER",
		"CLICK_URL",
		"CLICK_PASSWORD",
		"CLICK_TABLE",
	],
	additionalProperties: false,
} as const;

export type Config = FromSchema<typeof EnvSchema>;
