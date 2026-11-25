export const CACHE_KEY = 'homepage-oss-live-v1';

const GITHUB_USER = 'xianshujun';
const SEARCH_API = 'https://api.github.com/search/issues';
const PER_PAGE = 100;
const REPO_PATTERN = /^[\w.-]+\/[\w.-]+$/;
const SNAPSHOT_UPDATED_AT = '2026-11-25T07:10:00Z';

const FALLBACK_META = { lang: '—', color: 'var(--muted)', desc: { zh: '', en: '' } };

// [repo, language, color, zh, en] — 只含手工维护的描述与语言色，计数一律实时聚合。
const REPO_META = [
  ['modelcontextprotocol/go-sdk', 'Go', '#00ADD8', 'MCP 官方 Go SDK，由 MCP 与 Google 共同维护。', 'The official Go SDK for MCP, maintained with Google.'],
  ['trpc-group/trpc-agent-go', 'Go', '#00ADD8', 'tRPC 团队的 Go Agent 框架：图工作流、工具、记忆、A2A、MCP 与可观测性。', 'A Go framework for production agent systems — graph workflows, tools, memory, MCP and observability.'],
  ['google/adk-go', 'Go', '#00ADD8', 'Google 的 Go Agent 开发工具包，用于构建、评估和部署 AI Agent。', 'Google’s code-first Go toolkit for building, evaluating and deploying AI agents.'],
  ['kagent-dev/kagent', 'Go', '#00ADD8', '云原生 Agentic AI 平台，在 Kubernetes 上运行和管理 Agent。', 'Cloud-native agentic AI platform for running agents on Kubernetes.'],
  ['stacklok/toolhive', 'Go', '#00ADD8', '企业级 MCP 服务器运行与管理平台。', 'Enterprise-grade platform for running and managing MCP servers.'],
  ['AstrBotDevs/shipyard-neo', 'Python', '#3572A5', '面向 AI Agent 的安全、持久化执行平台。', 'A secure, persistent execution platform for AI agents.'],
  ['casdoor/casdoor', 'Go', '#00ADD8', 'Agent-first 的开源 IAM：OAuth、OIDC、SAML、LDAP 与 MCP 网关。', 'Open-source agent-first IAM with OAuth, OIDC, SAML, LDAP and an MCP gateway.'],
  ['a2aproject/a2a-samples', 'Jupyter Notebook', '#DA5B0B', 'A2A（Agent2Agent）协议的官方示例集合。', 'Official samples for the Agent2Agent (A2A) protocol.'],
  ['mudler/LocalAI', 'Go', '#00ADD8', '开源本地 AI 引擎，在任意硬件上运行 LLM、视觉、语音与图像模型。', 'The open-source AI engine — run LLMs, vision, voice and image models on any hardware.'],
  ['milvus-io/milvus', 'Go', '#00ADD8', '高性能、云原生向量数据库，面向大规模向量检索。', 'A high-performance, cloud-native vector database for scalable ANN search.'],
  ['obot-platform/obot', 'Go', '#00ADD8', 'Obot AI 的 AI 治理平台。', 'AI governance platform from Obot AI.'],
  ['modelcontextprotocol/registry', 'Go', '#00ADD8', 'MCP 服务器的社区注册服务。', 'A community-driven registry service for MCP servers.'],
  ['PrefectHQ/fastmcp', 'Python', '#3572A5', '构建 MCP 服务器与客户端的 Pythonic 框架。', 'The fast, Pythonic way to build MCP servers and clients.'],
  ['weaviate/weaviate', 'Go', '#00ADD8', '开源向量数据库，结合向量检索与结构化过滤。', 'Open-source vector database combining vector search with structured filtering.'],
  ['a2aproject/a2a-go', 'Go', '#00ADD8', 'A2A 协议的 Go SDK。', 'The Go SDK for the A2A protocol.'],
  ['binaricat/Netcatty', 'TypeScript', '#3178C6', '把 SSH 工作区、SFTP 与终端放在一起的桌面工具。', 'SSH workspace, SFTP and terminals in one.'],
  ['cloudwego/eino', 'Go', '#00ADD8', 'CloudWeGo 的 Go LLM / AI 应用开发框架。', 'The ultimate LLM/AI application development framework in Go.'],
  ['LinuxSuRen/api-testing', 'Go', '#00ADD8', '开源接口调试与测试工具。', 'Open-source API testing tool with a mock server.'],
  ['firstcontributions/first-contributions', 'Docs', '#8A8F98', '面向初学者的开源贡献练习仓库。', 'A beginner-friendly repository for learning to contribute to open source.'],
  ['AstrBotDevs/AstrBot', 'Python', '#3572A5', '接入多 IM 平台、LLM 与插件的 AI Agent 助手与开发框架。', 'AI agent assistant and framework integrating IM platforms, LLMs and plugins.'],
];

