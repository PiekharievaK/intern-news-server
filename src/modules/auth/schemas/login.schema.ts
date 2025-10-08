import { errorSchema } from "../../../types/errorSchema";

export const schema = {
	body: {
		type: "object",
		required: ["email", "password"],
		properties: {
			email: { type: "string", format: "email", default: "usertest@gmail.com" },
			password: { type: "string", minLength: 6, default: "usertest@gmail.com" },
		},
	},
	response: {
		200: {
			type: "object",
			properties: {
				login: { type: "string" },
			},
			required: ["login"],
			additionalProperties: false,
		},
		400: errorSchema,
		500: errorSchema,
	},
};
