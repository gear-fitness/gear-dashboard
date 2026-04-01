const OWNER = "gear-fitness";
const REPO = "gear-fitness-app";
const BASE = `https://api.github.com/repos/${OWNER}/${REPO}`;

export interface Commit {
  sha: string;
  message: string;
  author: string;
  avatar: string;
  date: string;
  url: string;
}

export interface Issue {
  number: number;
  title: string;
  state: string;
  author: string;
  avatar: string;
  labels: { name: string; color: string }[];
  createdAt: string;
  url: string;
}

export interface PullRequest {
  number: number;
  title: string;
  state: string; // "open" | "closed" | "merged"
  author: string;
  avatar: string;
  createdAt: string;
  url: string;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return `${seconds}s ago`;
}

export async function fetchCommits(
  branch = "develop",
  count = 8,
): Promise<Commit[]> {
  try {
    const res = await fetch(`${BASE}/commits?sha=${branch}&per_page=${count}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    return data.map((item: any) => ({
      sha: item.sha.slice(0, 7),
      message: item.commit.message.split("\n")[0],
      author: item.author?.login ?? item.commit.author.name,
      avatar: item.author?.avatar_url ?? "",
      date: timeAgo(item.commit.author.date),
      url: item.html_url,
    }));
  } catch (err) {
    console.error("Failed to fetch commits:", err);
    return [];
  }
}

export async function fetchIssues(count = 6): Promise<Issue[]> {
  try {
    const res = await fetch(
      `${BASE}/issues?state=all&sort=created&direction=desc&per_page=${count}`,
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // Filter out pull requests (GitHub API returns PRs in the issues endpoint)
    return data
      .filter((item: any) => !item.pull_request)
      .map((item: any) => ({
        number: item.number,
        title: item.title,
        state: item.state,
        author: item.user.login,
        avatar: item.user.avatar_url,
        labels: item.labels.map((l: any) => ({
          name: l.name,
          color: l.color,
        })),
        createdAt: timeAgo(item.created_at),
        url: item.html_url,
      }));
  } catch (err) {
    console.error("Failed to fetch issues:", err);
    return [];
  }
}

export async function fetchPullRequests(count = 6): Promise<PullRequest[]> {
  try {
    const res = await fetch(
      `${BASE}/pulls?state=all&sort=created&direction=desc&per_page=${count}`,
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    return data.map((item: any) => ({
      number: item.number,
      title: item.title,
      state: item.merged_at ? "merged" : item.state,
      author: item.user.login,
      avatar: item.user.avatar_url,
      createdAt: timeAgo(item.created_at),
      url: item.html_url,
    }));
  } catch (err) {
    console.error("Failed to fetch pull requests:", err);
    return [];
  }
}
