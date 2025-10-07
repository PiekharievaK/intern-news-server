import { errorSchema } from "../../../types/errorSchema";

export const schema = {
	response: {
		200: {
			type: "object",
			properties: {
				message: { type: "string" },
			},
			required: ["message"],
			additionalProperties: false,
		},
		401: errorSchema,
		500: errorSchema,
	},
};
