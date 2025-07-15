import axios from "axios";
import { XMLParser as FastXMLParser } from "fast-xml-parser";
import Article from "../models/Article.js";
import HigherEdLog from "../models/HigherEdLog.js";
import { higherEdUrl } from "../config/constants.js";



export async function fetchHigherEdJobs() {

  const fastParser = new FastXMLParser({ ignoreAttributes: false });

  const log = {
    timestamp: new Date(),
    sourceUrl: higherEdUrl,
    totalFetched: 0,
    newArticles: 0,
    updatedArticles: 0,
    failedArticles: 0,
    failedReasons: [],
  };

  try {
    // Use the ScraperAPI key from .env and add render=true
const proxyUrl = `https://api.scraperapi.com?api_key=${process.env.SCRAPER_API_KEY}&url=${encodeURIComponent(higherEdUrl)}`;

    console.log("📡 Fetching HigherEdJobs feed via ScraperAPI...");
    
    const res = await axios.get(proxyUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      },
      timeout: 50000 // Increase timeout to 50 seconds
    });

    const parsed = fastParser.parse(res.data);

    if (!parsed?.rss?.channel?.item) {
      console.log("❌ No <item> array found in feed!");
      console.dir(parsed, { depth: null });
    }

    const items = parsed?.rss?.channel?.item || [];
    const articles = Array.isArray(items) ? items : [items];

    console.log("🔎 Parsed articles:", articles.length);
    console.log("🔎 Sample article:", articles[0]);

    log.totalFetched = articles.length;

    for (const article of articles) {
      try {
        const guidValue =
          typeof article.guid === "object"
            ? article.guid?.["#text"] || article.guid?._ || ""
            : article.guid;

        const articleData = {
          title: article.title || "",
          link: article.link || "",
          pubDate: new Date(article.pubDate).toISOString(),
          guid: guidValue || "",
          description: article.description || "",
          author: article.author || "",
          source: "HigherEdJobs",
        };

        if (!articleData.link) {
          log.failedArticles++;
          log.failedReasons.push({ title: article.title || "Unknown", reason: "Missing link" });
          continue;
        }

        const existing = await Article.findOne({ link: articleData.link });

        if (existing) {
          await Article.updateOne({ _id: existing._id }, articleData);
          log.updatedArticles++;
          console.log("🔄 Updated:", articleData.title);
        } else {
          await Article.create(articleData);
          log.newArticles++;
          console.log("✅ Inserted:", articleData.title);
        }
      } catch (err) {
        log.failedArticles++;
        log.failedReasons.push({
          link: article?.link || "N/A",
          reason: err.message,
        });
        console.error("❌ Article insert failed:", article?.title || "Unknown", err.message);
      }
    }
  } catch (err) {
    console.error("❌ HigherEdJobs fetch failed:", err.message);
    log.failedArticles++;
    log.failedReasons.push({ reason: err.message });
  }

  await HigherEdLog.create(log);
}

