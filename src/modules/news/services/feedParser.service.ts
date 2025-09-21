import Parser from "rss-parser";

export interface ParsedNewsItem {
	title: string;
	image?: string;
	pubDate?: string;
	sourceUrl: string;
	newsUrl: string;
	content?: string;
}

const parser = new Parser();

export const parseFeed = async (url: string): Promise<ParsedNewsItem[]> => {
	try {
		const feed = await parser.parseURL(url);

		return (feed.items || []).map((item) => ({
			title: item.title || "",
			image:
				item.enclosure?.url ||
				item.mediaContent?.url ||
				item.mediaThumbnail?.url ||
				feed.image?.url,
			pubDate: item.pubDate ? new Date(item.pubDate).toISOString() : undefined,
			sourceUrl: url,
			newsUrl: item.link || "",
			content: item.contentSnippet || "",
		}));
	} catch (error) {
		console.error("RSS parse error:", error);
		throw new Error("Failed to parse RSS feed");
	}
};
