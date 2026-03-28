<!-- [toc] -->

---

# Vue 面试题

> 高频 Vue 面试题精选，涵盖 Vue 2 和 Vue 3 核心知识点。

---

## 1. Vue 2 响应式原理

通过 `Object.defineProperty()` 劫持 data 属性的 getter/setter。

```
初始化 → Object.defineProperty 劫持属性
                ↓
     get（依赖收集）  ←  Watcher 订阅
                ↓
     set（派发更新）  →  通知 Dep → 触发 Watcher.update()
                ↓
          异步更新队列 → nextTick → 更新 DOM
```

**核心三要素：**
1. **Observer**：递归遍历 data，用 `Object.defineProperty` 劫持每个属性
2. **Dep（依赖收集器）**：每个属性对应一个 Dep 实例，收集依赖它的 Watcher
3. **Watcher（观察者）**：组件渲染时触发 getter → 收集到 Dep 中；数据变化时 Dep 通知 Watcher 更新

**局限性（为什么 Vue 3 用 Proxy）：**
- 无法检测**对象属性的新增/删除**（需用 `Vue.set` / `Vue.delete`）
- 无法检测**数组索引赋值**和**修改 length**（Vue 重写了数组的 7 个方法：push、pop、shift、unshift、splice、sort、reverse）
- 初始化时需要递归遍历所有属性，性能开销大

---

## 2. Vue 3 响应式原理

使用 `Proxy` 替代 `Object.defineProperty`：

```js
const handler = {
  get(target, key, receiver) {
    track(target, key); // 依赖收集
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver);
    trigger(target, key); // 派发更新
    return result;
  }
};
const proxy = new Proxy(data, handler);
```

**Proxy 优势：**
- 可以监听属性新增/删除
- 可以监听数组索引和 length 变化
- **懒代理**：用到才代理，不用递归遍历
- 支持 Map、Set 等集合类型

---

## 3. v-if 和 v-show 的区别

| 对比 | v-if | v-show |
| --- | --- | --- |
| 切换方式 | **销毁/创建** DOM | 切换 `display: none` |
| 性能 | 切换开销大 | **初始渲染开销大** |
| 生命周期 | 会触发 created/destroyed | 不会 |
| 适用场景 | 条件很少改变时 | 频繁切换时 |

---

## 4. v-if 和 v-for 的优先级

- **Vue 2**：`v-for` 优先级高于 `v-if`（一起用性能差，每次渲染都遍历整个列表）
- **Vue 3**：`v-if` 优先级高于 `v-for`

**最佳实践：** 不要同时用在一个元素上，用 `computed` 过滤列表或外层包裹 `<template>`

---

## 5. computed 和 watch 的区别

| 对比 | computed | watch |
| --- | --- | --- |
| 缓存 | **有缓存**，依赖不变不会重新计算 | 无缓存 |
| 返回值 | 必须有返回值 | 不需要 |
| 异步 | 不能有异步操作 | **可以执行异步操作** |
| 用途 | 依赖其他值计算出新值 | 监听值变化后执行副作用 |

---

## 6. 组件通信方式

| 方式 | 场景 | 说明 |
| --- | --- | --- |
| `props` / `$emit` | 父子 | 最基础，单向数据流 |
| `v-model` / `.sync` | 父子 | 双向绑定语法糖 |
| `$refs` | 父→子 | 直接访问子组件实例 |
| `$parent` / `$children` | 父子 | 直接访问实例（不推荐） |
| `provide` / `inject` | 祖先→后代 | 跨层级传递（非响应式，Vue 2） |
| `EventBus` / `mitt` | 任意 | 全局事件总线 |
| Vuex / Pinia | 任意 | 全局状态管理 |
| `$attrs` / `$listeners` | 祖先→后代 | 透传属性/事件 |

---

## 7. Vue Router 的 hash 和 history 模式

- **hash**：URL 中带 `#`，靠 `hashchange` 事件，不需要服务端配置
- **history**：URL 正常，靠 `pushState/replaceState`，**需要服务端配置 fallback**

---

## 8. Vuex 和 Pinia 的区别

| 对比 | Vuex | Pinia |
| --- | --- | --- |
| Mutation | 必须 | 不需要 |
| 模块化 | module 嵌套 | 每个 store 独立 |
| TypeScript | 弱 | **原生支持** |
| 体积 | 较大 | **~1KB** |

**Vuex 核心概念：**

```
State（状态）→ Getter（计算属性）→ Mutation（同步修改）→ Action（异步操作）→ Module（模块化）
```

```
组件 dispatch → Action(异步) → commit → Mutation(同步) → 修改 State → 响应式更新视图
```

**为什么 Mutation 必须是同步的？** 每个 Mutation 执行完都可以被 devtools 记录状态快照，异步操作无法追踪状态变化。

---

## 9. 虚拟 DOM 和 diff 算法

**虚拟 DOM**：用 JS 对象描述真实 DOM 结构

```js
{
  tag: 'div',
  props: { class: 'container' },
  children: [
    { tag: 'p', children: 'Hello' }
  ]
}
```

**为什么需要虚拟 DOM？**
1. 减少直接操作 DOM 的次数（DOM 操作非常昂贵）
2. 跨平台：可以用相同逻辑渲染到不同平台（SSR、小程序等）
3. diff 算法可以**最小化 DOM 更新**

