import { errorSchema } from "../../../types/errorSchema";

export const schema = {
	querystring: {
		type: "object",
		properties: {
			url: { type: "string", format: "uri" },
			force: { type: "string" },
			page: { type: "string" },
		},
		additionalProperties: false,
	},
	response: {
		200: {
			type: "object",
			properties: {
				items: {
					type: "array",
					items: {
						type: "object",
						properties: {
							id: { type: "string" },
							title: { type: "string" },
							image: { type: "string" },
							sourceUrl: { type: "string", format: "uri" },
							newsUrl: { type: "string", format: "uri" },
							content: { type: "string" },
						},
						required: ["id", "title", "sourceUrl", "newsUrl", "content"],
						additionalProperties: false,
					},
				},
				totalCount: { type: "number" },
			},
			required: ["items", "totalCount"],
			additionalProperties: false,
		},
		400: errorSchema,
		500: errorSchema,
	},
} as const;
