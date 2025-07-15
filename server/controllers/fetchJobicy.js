import axios from "axios";
import xml2js from "xml2js";
import Job from "../models/Job.js";
import ImportLog from "../models/ImportLog.js";
import { jobicyUrls } from "../config/constants.js";


export async function fetchJobicyFeeds() {
  const xml2jsParser = new xml2js.Parser({ explicitArray: false, attrkey: "$" });

  for (const url of jobicyUrls) {
    const log = {
      timestamp: new Date(),
      sourceUrl: url,
      totalFetched: 0,
      newJobs: 0,
      updatedJobs: 0,
      failedJobs: 0,
      failedReasons: [],
    };

    try {
      const res = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      const parsed = await xml2jsParser.parseStringPromise(res.data);
      const items = parsed?.rss?.channel?.item || [];
      const jobs = Array.isArray(items) ? items : [items];

      log.totalFetched = jobs.length;

      for (const job of jobs) {
        try {
          const guidValue = typeof job.guid === "object" ? job.guid._ : job.guid;

          const jobData = {
            title: job.title || "",
            link: job.link || "",
            pubDate: job.pubDate || "",
            guid: guidValue || "",
            description: job.description || "",
            location: job["job_listing:location"] || "",
            company: job["job_listing:company"] || "",
            jobType: job["job_listing:job_type"] || "",
            image: job["media:content"]?.$?.url || "",
            source: "Jobicy",
          };

          if (!jobData.link) {
            log.failedJobs++;
            log.failedReasons.push({ title: job.title || "Unknown", reason: "Missing link" });
            continue;
          }

          const existing = await Job.findOne({ link: jobData.link });

          if (existing) {
            await Job.updateOne({ _id: existing._id }, jobData);
            log.updatedJobs++;
            console.log("🔄 Updated:", jobData.title);
          } else {
            await Job.create(jobData);
            log.newJobs++;
            console.log("✅ Inserted:", jobData.title);
          }
        } catch (err) {
          log.failedJobs++;
          log.failedReasons.push({ link: job?.link || "N/A", reason: err.message });
          console.error("❌ Jobicy insert failed:", job?.title || "Unknown", err.message);
        }
      }
    } catch (err) {
      console.error("❌ Jobicy fetch failed:", err.message);
      log.failedJobs++;
      log.failedReasons.push({ reason: err.message });
    }

    await ImportLog.create(log);
  }
}
