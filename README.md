# 前端知识体系

个人前端学习笔记，涵盖面试八股文、手写题、工程化等核心内容。支持 VitePress 部署为个人文档站。

## 快速开始（VitePress 部署）

```bash
# 安装依赖（将 docs-package.json 重命名或合并到 package.json）
cp docs-package.json package.json
npm install

# 本地预览
npm run docs:dev

# 构建静态站点
npm run docs:build

# 预览构建产物
npm run docs:preview
```

部署到 GitHub Pages / Vercel / Netlify 等平台即可。

## 笔记索引

| 文件 | 内容 | 说明 |
| --- | --- | --- |
| [JS.md](笔记/JS.md) | JavaScript 核心 | 数据类型、闭包、原型链、this、Promise、事件循环 |
| [CSS&HTML.md](笔记/CSS%26HTML.md) | CSS & HTML | 盒模型、BFC、Flex/Grid、回流重绘、居中方案、选择器优先级、响应式 |
| [Vue2.md](笔记/Vue2.md) | Vue 2 | 响应式原理、虚拟DOM/diff、生命周期、组件通信、Vuex |
| [Vue3.md](笔记/Vue3.md) | Vue 3 | Composition API、ref/reactive、Pinia、组件通信、Teleport/Suspense |
| [network.md](笔记/network.md) | 计算机网络 | HTTP/HTTPS、TCP/UDP、DNS、CDN、WebSocket、浏览器缓存、Cookie/JWT |
| [浏览器原理.md](笔记/浏览器原理.md) | 浏览器原理 | 进程模型、渲染流水线、事件循环、V8引擎、垃圾回收、缓存策略、CORS |
| [engineering.md](笔记/engineering.md) | 前端工程化 | 模块化(CJS/ESM)、npm/yarn/pnpm、Webpack深入、Vite、Babel |
| [手写题.md](笔记/手写题.md) | 手写代码题 | 防抖节流、深拷贝、Promise、call/apply/bind、EventEmitter、LRU缓存 |
| [面试题/](笔记/面试题/) | 面试题库 | JS/CSS/Vue/网络/浏览器/工程化/性能优化/输出题，按分类独立文件 |
| [小程序.md](笔记/小程序.md) | 小程序 & UniApp | 微信小程序核心 + UniApp 跨端开发 + 条件编译 |
| [三方库.md](笔记/三方库.md) | 第三方库速查 | jQuery、Lodash、Axios、MockJS、Moment、Echarts 等 |

## 目录结构

```
├── 笔记/                    # 个人知识总结（面试八股文）
│   ├── .vitepress/          # VitePress 配置（可部署为文档站）
│   ├── JS.md
│   ├── CSS&HTML.md
│   ├── Vue2.md
│   ├── Vue3.md
│   ├── network.md
│   ├── 浏览器原理.md
│   ├── engineering.md
│   ├── 手写题.md
│   ├── 面试题.md             # 面试题总览（导航页）
│   ├── 面试题/               # 面试题分类文件
│   │   ├── JS面试题.md
│   │   ├── CSS面试题.md
│   │   ├── Vue面试题.md
│   │   ├── 网络面试题.md
│   │   ├── 浏览器面试题.md
│   │   ├── 工程化面试题.md
│   │   ├── 性能优化面试题.md
│   │   ├── 小程序面试题.md
│   │   └── 输出题.md
│   ├── 小程序.md
│   ├── 三方库.md
│   └── img/                 # 笔记引用的图片
└── img/                 # 笔记引用的图片
```
