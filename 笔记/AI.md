# AI 辅助前端开发

## 一、AI 编码工具

### 1.1 主流工具对比

| 工具 | 特点 | 适用场景 |
|------|------|----------|
| **GitHub Copilot** | VS Code 深度集成，补全质量高 | 日常编码、补全、行内建议 |
| **Cursor** | AI-native 编辑器，支持多文件上下文编辑 | 大规模重构、跨文件修改 |
| **Codeium / Windsurf** | 免费可用，支持多 IDE | 轻量补全 |
| **v0.dev** | Vercel 出品，从描述生成 UI 组件 | 快速原型、UI 组件生成 |
| **bolt.new** | 全栈 AI 开发，直接生成可运行项目 | 快速 Demo、全栈原型 |

### 1.2 高效使用技巧

```markdown
1. **提供充分上下文**：打开相关文件、写好类型定义，AI 补全质量会显著提升
2. **写好注释再让 AI 补全**：先写注释描述意图，AI 生成的代码更准确
3. **善用 Chat 模式**：复杂逻辑先在 Chat 里讨论方案，再让 AI 生成代码
4. **Review AI 生成的代码**：不要盲目接受，关注边界条件和安全性
5. **迭代式 Prompt**：一次生成不满意就追加要求，逐步优化
```

### 1.3 Prompt Engineering 技巧（面向开发者）

```markdown
## 好的 Prompt 模板

### 生成组件
"创建一个 Vue3 + TypeScript 的 [组件名] 组件，需求如下：
- 功能：...
- Props：...
- 事件：...
- 使用 Composition API + script setup
- 需要响应式设计"

### 代码重构
"将以下 Options API 代码重构为 Composition API（script setup），
保持功能完全一致，使用 ref/reactive/computed 替代 data/computed/methods"

### 生成测试
"为以下函数生成 Vitest 单元测试，覆盖以下场景：
- 正常输入
- 边界值（空数组、null、undefined）
- 异常输入
- 返回值类型校验"
```

---

## 二、AI 驱动的组件开发

### 2.1 用 AI 快速生成组件

**典型工作流：**

```
设计稿/需求描述 → AI 生成组件骨架 → 人工调整细节 → AI 生成测试 → 完成
```

**实际示例：用 Cursor 生成一个表格组件**

```vue
<!-- 只需描述需求，AI 就能生成完整组件 -->
<!--
  Prompt: "创建一个通用 Table 组件，支持：
  1. 列配置（columns prop）
  2. 数据源（dataSource prop）
  3. 排序功能
  4. 分页功能
  5. 加载状态
  使用 Vue3 + TypeScript + script setup"
-->

<script setup lang="ts">
interface Column {
  key: string
  title: string
  sortable?: boolean
  width?: string
  render?: (value: any, row: any) => any
}

interface Props {
  columns: Column[]
  dataSource: any[]
  loading?: boolean
  pagination?: {
    current: number
    pageSize: number
    total: number
  }
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  sort: [key: string, order: 'asc' | 'desc']
  pageChange: [page: number]
}>()

const sortState = ref<{ key: string; order: 'asc' | 'desc' } | null>(null)

function handleSort(column: Column) {
  if (!column.sortable) return
  const order = sortState.value?.key === column.key && sortState.value.order === 'asc'
    ? 'desc' : 'asc'
  sortState.value = { key: column.key, order }
  emit('sort', column.key, order)
}
</script>
```

### 2.2 设计稿转代码

```markdown
工具链：
1. **截图 → 代码**：Cursor / GPT-4o 支持上传设计稿截图直接生成 HTML/CSS/组件
2. **Figma → 代码**：Figma 插件（如 Locofy、Builder.io）+ AI 辅助
3. **v0.dev**：输入文字描述，生成 React/Next.js 组件（可参考思路用于 Vue）

实际经验：
- AI 生成的 UI 代码通常需要 20-30% 的人工调整
- 复杂交互逻辑仍需手写，AI 更擅长布局和样式
- 建议先让 AI 生成静态结构，再逐步添加交互
```

---

## 三、AI 辅助代码迁移与重构

### 3.1 框架迁移

#### Vue2 → Vue3 迁移

