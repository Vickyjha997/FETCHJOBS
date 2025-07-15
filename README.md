# FETCHJOBS

A full-stack job importer and monitoring system that fetches job feeds from multiple RSS sources (e.g., Jobicy and HigherEdJobs), saves them into MongoDB, tracks import logs, and provides a frontend dashboard to view the results.

## 🗂️ Project Structure

FETCHJOBS/
- ├── client/ # React frontend for viewing logs and job data
- ├── server/ # Node.js + Express + Mongoose backend
- ├── .gitignore
- ├── README.md

  
---

## 🚀 Features

### Backend (`/server`)
- Built with **Node.js**, **Express**, and **Mongoose**
- Fetches jobs from:
  - [Jobicy](https://jobicy.com/?feed=job_feed)
  - [HigherEdJobs](https://www.higheredjobs.com/rss/articleFeed.cfm) via ScraperAPI
- Stores and updates data in **MongoDB**
- Logs total fetched, inserted, updated, and failed records
- Exposes APIs:
  - `/logs` – Jobicy import logs
  - `/articles/logs` – HigherEdJobs import logs
  - `/jobs` – Latest jobs
  - `/articles` – Latest articles

### Frontend (`/client`)
- Built with **React**
- Displays job import logs in tabular format
- Fetches data from backend APIs
- Provides a clean UI for job monitoring

---

## 📦 Getting Started

### Prerequisites
- Node.js
- MongoDB (local or Atlas)
- ScraperAPI Key (for HigherEdJobs)
- Vercel (for deployment)

---

## 🛠️ Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Vickyjha997/FETCHJOBS.git
cd FETCHJOBS
```

### 2. Backend Setup
## .env
- PORT= YOUR_PORT
- MONGO_URI= YOUR_MONG_DB_CONNECTION_URI
- SCRAPER_API_KEY=your_scraper_api_key

```bash
cd server
npm install
npm start
```

### Frontend Setup

```bash
cd ../client
npm install
npm run dev
```








