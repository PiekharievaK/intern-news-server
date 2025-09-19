import { Type } from "@sinclair/typebox";

export const schema = {
	params: Type.Object({
		id: Type.String(),
	}),
	response: {
		200: Type.Object({
			id: Type.String(),
			title: Type.String(),
			image: Type.Optional(Type.String()),
			pubDate: Type.Optional(Type.String({ format: "date-time" })),
			sourceUrl: Type.String(),
			newsUrl: Type.String(),
			content: Type.String(),
			previewId: Type.String(),
			createdAt: Type.String({ format: "date-time" }),
		}),
		404: Type.Object({
			error: Type.String(),
		}),
		500: Type.Object({
			error: Type.String(),
		}),
	},
} as const;
