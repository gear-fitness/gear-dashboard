import { useEffect, useState } from "react";
import { fetchIssues, type Issue } from "./github";

export default function IssuesPanel() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await fetchIssues(6);
      setIssues(data);
      setLoading(false);
    };

    load();
    const interval = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-icon" style={{ color: "#3fb950" }}>
          ●
        </span>
        <h2>Issues</h2>
        <span className="panel-badge">{issues.length}</span>
      </div>
      <div className="panel-body">
        {loading ? (
          <div className="panel-loading">loading...</div>
        ) : issues.length === 0 ? (
          <div className="panel-empty">No issues found</div>
        ) : (
          <ul className="issue-list">
            {issues.map((issue) => (
              <li key={issue.number} className="issue-item">
                <div className="issue-top">
                  <span
                    className={`issue-state ${issue.state === "open" ? "state-open" : "state-closed"}`}
                  >
                    {issue.state === "open" ? "○" : "●"}
                  </span>
                  <span className="issue-title">{issue.title}</span>
                </div>
                <div className="issue-meta">
                  <span className="issue-number">#{issue.number}</span>
                  <span className="issue-author">{issue.author}</span>
                  <span className="issue-time">{issue.createdAt}</span>
                  {issue.labels.map((label) => (
                    <span
                      key={label.name}
                      className="issue-label"
                      style={{
                        backgroundColor: `#${label.color}22`,
                        color: `#${label.color}`,
                        borderColor: `#${label.color}44`,
                      }}
                    >
                      {label.name}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