**diff 算法策略：**
1. **同层比较**：只比较同一层级的节点，不跨层
2. **Vue 2 双端比较**：头头、尾尾、头尾、尾头四种比较方式
3. **Vue 3 最长递增子序列**：更高效的节点复用
4. **key 的作用**：通过 key 快速找到可复用的节点
5. 时间复杂度：O(n)

---

## 10. v-for 中 key 的作用

key 是给 VNode 的唯一标识，在 diff 算法中用来**精准判断两个节点是否相同**，从而实现高效更新、复用和重排。

**不能用 index 作为 key 的场景：**
- 列表有**增删、排序**操作时，index 会变化，导致 Vue 错误地复用节点
- 子组件有状态（如 input 值）时，会出现状态混乱

```js
// ❌ 使用 index
<li v-for="(item, index) in list" :key="index">

// ✅ 使用唯一 id
<li v-for="item in list" :key="item.id">
```

---

## 11. nextTick 原理

`nextTick` 将回调延迟到下次 DOM 更新后执行。本质是利用微任务（`Promise.then`）或降级为宏任务（`setTimeout`）。

```js
this.message = '更新了';
this.$nextTick(() => {
  // 此时 DOM 已经更新
  console.log(this.$refs.msg.textContent); // '更新了'
});
```

**原理：** Vue 内部数据变化 → 触发 setter → 通知 Watcher → Watcher 不会立即更新 DOM，而是加入异步更新队列 → 同一事件循环中的多次数据变化会被合并（去重） → 在 nextTick（微任务）中统一更新 DOM

---

## 12. keep-alive

缓存不活动的组件实例，避免重复销毁和创建。

```html
<keep-alive include="Home,About" :max="10">
  <router-view />
</keep-alive>
```

**专属生命周期：**
- `activated`：组件被激活时调用
- `deactivated`：组件被停用时调用

---

## 13. 生命周期

```
beforeCreate → created → beforeMount → mounted → beforeUpdate → updated → beforeDestroy → destroyed
```

| 阶段 | 可访问 | 说明 |
| --- | --- | --- |
| `beforeCreate` | - | 实例初始化，data/methods 不可用 |
| `created` | data、methods、computed | **常用：发请求**，DOM 不可用 |
| `beforeMount` | 同上 | 模板编译完成，即将挂载 |
| `mounted` | **DOM 可用** | **常用：操作 DOM、第三方库初始化** |
| `beforeUpdate` | 更新前的 DOM | 数据已变，DOM 未更新 |
| `updated` | 更新后的 DOM | DOM 已更新（避免在此修改数据） |
| `beforeDestroy` | 全部可用 | **常用：清除定时器、解绑事件** |
| `destroyed` | - | 实例销毁完成 |

**父子组件生命周期顺序：**
- 创建：父 beforeCreate → 父 created → 父 beforeMount → **子 beforeCreate → 子 created → 子 beforeMount → 子 mounted** → 父 mounted
- 更新：父 beforeUpdate → **子 beforeUpdate → 子 updated** → 父 updated
- 销毁：父 beforeDestroy → **子 beforeDestroy → 子 destroyed** → 父 destroyed

---

## 14. Vue Router 导航守卫

```
全局前置(beforeEach) → 路由独享(beforeEnter) → 组件内(beforeRouteEnter)
→ 全局解析(beforeResolve) → 全局后置(afterEach)
```

---

## 15. Vue 2 vs Vue 3 对比

| 特性 | Vue 2 | Vue 3 |
| --- | --- | --- |
| 响应式 | `Object.defineProperty` | **Proxy** |
| API 风格 | Options API | **Composition API** |
| 生命周期 | beforeDestroy / destroyed | **onBeforeUnmount / onUnmounted** |
| Fragment | 不支持（单根节点） | **支持多根节点** |
| Teleport | 无 | `<Teleport>` |
| 性能 | 虚拟 DOM 全量比较 | **静态标记 + 树摇优化** |
| TypeScript | 支持差 | **原生支持** |
| 状态管理 | Vuex | Vuex / **Pinia**（推荐）|

---

## 16. Vue 3 Composition API 核心

```js
import { ref, reactive, computed, watch, onMounted } from 'vue';

export default {
  setup() {
    // 响应式数据
    const count = ref(0);
    const state = reactive({ name: '张三', age: 25 });

    // 计算属性
    const doubleCount = computed(() => count.value * 2);

    // 监听
    watch(count, (newVal, oldVal) => {
      console.log(`count: ${oldVal} → ${newVal}`);
    });

    // 生命周期
    onMounted(() => { console.log('mounted'); });

    // 方法
    const increment = () => count.value++;

    return { count, state, doubleCount, increment };
  }
};
```

---

## 17. 性能优化

1. **路由懒加载**：`() => import('./views/Home.vue')`
2. **keep-alive 缓存**：减少重复渲染
3. **v-show 替代 v-if**：频繁切换场景
4. **Object.freeze()**：冻结不需要响应式的大数据
5. **虚拟滚动**：大列表使用 `vue-virtual-scroller`
6. **合理使用 computed**：利用缓存避免重复计算
7. **v-once / v-memo**：只渲染一次的静态内容
8. **图片懒加载**：`v-lazy` 指令
9. **第三方库按需引入**：如 Element UI 按需导入
10. **SSR / SSG**：首屏性能优化
