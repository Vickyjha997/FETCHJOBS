// import express from "express";
// import cors from "cors";
// import axios from "axios";
// import { XMLParser as FastXMLParser } from "fast-xml-parser";
// import xml2js from "xml2js";
// import mongoose from "mongoose";
// import dotenv from "dotenv";

// dotenv.config();
// const app = express();
// app.use(cors());
// const PORT = process.env.PORT || 3000;
// const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/job_importer";

// // ------------------ MongoDB Schemas ------------------

// // Jobicy
// const jobSchema = new mongoose.Schema({}, { strict: false });
// const Job = mongoose.model("Job", jobSchema);

// const importLogSchema = new mongoose.Schema({
//   timestamp: Date,
//   sourceUrl: String,
//   totalFetched: Number,
//   newJobs: Number,
//   updatedJobs: Number,
//   failedJobs: Number,
//   failedReasons: [Object],
// });
// const ImportLog = mongoose.model("ImportLog", importLogSchema);

// // HigherEdJobs
// const articleSchema = new mongoose.Schema({}, { strict: false });
// const Article = mongoose.model("Article", articleSchema);

// const higherEdLogSchema = new mongoose.Schema({
//   timestamp: Date,
//   sourceUrl: String,
//   totalFetched: Number,
//   newArticles: Number,
//   updatedArticles: Number,
//   failedArticles: Number,
//   failedReasons: [Object],
// });
// const HigherEdLog = mongoose.model("HigherEdLog", higherEdLogSchema);

// // ------------------ Feed URLs ------------------
// const jobicyUrls = [
//   "https://jobicy.com/?feed=job_feed",
//   "https://jobicy.com/?feed=job_feed&job_categories=smm&job_types=full-time",
//   "https://jobicy.com/?feed=job_feed&job_categories=seller&job_types=full-time&search_region=france",
//   "https://jobicy.com/?feed=job_feed&job_categories=design-multimedia",
//   "https://jobicy.com/?feed=job_feed&job_categories=data-science",
//   "https://jobicy.com/?feed=job_feed&job_categories=copywriting",
//   "https://jobicy.com/?feed=job_feed&job_categories=business",
//   "https://jobicy.com/?feed=job_feed&job_categories=management",
// ];

// const higherEdUrl = "https://www.higheredjobs.com/rss/articleFeed.cfm";

// // ------------------ Jobicy Fetch ------------------
// async function fetchJobicyFeeds() {
//   const xml2jsParser = new xml2js.Parser({ explicitArray: false, attrkey: "$" });

//   for (const url of jobicyUrls) {
//     const log = {
//       timestamp: new Date(),
//       sourceUrl: url,
//       totalFetched: 0,
//       newJobs: 0,
//       updatedJobs: 0,
//       failedJobs: 0,
//       failedReasons: [],
//     };

//     try {
//       const res = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" } });
//       const parsed = await xml2jsParser.parseStringPromise(res.data);
//       const items = parsed?.rss?.channel?.item || [];
//       const jobs = Array.isArray(items) ? items : [items];

//       log.totalFetched = jobs.length;

//       for (const job of jobs) {
//         try {
//           const guidValue = typeof job.guid === "object" ? job.guid._ : job.guid;

//           const jobData = {
//             title: job.title || "",
//             link: job.link || "",
//             pubDate: job.pubDate || "",
//             guid: guidValue || "",
//             description: job.description || "",
//             location: job["job_listing:location"] || "",
//             company: job["job_listing:company"] || "",
//             jobType: job["job_listing:job_type"] || "",
//             image: job["media:content"]?.$?.url || "",
//             source: "Jobicy",
//           };

//           if (!jobData.link) {
//             log.failedJobs++;
//             log.failedReasons.push({ title: job.title || "Unknown", reason: "Missing link" });
//             continue;
//           }

//           const existing = await Job.findOne({ link: jobData.link });

//           if (existing) {
//             await Job.updateOne({ _id: existing._id }, jobData);
//             log.updatedJobs++;
//             console.log("🔄 Updated:", jobData.title);
//           } else {
//             await Job.create(jobData);
//             log.newJobs++;
//             console.log("✅ Inserted:", jobData.title);
//           }
//         } catch (err) {
//           log.failedJobs++;
//           log.failedReasons.push({ link: job?.link || "N/A", reason: err.message });
//           console.error("❌ Jobicy insert failed:", job?.title || "Unknown", err.message);
//         }
//       }
//     } catch (err) {
//       console.error("❌ Jobicy fetch failed:", err.message);
//       log.failedJobs++;
//       log.failedReasons.push({ reason: err.message });
//     }

//     await ImportLog.create(log);
//   }
// }

