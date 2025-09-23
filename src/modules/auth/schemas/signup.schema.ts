import { errorSchema } from "../../../types/errorSchema";

export const schema = {
	body: {
		type: "object",
		required: ["email", "password", "login"],
		properties: {
			email: { type: "string", format: "email" },
			password: { type: "string", minLength: 6 },
			login: { type: "string", minLength: 3 },
		},
	},
	response: {
		200: {
			type: "object",
			properties: {
				id: { type: "string" },
				login: { type: "string" },
			},
			required: ["id", "login"],
			additionalProperties: false,
		},
		400: errorSchema,
		500: errorSchema,
	},
};
