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
				sourceUrl: { type: "string" },
				newsUrl: { type: "string" },
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
		404: {
			type: "object",
			properties: {
				error: { type: "string" },
			},
			required: ["error"],
			additionalProperties: false,
		},
		500: {
			type: "object",
			properties: {
				error: { type: "string" },
			},
			required: ["error"],
			additionalProperties: false,
		},
	},
} as const;