const META = new Map(REPO_META.map(([repo, lang, color, zh, en]) => [repo, {
  lang,
  color,
  desc: { zh, en },
}]));

// [pr, merged, open, closed, issues, issuesOpen]
const SNAPSHOT_COUNTS = {
  'modelcontextprotocol/go-sdk': [3, 3, 0, 0, 0, 0],
  'trpc-group/trpc-agent-go': [2, 2, 0, 0, 0, 0],
  'google/adk-go': [2, 0, 1, 1, 1, 0],
  'kagent-dev/kagent': [2, 1, 1, 0, 0, 0],
  'stacklok/toolhive': [2, 2, 0, 0, 0, 0],
  'AstrBotDevs/shipyard-neo': [2, 1, 1, 0, 0, 0],
  'casdoor/casdoor': [1, 0, 0, 1, 0, 0],
  'a2aproject/a2a-samples': [1, 1, 0, 0, 0, 0],
  'mudler/LocalAI': [1, 0, 0, 1, 0, 0],
  'milvus-io/milvus': [1, 0, 1, 0, 0, 0],
  'obot-platform/obot': [1, 0, 1, 0, 0, 0],
  'modelcontextprotocol/registry': [1, 0, 1, 0, 0, 0],
  'PrefectHQ/fastmcp': [1, 0, 0, 1, 0, 0],
  'weaviate/weaviate': [1, 0, 0, 1, 0, 0],
  'a2aproject/a2a-go': [1, 0, 0, 1, 0, 0],
  'binaricat/Netcatty': [1, 0, 0, 1, 3, 0],
  'cloudwego/eino': [1, 0, 1, 0, 0, 0],
  'LinuxSuRen/api-testing': [1, 1, 0, 0, 0, 0],
  'firstcontributions/first-contributions': [1, 1, 0, 0, 0, 0],
  'AstrBotDevs/AstrBot': [0, 0, 0, 0, 1, 0],
};

const SNAPSHOT_MONTHLY = [
  ['2024-12', 0], ['2025-01', 0], ['2025-02', 0], ['2025-03', 0],
  ['2025-04', 1], ['2025-05', 0], ['2025-06', 1], ['2025-07', 0],
  ['2025-08', 0], ['2025-09', 0], ['2025-10', 0], ['2025-11', 0],
  ['2025-12', 0], ['2026-01', 0], ['2026-02', 0], ['2026-03', 1],
  ['2026-04', 0], ['2026-05', 0], ['2026-06', 0], ['2026-07', 0],
  ['2026-08', 0], ['2026-09', 1], ['2026-10', 19], ['2026-11', 8],
];

