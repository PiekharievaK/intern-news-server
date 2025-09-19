import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	try {
		const newsItem = await prisma.newsPreview.create({
			data: {
				title: "Test News",
				image: "https://example.com/image.jpg",
				sourceUrl: "https://example.com",
				newsUrl: "https://example.com/news/1",
				content: "Short content",
			},
		});

		console.log("Success:", newsItem);
	} catch (error) {
		console.error("Error:", error);
	} finally {
		await prisma.$disconnect();
	}
}

main();
