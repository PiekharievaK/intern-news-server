import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Parser } from "json2csv";
import ExcelJS from "exceljs";

export const getStatsController = async (
	fastify: FastifyInstance,
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	const {
		from,
		to,
		eventType,
		format,
		page = 1,
	} = request.query as {
		from?: string;
		to?: string;
		eventType?: string;
		format?: "json" | "csv" | "excel";
		page?: number;
	};

	const pageSize = 15;
	const filters: string[] = [];

	if (from) filters.push(`timestamp >= toDateTime('${from}')`);
	if (to) filters.push(`timestamp <= toDateTime('${to}')`);
	if (eventType) filters.push(`eventType = '${eventType}'`);
	const whereClause =
		filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

	try {
		const countQuery = `SELECT COUNT(*) AS total FROM ${fastify.config.CLICK_TABLE} ${whereClause}`;
		const countResult = await fastify.clickhouse.query({
			query: countQuery,
			format: "JSON",
		});

		const { data: countData }: { data: { total: number }[] } =
			await countResult.json();

		const totalRecords = countData?.[0]?.total || 0;

		let query = `SELECT * FROM ${fastify.config.CLICK_TABLE} ${whereClause} ORDER BY timestamp DESC`;
		if (format !== "csv" && format !== "excel") {
			query += ` LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}`;
		}

		const result = await fastify.clickhouse.query({
			query,
			format: "JSON",
		});
		const { data } = await result.json();

		const expandedData = data;

		if (format === "csv") {
			const parser = new Parser();
			const csv = parser.parse(expandedData);
			reply.header("Content-Type", "text/csv");
			reply.header("Content-Disposition", 'attachment; filename="stats.csv"');
			return reply.status(200).send(csv);
		}

		if (format === "excel") {
			const workbook = new ExcelJS.Workbook();
			const sheet = workbook.addWorksheet("Stats");
			if (expandedData.length > 0) {
				sheet.columns = Object.keys(expandedData[0] as object).map((key) => ({
					header: key,
					key,
				}));
				for (const row of expandedData) {
					sheet.addRow(row);
				}
			}

			const buffer = await workbook.xlsx.writeBuffer();
			reply.header(
				"Content-Type",
				"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			);
			reply.header("Content-Disposition", 'attachment; filename="stats.xlsx"');
			return reply.status(200).send(buffer);
		}

		return reply.status(200).send({
			data: expandedData,
			totalRecords,
		});
	} catch (error) {
		fastify.log.error("Error while fetching count or data:", error);
		return reply.internalServerError();
	}
};
