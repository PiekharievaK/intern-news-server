import { Type } from "@sinclair/typebox";

export const schema = {
	querystring: Type.Object({
		url: Type.Optional(Type.String({ format: "uri" })),
		force: Type.Optional(Type.Union([Type.String(), Type.Number()])),
	}),
	response: {
		200: Type.Array(
			Type.Object({
				id: Type.String(),
				title: Type.String(),
				image: Type.Optional(Type.String()),
				sourceUrl: Type.String(),
				newsUrl: Type.String(),
				content: Type.Optional(Type.String()),
			}),
		),
		500: Type.Object({ error: Type.String() }),
	},
} as const;
