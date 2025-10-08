import { errorSchema } from "../../../types/errorSchema";

export const schema = {
	body: {
		type: "object",
		required: ["email", "password", "login"],
		properties: {
			email: {
				type: "string",
				format: "email",
				default: "user1test@gmail.com",
			},
			password: {
				type: "string",
				minLength: 6,
				default: "user1test@gmail.com",
			},
			login: { type: "string", minLength: 3, default: "user1test" },
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