```markdown
**AI 辅助迁移步骤：**

1. **Options API → Composition API**
   - 让 AI 逐个组件转换，保持功能一致
   - Prompt: "将这个 Vue2 Options API 组件转为 Vue3 Composition API（script setup）"

2. **Vuex → Pinia**
   - Prompt: "将这个 Vuex module 转为 Pinia store，使用 Setup Store 风格"

3. **Vue Router 3 → 4**
   - 路由守卫、路由配置的 API 变更，AI 可以批量处理

4. **移除废弃 API**
   - $on/$off/$once → mitt 或 provide/inject
   - filter → computed 或 method
   - $set/$delete → 直接赋值（Proxy 响应式）
```

#### JavaScript → TypeScript 迁移

```markdown
**迁移策略：**
1. 让 AI 为现有 JS 文件生成 .d.ts 类型声明
2. 逐步将 .js 改为 .ts，AI 自动推断并添加类型
3. 重点关注：
   - API 响应数据的类型定义
   - 组件 Props/Emits 的类型
   - Store 状态的类型
   - 工具函数的参数和返回值类型
```

#### Webpack → Vite 迁移

```markdown
AI 可以帮助：
1. 将 webpack.config.js 转为 vite.config.ts
2. 转换 require() → import
3. 处理环境变量 process.env → import.meta.env
4. 识别不兼容的 webpack loader，推荐 Vite 插件替代
```

### 3.2 代码重构

```markdown
常见 AI 辅助重构场景：
1. **提取公共逻辑** → 让 AI 识别重复代码，提取为 composable / util
2. **优化复杂条件** → AI 简化嵌套 if-else 为策略模式/查找表
3. **拆分大组件** → AI 分析组件职责，建议拆分方案
4. **命名优化** → AI 根据上下文建议更语义化的变量/函数名
```

---

## 四、AI 辅助自动化测试

### 4.1 单元测试生成

```typescript
// AI 可以根据源码自动生成测试用例
// 示例：给定一个工具函数

// utils/format.ts
export function formatPrice(price: number): string {
  if (price < 0) throw new Error('Price cannot be negative')
  return '¥' + price.toFixed(2)
}

// AI 生成的测试 ↓
// utils/__tests__/format.test.ts
import { describe, it, expect } from 'vitest'
import { formatPrice } from '../format'

describe('formatPrice', () => {
  it('应正确格式化整数价格', () => {
    expect(formatPrice(100)).toBe('¥100.00')
  })

  it('应正确格式化小数价格', () => {
    expect(formatPrice(99.9)).toBe('¥99.90')
  })

  it('应处理 0', () => {
    expect(formatPrice(0)).toBe('¥0.00')
  })

  it('负数应抛出异常', () => {
    expect(() => formatPrice(-1)).toThrow('Price cannot be negative')
  })

  it('应保留两位小数', () => {
    expect(formatPrice(1.999)).toBe('¥2.00')
  })
})
```

### 4.2 组件测试生成

```markdown
Prompt 模板：
"为以下 Vue3 组件生成 @vue/test-utils + Vitest 测试，覆盖：
1. 组件渲染
2. Props 传入后的 DOM 状态
3. 用户交互（点击、输入）
4. 事件触发（emit）
5. 异步数据加载
6. 边界情况（空数据、加载中、错误状态）"
```

### 4.3 E2E 测试生成

```markdown
AI 可以根据用户故事生成 Playwright / Cypress 测试：

Prompt: "根据以下用户故事生成 Playwright E2E 测试：
- 用户打开登录页
- 输入用户名和密码
- 点击登录按钮
- 验证跳转到首页
- 验证导航栏显示用户名"
```

```typescript
// AI 生成的 Playwright 测试
import { test, expect } from '@playwright/test'

test('用户登录流程', async ({ page }) => {
  await page.goto('/login')

  await page.getByPlaceholder('请输入用户名').fill('testuser')
  await page.getByPlaceholder('请输入密码').fill('password123')
  await page.getByRole('button', { name: '登录' }).click()

  // 验证跳转
  await expect(page).toHaveURL('/')

  // 验证用户名显示
  await expect(page.getByTestId('username')).toHaveText('testuser')
})
```

### 4.4 测试覆盖率提升策略

```markdown
1. 让 AI 分析现有代码，找出未覆盖的分支
2. 针对未覆盖分支生成补充测试
3. AI 辅助编写 Mock 数据和 Mock 函数
4. 使用 AI 生成测试数据工厂（faker.js 配置）
```

