import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './oss.css';
import { OSS_COPY, OSS_SNAPSHOT, fetchOssStats, loadCachedOss, saveCachedOss } from './oss-data.js';

const REPO_PATTERN = /^[\w.-]+\/[\w.-]+$/;
const REFRESH_INTERVAL = 10 * 60 * 1000;

function count(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function formatTime(date, language) {
  try {
    return date.toLocaleTimeString(language === 'zh' ? 'zh-CN' : 'en-GB', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }
}

function formatShortDate(date, language) {
  // 快照日期按 UTC 读，避免时区把 11-25 显示成前一天。
  if (language === 'en') {
    try {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
    } catch {
      return `${date.getUTCMonth() + 1}/${date.getUTCDate()}`;
    }
  }
  return `${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
}

function formatMonth(month) {
  return typeof month === 'string' ? month.replace('-', '.') : '';
}

function isUsableDate(date) {
  return date instanceof Date && Number.isFinite(date.getTime());
}

export default function OssSection({ language }) {
  const lang = language === 'en' ? 'en' : 'zh';
  const t = OSS_COPY[lang];

  const [initial] = useState(() => {
    const cached = loadCachedOss();
    return { data: cached || OSS_SNAPSHOT, fromCache: Boolean(cached) };
  });
  const [data, setData] = useState(initial.data);
  const [status, setStatus] = useState('loading');
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(true);
  const [announcement, setAnnouncement] = useState('');

  const cacheRef = useRef(initial.fromCache);
  const liveRef = useRef(false);
  const inFlightRef = useRef(false);
  const abortRef = useRef(null);
  const languageRef = useRef(lang);
  languageRef.current = lang;

  const load = useCallback(async (announce = false) => {
    if (inFlightRef.current) return;
    const controller = new AbortController();
    abortRef.current = controller;
    inFlightRef.current = true;
    setBusy(true);

    try {
      const next = await fetchOssStats(controller.signal);
      if (controller.signal.aborted) return;
      liveRef.current = true;
      cacheRef.current = true;
      setData(next);
      setStatus('live');
      setFailed(false);
      saveCachedOss(next);
      if (announce) setAnnouncement((OSS_COPY[languageRef.current] || OSS_COPY.zh).refreshed);
    } catch {
      if (controller.signal.aborted) return;
      setFailed(true);
      setStatus(liveRef.current ? 'live' : cacheRef.current ? 'cached' : 'fallback');
      if (announce) setAnnouncement((OSS_COPY[languageRef.current] || OSS_COPY.zh).refreshFailed);
    } finally {
      if (!controller.signal.aborted) {
        setBusy(false);
        inFlightRef.current = false;
        if (abortRef.current === controller) abortRef.current = null;
      }
    }
  }, []);

  useEffect(() => {
    load(false);
    const timer = window.setInterval(() => load(false), REFRESH_INTERVAL);
    return () => {
      window.clearInterval(timer);
      if (abortRef.current) {
        abortRef.current.abort();
        abortRef.current = null;
      }
      inFlightRef.current = false;
    };
  }, [load]);

  useEffect(() => {
    if (!announcement) return undefined;
    const timer = window.setTimeout(() => setAnnouncement(''), 4000);
    return () => window.clearTimeout(timer);
  }, [announcement]);

  const repos = useMemo(() => {
    const list = Array.isArray(data.repos) ? data.repos : [];
    return list
      .filter((repo) => repo && REPO_PATTERN.test(repo.repo || '') && !repo.repo.startsWith('xianshujun/'))
      .slice()
      .sort((a, b) => (
        count(b.pr) + count(b.issues) - count(a.pr) - count(a.issues)
        || count(b.merged) - count(a.merged)
        || a.repo.localeCompare(b.repo)
      ));
  }, [data.repos]);

  const monthly = useMemo(() => {
    const list = Array.isArray(data.monthly) ? data.monthly.slice(-24) : [];
    return list.filter((entry) => Array.isArray(entry) && typeof entry[0] === 'string');
  }, [data.monthly]);

  const peak = useMemo(() => (
    monthly.reduce((max, entry) => Math.max(max, count(entry[1])), 0)
  ), [monthly]);

  const maxTotal = useMemo(() => (
    Math.max(1, repos.reduce((max, repo) => Math.max(max, count(repo.pr) + count(repo.issues)), 0))
  ), [repos]);

  const totals = [
    [count(data.prTotal), t.labels.pr],
    [count(data.mergedTotal), t.labels.merged],
    [count(data.issueTotal), t.labels.issues],
    [count(data.repoCount) || repos.length, t.labels.projects],
  ];

  const statusText = useMemo(() => {
    const updated = data.updatedAt ? new Date(data.updatedAt) : null;
    const valid = isUsableDate(updated);
    if (status === 'loading') return t.statusLoading;
    if (status === 'live') return valid ? `LIVE · ${formatTime(updated, lang)}` : 'LIVE';
    if (status === 'cached') return valid ? `${t.statusCached} · ${formatTime(updated, lang)}` : t.statusCached;
    return valid ? `${t.statusSnapshot} · ${formatShortDate(updated, lang)}` : t.statusSnapshot;
  }, [status, data.updatedAt, lang, t]);

  const updatedStamp = useMemo(() => {
    const updated = data.updatedAt ? new Date(data.updatedAt) : null;
    if (!isUsableDate(updated)) return '';
    return status === 'fallback' ? formatShortDate(updated, lang) : formatTime(updated, lang);
  }, [data.updatedAt, status, lang]);

  const monthRange = monthly.length
    ? `${formatMonth(monthly[0][0])} → ${formatMonth(monthly[monthly.length - 1][0])}`
    : '';

  return (
    <section id="opensource" className="oss section-shell" aria-labelledby="oss-title">
      <div className="section-rule" data-rule />
      <div className="section-heading" data-reveal>
        <h2 id="oss-title"><span className="micro section-index">02 /</span>{t.heading}</h2>
        <span className="micro oss-status" data-state={status} role="status" aria-live="polite">
          <span className="oss-status-dot" aria-hidden="true" />
          {statusText}
        </span>
      </div>

      <div className="oss-lede">
        <div className="oss-intro">
          <p className="oss-statement masked-heading">
            {t.statement.map((line) => (
              <span className="text-mask" key={line}><span data-mask="scroll">{line}</span></span>
            ))}
          </p>
          <p className="oss-lead" data-reveal>{t.lead}</p>
        </div>

        <div className="oss-ledger" data-reveal>
          <div className="oss-totals">
            {totals.map(([value, label]) => (
              <div className="oss-total" key={label}>
                <strong>{value}</strong>
                <span className="micro">{label}</span>
              </div>
            ))}
          </div>

          <figure className="oss-activity">
            <div className="oss-activity-head micro"><span>{t.activity}</span></div>
            <div className="oss-chart" role="img" aria-label={t.chartAria}>
              <div className="oss-bars">
                {monthly.map(([month, value]) => {
                  const amount = count(value);
                  const height = amount > 0 && peak > 0 ? `${(amount / peak) * 100}%` : '0%';
                  return (
                    <span className="oss-bar-slot" key={month}>
                      {amount > 0 && amount === peak && (
                        <span className="oss-peak micro" aria-hidden="true">{amount}</span>
                      )}
                      <span
                        className={`oss-bar${amount === 0 ? ' is-zero' : ''}`}
                        style={{ '--h': height }}
                        title={`${month} · ${amount}`}
                        aria-hidden="true"
                      />
                    </span>
                  );
                })}
              </div>
            </div>
            <figcaption className="oss-axis micro">
              <span>{monthRange}</span>
              <span>{updatedStamp ? `${t.updated} ${updatedStamp}` : ''}</span>
            </figcaption>
          </figure>
        </div>
      </div>

      <div className="oss-grid" data-reveal>
        {repos.length === 0 && <p className="oss-empty micro">{t.empty}</p>}
        {repos.map((repo, index) => {
          const [owner, name] = repo.repo.split('/');
          const merged = count(repo.merged);
          const open = count(repo.open);
          const closed = count(repo.closed);
          const issues = count(repo.issues);
          const desc = repo.desc ? repo.desc[lang] || repo.desc.zh || repo.desc.en || '' : '';
          const langName = repo.lang || '—';
          const color = repo.color || 'var(--muted)';
          const meterBase = Math.max(maxTotal, 1);

          return (
            <a
              className="oss-card"
              key={repo.repo}
              href={`https://github.com/${repo.repo}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${t.openAria} ${repo.repo} — ${count(repo.pr)} ${t.labels.pr}, ${merged} ${t.labels.merged}, ${issues} ${t.labels.issues}`}
            >
              <span className="oss-card-top">
                <span className="micro oss-card-index">{String(index + 1).padStart(2, '0')}</span>
                <svg className="oss-card-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" strokeLinejoin="miter" />
                </svg>
              </span>

              <span className="oss-card-name"><span className="oss-card-owner">{owner}/</span>{name}</span>
              <span className="oss-card-desc">{desc}</span>

              <span className="oss-card-bottom">
                <span className="oss-lang micro">
                  <span className="oss-lang-dot" style={{ backgroundColor: color }} aria-hidden="true" />
                  <span className="sr-only">{t.languageLabel}: </span>{langName}
                </span>
                <span className="oss-card-stats">
                  <span className="oss-stat"><strong>{count(repo.pr)}</strong><span className="oss-stat-label">{t.labels.pr}</span></span>
                  <span className="oss-stat"><strong>{merged}</strong><span className="oss-stat-label">{t.labels.merged}</span></span>
                  <span className="oss-stat"><strong>{issues}</strong><span className="oss-stat-label">{t.labels.issues}</span></span>
                </span>
              </span>

              <span className="oss-meter" aria-hidden="true" title={t.meterAria}>
                <span className="oss-meter-merged" style={{ width: `${(merged / meterBase) * 100}%` }} />
                <span className="oss-meter-open" style={{ width: `${(open / meterBase) * 100}%` }} />
                <span className="oss-meter-closed" style={{ width: `${(closed / meterBase) * 100}%` }} />
                <span className="oss-meter-issues" style={{ width: `${(issues / meterBase) * 100}%` }} />
              </span>
            </a>
          );
        })}
      </div>

      <div className="oss-foot">
        <div className="oss-foot-copy">
          <p className="micro">{t.note}</p>
          {data.truncated && <p className="micro oss-foot-warn">{t.truncatedNote}</p>}
          {failed && <p className="micro oss-foot-warn">{status === 'live' ? t.refreshFailed : t.offlineNote}</p>}
        </div>
        <button
          type="button"
          className="oss-refresh micro"
          onClick={() => load(true)}
          aria-disabled={busy}
          aria-busy={busy}
        >
          <svg className={busy ? 'is-spinning' : ''} width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M20 11a8 8 0 1 0-2.34 5.66" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
            <path d="M20 4v7h-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
          </svg>
          <span>{busy ? t.refreshing : t.refresh}</span>
        </button>
        <span className="sr-only" role="status" aria-live="polite">{announcement}</span>
      </div>
    </section>
  );
}
