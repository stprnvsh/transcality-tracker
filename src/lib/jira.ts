import axios from "axios";

export interface JiraIssue {
  key: string;
  fields: {
    summary: string;
    status: { name: string };
  };
  self: string;
}

export async function fetchJiraIssue(baseUrl: string, issueKey: string, token?: string) {
  if (!token) {
    throw new Error("Jira token missing");
  }
  const response = await axios.get<JiraIssue>(`${baseUrl}/rest/api/3/issue/${issueKey}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  });

  return response.data;
}
