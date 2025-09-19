import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	const items = await prisma.newsItem.findMany();
	console.log("News Items:", items);
}

main()
	.catch((e) => {
		console.error("❌ Error:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
