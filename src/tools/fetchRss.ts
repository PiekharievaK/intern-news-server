import { parseFeed } from "../modules/feedParser/services/feedParser.service";

async function main() {
	const url = "https://feeds.bbci.co.uk/news/world/rss.xml";
	console.log("URL to parse:", url);
	try {
		const items = await parseFeed(url);
		console.log(items[0]);
		console.log(`Parsed ${items.length} items:\n`);
		items.slice(0, 5).forEach((item, index) => {
			console.log(`${index + 1}. ${item.title}`);
			console.log(`   URL: ${item.newsUrl}`);
			console.log(`   img: ${item.image}`);
			console.log(`   Date: ${item.pubDate}`);
			console.log(`   Snippet: ${item.content?.slice(0, 100)}\n`);
		});
	} catch (err) {
		console.error("❌ Failed to parse feed:", err);
	}
}

main();