export const OSS_COPY = {
  zh: {
    heading: '开源贡献',
    statement: ['在别人的项目里，', '也写下一些代码。'],
    lead: '除了自己的项目，我也在开源社区提交 PR、报 Issue。这里汇总了公开的贡献数据，页面加载时从 GitHub 实时同步。',
    labels: { pr: 'PR', merged: '已合并', open: '待合并', issues: 'Issue', projects: '个项目' },
    activity: '近 24 个月 PR / Issue 活动',
    updated: '更新于',
    refresh: '刷新数据',
    refreshing: '刷新中',
    note: '统计口径：GitHub 公开的 PR 与 Issue 检索，不含自己名下的仓库。',
    truncatedNote: '计数基于最近的公开检索结果，超过 300 条时可能被截断。',
    languageLabel: '语言',
    chartAria: '近 24 个月的 PR 与 Issue 活动柱状图',
    meterAria: '贡献构成：合并 PR、待合并 PR、已关闭 PR、Issue',
    openAria: '在 GitHub 打开',
    empty: '暂无公开数据',
    statusLoading: '正在同步 GitHub…',
    statusCached: '缓存',
    statusSnapshot: '快照',
    offlineNote: '实时接口暂不可用，展示最近缓存或快照',
    refreshed: '已刷新',
  },
  en: {
    heading: 'Open source',
    statement: ['Code written in', 'other projects, too.'],
    lead: 'Beyond my own projects, I file PRs and issues in the open-source community. These numbers are aggregated from public GitHub data and synced live on page load.',
    labels: { pr: 'PR', merged: 'Merged', open: 'Open', issues: 'Issues', projects: 'projects' },
    activity: 'PR / issue activity, last 24 months',
    updated: 'Updated',
    refresh: 'Refresh',
    refreshing: 'Refreshing',
    note: 'Scope: public GitHub PR and issue search, excluding repositories owned by xianshujun.',
    truncatedNote: 'Counts are based on the latest public search results and may be capped at 300 entries.',
    languageLabel: 'Language',
    chartAria: 'Bar chart of PR and issue activity over the last 24 months',
    meterAria: 'Contribution mix: merged PRs, open PRs, closed PRs and issues',
    openAria: 'Open on GitHub',
    empty: 'No public data',
    statusLoading: 'Syncing GitHub…',
    statusCached: 'Cached',
    statusSnapshot: 'Snapshot',
    offlineNote: 'Live API unavailable — showing the latest cached snapshot',
    refreshed: 'Refreshed',
  },
};

function createRepo(repo) {
  const [owner, name] = repo.split('/');
  const meta = META.get(repo) || FALLBACK_META;
  return {
    repo,
    owner,
    name,
    lang: meta.lang,
    color: meta.color,
    desc: { ...meta.desc },
    pr: 0,
    merged: 0,
    open: 0,
    closed: 0,
    issues: 0,
    issuesOpen: 0,
  };
}

function contributions(repo) {
  const pr = Number(repo.pr);
  const issues = Number(repo.issues);
  return (Number.isFinite(pr) ? pr : 0) + (Number.isFinite(issues) ? issues : 0);
}

function sortRepos(repos) {
  return repos.sort((a, b) => (
    contributions(b) - contributions(a)
    || (Number(b.merged) || 0) - (Number(a.merged) || 0)
    || a.repo.localeCompare(b.repo)
  ));
}

function repoFromItem(item) {
  const url = item && typeof item.repository_url === 'string' ? item.repository_url : '';
  const repo = url.split('/repos/')[1] || '';
  if (!REPO_PATTERN.test(repo) || repo.startsWith(`${GITHUB_USER}/`)) return '';
  return repo;
}

function buildMonthly(items, now = new Date()) {
  const keys = [];
  for (let offset = 23; offset >= 0; offset -= 1) {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1));
    keys.push(`${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`);
  }
  const counts = new Map(keys.map((key) => [key, 0]));
  for (const item of items) {
    const key = item && typeof item.created_at === 'string' ? item.created_at.slice(0, 7) : '';
    if (counts.has(key)) counts.set(key, counts.get(key) + 1);
  }
  return keys.map((key) => [key, counts.get(key)]);
}

function totalsOf(repos) {
  return repos.reduce((totals, repo) => ({
    prTotal: totals.prTotal + (Number(repo.pr) || 0),
    mergedTotal: totals.mergedTotal + (Number(repo.merged) || 0),
    openTotal: totals.openTotal + (Number(repo.open) || 0),
    issueTotal: totals.issueTotal + (Number(repo.issues) || 0),
  }), { prTotal: 0, mergedTotal: 0, openTotal: 0, issueTotal: 0 });
}

