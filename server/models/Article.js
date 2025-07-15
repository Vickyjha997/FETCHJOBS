import mongoose from "mongoose";
const articleSchema = new mongoose.Schema({}, { strict: false });
export default mongoose.model("Article", articleSchema);
