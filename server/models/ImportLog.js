import mongoose from "mongoose";
const importLogSchema = new mongoose.Schema({
  timestamp: Date,
  sourceUrl: String,
  totalFetched: Number,
  newJobs: Number,
  updatedJobs: Number,
  failedJobs: Number,
  failedReasons: [Object],
});
export default mongoose.model("ImportLog", importLogSchema);
