import { useEffect, useState } from "react";
import LogsTable from "./components/LogsTable";

function App() {
  const [jobLogs, setJobLogs] = useState([]);
  const [articleLogs, setArticleLogs] = useState([]);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    // Fetch Jobicy logs
    fetch(`${API_BASE_URL}/logs`)
      .then((res) => res.json())
      .then((data) => setJobLogs(data))
      .catch((err) => console.error("Job logs fetch error:", err));

    // Fetch HigherEdJobs logs
    fetch(`${API_BASE_URL}/articles/logs`)
      .then((res) => res.json())
      .then((data) => setArticleLogs(data))
      .catch((err) => console.error("Article logs fetch error:", err));
  }, [API_BASE_URL]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>📊 Job Import Logs</h1>
      <LogsTable logs={jobLogs} title="Jobicy Logs" />
      <LogsTable logs={articleLogs} title="HigherEdJobs Logs" />
    </div>
  );
}

export default App;
