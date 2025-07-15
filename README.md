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
## .env
- VITE_API_BASE_URL=https://03cc0e87b365.ngrok-free.app

  To generate
  ```bash
  npm i ngrok -g
  ngrok http 3000
  ```
  You will get a Link 
  

```bash
cd ../client
npm install
npm run dev
```

### 🌐 Vercel Deployment (Frontend Only)
- The frontend is deployed on Vercel and connects to the backend via a remote API URL (like https://xyz.ngrok-free.app).

## 🛠️ Environment Variables (Client)
- Inside /client/.env:

env
Copy
Edit
- VITE_API_BASE_URL=https://your-ngrok-url-or-backend-api
- 🔄 Steps to Deploy on Vercel
  Push code to GitHub
  Go to vercel.com
  Import GitHub repo
  Select client/ as Root Directory
  Set env var VITE_API_BASE_URL

## Deploy 🎉

📊 Features
- Imports Job feeds from Jobicy
- Imports Articles from HigherEdJobs
- Logs all imports: new, updated, failed, and reasons
- Modular backend architecture
- React dashboard showing logs in table

<img width="1366" height="768" alt="Screenshot (180)" src="https://github.com/user-attachments/assets/8f3e9baa-869a-40c7-b8dc-1f790844bb9d" />


- VERCEL LINK : https://fetchjobs.vercel.app/
- 🙋‍♂️ Author
- Vicky Jha
- GitHub: @Vickyjha997










