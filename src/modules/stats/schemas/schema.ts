import { errorSchema } from "../../../types/errorSchema";

const statsItemSchema = {
	type: "object",
	properties: {
		eventType: { type: "string" },
		timestamp: { type: "string", format: "date-time" },
	},
	required: ["eventType", "timestamp"],
	additionalProperties: true,
};

export const schema = {
	querystring: {
		type: "object",
		properties: {
			eventType: { type: "string" },
			format: {
				type: "string",
				enum: ["json", "csv", "excel"],
			},
			page: {
				type: "integer",
				minimum: 1,
				default: 1,
			},
		},
		additionalProperties: false,
	},

	response: {
		200: {
			type: "object",
			properties: {
				data: {
					type: "array",
					items: statsItemSchema,
				},
				totalRecords: { type: "integer" },
			},
			required: ["data", "totalRecords"],
		},

		400: errorSchema,
		500: errorSchema,
	},
} as const;
