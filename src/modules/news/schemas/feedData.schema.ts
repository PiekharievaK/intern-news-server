import { errorSchema } from "../../../types/errorSchema";

export const schema = {
	querystring: {
		type: "object",
		properties: {
			url: { type: "string", format: "uri" },
			force: { type: "string" },
		},
		additionalProperties: false,
	},
	response: {
		200: {
			type: "array",
			items: {
				type: "object",
				properties: {
					id: { type: "string" },
					title: { type: "string" },
					image: { type: "string" },
					sourceUrl: { type: "string" },
					newsUrl: { type: "string" },
					content: { type: "string" },
				},
				required: ["id", "title", "sourceUrl", "newsUrl", "content"],
				additionalProperties: false,
			},
		},
		400: errorSchema,
		500: errorSchema,
	},
} as const;
