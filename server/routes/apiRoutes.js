import express from "express";
import ImportLog from "../models/ImportLog.js";
import HigherEdLog from "../models/HigherEdLog.js";
import Job from "../models/Job.js";
import Article from "../models/Article.js";

const router = express.Router();

router.get("/", (req, res) => res.send("✅ Job Importer is running."));

router.get("/logs", async (req, res) =>
  res.json(await ImportLog.find().sort({ timestamp: -1 }).limit(50))
);

router.get("/articles/logs", async (req, res) =>
  res.json(await HigherEdLog.find().sort({ timestamp: -1 }).limit(50))
);

router.get("/jobs", async (req, res) =>
  res.json(await Job.find().sort({ pubDate: -1 }).limit(50))
);

router.get("/articles", async (req, res) =>
  res.json(await Article.find().sort({ pubDate: -1 }).limit(50))
);

export default router;
