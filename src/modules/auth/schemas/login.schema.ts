import { errorSchema } from "../../../types/errorSchema";

export const schema = {
	body: {
		type: "object",
		required: ["email", "password"],
		properties: {
			email: { type: "string", format: "email" },
			password: { type: "string", minLength: 6 },
		},
	},
	response: {
		200: {
			type: "object",
			properties: {
				login: { type: "string" },
				token: { type: "string" },
			},
			required: ["login", "token"],
			additionalProperties: false,
		},
		400: errorSchema,
		500: errorSchema,
	},
};
