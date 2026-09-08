const GITHUB_API = "https://api.github.com";

function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

function repoConfig() {
  return {
    owner: env("GITHUB_OWNER"),
    repo: env("GITHUB_REPO"),
    branch: env("GITHUB_BRANCH"),
    token: env("GITHUB_TOKEN"),
  };
}

function authHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

export class ContentConflictError extends Error {
  constructor(path: string) {
    super(`"${path}" was changed by someone else since you loaded it. Reload the page to see the latest version.`);
    this.name = "ContentConflictError";
  }
}

/** Reads a JSON file from the repo at the current HEAD of the configured branch. */
export async function getContentFile<T>(path: string): Promise<{ data: T; sha: string }> {
  const { owner, repo, branch, token } = repoConfig();
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
  const res = await fetch(url, { headers: authHeaders(token), cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to load ${path} from GitHub (${res.status})`);
  }
  const json = (await res.json()) as { content: string; sha: string };
  const decoded = Buffer.from(json.content, "base64").toString("utf-8");
  return { data: JSON.parse(decoded) as T, sha: json.sha };
}

/**
 * Commits an updated JSON file straight to the configured branch.
 * Throws ContentConflictError if expectedSha is stale (someone else saved
 * this file since the caller loaded it).
 */
export async function updateContentFile(
  path: string,
  data: unknown,
  expectedSha: string,
  message: string,
): Promise<void> {
  const { owner, repo, branch, token } = repoConfig();
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`;
  const content = Buffer.from(JSON.stringify(data, null, 2) + "\n", "utf-8").toString("base64");
  const res = await fetch(url, {
    method: "PUT",
    headers: { ...authHeaders(token), "Content-Type": "application/json" },
    body: JSON.stringify({ message, content, sha: expectedSha, branch }),
  });
  if (res.status === 409) {
    throw new ContentConflictError(path);
  }
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to update ${path} on GitHub (${res.status}): ${body}`);
  }
}

export type RecentChange = { sha: string; message: string; author: string; date: string };

/** Lists the most recent commits that touched anything under content/. */
export async function listRecentContentChanges(limit = 20): Promise<RecentChange[]> {
  const { owner, repo, branch, token } = repoConfig();
  const url = `${GITHUB_API}/repos/${owner}/${repo}/commits?path=content&sha=${branch}&per_page=${limit}`;
  const res = await fetch(url, { headers: authHeaders(token), cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to load recent changes (${res.status})`);
  }
  const commits = (await res.json()) as Array<{
    sha: string;
    commit: { message: string; author: { name: string; date: string } };
  }>;
  return commits.map((c) => ({
    sha: c.sha,
    message: c.commit.message,
    author: c.commit.author.name,
    date: c.commit.author.date,
  }));
}
