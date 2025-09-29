import { errorSchema } from "../../../../types/errorSchema";

export const adRequestSchema = {
	body: {
		type: "object",
		required: ["bids"],
		properties: {
			bids: {
				type: "array",
				minItems: 1,
				items: {
					type: "object",
					required: ["requestId", "sizes"],
					properties: {
						requestId: { type: "string" },
						aid: { type: "string" },
						sizes: {
							type: "array",
							minItems: 2,
							maxItems: 2,
							items: {
								anyOf: [{ type: "string" }, { type: "number" }],
							},
							description:
								"Array of [width, height], each item can be string or number",
						},
						placementId: { type: "string" },
					},
				},
			},
		},
		additionalProperties: false,
	},
	response: {
		200: {
			type: "object",
			properties: {
				body: {
					type: "object",
					properties: {
						bids: {
							type: "array",
							items: {
								type: "object",
								required: [
									"requestId",
									"cpm",
									"width",
									"height",
									"creativeId",
									"currency",
									"netRevenue",
									"ttl",
									"mediaType",
									"ad",
								],
								properties: {
									requestId: { type: "string" },
									cpm: { type: "number" },
									width: { type: "number" },
									height: { type: "number" },
									creativeId: { type: "string" },
									currency: { type: "string" },
									netRevenue: { type: "boolean" },
									ttl: { type: "integer" },
									mediaType: { type: "string" },
									ad: { type: "string" },
								},
							},
						},
					},
					required: ["bids"],
				},
			},
			additionalProperties: false,
		},
		400: errorSchema,
	},
};
