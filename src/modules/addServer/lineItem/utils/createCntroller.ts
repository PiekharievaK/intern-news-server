import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

export const createLineItemController = async (
	fastify: FastifyInstance,
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	fastify.log.info("createLineItemController called");

	const file = await request.file();

	if (!file) {
		return reply.badRequest("File is required");

	}

	const fields = file.fields as Record<string, any>;

	const widthField = fields.width;
	const heightField = fields.height;
	const minCPMField = fields.minCPM;
	const maxCPMField = fields.maxCPM;
	const geoField = fields.geo;
	const frequencyField = fields.frequency;

	if (
		!widthField?.value?.trim() ||
		!heightField?.value?.trim() ||
		!minCPMField?.value?.trim() ||
		!maxCPMField?.value?.trim() ||
		!geoField?.value?.trim() ||
		!frequencyField?.value?.trim()
	) {
		return reply.badRequest("All fields are required");
	}

	const width = parseInt(widthField.value, 10);
	const height = parseInt(heightField.value, 10);
	const minCPM = parseFloat(minCPMField.value);
	const maxCPM = parseFloat(maxCPMField.value);
	const frequency = parseInt(frequencyField.value, 10);
	const geo = geoField.value;

	if (
		Number.isNaN(width) ||
		width <= 0 ||
		Number.isNaN(height) ||
		height <= 0 ||
		Number.isNaN(minCPM) ||
		minCPM < 0 ||
		Number.isNaN(maxCPM) ||
		maxCPM < minCPM ||
		Number.isNaN(frequency) ||
		frequency < 0
	) {
		return reply.badRequest("Invalid numeric form data");
	}

	const uploadDir = path.join(process.cwd(), "uploads");
	const filename = `${randomUUID()}${path.extname(file.filename || "file")}`;
	const uploadPath = path.join(uploadDir, filename);

	await fs.promises.mkdir(uploadDir, { recursive: true });

	await new Promise<void>((resolve, reject) => {
		const writeStream = fs.createWriteStream(uploadPath);
		file.file.pipe(writeStream);
		file.file.on("error", reject);
		writeStream.on("error", reject);
		writeStream.on("finish", resolve);
	});

	const sizeArray = [width, height];

	const lineItem = await fastify.prisma.lineItem.create({
		data: {
			size: sizeArray,
			minCPM,
			maxCPM,
			geo,
			adType: "banner",
			frequency,
			creativePath: `/uploads/${filename}`,
		},
	});

	fastify.log.info("✅ [DB] Line item saved to DB.");
	return reply.status(200).send({ success: true, lineItem });
};