// // ------------------ HigherEdJobs Fetch ------------------
// async function fetchHigherEdJobs() {

//   const fastParser = new FastXMLParser({ ignoreAttributes: false });

//   const log = {
//     timestamp: new Date(),
//     sourceUrl: higherEdUrl,
//     totalFetched: 0,
//     newArticles: 0,
//     updatedArticles: 0,
//     failedArticles: 0,
//     failedReasons: [],
//   };

//   try {
//     // Use the ScraperAPI key from .env and add render=true
// const proxyUrl = `https://api.scraperapi.com?api_key=${process.env.SCRAPER_API_KEY}&url=${encodeURIComponent(higherEdUrl)}`;

//     console.log("📡 Fetching HigherEdJobs feed via ScraperAPI...");
    
//     const res = await axios.get(proxyUrl, {
//       headers: {
//         "User-Agent": "Mozilla/5.0"
//       },
//       timeout: 50000 // Increase timeout to 50 seconds
//     });

//     const parsed = fastParser.parse(res.data);

//     if (!parsed?.rss?.channel?.item) {
//       console.log("❌ No <item> array found in feed!");
//       console.dir(parsed, { depth: null });
//     }

//     const items = parsed?.rss?.channel?.item || [];
//     const articles = Array.isArray(items) ? items : [items];

//     console.log("🔎 Parsed articles:", articles.length);
//     console.log("🔎 Sample article:", articles[0]);

//     log.totalFetched = articles.length;

//     for (const article of articles) {
//       try {
//         const guidValue =
//           typeof article.guid === "object"
//             ? article.guid?.["#text"] || article.guid?._ || ""
//             : article.guid;

//         const articleData = {
//           title: article.title || "",
//           link: article.link || "",
//           pubDate: new Date(article.pubDate).toISOString(),
//           guid: guidValue || "",
//           description: article.description || "",
//           author: article.author || "",
//           source: "HigherEdJobs",
//         };

//         if (!articleData.link) {
//           log.failedArticles++;
//           log.failedReasons.push({ title: article.title || "Unknown", reason: "Missing link" });
//           continue;
//         }

//         const existing = await Article.findOne({ link: articleData.link });

//         if (existing) {
//           await Article.updateOne({ _id: existing._id }, articleData);
//           log.updatedArticles++;
//           console.log("🔄 Updated:", articleData.title);
//         } else {
//           await Article.create(articleData);
//           log.newArticles++;
//           console.log("✅ Inserted:", articleData.title);
//         }
//       } catch (err) {
//         log.failedArticles++;
//         log.failedReasons.push({
//           link: article?.link || "N/A",
//           reason: err.message,
//         });
//         console.error("❌ Article insert failed:", article?.title || "Unknown", err.message);
//       }
//     }
//   } catch (err) {
//     console.error("❌ HigherEdJobs fetch failed:", err.message);
//     log.failedArticles++;
//     log.failedReasons.push({ reason: err.message });
//   }

//   await HigherEdLog.create(log);
// }



// // ------------------ Master Import Function ------------------
// async function fetchAndSaveJobs() {
//     console.log("📥 Starting job/article fetch...");
//     await fetchHigherEdJobs(); // just the HigherEd feed
//     console.log("📥 Starting job/article fetch from jobicy...")
//     await fetchJobicyFeeds();
// }

// // ------------------ Express API ------------------
// app.get("/", (req, res) => res.send("✅ Job Importer is running."));
// app.get("/logs", async (req, res) =>
//   res.json(await ImportLog.find().sort({ timestamp: -1 }).limit(50))
// );
// app.get("/articles/logs", async (req, res) =>
//   res.json(await HigherEdLog.find().sort({ timestamp: -1 }).limit(50))
// );
// app.get("/jobs", async (req, res) =>
//   res.json(await Job.find().sort({ pubDate: -1 }).limit(50))
// );
// app.get("/articles", async (req, res) =>
//   res.json(await Article.find().sort({ pubDate: -1 }).limit(50))
// );

// // ------------------ Start Server ------------------
// mongoose.connect(MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => {
//   console.log("✅ MongoDB connected");
//   app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
//   fetchAndSaveJobs(); // Initial run
//   setInterval(fetchAndSaveJobs, 1000 * 60 * 60); // Hourly
// })
// .catch((err) => {
//   console.error("❌ MongoDB connection error:", err.message);
// });

 
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import apiRoutes from "./routes/apiRoutes.js";
import { fetchAndSaveJobs } from "./controllers/fetchMaster.js";

dotenv.config();
const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use("/", apiRoutes);

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    fetchAndSaveJobs(); // initial fetch
    setInterval(fetchAndSaveJobs, 1000 * 60 * 60); // hourly
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
