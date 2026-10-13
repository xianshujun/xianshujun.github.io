# xianshujun.github.io

个人主页，纯静态站点：`index.html` + `index.css` + `index.js`，直接由 GitHub Pages 发布，没有构建步骤。

## 依赖

- `vendor/motion.js` — [Motion](https://motion.dev) v14.1.0 的浏览器构建（单文件、已压缩，UMD 形式暴露 `window.Motion`）。随仓库内置而不是走 CDN：静态站点少一个外部依赖，国内访问也稳。升级方式：`npm i motion@<版本>` 后复制 `node_modules/motion/dist/motion.js`。
- `fonts/` — Space Grotesk 与 JetBrains Mono 的拉丁子集（SIL OFL 1.1，许可全文同目录），来自 [Fontsource](https://fontsource.org)。中文由系统字体渲染。
- `favicon.svg` — 内联矢量图标。

## 约定

- **不使用渐变**。视觉沿用与 [GoStudy](https://xianshujun.github.io/awsome-go-study/) 相同的设计令牌：近中性底色、单一强调色、1px 描边分层。
- **动效不能把内容藏住**：所有动画都是"JS 先写起点、再动到终点"。Motion 没加载或用户开启「减少动效」时，页面保持默认的可见状态。
