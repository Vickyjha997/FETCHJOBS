function LogsTable({ logs, title }) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <h2>{title}</h2>
      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Source</th>
            <th>Total</th>
            <th>Inserted</th>
            <th>Updated</th>
            <th>Failed</th>
            <th>Failure Reasons</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, i) => (
            <tr key={i}>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
              <td>{log.sourceUrl}</td>
              <td>{log.totalFetched}</td>
              <td>{log.newJobs ?? log.newArticles}</td>
              <td>{log.updatedJobs ?? log.updatedArticles}</td>
              <td>{log.failedJobs ?? log.failedArticles}</td>
              <td>
                <ul>
                  {log.failedReasons.map((r, j) => (
                    <li key={j}>
                      {r.title || r.link || "Unknown"} - {r.reason}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LogsTable;
