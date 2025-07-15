import mongoose from "mongoose";
const higherEdLogSchema = new mongoose.Schema({
  timestamp: Date,
  sourceUrl: String,
  totalFetched: Number,
  newArticles: Number,
  updatedArticles: Number,
  failedArticles: Number,
  failedReasons: [Object],
});
export default mongoose.model("HigherEdLog", higherEdLogSchema);
