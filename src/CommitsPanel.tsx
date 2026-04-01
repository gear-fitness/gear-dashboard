import { useEffect, useState } from "react";
import { fetchCommits, type Commit } from "./github";

export default function CommitsPanel() {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await fetchCommits("develop", 8);
      setCommits(data);
      setLoading(false);
    };

    load();
    const interval = setInterval(load, 5 * 60 * 1000); // poll every 5 min
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-icon">●</span>
        <h2>Commits</h2>
        <span className="panel-badge">develop</span>
      </div>
      <div className="panel-body">
        {loading ? (
          <div className="panel-loading">loading...</div>
        ) : commits.length === 0 ? (
          <div className="panel-empty">No commits found</div>
        ) : (
          <ul className="commit-list">
            {commits.map((c) => (
              <li key={c.sha} className="commit-item">
                <div className="commit-top">
                  <code className="commit-sha">{c.sha}</code>
                  <span className="commit-time">{c.date}</span>
                </div>
                <p className="commit-msg">{c.message}</p>
                <span className="commit-author">{c.author}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
