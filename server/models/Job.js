import mongoose from "mongoose";
const jobSchema = new mongoose.Schema({}, { strict: false });
export default mongoose.model("Job", jobSchema);
