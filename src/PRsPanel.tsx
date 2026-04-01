import { useEffect, useState } from "react";
import { fetchPullRequests, type PullRequest } from "./github";

export default function PRsPanel() {
  const [prs, setPrs] = useState<PullRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await fetchPullRequests(6);
      setPrs(data);
      setLoading(false);
    };

    load();
    const interval = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const stateColor = (state: string) => {
    switch (state) {
      case "open":
        return "#3fb950";
      case "merged":
        return "#a371f7";
      case "closed":
        return "#f85149";
      default:
        return "#8b949e";
    }
  };

  const stateIcon = (state: string) => {
    switch (state) {
      case "open":
        return "◯";
      case "merged":
        return "⊕";
      case "closed":
        return "⊘";
      default:
        return "○";
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-icon" style={{ color: "#a371f7" }}>
          ●
        </span>
        <h2>Pull Requests</h2>
        <span className="panel-badge">{prs.length}</span>
      </div>
      <div className="panel-body">
        {loading ? (
          <div className="panel-loading">loading...</div>
        ) : prs.length === 0 ? (
          <div className="panel-empty">No pull requests found</div>
        ) : (
          <ul className="pr-list">
            {prs.map((pr) => (
              <li key={pr.number} className="pr-item">
                <div className="pr-top">
                  <span
                    className="pr-state"
                    style={{ color: stateColor(pr.state) }}
                  >
                    {stateIcon(pr.state)}
                  </span>
                  <span className="pr-title">{pr.title}</span>
                </div>
                <div className="pr-meta">
                  <span className="pr-number">#{pr.number}</span>
                  <span
                    className="pr-state-badge"
                    style={{
                      backgroundColor: `${stateColor(pr.state)}22`,
                      color: stateColor(pr.state),
                      borderColor: `${stateColor(pr.state)}44`,
                    }}
                  >
                    {pr.state}
                  </span>
                  <span className="pr-author">{pr.author}</span>
                  <span className="pr-time">{pr.createdAt}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
