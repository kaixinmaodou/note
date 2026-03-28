import { defineConfig } from 'vitepress';

export default defineConfig({
  title: '前端知识体系',
  description: '学习笔记与面试八股',
  lang: 'zh-CN',
  // 设置基础路径，确保部署在 GitHub Pages 或子路径时资源正确加载
  base: '/note/',

  // 排除课程资源和无关文件，避免构建报错
  srcExclude: [
    '**/DY/**',
    '**/SGG/**',
    '**/demo/**',
    '进度.md'
  ],

  // 忽略死链接（部分笔记引用了本地 demo 或外部资源）
  ignoreDeadLinks: true,

  // 自定义 vite 插件：在 VitePress 处理前，转义 .md 中代码栅栏外的裸 HTML 标签
  vite: {
    assetsInclude: ['**/*.awebp'],
    plugins: [
      {
        name: 'escape-raw-html-in-md',
        enforce: 'pre',
        transform(code, id) {
          if (!id.endsWith('.md')) return null;

          const lines = code.split('\n');
          const result = [];
          let inFence = false;
          let changed = false;

          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();

            // Track code fence state
            if (/^(`{3,})/.test(trimmed)) {
              if (!inFence) {
                inFence = true;
                result.push(line);
                continue;
              } else if (/^`{3,}\s*$/.test(trimmed)) {
                inFence = false;
                result.push(line);
                continue;
              }
            }

            if (inFence) {
              result.push(line);
              continue;
            }

            // Outside code fences: escape < except for:
            // 1. Self-closing img/br/hr tags
            // 2. HTML comments <!-- -->
            // 3. Already escaped \<
            let newLine = line.replace(
              /(?<!\\)<(?!\/?img[\s/>])(?!\/?br[\s/>])(?!\/?hr[\s/>])(?!!--)/gi,
              '\\<'
            );

            if (newLine !== line) changed = true;
            result.push(newLine);
          }

          if (changed) {
            return { code: result.join('\n'), map: null };
          }
          return null;
        }
      }
    ]
  },

  themeConfig: {
    nav: [
      { text: '笔记', link: '/JS' },
      { text: '面试题', link: '/面试题' },
      { text: '手写题', link: '/手写题' }
    ],

    sidebar: [
      {
        text: 'JavaScript',
        items: [
          { text: 'JS 核心', link: '/JS' }
        ]
      },
      {
        text: 'CSS & HTML',
        items: [
          { text: 'CSS & HTML', link: '/CSS&HTML' }
        ]
      },
      {
        text: 'Vue',
        items: [
          { text: 'Vue 2', link: '/Vue2' },
          { text: 'Vue 3', link: '/Vue3' }
        ]
      },
      {
        text: '网络',
        items: [
          { text: '计算机网络', link: '/network' }
        ]
      },
      {
        text: '浏览器',
        items: [
          { text: '浏览器原理', link: '/浏览器原理' }
        ]
      },
      {
        text: '工程化',
        items: [
          { text: '前端工程化', link: '/engineering' }
        ]
      },
      {
        text: '跨端',
        items: [
          { text: '小程序 & UniApp', link: '/小程序' }
        ]
      },
      {
        text: '面试专区',
        collapsed: false,
        items: [
          { text: '面试题总览', link: '/面试题' },
          { text: 'JS 面试题', link: '/面试题/JS面试题' },
          { text: 'CSS 面试题', link: '/面试题/CSS面试题' },
          { text: 'Vue 面试题', link: '/面试题/Vue面试题' },
          { text: '网络面试题', link: '/面试题/网络面试题' },
          { text: '浏览器面试题', link: '/面试题/浏览器面试题' },
          { text: '工程化面试题', link: '/面试题/工程化面试题' },
          { text: '性能优化面试题', link: '/面试题/性能优化面试题' },
          { text: '小程序面试题', link: '/面试题/小程序面试题' },
          { text: '输出题精选', link: '/面试题/输出题' },
          { text: '手写代码题', link: '/手写题' }
        ]
      },
      {
        text: '其他',
        items: [
          { text: '第三方库速查', link: '/三方库' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com' }
    ],

    search: {
      provider: 'local'
    },

    outline: {
      level: [2, 3],
      label: '目录'
    },

    lastUpdated: {
      text: '最后更新'
    }
  }
});
