# xianshujun.github.io

个人主页，使用 React + Vite 构建静态站点。保留中英文切换、个人介绍、GoStudy 与真实联系方式；GitHub Pages 发布的是 `dist/` 构建产物。

## 开发与构建

要求 Node.js 22 与 npm，依赖版本由 `package-lock.json` 锁定。

```bash
npm ci
npm run dev
npm run build
npm run preview
```

`src/main.jsx` 管理页面结构、双语内容与动效，`src/styles.css` 管理响应式排版。修改中文文案时，需确认 `public/fonts/noto-serif-sc-homepage.woff2` 子集包含新增字符，否则会回退到系统宋体。

## 依赖与资源

- Radix UI Themes — 实际用于按钮、工具提示、语言单选菜单与移动导航，提供键盘操作和焦点管理。
- GSAP + ScrollTrigger — 标题遮罩揭示、原创 SVG 线条绘制与区块滚动进场，不接管滚动。
- Motion — 链接的弹簧反馈，尊重系统减少动效设置。
- `public/fonts/` — 自托管 Space Grotesk、Noto Serif SC 中文页面子集及对应 SIL OFL 许可；原有 JetBrains Mono 资源一并保留。
- `public/images/gostudy-lesson.png` — 来自 GoStudy 仓库的本地应用截图。
- `public/favicon.svg` — 与首屏原创线稿对应的最小 XS 标识。
- 原有 `vendor/motion.js`、根目录 `index.css` / `index.js`、`fonts/` 和 `favicon.svg` 保留为历史资源，新入口不再加载它们。

## GitHub Pages

`.github/workflows/pages.yml` 在 `main` 推送或手动触发后执行 `npm ci`、`npm run build`，上传 `dist/` 并由官方 Pages Actions 发布。

启用该流程时，需要在仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。这是用户站点，Vite 的 `base` 为 `/`；无需提交构建产物。仅修改本地文件不会触发发布。

## 约定

- 不使用渐变。视觉与 GoStudy 共用暖纸色 `#f8f7f4`、墨色 `#202521`、苔藓色 `#52634e`、细线和留白。
- 内容默认可见，GSAP 只在允许动效时设置动画起点；减少动效模式不隐藏内容、不平滑滚动。
- 没有光标替换、滚动接管或外部 CDN；字体、脚本、样式与图片均由站点自托管。
- 语言切换同步页面 `lang`、标题、描述，并在可用时保存到本地存储。
