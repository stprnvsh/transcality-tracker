import axios from "axios";

export interface GitHubPullRequest {
  number: number;
  title: string;
  state: string;
  html_url: string;
  head: { ref: string };
}

export async function fetchPullRequest(repo: string, pullNumber: number, token?: string) {
  if (!token) {
    throw new Error("GitHub token missing");
  }

  const response = await axios.get<GitHubPullRequest>(`https://api.github.com/repos/${repo}/pulls/${pullNumber}`, {
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github+json"
    }
  });

  return response.data;
}

export function buildBranchName(type: "feature" | "bug", title: string) {
  const prefix = type === "feature" ? "feature" : "fix";
  return `${prefix}/${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}`;
}
