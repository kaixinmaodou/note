# AI 面试题

## 1. 你在工作中是怎么使用 AI 辅助开发的？

```markdown
**回答思路：** 结合实际场景，展示你对 AI 工具的合理使用

1. **日常编码**：使用 Copilot / Cursor 辅助代码补全，尤其是重复性代码（CRUD、类型定义）
2. **组件开发**：用 AI 快速生成组件骨架，再手动调整业务逻辑和交互细节
3. **测试编写**：让 AI 生成单元测试的基础用例，人工补充边界场景
4. **代码重构**：利用 AI 做 Options API → Composition API 的转换、JS → TS 迁移等
5. **Code Review**：AI 辅助检查潜在 bug、性能问题、类型安全
6. **文档生成**：自动生成 JSDoc 注释、API 文档、Commit Message

**关键点：** 强调 AI 是提效工具，人工判断力才是核心
```

---

## 2. AI 生成的代码可能有哪些问题？你如何应对？

```markdown
**常见问题：**
1. **幻觉**：生成看似正确但实际有 bug 的代码（如 API 不存在、逻辑错误）
2. **安全漏洞**：忽略 XSS、SQL 注入、敏感信息暴露等问题
3. **过时 API**：使用已废弃的方法（如 Vue2 语法混入 Vue3 项目）
4. **性能问题**：不考虑性能优化（如不必要的重渲染、缺少防抖节流）
5. **上下文丢失**：大型项目中 AI 可能不了解全局架构，生成的代码与项目风格不一致

**应对策略：**
- 始终 Review AI 生成的代码，不盲目接受
- 跑测试验证正确性
- 关注边界条件和异常处理
- 检查是否符合项目编码规范
- 对安全敏感的代码（鉴权、支付等）必须人工审查
```

---

## 3. 如何用 AI 辅助完成 Vue2 到 Vue3 的迁移？

```markdown
**迁移步骤：**

1. **Options API → Composition API**
   - 逐个组件让 AI 转换，提供清晰的 Prompt
   - 检查 this 引用是否正确移除
   - 确认生命周期钩子映射正确（created → 直接执行, mounted → onMounted）

2. **Vuex → Pinia**
   - AI 转换 module 为独立 store
   - 验证 state、getters、actions 的映射
   - 检查组件中的 mapState/mapGetters 是否正确替换

3. **废弃 API 处理**
   - $on/$off → mitt 或 provide/inject
   - filters → computed 或方法调用
   - $set/$delete → 直接赋值

4. **批量处理 + 人工验证**
   - AI 可以批量转换，但每个组件都需要人工验证功能一致性
   - 迁移后跑一遍测试，确保无回归
```

---

## 4. 什么是 Prompt Engineering？前端开发中如何写好 Prompt？

```markdown
**Prompt Engineering** 是通过优化输入提示，让 AI 输出更准确、更高质量结果的技巧。

**前端开发中的 Prompt 技巧：**

1. **明确技术栈**："使用 Vue3 + TypeScript + Composition API（script setup）"
2. **描述清楚需求**：列出功能点、Props、事件、样式要求
3. **给出约束条件**："不使用第三方 UI 库"、"兼容移动端"
4. **提供参考示例**：贴一段现有代码作为风格参考
5. **分步骤请求**：复杂任务拆分为多步，逐步生成
6. **要求解释**："生成代码并解释关键实现思路"

**示例对比：**
❌ 差的 Prompt："写一个表格组件"
✅ 好的 Prompt："用 Vue3 + TS + script setup 写一个 Table 组件，支持列配置、排序、分页、loading 状态，不依赖 UI 库，响应式布局"
```

---

## 5. 如何用 AI 生成自动化测试？效果如何？

```markdown
**生成方式：**
1. 将源代码 + 需求说明作为上下文
2. 指定测试框架（Vitest / Jest / Playwright）
3. 明确要覆盖的场景（正常、边界、异常）

**效果评估：**
- ✅ 基础用例覆盖率高：正常路径的测试 AI 生成质量不错
- ✅ 省去大量 boilerplate 代码
- ⚠️ 边界用例需人工补充：AI 容易遗漏业务相关的边界条件
- ⚠️ Mock 策略可能不合理：需要人工确认 Mock 的粒度
- ❌ 无法理解业务上下文：纯业务逻辑的测试仍需人工设计

**最佳实践：**
- AI 生成 70-80% 的测试代码
- 人工补充 20-30% 的关键场景（边界、异常、业务规则）
- 每次 Review 测试是否真正在测有意义的东西（避免无效断言）
```

---

## 6. 前端如何实现 AI 聊天的流式输出（打字机效果）？

```markdown
**核心技术：Server-Sent Events (SSE) + ReadableStream**

1. **后端**：以 SSE 格式逐块返回 LLM 的输出
   - Content-Type: text/event-stream
   - 每个 chunk 格式：`data: {"content": "你"}\n\n`

2. **前端**：使用 fetch + ReadableStream 读取
   ```js
   const response = await fetch('/api/chat', { method: 'POST', body: ... })
   const reader = response.body.getReader()
   const decoder = new TextDecoder()

   while (true) {
     const { done, value } = await reader.read()
     if (done) break
     const text = decoder.decode(value, { stream: true })
     // 解析 SSE 数据，追加到页面
   }
   ```

3. **Vue3 实现要点**：
   - 用 ref 存储累计文本，逐字追加触发响应式更新
   - 注意滚动到底部的处理（nextTick + scrollIntoView）
   - 支持中断请求（AbortController）

4. **也可使用 Vercel AI SDK**：`useChat()` 封装了以上所有逻辑
```

---

## 7. 什么是 RAG？前端在 RAG 架构中的角色是什么？

```markdown
**RAG（Retrieval-Augmented Generation，检索增强生成）：**
让 LLM 基于检索到的外部知识回答问题，解决模型知识截止和幻觉问题。

**流程：**
文档 → 分片 → Embedding → 向量数据库
用户提问 → Embedding → 向量检索 → 拼接上下文 → LLM 生成回答

**前端的角色：**
1. **聊天界面**：消息列表、输入框、发送按钮
2. **流式渲染**：打字机效果展示 AI 回答
3. **文件上传**：上传文档供后端建立知识库
4. **引用来源展示**：展示回答引用了哪些文档片段
5. **Markdown 渲染**：AI 回答通常是 Markdown 格式
6. **对话历史管理**：多轮对话的上下文维护

**技术选型：**
- Markdown 渲染：markdown-it / react-markdown
- 代码高亮：Shiki / Prism
- 流式处理：Vercel AI SDK / 手写 SSE 解析
```

---

## 8. AI 工具的使用会不会让开发者失去竞争力？

```markdown
**参考回答：**

不会，反而会重新定义竞争力的标准：

1. **AI 替代的是重复性编码**，不是思考和决策
2. **新的核心竞争力：**
   - 架构设计能力（AI 无法独立完成系统设计）
   - 需求分析和技术选型
   - 判断 AI 输出质量的能力
   - 调试和排查复杂问题的能力
   - 业务理解和沟通能力

3. **会用 AI 的人 vs 不会用的人**：
   - 效率差距可能达到 2-5 倍
   - 善用 AI 的开发者能把更多时间投入高价值工作

4. **类比**：IDE 的自动补全没有让程序员失业，而是提高了效率门槛
```