---

## 五、AI 在前端工程化中的应用

### 5.1 Code Review

```markdown
- **AI 辅助 CR**：GitHub Copilot PR Review、CodeRabbit 等
- 自动检测：
  - 潜在的 bug 和安全漏洞
  - 性能问题（不必要的重渲染、内存泄漏风险）
  - 代码风格和最佳实践
  - 类型安全问题
```

### 5.2 文档生成

```markdown
- AI 自动生成 JSDoc / TSDoc 注释
- 根据组件 Props 生成 API 文档
- 根据 Git commit 生成 Changelog
- 根据代码生成 README
```

### 5.3 Commit Message & PR 描述

```markdown
- AI 根据 diff 自动生成规范的 commit message（Conventional Commits）
- 自动生成 PR 描述，包含改动摘要、影响范围、测试建议
```

---

## 六、前端应用接入 AI 能力

### 6.1 调用大模型 API

```typescript
// 基础调用示例（OpenAI 兼容 API）
async function chat(message: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: message }]
    })
  })
  const data = await response.json()
  return data.choices[0].message.content
}
```

### 6.2 流式输出（SSE）

```typescript
// 流式输出 — 实现打字机效果
async function streamChat(message: string, onChunk: (text: string) => void) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  })

  const reader = response.body!.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value, { stream: true })
    // SSE 格式：data: {...}\n\n
    const lines = chunk.split('\n').filter(line => line.startsWith('data: '))

    for (const line of lines) {
      const data = line.slice(6) // 去掉 "data: "
      if (data === '[DONE]') return
      const parsed = JSON.parse(data)
      const content = parsed.choices?.[0]?.delta?.content || ''
      if (content) onChunk(content)
    }
  }
}

// Vue3 组合式用法
const answer = ref('')
await streamChat('你好', (chunk) => {
  answer.value += chunk  // 逐字追加，实现打字机效果
})
```

### 6.3 Vercel AI SDK（推荐）

```typescript
// 使用 Vercel AI SDK 简化流式 AI 调用
// npm install ai @ai-sdk/openai

// 服务端（Node.js / Edge）
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function POST(req: Request) {
  const { messages } = await req.json()
  const result = streamText({
    model: openai('gpt-4o'),
    messages
  })
  return result.toDataStreamResponse()
}

// 客户端（Vue3）
import { useChat } from '@ai-sdk/vue'

const { messages, input, handleSubmit, isLoading } = useChat({
  api: '/api/chat'
})
```

### 6.4 RAG（检索增强生成）

```markdown
**RAG 基本流程：**
1. 文档分片 → 向量化（Embedding）→ 存入向量数据库
2. 用户提问 → 向量化 → 在向量库中检索相似文档
3. 将检索到的文档作为上下文，连同问题一起发给 LLM
4. LLM 基于上下文生成回答

**前端相关：**
- 前端负责：聊天界面、消息流渲染、文件上传、引用来源展示
- 后端负责：Embedding、向量检索、Prompt 拼接、LLM 调用
- 常用向量数据库：Pinecone、Milvus、Chroma
```

---

## 七、AI 开发的边界与注意事项

### 7.1 AI 生成代码的局限性

```markdown
1. **上下文窗口有限**：超大项目中 AI 可能丢失全局上下文
2. **幻觉问题**：可能生成看似正确但实际有 bug 的代码
3. **安全性**：AI 可能忽略 XSS、CSRF 等安全问题
4. **过时 API**：训练数据截止日期问题，可能使用已废弃的 API
5. **业务理解不足**：复杂业务逻辑仍需人工把关
```

### 7.2 面试中如何谈 AI

```markdown
✅ 正确姿势：
- "我用 Cursor 辅助完成了 Vue2 到 Vue3 的迁移，效率提升约 60%"
- "我会用 AI 生成测试用例，再人工补充边界场景"
- "AI 帮我快速生成组件骨架，我专注于业务逻辑和交互细节"

❌ 避免说：
- "我用 AI 写所有代码"（显得没有核心能力）
- "AI 比人写得好"（不客观）

💡 关键观点：
- AI 是**效率工具**，不是替代品
- 核心竞争力是**判断力**：知道 AI 生成的代码对不对、好不好
- 真正的价值在于**架构设计、需求分析、技术选型**这些 AI 无法独立完成的工作
```
