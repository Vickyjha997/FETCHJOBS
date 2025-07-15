import { fetchJobicyFeeds } from "./fetchJobicy.js";
import { fetchHigherEdJobs } from "./fetchHigherEd.js";

export async function fetchAndSaveJobs() {
  console.log("📥 Starting job/article fetch from jobicy...");
  await fetchJobicyFeeds();
  console.log("📥 Starting job/article fetch...");
  await fetchHigherEdJobs();
}
