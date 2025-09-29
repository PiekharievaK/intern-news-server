import { errorSchema } from "../../../../types/errorSchema";

export const schema = {
	summary: "Create line item with file upload",
	consumes: ["multipart/form-data"],
	requestBody: {
		content: {
			"multipart/form-data": {
				schema: {
					type: "object",
					properties: {
						size: {
							type: "array",
							items: { type: "number" },
							minItems: 2,
							maxItems: 2,
							description: "Array with width and height",
						},
						minCPM: { type: "number", minimum: 0 },
						maxCPM: { type: "number", minimum: 0 },
						geo: { type: "string" },
						frequency: { type: "integer", minimum: 1 },
						file: {
							type: "string",
							format: "binary",
							description: "Image file",
						},
					},
					required: ["size", "minCPM", "maxCPM", "geo", "frequency", "file"],
				},
			},
		},
	},
	responses: {
		200: {
			description: "Success",
			type: "object",
			properties: {
				message: { type: "string" },
			},
		},
		400: errorSchema,
	},
};