export const OSS_SNAPSHOT = (() => {
  const repos = Object.entries(SNAPSHOT_COUNTS).map(([repo, counts]) => {
    const entry = createRepo(repo);
    [entry.pr, entry.merged, entry.open, entry.closed, entry.issues, entry.issuesOpen] = counts;
    return entry;
  });
  sortRepos(repos);
  return {
    repos,
    ...totalsOf(repos),
    repoCount: repos.length,
    monthly: SNAPSHOT_MONTHLY.map(([month, value]) => [month, value]),
    updatedAt: SNAPSHOT_UPDATED_AT,
    truncated: false,
  };
})();

export function buildOssState(payload) {
  const prPayload = payload && payload.pr ? payload.pr : {};
  const issuePayload = payload && payload.issues ? payload.issues : {};
  const prItems = Array.isArray(prPayload.items) ? prPayload.items : [];
  const issueItems = Array.isArray(issuePayload.items) ? issuePayload.items : [];
  const repos = new Map();
  const accepted = [];

  const ensureRepo = (item) => {
    const repo = repoFromItem(item);
    if (!repo) return null;
    let entry = repos.get(repo);
    if (!entry) {
      entry = createRepo(repo);
      repos.set(repo, entry);
    }
    return entry;
  };

  for (const item of prItems) {
    const entry = ensureRepo(item);
    if (!entry) continue;
    entry.pr += 1;
    if (item.pull_request && item.pull_request.merged_at) entry.merged += 1;
    else if (item.state === 'open') entry.open += 1;
    else entry.closed += 1;
    accepted.push(item);
  }

  for (const item of issueItems) {
    const entry = ensureRepo(item);
    if (!entry) continue;
    entry.issues += 1;
    if (item.state === 'open') entry.issuesOpen += 1;
    accepted.push(item);
  }

  const list = sortRepos([...repos.values()]);
  return {
    repos: list,
    ...totalsOf(list),
    repoCount: list.length,
    monthly: buildMonthly(accepted),
    updatedAt: new Date().toISOString(),
    truncated: Boolean(prPayload.truncated || issuePayload.truncated),
  };
}

async function fetchKind(type, signal) {
  const items = [];
  let totalCount = 0;

  for (let page = 1; page <= 3; page += 1) {
    const base = `${SEARCH_API}?q=author:${GITHUB_USER}+type:${type}+-user:${GITHUB_USER}&per_page=${PER_PAGE}&sort=updated`;
    const url = page > 1 ? `${base}&page=${page}` : base;

    const response = await fetch(url, {
      headers: { Accept: 'application/vnd.github+json' },
      signal,
    });
    if (!response.ok) throw new Error(`GitHub search failed with ${response.status}`);

    const data = await response.json();
    if (page === 1) totalCount = Number.isFinite(data.total_count) ? data.total_count : 0;
    const batch = Array.isArray(data.items) ? data.items : [];
    items.push(...batch);

    if (items.length >= totalCount || batch.length === 0) break;
  }

  return { items, totalCount, truncated: items.length < totalCount };
}

export async function fetchOssStats(signal) {
  // 给请求一个上限，弱网时不让状态一直停在「正在同步」。
  const timeout = typeof AbortSignal !== 'undefined' && AbortSignal.timeout ? AbortSignal.timeout(15000) : null;
  const bounded = timeout && AbortSignal.any && signal ? AbortSignal.any([signal, timeout]) : signal;
  const [pr, issues] = await Promise.all([
    fetchKind('pr', bounded),
    fetchKind('issue', bounded),
  ]);
  return buildOssState({ pr, issues });
}

export function loadCachedOss() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.repos) || typeof parsed.updatedAt !== 'string') return null;
    if (!Number.isFinite(new Date(parsed.updatedAt).getTime())) return null;
    const repos = parsed.repos.filter((repo) => (
      repo
      && typeof repo.repo === 'string'
      && REPO_PATTERN.test(repo.repo)
      && !repo.repo.startsWith(`${GITHUB_USER}/`)
    ));
    if (!repos.length) return null;
    return { ...parsed, repos };
  } catch {
    return null;
  }
}

export function saveCachedOss(state) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(state));
  } catch {
    /* 隐私模式下写入失败时保持内存中的实时数据即可。 */
  }
}
