import { errorSchema } from "../../../types/errorSchema";

export const schema = {
	params: {
		type: "object",
		properties: {
			id: { type: "string" },
		},
		required: ["id"],
		additionalProperties: false,
	},
	response: {
		200: {
			type: "object",
			properties: {
				id: { type: "string" },
				title: { type: "string" },
				image: { type: "string" },
				pubDate: { type: "string", format: "date-time" },
				sourceUrl: { type: "string", format: "uri" },
				newsUrl: { type: "string", format: "uri" },
				content: { type: "string" },
				previewId: { type: "string" },
				createdAt: { type: "string", format: "date-time" },
			},
			required: [
				"id",
				"title",
				"sourceUrl",
				"newsUrl",
				"content",
				"previewId",
				"createdAt",
			],
			additionalProperties: false,
		},
		400: errorSchema,
		500: errorSchema,
	},
} as const;
