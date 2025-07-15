import { useEffect, useState } from "react";
import LogsTable from "./components/LogsTable";

function App() {
  const [jobLogs, setJobLogs] = useState([]);
  const [articleLogs, setArticleLogs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/logs")
      .then((res) => res.json())
      .then((data) => setJobLogs(data))
      .catch((err) => console.error("Job logs fetch error:", err));

    fetch("http://localhost:3000/articles/logs")
      .then((res) => res.json())
      .then((data) => setArticleLogs(data))
      .catch((err) => console.error("Article logs fetch error:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>📊 Job Import Logs</h1>
      <LogsTable logs={jobLogs} title="Jobicy Logs" />
      <LogsTable logs={articleLogs} title="HigherEdJobs Logs" />
    </div>
  );
}

export default App;
