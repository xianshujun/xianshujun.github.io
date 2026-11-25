# xianshujun.github.io

个人主页，使用 React + Vite 构建静态站点。包含头像首屏、深色 / 浅色主题（默认深色）、精选作品 GoStudy、实时更新的开源贡献、个人介绍与真实联系方式；GitHub Pages 发布的是 `dist/` 构建产物。

## 开发与构建

要求 Node.js 22 与 npm，依赖版本由 `package-lock.json` 锁定。

```bash
npm ci
npm run dev
npm run build
npm run preview
```

`src/main.jsx` 管理页面结构、双语内容与动效，`src/styles.css` 管理响应式排版；`src/OssSection.jsx`、`src/oss-data.js` 与 `src/oss.css` 组成开源贡献区块。修改中文文案时，需确认 `public/fonts/noto-serif-sc-homepage.woff2` 子集包含新增字符，否则会回退到系统宋体。

## 开源贡献数据

区块展示 `xianshujun` 之外的开源仓库，统计 PR 总数、已合并数、Issue 数与最近 24 个月活动。页面加载时并行请求两条 GitHub 公开搜索：

- `author:xianshujun type:pr -user:xianshujun`
- `author:xianshujun type:issue -user:xianshujun`

结果按仓库聚合，写入 `localStorage` 的 `homepage-oss-live-v1`，并每 10 分钟自动刷新；也可以点「刷新数据」手动触发。GitHub 未认证搜索接口限制为 10 次/分钟，因此不做逐仓库请求。

接口失败、限流或离线时按「本地缓存 → 内置快照」顺序降级，状态会显示 `LIVE`、`缓存` 或 `快照`。内置快照位于 `src/oss-data.js` 的 `SNAPSHOT_COUNTS` / `SNAPSHOT_MONTHLY`，仓库语言与描述在 `REPO_META` 中手工维护；新增贡献仓库时，实时数据会自动出现，补充元数据后即可获得完整文案。

## 依赖与资源

- Radix UI Themes — 实际用于按钮、工具提示、语言单选菜单与移动导航，提供键盘操作和焦点管理。
- GSAP + ScrollTrigger — 标题遮罩揭示、原创 SVG 线条绘制与区块滚动进场，不接管滚动。
- Motion — 链接的弹簧反馈，尊重系统减少动效设置。
- `public/fonts/` — 自托管 Space Grotesk、Noto Serif SC 中文页面子集及对应 SIL OFL 许可；原有 JetBrains Mono 资源一并保留。
- `public/images/gostudy-lesson.png` — 来自 GoStudy 仓库的本地应用截图。
- `public/images/avatar.webp` / `avatar.png` — 自托管的 GitHub 头像，WebP 优先、PNG 回退。
- `public/favicon.svg` — 与首屏原创线稿对应的最小 XS 标识。
- 原有 `vendor/motion.js`、根目录 `index.css` / `index.js`、`fonts/` 和 `favicon.svg` 保留为历史资源，新入口不再加载它们。

## GitHub Pages

`.github/workflows/pages.yml` 在 `main` 推送或手动触发后执行 `npm ci`、`npm run build`，上传 `dist/` 并由官方 Pages Actions 发布。

启用该流程时，需要在仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。这是用户站点，Vite 的 `base` 为 `/`；无需提交构建产物。仅修改本地文件不会触发发布。

## 约定

- 不使用渐变。视觉与 GoStudy 共用暖纸色 `#f8f7f4`、墨色 `#202521`、陶土橙 `#d97757`、细线和留白。
- 默认深色：`index.html` 的内联脚本在首帧前写入主题，用户手动切到浅色后才按 `localStorage` 恢复。
- 内容默认可见，GSAP 只在允许动效时设置动画起点；减少动效模式不隐藏内容、不平滑滚动。
- 没有光标替换、滚动接管或外部 CDN；字体、脚本、样式与图片均由站点自托管。开源贡献计数是唯一的运行时外部数据请求（GitHub API），不加载任何外部静态资源。
- 语言切换同步页面 `lang`、标题、描述，并在可用时保存到本地存储。
