import * as cheerio from "cheerio";

export interface ParsedNewsItem {
	title: string;
	image?: string;
	pubDate?: string;
	sourceUrl: string;
	newsUrl: string;
	content?: string;
}

export const parsePage = async (
	url: string,
	sourceUrl: string,
): Promise<ParsedNewsItem> => {
	try {
		const res = await fetch(url);

		if (!res.ok) {
			throw new Error(`Failed to fetch page: ${res.status}`);
		}

		const html = await res.text();
		const $ = cheerio.load(html);

		const title =
			$("h1").first().text().trim() ||
			$("meta[property='og:title']").attr("content") ||
			$("title").text().trim();

		const image =
			$("meta[property='og:image']").attr("content") ||
			$("article img").first().attr("src");

		const pubDate =
			$("time[datetime]").attr("datetime") ||
			$("meta[property='article:published_time']").attr("content");

		const content =
			$("article").text().trim() ||
			$("main").text().trim() ||
			$("body").text().trim();

		if (!content || content.length < 100) {
			throw new Error("Content too short or missing");
		}

		return {
			title: title || "Untitled",
			image,
			pubDate: pubDate ? new Date(pubDate).toISOString() : undefined,
			sourceUrl,
			newsUrl: url,
			content,
		};
	} catch (err) {
		console.error("Page parse error:", err);
		throw new Error("Failed to parse HTML page");
	}
};
