<!-- [toc] -->

---

# Vue 3

> Vue 3 于 2020 年 9 月 18 日正式发布，代号 `One Piece`。
> 经历了 [4800+ 次提交](https://github.com/vuejs/core/commits/main)、[40+ 个 RFC](https://github.com/vuejs/rfcs/tree/master/active-rfcs)、[600+ 次 PR](https://github.com/vuejs/vue-next/pulls?q=is%3Apr+is%3Amerged)、[300+ 贡献者](https://github.com/vuejs/core/graphs/contributors)
>
> 官方文档：[https://cn.vuejs.org/](https://cn.vuejs.org/)  
> API 参考：[https://cn.vuejs.org/api/](https://cn.vuejs.org/api/)

---

## Vue 3 简介

### 性能提升

- 打包大小减少 **41%**
- 初次渲染快 **55%**，更新渲染快 **133%**
- 内存减少 **54%**

### 源码升级

- 使用 **[Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)** 代替 `Object.defineProperty` 实现响应式
- 重写虚拟 DOM 的实现和 **[Tree-Shaking](https://developer.mozilla.org/zh-CN/docs/Glossary/Tree_shaking)**

### TypeScript 支持

- Vue 3 源码使用 TypeScript 编写，对 TS 支持更加友好
- `<script setup lang="ts">` 开箱即用

### 新特性总览

| 特性 | Vue 2 | Vue 3 |
| --- | --- | --- |
| 响应式系统 | `Object.defineProperty` | **Proxy** |
| API 风格 | Options API | **Composition API** + Options API |
| 生命周期 | beforeDestroy / destroyed | **onBeforeUnmount / onUnmounted** |
| Fragment | 必须单根节点 | **支持多根节点** |
| Teleport | 无 | **`<Teleport>`** |
| Suspense | 无 | **`<Suspense>`**（实验性） |
| 性能 | 虚拟 DOM 全量 diff | **静态标记 + Block Tree** |
| TypeScript | 支持弱 | **原生友好** |
| Tree-shaking | 不支持 | **按需引入** |
| 状态管理 | Vuex | Vuex / **Pinia（推荐）** |

---

## 创建 Vue 3 工程

### 基于 vue-cli 创建

> 目前 `vue-cli` 已处于维护模式，官方推荐基于 Vite 创建项目。

```bash
# 确保 @vue/cli 版本 >= 4.5.0
vue --version

# 安装或升级
npm install -g @vue/cli

# 创建项目，选择 3.x
vue create vue_test
```

### 基于 Vite 创建（推荐）

[Vite 官网](https://cn.vitejs.dev/) — 新一代前端构建工具。

**优势：**
- 轻量快速的热重载（HMR），极速的服务启动
- 对 TypeScript、JSX、CSS 等支持开箱即用
- 真正的按需编译，不再等待整个应用编译完成

```bash
## 创建项目
npm create vue@latest

## 配置选项
√ Project name: vue3_test
√ Add TypeScript?  Yes
√ Add JSX Support?  No
√ Add Vue Router?  No
√ Add Pinia?  No
√ Add Vitest?  No
√ Add End-to-End Testing?  No
√ Add ESLint?  Yes
√ Add Prettier?  No
```

> 参考官方文档：[创建一个 Vue 应用](https://cn.vuejs.org/guide/quick-start.html#creating-a-vue-application)

### 入口文件对比

```js
// Vue 2
import Vue from 'vue';
import App from './App.vue';
new Vue({ render: h => h(App) }).$mount('#app');

// Vue 3 —— 使用 createApp
import { createApp } from 'vue';
import App from './App.vue';
createApp(App).mount('#app');
```

**总结：**
- Vite 项目中，`index.html` 是项目的入口文件（在项目最外层）
- 加载 `index.html` 后，Vite 解析 `<script type="module" src="xxx">` 指向的 JavaScript
- Vue 3 中通过 `createApp` 函数创建一个应用实例

### 项目结构

```
├── public/
├── src/
│   ├── assets/          # 静态资源
│   ├── components/      # 公共组件
│   ├── views/           # 页面（路由组件）
│   ├── router/          # 路由
│   ├── stores/          # Pinia 状态管理
│   ├── hooks/           # 自定义 hooks
│   ├── App.vue          # 根组件
│   └── main.ts          # 入口文件
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

### 一个简单的效果

Vue 3 向下兼容 Vue 2 语法，且模板中可以没有根标签（Fragment）：

```vue
<template>
  <div class="person">
    <h2>姓名：{{ name }}</h2>
    <h2>年龄：{{ age }}</h2>
    <button @click="changeName">修改名字</button>
    <button @click="changeAge">年龄+1</button>
    <button @click="showTel">查看联系方式</button>
  </div>
</template>

<script lang="ts">
export default {
  name: 'App',
  data() {
    return {
      name: '张三',
      age: 18,
      tel: '13888888888'
    };
  },
  methods: {
    changeName() {
      this.name = 'zhang-san';
    },
    changeAge() {
      this.age += 1;
    },
    showTel() {
      alert(this.tel);
    }
  }
};
</script>
```

---

## Options API 与 Composition API

### Options API 的弊端

Options 类型的 API，数据、方法、计算属性等，分散在 `data`、`methods`、`computed` 中。若想新增或修改一个需求，就需要分别修改这些配置，**不便于维护和复用**。

### Composition API 的优势

> 参考：[组合式 API FAQ](https://cn.vuejs.org/guide/extras/composition-api-faq.html)

可以用函数的方式，将相关功能的代码组织在一起：

```js
// Options API —— 功能A的代码分散在 data/methods/computed 中
export default {
  data() { return { countA: 0, countB: 0 }; },
  methods: {
    incrementA() { this.countA++; },
    incrementB() { this.countB++; }
  },
  computed: {
    doubleA() { return this.countA * 2; },
    doubleB() { return this.countB * 2; }
  }
};

// Composition API —— 同一功能的代码放在一起
function useFeatureA() {
  const count = ref(0);
  const double = computed(() => count.value * 2);
  const increment = () => count.value++;
  return { count, double, increment };
}
```

**Composition API 四大优势：**

1. **逻辑复用** — 自定义 hooks 替代 mixins，无命名冲突
2. **代码组织** — 相关逻辑集中在一起，不按选项拆分
3. **类型推断** — 天然支持 TypeScript
4. **Tree-shaking** — 按需导入 `ref`、`computed` 等，未使用的不打包

---

## setup

### setup 函数

> 参考：[setup()](https://cn.vuejs.org/api/composition-api-setup.html)

`setup` 是 Vue 3 中一个新的配置项，是 Composition API 的入口函数。

**特点：**
- `setup` 函数返回的对象中的内容，可直接在模板中使用
- `setup` 中访问 `this` 是 `undefined`
- `setup` 函数会在 `beforeCreate` 之前调用，"领先"所有钩子执行

```vue
<template>
  <div class="person">
    <h2>姓名：{{ name }}</h2>
    <h2>年龄：{{ age }}</h2>
    <button @click="changeName">修改名字</button>
    <button @click="changeAge">年龄+1</button>
    <button @click="showTel">查看联系方式</button>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Person',
  setup() {
    // 数据（注意：此时的 name、age、tel 都不是响应式数据）
    let name = '张三';
    let age = 18;
    let tel = '13888888888';

    // 方法
    function changeName() {
      name = 'zhang-san'; // 注意：此时修改 name 页面不会变化
      console.log(name);
    }
    function changeAge() {
      age += 1; // 注意：此时修改 age 页面不会变化
      console.log(age);
    }
    function showTel() {
      alert(tel);
    }

    // 返回一个对象，模板中可以直接使用
    return { name, age, tel, changeName, changeAge, showTel };
  }
};
</script>
```

### setup 的返回值

- 若返回一个 **对象**：属性、方法等在模板中均可直接使用（**重点**）
- 若返回一个 **函数**：可自定义渲染内容

```jsx
setup() {
  return () => '你好啊！';
}
```

### setup 与 Options API 的关系

- Vue 2 的配置（`data`、`methods`……）中 **可以访问到** `setup` 中的属性、方法
- 但在 `setup` 中 **不能访问到** Vue 2 的配置
- 如果与 Vue 2 冲突，则 `setup` 优先

### `<script setup>` 语法糖（推荐）

> 参考：[`<script setup>`](https://cn.vuejs.org/api/sfc-script-setup.html)

```vue
<template>
  <div class="person">
    <h2>姓名：{{ name }}</h2>
    <h2>年龄：{{ age }}</h2>
    <button @click="changeName">修改名字</button>
    <button @click="changeAge">年龄+1</button>
    <button @click="showTel">查看联系方式</button>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Person'
};
</script>

<!-- 下面是 setup 语法糖 -->
<script setup lang="ts">
console.log(this); // undefined

// 数据（注意：此时都不是响应式数据）
let name = '张三';
let age = 18;
let tel = '13888888888';

// 方法
function changeName() {
  name = '李四'; // 修改不会引起页面更新
}
function changeAge() {
  age += 1; // 修改不会引起页面更新
}
function showTel() {
  alert(tel);
}
</script>
```

**`<script setup>` 的优势：**
- 更简洁（无需 return）
- 更好的 TypeScript 类型推断
- 更好的性能（编译时优化）
- 顶层 `await` 支持

**扩展：** 指定组件名字可以使用 `vite-plugin-vue-setup-extend` 插件：

```bash
npm i vite-plugin-vue-setup-extend -D
```

```js
// vite.config.ts
import VueSetupExtend from 'vite-plugin-vue-setup-extend';

export default defineConfig({
  plugins: [VueSetupExtend()]
});
```

```vue
<script setup lang="ts" name="Person">
  // 直接在 script setup 上指定组件名
</script>
```

---

## 响应式数据

### ref —— 基本类型的响应式数据

> 参考：[ref()](https://cn.vuejs.org/api/reactivity-core.html#ref)

- **作用：** 定义响应式变量
- **语法：** `let xxx = ref(初始值)`
- **返回值：** 一个 `RefImpl` 的实例对象，简称 `ref` 对象，其 `value` 属性是响应式的
- **注意点：**
  - JS 中操作数据需要 `xxx.value`，但模板中不需要 `.value`，直接使用即可
  - 对于 `let name = ref('张三')`，`name` 不是响应式的，`name.value` 才是响应式的

```vue
<template>
  <div class="person">
    <h2>姓名：{{ name }}</h2>
    <h2>年龄：{{ age }}</h2>
    <button @click="changeName">修改名字</button>
    <button @click="changeAge">年龄+1</button>
    <button @click="showTel">查看联系方式</button>
  </div>
</template>

<script setup lang="ts" name="Person">
import { ref } from 'vue';

// name 和 age 是 RefImpl 的实例对象，它们的 value 属性是响应式的
let name = ref('张三');
let age = ref(18);
// tel 就是一个普通的字符串，不是响应式的
let tel = '13888888888';

function changeName() {
  // JS 中操作 ref 对象需要 .value
  name.value = '李四';
  console.log(name.value);

  // 注意：name 不是响应式的，name.value 是响应式的
  // 所以 name = ref('zhang-san') 不会引起页面更新
}
function changeAge() {
  age.value += 1;
  console.log(age.value);
}
function showTel() {
  alert(tel);
}
</script>
```

### reactive —— 对象类型的响应式数据

> 参考：[reactive()](https://cn.vuejs.org/api/reactivity-core.html#reactive)

- **作用：** 定义一个响应式对象（基本类型不要用它，否则报错）
- **语法：** `let 响应式对象 = reactive(源对象)`
- **返回值：** 一个 [Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 的实例对象，简称响应式对象
- **注意：** `reactive` 定义的响应式数据是"深层次"的

```vue
<template>
  <div class="person">
    <h2>汽车信息：一台{{ car.brand }}汽车，价值{{ car.price }}万</h2>
    <h2>游戏列表：</h2>
    <ul>
      <li v-for="g in games" :key="g.id">{{ g.name }}</li>
    </ul>
    <h2>测试：{{ obj.a.b.c.d }}</h2>
    <button @click="changeCarPrice">修改汽车价格</button>
    <button @click="changeFirstGame">修改第一游戏</button>
    <button @click="test">测试</button>
  </div>
</template>

<script lang="ts" setup name="Person">
import { reactive } from 'vue';

let car = reactive({ brand: '奔驰', price: 100 });
let games = reactive([
  { id: 'ahsgdyfa01', name: '英雄联盟' },
  { id: 'ahsgdyfa02', name: '王者荣耀' },
  { id: 'ahsgdyfa03', name: '原神' }
]);
let obj = reactive({
  a: { b: { c: { d: 666 } } }
});

function changeCarPrice() {
  car.price += 10;
}
function changeFirstGame() {
  games[0].name = '流星蝴蝶剑';
}
function test() {
  obj.a.b.c.d = 999;
}
</script>
```

### ref 也能用于对象类型

`ref` 接收的数据可以是基本类型、也可以是对象类型。若 `ref` 接收的是对象类型，内部其实也是调用了 `reactive` 函数：

```vue
<script lang="ts" setup name="Person">
import { ref } from 'vue';

let car = ref({ brand: '奔驰', price: 100 });
let games = ref([
  { id: 'ahsgdyfa01', name: '英雄联盟' },
  { id: 'ahsgdyfa02', name: '王者荣耀' },
  { id: 'ahsgdyfa03', name: '原神' }
]);

// ref 包对象的情况，访问需要 .value 再取属性
function changeCarPrice() {
  car.value.price += 10;
}
function changeFirstGame() {
  games.value[0].name = '流星蝴蝶剑';
}
</script>
```

### ref 对比 reactive

> 参考：[ref vs reactive](https://cn.vuejs.org/guide/essentials/reactivity-fundamentals.html#ref-vs-reactive)

宏观角度看：
- `ref` 用来定义：**基本类型数据** 和 **对象类型数据**
- `reactive` 用来定义：**仅对象类型数据**

| 对比 | ref | reactive |
| --- | --- | --- |
| 数据类型 | 基本类型 + 对象类型 | **仅对象类型** |
| 访问方式 | JS 中需要 `.value` | 直接访问 |
| 重新赋值 | ✅ `ref.value = newObj` | ❌ 直接赋值会丢失响应式 |
| 模板中 | 自动解包 | 直接使用 |
| 底层原理 | `RefImpl` 对象（对象类型内部用 reactive） | **Proxy** |

**reactive 的局限——重新赋值会丢失响应式：**

```js
let state = reactive({ count: 0 });

// ❌ 直接替换整个对象，响应式丢失！
state = reactive({ count: 1 });

// ✅ 使用 Object.assign 替换
Object.assign(state, { count: 1 });
```

**使用原则：**
1. 若需要一个基本类型的响应式数据，必须使用 `ref`
2. 若需要一个响应式对象，层级不深，`ref`、`reactive` 都可以
3. 若需要一个响应式对象，且层级较深，推荐使用 `reactive`
4. **社区主流推荐统一使用 `ref`**（更灵活，不会丢失响应式）

### toRefs 与 toRef

> 参考：[toRefs()](https://cn.vuejs.org/api/reactivity-utilities.html#torefs) / [toRef()](https://cn.vuejs.org/api/reactivity-utilities.html#toref)

- **作用：** 将一个响应式对象中的每一个属性，转换为 `ref` 对象
- **备注：** `toRefs` 与 `toRef` 功能一致，但 `toRefs` 可以批量转换

```vue
<template>
  <div class="person">
    <h2>姓名：{{ person.name }}</h2>
    <h2>年龄：{{ person.age }}</h2>
    <h2>性别：{{ person.gender }}</h2>
    <button @click="changeName">修改名字</button>
    <button @click="changeAge">修改年龄</button>
    <button @click="changeGender">修改性别</button>
  </div>
</template>

<script lang="ts" setup name="Person">
import { ref, reactive, toRefs, toRef } from 'vue';

let person = reactive({ name: '张三', age: 18, gender: '男' });

// 通过 toRefs 将 person 对象中的属性批量取出，且依然保持响应式
let { name, gender } = toRefs(person);

// 通过 toRef 将 person 对象中的 age 属性取出
let age = toRef(person, 'age');

function changeName() {
  name.value += '~';
}
function changeAge() {
  age.value += 1;
}
function changeGender() {
  gender.value = '女';
}
</script>
```

> **关键理解：** 直接解构 reactive 对象会丢失响应式，`toRefs` / `toRef` 解决了这个问题。

### Proxy vs Object.defineProperty

Vue 2 使用 `Object.defineProperty` 实现响应式，Vue 3 切换为 `Proxy`。两者对比：

| 对比 | Object.defineProperty (Vue 2) | Proxy (Vue 3) |
| --- | --- | --- |
| 监听方式 | 逐个属性劫持 getter/setter | 代理整个对象 |
| 新增属性 | ❗ 无法监听，需要 `Vue.set()` | ✅ 自动监听 |
| 删除属性 | ❗ 无法监听，需要 `Vue.delete()` | ✅ 自动监听 |
| 数组索引 | ❗ 无法监听，需要重写数组方法 | ✅ 自动监听 |
| 嵌套对象 | 需要递归遍历每一层 | 懒代理，访问时才递归 |
| 性能 | 初始化时递归遍历所有属性，开销大 | 按需代理，性能更好 |
| 支持类型 | 仅对象属性 | 对象、数组、Map、Set 等 |

```js
// Vue 2 - Object.defineProperty
Object.defineProperty(obj, 'key', {
  get() { /* 依赖收集 */ },
  set(newVal) { /* 派发更新 */ }
});

// Vue 3 - Proxy
const proxy = new Proxy(obj, {
  get(target, key, receiver) { /* 依赖收集 */ },
  set(target, key, value, receiver) { /* 派发更新 */ },
  deleteProperty(target, key) { /* 处理删除 */ }
});
```

---

## computed 计算属性

> 参考：[computed()](https://cn.vuejs.org/api/reactivity-core.html#computed)

作用：根据已有数据计算出新数据（和 Vue 2 中的 `computed` 作用一致）。

```vue
<template>
  <div class="person">
    姓：<input type="text" v-model="firstName"> <br>
    名：<input type="text" v-model="lastName"> <br>
    全名：<span>{{ fullName }}</span> <br>
    <button @click="changeFullName">全名改为：li-si</button>
  </div>
</template>

<script setup lang="ts" name="App">
import { ref, computed } from 'vue';

let firstName = ref('zhang');
let lastName = ref('san');

// 计算属性——只读取（简写）
/* let fullName = computed(() => {
  return firstName.value + '-' + lastName.value;
}); */

// 计算属性——既读取又修改（完整写法）
let fullName = computed({
  get() {
    return firstName.value + '-' + lastName.value;
  },
  set(val) {
    console.log('有人修改了 fullName', val);
    firstName.value = val.split('-')[0];
    lastName.value = val.split('-')[1];
  }
});

function changeFullName() {
  fullName.value = 'li-si';
}
</script>
```

**特点：** 有缓存，依赖不变则不重新计算（和方法调用不同）。

---

## watch 监视

> 参考：[watch()](https://cn.vuejs.org/api/reactivity-core.html#watch)

- **作用：** 监视数据的变化（和 Vue 2 中的 `watch` 作用一致）
- **特点：** Vue 3 中的 `watch` 只能监视以下 **四种数据**：
  1. `ref` 定义的数据
  2. `reactive` 定义的数据
  3. 函数返回一个值（`getter` 函数）
  4. 一个包含上述内容的数组

### 情况一：监视 ref 定义的【基本类型】数据

直接写数据名即可，监视的是其 `value` 值的改变。

```vue
<template>
  <div class="person">
    <h2>当前求和为：{{ sum }}</h2>
    <button @click="changeSum">点我 sum+1</button>
  </div>
</template>

<script lang="ts" setup name="Person">
import { ref, watch } from 'vue';

let sum = ref(0);

function changeSum() {
  sum.value += 1;
}

// 监视 ref 定义的【基本类型】数据
const stopWatch = watch(sum, (newValue, oldValue) => {
  console.log('sum 变化了', newValue, oldValue);
  if (newValue >= 10) {
    stopWatch(); // 停止监视
  }
});
</script>
```

### 情况二：监视 ref 定义的【对象类型】数据

直接写数据名，监视的是对象的【地址值】。若想监视对象内部的数据，要手动开启深度监视。

> **注意：**
> - 若修改的是 ref 定义的对象中的属性，`newValue` 和 `oldValue` 都是新值（因为是同一个对象）
> - 若修改整个 ref 定义的对象，`newValue` 是新值，`oldValue` 是旧值（因为不是同一个对象了）

```vue
<script lang="ts" setup name="Person">
import { ref, watch } from 'vue';

let person = ref({
  name: '张三',
  age: 18
});

function changeName() {
  person.value.name += '~';
}
function changeAge() {
  person.value.age += 1;
}
function changePerson() {
  person.value = { name: '李四', age: 90 };
}

/*
  watch 的第一个参数：被监视的数据
  watch 的第二个参数：监视的回调
  watch 的第三个参数：配置对象（deep、immediate 等）
*/
watch(person, (newValue, oldValue) => {
  console.log('person 变化了', newValue, oldValue);
}, { deep: true });
</script>
```

### 情况三：监视 reactive 定义的【对象类型】数据

监视 `reactive` 定义的对象，**默认开启了深度监视**（且无法关闭）。

```vue
<script lang="ts" setup name="Person">
import { reactive, watch } from 'vue';

let person = reactive({ name: '张三', age: 18 });
let obj = reactive({ a: { b: { c: 666 } } });

function changeName() {
  person.name += '~';
}
function changePerson() {
  Object.assign(person, { name: '李四', age: 80 }); // reactive 不能直接替换
}
function test() {
  obj.a.b.c = 888;
}

// reactive 对象默认是开启深度监视的
watch(person, (newValue, oldValue) => {
  console.log('person 变化了', newValue, oldValue);
});
watch(obj, (newValue, oldValue) => {
  console.log('obj 变化了', newValue, oldValue);
});
</script>
```

### 情况四：监视对象中的某个属性

**注意点：**
1. 若该属性值 **不是** 对象类型，需要写成 **函数形式**（getter）
2. 若该属性值 **是** 对象类型，可直接写，也可写成函数，**建议写成函数**

**结论：** 监视的要是对象里的属性，最好写函数式。若是对象属性需要关注内部变化，需要手动开启深度监视。

```vue
<script lang="ts" setup name="Person">
import { reactive, watch } from 'vue';

let person = reactive({
  name: '张三',
  age: 18,
  car: { c1: '奔驰', c2: '宝马' }
});

// 监视响应式对象中的某个属性（基本类型），要写成函数式
watch(
  () => person.name,
  (newValue, oldValue) => {
    console.log('person.name 变化了', newValue, oldValue);
  }
);

// 监视响应式对象中的某个属性（对象类型），推荐写成函数 + deep
watch(
  () => person.car,
  (newValue, oldValue) => {
    console.log('person.car 变化了', newValue, oldValue);
  },
  { deep: true }
);
</script>
```

### 情况五：监视多个数据

```vue
<script lang="ts" setup name="Person">
import { reactive, watch } from 'vue';

let person = reactive({
  name: '张三',
  age: 18,
  car: { c1: '奔驰', c2: '宝马' }
});

// 同时监视多个数据
watch([() => person.name, person.car], (newValue, oldValue) => {
  console.log('person.name 或 person.car 变化了', newValue, oldValue);
}, { deep: true });
</script>
```

### watch 配置项汇总

```js
watch(source, callback, {
  deep: true,       // 深层监视
  immediate: true,  // 立即执行一次
  flush: 'post'     // DOM 更新后触发（默认 'pre'）
});
```

---

## watchEffect

> 参考：[watchEffect()](https://cn.vuejs.org/api/reactivity-core.html#watcheffect)

- 立即运行一个函数，同时响应式地追踪其依赖，并在依赖更改时重新执行该函数
- 不用明确指出监视的数据，函数中用到哪些属性，就自动监视哪些属性

```vue
<template>
  <div class="person">
    <h1>需求：水温达到 50℃，或水位达到 20cm，则联系服务器</h1>
    <h2>水温：{{ temp }}</h2>
    <h2>水位：{{ height }}</h2>
    <button @click="changeTemp">水温+10</button>
    <button @click="changeHeight">水位+1</button>
  </div>
</template>

<script lang="ts" setup name="Person">
import { ref, watch, watchEffect } from 'vue';

let temp = ref(0);
let height = ref(0);

function changeTemp() {
  temp.value += 10;
}
function changeHeight() {
  height.value += 1;
}

// 用 watch 实现，需要明确指出要监视 temp、height
watch([temp, height], (value) => {
  const [newTemp, newHeight] = value;
  if (newTemp >= 50 || newHeight >= 20) {
    console.log('联系服务器');
  }
});

// 用 watchEffect 实现，不用明确指出监视谁
const stopWatch = watchEffect(() => {
  if (temp.value >= 50 || height.value >= 20) {
    console.log('联系服务器');
  }
  if (temp.value === 100 || height.value === 50) {
    console.log('清理了');
    stopWatch(); // 停止监视
  }
});
</script>
```

### watch vs watchEffect 对比

| 对比 | watch | watchEffect |
| --- | --- | --- |
| 依赖追踪 | 手动指定监视源 | **自动追踪** |
| 旧值 | 可以获取新旧值 | 不能 |
| 立即执行 | 默认不立即 | **默认立即执行** |
| 适用场景 | 需要新旧值对比 | 多依赖的副作用 |

---

## 标签的 ref 属性

> 参考：[模板引用](https://cn.vuejs.org/guide/essentials/template-refs.html)

作用：用于注册模板引用。
- 用在普通 DOM 标签上，获取的是 DOM 节点
- 用在组件标签上，获取的是组件实例对象

### 用在普通 DOM 标签上

```vue
<template>
  <div class="person">
    <h1 ref="title1">尚硅谷</h1>
    <h2 ref="title2">前端</h2>
    <h3 ref="title3">Vue</h3>
    <input type="text" ref="inpt">
    <button @click="showLog">点我打印内容</button>
  </div>
</template>

<script lang="ts" setup name="Person">
import { ref } from 'vue';

let title1 = ref();
let title2 = ref();
let title3 = ref();

function showLog() {
  // 通过 ref 获取元素
  console.log(title1.value);
  console.log(title2.value);
  console.log(title3.value);
}
</script>
```

### 用在组件标签上

```vue
<!-- 父组件 App.vue -->
<template>
  <Person ref="ren" />
  <button @click="test">测试</button>
</template>

<script lang="ts" setup name="App">
import Person from './components/Person.vue';
import { ref } from 'vue';

let ren = ref();

function test() {
  console.log(ren.value.name);
  console.log(ren.value.age);
}
</script>
```

> **`<script setup>` 中组件默认不暴露任何东西，需要用 `defineExpose`**

```vue
<!-- 子组件 Person.vue 中要使用 defineExpose 暴露内容 -->
<script lang="ts" setup name="Person">
import { ref, defineExpose } from 'vue';

let name = ref('张三');
let age = ref(18);

// 使用 defineExpose 将组件中的数据交给外部
defineExpose({ name, age });
</script>
```

---

## props

> 参考：[defineProps()](https://cn.vuejs.org/api/sfc-script-setup.html#defineprops-defineemits)

### 定义类型接口

```ts
// types/index.ts
export interface PersonInter {
  id: string;
  name: string;
  age: number;
}

export type Persons = Array<PersonInter>;
```

### 父组件传递

```vue
<!-- App.vue -->
<template>
  <Person :list="persons" />
</template>

<script lang="ts" setup name="App">
import Person from './components/Person.vue';
import { reactive } from 'vue';
import { type Persons } from './types';

let persons = reactive<Persons>([
  { id: 'e98219e12', name: '张三', age: 18 },
  { id: 'e98219e13', name: '李四', age: 19 },
  { id: 'e98219e14', name: '王五', age: 20 }
]);
</script>
```

### 子组件接收（三种写法）

```vue
<!-- Person.vue -->
<template>
  <div class="person">
    <ul>
      <li v-for="item in list" :key="item.id">
        {{ item.name }}--{{ item.age }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup name="Person">
import { defineProps } from 'vue';
import { type Persons } from '@/types';

// 第一种写法：仅接收
// const props = defineProps(['list']);

// 第二种写法：接收 + 限制类型
// defineProps<{ list: Persons }>();

// 第三种写法：接收 + 限制类型 + 指定默认值 + 限制必要性
let props = withDefaults(defineProps<{ list?: Persons }>(), {
  list: () => [{ id: 'asdasg01', name: '小猪佩奇', age: 18 }]
});
console.log(props);
</script>
```

---

## 生命周期

> 参考：[生命周期钩子](https://cn.vuejs.org/api/composition-api-lifecycle.html)

### 生命周期概念

Vue 组件实例在创建时要经历一系列的初始化步骤，在此过程中 Vue 会在合适的时机调用特定的函数。生命周期整体分为四个阶段：**创建、挂载、更新、卸载**。

### Vue 2 vs Vue 3 生命周期对照

| Vue 2 | Vue 3 (Options) | Vue 3 (Composition) |
| --- | --- | --- |
| beforeCreate | beforeCreate | **setup()** |
| created | created | **setup()** |
| beforeMount | beforeMount | **onBeforeMount** |
| mounted | mounted | **onMounted** |
| beforeUpdate | beforeUpdate | **onBeforeUpdate** |
| updated | updated | **onUpdated** |
| beforeDestroy | **beforeUnmount** | **onBeforeUnmount** |
| destroyed | **unmounted** | **onUnmounted** |

### 在 Composition API 中使用

```vue
<template>
  <div class="person">
    <h2>当前求和为：{{ sum }}</h2>
    <button @click="changeSum">点我 sum+1</button>
  </div>
</template>

<script lang="ts" setup name="Person">
import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted
} from 'vue';

let sum = ref(0);
function changeSum() {
  sum.value += 1;
}

// 创建阶段——直接写在 setup 顶层（等价于 created）
console.log('setup');

// 生命周期钩子
onBeforeMount(() => {
  console.log('挂载之前');
});
onMounted(() => {
  console.log('挂载完毕');
});
onBeforeUpdate(() => {
  console.log('更新之前');
});
onUpdated(() => {
  console.log('更新完毕');
});
onBeforeUnmount(() => {
  console.log('卸载之前');
});
onUnmounted(() => {
  console.log('卸载完毕');
});
</script>
```

**常用钩子：** `onMounted`（挂载完毕）、`onUpdated`（更新完毕）、`onBeforeUnmount`（卸载之前——清理定时器、事件监听等）

---

## 自定义 Hooks

> 参考：[组合式函数](https://cn.vuejs.org/guide/reusability/composables.html)

- **什么是 hook？** 本质是一个函数，把 `setup` 函数中使用的 Composition API 进行了封装，类似 Vue 2 的 `mixin`
- **优势：** 复用代码，让 `setup` 中的逻辑更清楚易懂

### 示例：useSum

```ts
// hooks/useSum.ts
import { ref, onMounted } from 'vue';

export default function () {
  let sum = ref(0);

  const increment = () => {
    sum.value += 1;
  };
  const decrement = () => {
    sum.value -= 1;
  };
  onMounted(() => {
    increment();
  });

  return { sum, increment, decrement };
}
```

### 示例：useDog（异步请求）

```ts
// hooks/useDog.ts
import { reactive, onMounted } from 'vue';
import axios, { AxiosError } from 'axios';

export default function () {
  let dogList = reactive<string[]>([]);

  async function getDog() {
    try {
      let { data } = await axios.get('https://dog.ceo/api/breed/pembroke/images/random');
      dogList.push(data.message);
    } catch (error) {
      const err = <AxiosError>error;
      console.log(err.message);
    }
  }

  onMounted(() => {
    getDog();
  });

  return { dogList, getDog };
}
```

### 组件中使用

```vue
<template>
  <h2>当前求和为：{{ sum }}</h2>
  <button @click="increment">点我+1</button>
  <button @click="decrement">点我-1</button>
  <hr>
  <img v-for="(u, index) in dogList" :key="index" :src="u">
  <button @click="getDog">再来一只狗</button>
</template>

<script setup lang="ts">
import useSum from './hooks/useSum';
import useDog from './hooks/useDog';

let { sum, increment, decrement } = useSum();
let { dogList, getDog } = useDog();
</script>
```

### hooks vs mixins 对比

| 对比 | hooks | mixins |
| --- | --- | --- |
| 命名冲突 | ❌ 不会（返回值自行命名） | ⚠️ 会覆盖 |
| 数据来源 | 清晰（显式导入） | 不清晰（隐式合并） |
| 复用性 | 灵活（可传参） | 受限 |
| TypeScript | 友好 | 差 |

---

## Vue Router（Vue 3 版）

> 参考：[Vue Router 4.x 文档](https://router.vuejs.org/zh/)
>
> Vue 3 使用 `vue-router` 的最新版本（4.x）

### 基本切换效果

路由配置文件：

```js
// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import News from '@/pages/News.vue';
import About from '@/pages/About.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/home', component: Home },
    { path: '/news', component: News },
    { path: '/about', component: About }
  ]
});
export default router;
```

入口文件：

```js
// main.ts
import router from './router/index';
app.use(router);
app.mount('#app');
```

App 组件：

```vue
<template>
  <div class="app">
    <h2 class="title">Vue 路由测试</h2>
    <!-- 导航区 -->
    <div class="navigate">
      <RouterLink to="/home" active-class="active">首页</RouterLink>
      <RouterLink to="/news" active-class="active">新闻</RouterLink>
      <RouterLink to="/about" active-class="active">关于</RouterLink>
    </div>
    <!-- 展示区 -->
    <div class="main-content">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<script lang="ts" setup name="App">
import { RouterLink, RouterView } from 'vue-router';
</script>
```

**两个注意点：**
1. 路由组件通常存放在 `pages` 或 `views` 文件夹，一般组件存放在 `components` 文件夹
2. 通过点击导航，视觉效果上"消失"了的路由组件，默认是被**卸载**掉的，需要时再去**挂载**

### 路由器工作模式

| 模式 | 实现 | URL 形式 | 需要服务端配置 |
| --- | --- | --- | --- |
| history | `createWebHistory()` | `/home` | ✅ 需要（否则刷新 404） |
| hash | `createWebHashHistory()` | `/#/home` | ❌ 不需要 |

```js
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),     // history 模式
  // history: createWebHashHistory(), // hash 模式
  routes: [/* ... */]
});
```

### to 的两种写法

```vue
<!-- 第一种：to 的字符串写法 -->
<router-link active-class="active" to="/home">主页</router-link>

<!-- 第二种：to 的对象写法 -->
<router-link active-class="active" :to="{ path: '/home' }">Home</router-link>
```

### 命名路由

给路由规则命名，可以简化路由跳转及传参：

```js
routes: [
  { name: 'zhuye', path: '/home', component: Home },
  { name: 'xinwen', path: '/news', component: News },
  { name: 'guanyu', path: '/about', component: About }
]
```

```vue
<!-- 简化前：需要写完整的路径 -->
<router-link to="/news/detail">跳转</router-link>

<!-- 简化后：直接通过名字跳转 -->
<router-link :to="{ name: 'guanyu' }">跳转</router-link>
```

### 嵌套路由

配置路由规则，使用 `children` 配置项：

```ts
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { name: 'zhuye', path: '/home', component: Home },
    {
      name: 'xinwen',
      path: '/news',
      component: News,
      children: [
        {
          name: 'xiang',
          path: 'detail', // 子路由不需要加 /
          component: Detail
        }
      ]
    },
    { name: 'guanyu', path: '/about', component: About }
  ]
});
```

跳转路由（记得要加完整路径）：

```vue
<router-link to="/news/detail">xxxx</router-link>
```

父组件中预留 `<router-view>`：

```vue
<template>
  <div class="news">
    <nav class="news-list">
      <RouterLink v-for="news in newsList" :key="news.id" :to="{ path: '/news/detail' }">
        {{ news.name }}
      </RouterLink>
    </nav>
    <div class="news-detail">
      <RouterView />
    </div>
  </div>
</template>
```

### 路由传参

#### query 参数

```vue
<!-- 传递 query 参数（字符串写法） -->
<router-link to="/news/detail?a=1&b=2&content=欢迎你">跳转</router-link>

<!-- 传递 query 参数（对象写法） -->
<RouterLink
  :to="{
    path: '/news/detail',
    query: { id: news.id, title: news.title, content: news.content }
  }"
>
  {{ news.title }}
</RouterLink>
```

接收参数：

```js
import { useRoute } from 'vue-router';
const route = useRoute();
console.log(route.query);
```

#### params 参数

```vue
<!-- 传递 params 参数（字符串写法） -->
<RouterLink :to="`/news/detail/001/新闻001/内容001`">{{ news.title }}</RouterLink>

<!-- 传递 params 参数（对象写法） -->
<RouterLink
  :to="{
    name: 'xiang', // 必须用 name，不能用 path
    params: { id: news.id, title: news.title, content: news.title }
  }"
>
  {{ news.title }}
</RouterLink>
```

接收参数：

```js
import { useRoute } from 'vue-router';
const route = useRoute();
console.log(route.params);
```

> **备注 1：** 传递 `params` 参数时，若使用 `to` 的对象写法，必须使用 `name` 配置项，不能用 `path`
>
> **备注 2：** 传递 `params` 参数时，需要提前在规则中占位：`path: 'detail/:id/:title/:content'`

### 路由的 props 配置

作用：让路由组件更方便地收到参数（可将路由参数作为 `props` 传给组件）

```js
{
  name: 'xiang',
  path: 'detail/:id/:title/:content',
  component: Detail,

  // props 的对象写法：把对象中的每一组 key-value 作为 props 传给 Detail 组件
  // props: { a: 1, b: 2, c: 3 },

  // props 的布尔值写法：把每一组 params 参数，作为 props 传给 Detail 组件
  // props: true,

  // props 的函数写法：把返回的对象中每一组 key-value 作为 props 传给 Detail 组件
  props(route) {
    return route.query;
  }
}
```

### replace 属性

- 作用：控制路由跳转时操作浏览器历史记录的模式
- `push` 是追加历史记录（默认值）
- `replace` 是替换当前记录

```vue
<RouterLink replace .......>News</RouterLink>
```

### 编程式导航

路由组件的 `$route` 和 `$router` 变成了两个 hooks：

```js
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();    // 当前路由信息
const router = useRouter();  // 路由器实例

console.log(route.query);
console.log(route.params);

router.push('/home');
router.push({ name: 'detail', params: { id: 1 } });
router.replace('/home'); // 不留历史记录
router.go(-1);           // 后退
router.back();           // 后退
router.forward();        // 前进
```

### 重定向

```js
{
  path: '/',
  redirect: '/about'
}
```

### 导航守卫

```js
// 全局前置守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else {
    next();
  }
});

// 路由独享守卫
{
  path: '/admin',
  component: Admin,
  beforeEnter: (to, from, next) => { /* ... */ }
}
```

```vue
<!-- 组件内守卫 -->
<script setup>
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router';

onBeforeRouteLeave((to, from) => {
  const answer = window.confirm('确定离开？');
  if (!answer) return false;
});
</script>
```

---

## Pinia 状态管理

> 参考：[Pinia 官方文档](https://pinia.vuejs.org/zh/)

### 搭建 Pinia 环境

```bash
npm install pinia
```

```ts
// src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.mount('#app');
```

### Store 核心概念

Store 是一个保存**状态**、**业务逻辑**的实体，每个组件都可以读取、写入它。

三个概念对应关系：
- `state` → 组件中的 `data`
- `getter` → 组件中的 `computed`
- `action` → 组件中的 `methods`

### 定义 Store —— 选项式写法

```ts
// src/store/count.ts
import { defineStore } from 'pinia';

export const useCountStore = defineStore('count', {
  actions: {
    increment(value: number) {
      if (this.sum < 10) {
        this.sum += value;
      }
    },
    decrement(value: number) {
      if (this.sum > 1) {
        this.sum -= value;
      }
    }
  },
  state() {
    return {
      sum: 6,
      school: 'atguigu'
    };
  },
  getters: {
    bigSum: (state): number => state.sum * 10,
    upperSchool(): string {
      return this.school.toUpperCase();
    }
  }
});
```

### 定义 Store —— 组合式写法（推荐）

```ts
// src/store/talk.ts
import { defineStore } from 'pinia';
import axios from 'axios';
import { nanoid } from 'nanoid';
import { reactive } from 'vue';

export const useTalkStore = defineStore('talk', () => {
  // state → ref / reactive
  const talkList = reactive(
    JSON.parse(localStorage.getItem('talkList') as string) || []
  );

  // action → 函数
  async function getATalk() {
    let {
      data: { content: title }
    } = await axios.get('https://api.uomg.com/api/rand.qinghua?format=json');
    let obj = { id: nanoid(), title };
    talkList.unshift(obj);
  }

  return { talkList, getATalk };
});
```

### 使用 Store 中的数据

```vue
<template>
  <h2>当前求和为：{{ sumStore.sum }}</h2>
</template>

<script setup lang="ts" name="Count">
import { useCountStore } from '@/store/count';

const sumStore = useCountStore();
</script>
```

### 修改数据（三种方式）

```ts
const countStore = useCountStore();

// 方式 1：直接修改
countStore.sum = 666;

// 方式 2：批量修改（$patch 对象形式）
countStore.$patch({
  sum: 999,
  school: 'atguigu'
});

// 方式 3：借助 action 修改
countStore.increment(1);
```

### storeToRefs

> 参考：[storeToRefs()](https://pinia.vuejs.org/zh/api/modules/pinia.html#Functions-storeToRefs)

- 借助 `storeToRefs` 将 store 中的数据转为 `ref` 对象，方便在模板中使用
- **注意：** Pinia 的 `storeToRefs` 只会转换数据（state/getters），而 Vue 的 `toRefs` 会转换 store 中所有内容

```vue
<template>
  <div class="count">
    <h2>当前求和为：{{ sum }}</h2>
  </div>
</template>

<script setup lang="ts" name="Count">
import { useCountStore } from '@/store/count';
import { storeToRefs } from 'pinia';

const countStore = useCountStore();

// ⚠️ 直接解构会丢失响应式
// const { sum } = countStore; // ❌

// ✅ 使用 storeToRefs（仅转换 state 和 getters）
const { sum } = storeToRefs(countStore);

// 方法直接解构（不需要 storeToRefs）
const { increment } = countStore;
</script>
```

### getters

当 `state` 中的数据需要经过处理后再使用时，可以使用 `getters`：

```ts
export const useCountStore = defineStore('count', {
  state() {
    return {
      sum: 1,
      school: 'atguigu'
    };
  },
  getters: {
    bigSum: (state): number => state.sum * 10,
    upperSchool(): string {
      return this.school.toUpperCase();
    }
  }
});
```

组件中读取：

```js
const { sum, school, bigSum, upperSchool } = storeToRefs(countStore);
```

### $subscribe 监听状态变化

```ts
talkStore.$subscribe((mutate, state) => {
  console.log('LoveTalk', mutate, state);
  localStorage.setItem('talk', JSON.stringify(state.talkList));
});
```

### Pinia vs Vuex 对比

| 对比 | Pinia | Vuex |
| --- | --- | --- |
| Mutation | ❌ 不需要 | 必须通过 mutation |
| 模块化 | 每个 store 独立 | module 嵌套 |
| TypeScript | **原生支持** | 支持弱 |
| 体积 | **约 1KB** | 较大 |
| Devtools | 支持 | 支持 |
| 设计理念 | Composition API 风格 | Options API 风格 |

---

## 组件通信

### Vue 3 组件通信与 Vue 2 的区别

- 移除事件总线，使用 `mitt` 代替
- Vuex 换成了 Pinia
- 把 `.sync` 优化到了 `v-model` 里面
- 把 `$listeners` 合并到 `$attrs` 中
- `$children` 被砍掉了

| 方式 | 场景 | 说明 |
| --- | --- | --- |
| **props / emit** | 父 ↔ 子 | defineProps / defineEmits |
| **v-model** | 父 ↔ 子 | 支持多个 v-model |
| **$refs / $parent** | 父子 | defineExpose |
| **provide / inject** | 祖先 → 后代 | 支持响应式 |
| **mitt** | 任意 | 替代 EventBus |
| **Pinia** | 任意 | 替代 Vuex |
| **$attrs** | 祖先 → 后代 | 包含 class/style |
| **slot** | 父 → 子 | 默认/具名/作用域插槽 |

### props

> 参考：[Props](https://cn.vuejs.org/guide/components/props.html)

使用频率最高的一种通信方式，常用于：**父 ↔ 子**。

- 若 **父传子**：属性值是**非函数**
- 若 **子传父**：属性值是**函数**

```vue
<!-- 父组件 -->
<template>
  <div class="father">
    <h3>父组件</h3>
    <h4>我的车：{{ car }}</h4>
    <h4>儿子给的玩具：{{ toy }}</h4>
    <Child :car="car" :getToy="getToy" />
  </div>
</template>

<script setup lang="ts" name="Father">
import Child from './Child.vue';
import { ref } from 'vue';

const car = ref('奔驰');
const toy = ref();

function getToy(value: string) {
  toy.value = value;
}
</script>
```

```vue
<!-- 子组件 -->
<template>
  <div class="child">
    <h3>子组件</h3>
    <h4>我的玩具：{{ toy }}</h4>
    <h4>父给我的车：{{ car }}</h4>
    <button @click="getToy(toy)">玩具给父亲</button>
  </div>
</template>

<script setup lang="ts" name="Child">
import { ref } from 'vue';
const toy = ref('奥特曼');

defineProps(['car', 'getToy']);
</script>
```

### 自定义事件

> 参考：[组件事件](https://cn.vuejs.org/guide/components/events.html)

常用于：**子 → 父**。

区分原生事件和自定义事件：
- **原生事件：** 事件名特定（`click`、`mouseenter` 等），事件对象 `$event` 是包含事件信息的对象
- **自定义事件：** 事件名任意，事件对象 `$event` 是调用 `emit` 时提供的数据，可以是任意类型

```html
<!-- 父组件中给子组件绑定自定义事件 -->
<Child @send-toy="toy = $event" />

<!-- 注意区分原生事件与自定义事件中的 $event -->
<button @click="toy = $event">测试</button>
```

```js
// 子组件中触发事件
const emit = defineEmits(['send-toy']);
emit('send-toy', 具体数据);
```

### mitt

> [mitt 仓库](https://github.com/developit/mitt)

与消息订阅与发布功能类似，可实现任意组件间通信。

```bash
npm i mitt
```

```ts
// src/utils/emitter.ts
import mitt from 'mitt';

const emitter = mitt();

export default emitter;
```

接收数据的组件中：

```ts
import emitter from '@/utils/emitter';
import { onUnmounted } from 'vue';

// 绑定事件
emitter.on('send-toy', (value) => {
  console.log('send-toy 事件被触发', value);
});

onUnmounted(() => {
  emitter.off('send-toy'); // 组件卸载时解绑
});
```

提供数据的组件中：

```ts
import emitter from '@/utils/emitter';

function sendToy() {
  emitter.emit('send-toy', toy.value);
}
```

### v-model

> 参考：[v-model 与组件](https://cn.vuejs.org/guide/components/v-model.html)

实现 **父 ↔ 子** 之间相互通信。

**v-model 的本质：**

```vue
<!-- 使用 v-model 指令 -->
<input type="text" v-model="userName">

<!-- v-model 的本质 -->
<input
  type="text"
  :value="userName"
  @input="userName = ($event.target as HTMLInputElement).value"
>
```

**组件标签上的 v-model 的本质：** `:modelValue` + `update:modelValue` 事件

```vue
<!-- 组件标签上使用 v-model -->
<AtguiguInput v-model="userName" />

<!-- 等价于 -->
<AtguiguInput :modelValue="userName" @update:model-value="userName = $event" />
```

```vue
<!-- AtguiguInput 组件 -->
<template>
  <div class="box">
    <input
      type="text"
      :value="modelValue"
      @input="emit('update:model-value', ($event.target as HTMLInputElement).value)"
    >
  </div>
</template>

<script setup lang="ts" name="AtguiguInput">
defineProps(['modelValue']);
const emit = defineEmits(['update:model-value']);
</script>
```

**更换 value 名称，实现多个 v-model：**

```vue
<!-- 可以更换 value，例如改成 abc -->
<AtguiguInput v-model:abc="userName" />
<!-- 等价于 -->
<AtguiguInput :abc="userName" @update:abc="userName = $event" />

<!-- 多个 v-model -->
<AtguiguInput v-model:abc="userName" v-model:xyz="password" />
```

### $attrs

> 参考：[透传 Attributes](https://cn.vuejs.org/guide/components/attrs.html)

用于实现**当前组件的父组件**向**当前组件的子组件**通信（**祖 → 孙**）。

`$attrs` 是一个对象，包含所有父组件传入的标签属性。

> **注意：** `$attrs` 会自动排除 `props` 中声明的属性（声明过的 props 被子组件自己"消费"了）

```vue
<!-- 父组件 -->
<Child :a="a" :b="b" :c="c" :d="d" v-bind="{ x: 100, y: 200 }" :updateA="updateA" />

<!-- 子组件（透传给孙组件） -->
<GrandChild v-bind="$attrs" />

<!-- 孙组件 -->
<script setup lang="ts" name="GrandChild">
defineProps(['a', 'b', 'c', 'd', 'x', 'y', 'updateA']);
</script>
```

### $refs、$parent

| 属性 | 说明 |
| --- | --- |
| `$refs` | 值为对象，包含所有被 `ref` 属性标识的 DOM 元素或组件实例（**父 → 子**） |
| `$parent` | 值为对象，当前组件的父组件实例对象（**子 → 父**） |

### provide / inject

> 参考：[依赖注入](https://cn.vuejs.org/guide/components/provide-inject.html)

实现**祖孙组件**直接通信。

祖先组件中通过 `provide` 提供数据：

```vue
<script setup lang="ts" name="Father">
import Child from './Child.vue';
import { ref, reactive, provide } from 'vue';

let money = ref(100);
let car = reactive({ brand: '奔驰', price: 100 });

function updateMoney(value: number) {
  money.value += value;
}

// 提供数据
provide('moneyContext', { money, updateMoney });
provide('car', car);
</script>
```

> 注意：子组件中不用编写任何东西，不受打扰

孙组件中使用 `inject` 接收数据：

```vue
<template>
  <div class="grand-child">
    <h3>我是孙组件</h3>
    <h4>资产：{{ money }}</h4>
    <h4>汽车：{{ car }}</h4>
    <button @click="updateMoney(6)">点我</button>
  </div>
</template>

<script setup lang="ts" name="GrandChild">
import { inject } from 'vue';

let { money, updateMoney } = inject('moneyContext', {
  money: 0,
  updateMoney: (x: number) => {}
});
let car = inject('car');
</script>
```

### Pinia

参考前面「十四、Pinia 状态管理」部分。

### slot 插槽

> 参考：[插槽](https://cn.vuejs.org/guide/components/slots.html)

#### 默认插槽

```vue
<!-- 父组件 -->
<Category title="今日热门游戏">
  <ul>
    <li v-for="g in games" :key="g.id">{{ g.name }}</li>
  </ul>
</Category>

<!-- 子组件 -->
<template>
  <div class="item">
    <h3>{{ title }}</h3>
    <slot></slot>
  </div>
</template>
```

#### 具名插槽

```vue
<!-- 父组件 -->
<Category title="今日热门游戏">
  <template v-slot:s1>
    <ul>
      <li v-for="g in games" :key="g.id">{{ g.name }}</li>
    </ul>
  </template>
  <template #s2>
    <a href="">更多</a>
  </template>
</Category>

<!-- 子组件 -->
<template>
  <div class="item">
    <h3>{{ title }}</h3>
    <slot name="s1"></slot>
    <slot name="s2"></slot>
  </div>
</template>
```

#### 作用域插槽

数据在组件自身，但根据数据生成的结构需要组件的使用者来决定。

```vue
<!-- 子组件 Game.vue -->
<template>
  <div class="category">
    <h2>今日游戏榜单</h2>
    <slot :games="games" a="哈哈"></slot>
  </div>
</template>

<script setup lang="ts" name="Category">
import { reactive } from 'vue';
let games = reactive([
  { id: 'asgdytsa01', name: '英雄联盟' },
  { id: 'asgdytsa02', name: '王者荣耀' },
  { id: 'asgdytsa03', name: '红色警戒' },
  { id: 'asgdytsa04', name: '斗罗大陆' }
]);
</script>
```

```vue
<!-- 父组件 -->
<Game v-slot="params">
  <ul>
    <li v-for="g in params.games" :key="g.id">{{ g.name }}</li>
  </ul>
</Game>

<!-- 也可以这样写 -->
<!-- <Game v-slot:default="params"> -->
<!-- <Game #default="params"> -->
```

---

## 其他 API

### shallowRef 与 shallowReactive

> 参考：[shallowRef()](https://cn.vuejs.org/api/reactivity-advanced.html#shallowref) / [shallowReactive()](https://cn.vuejs.org/api/reactivity-advanced.html#shallowreactive)

**shallowRef：** 创建一个响应式数据，但只对顶层属性进行响应式处理。只跟踪引用值的变化，不关心值内部的属性变化。

```js
let myVar = shallowRef(initialValue);

myVar.value.count++; // ❌ 不触发更新
myVar.value = { count: 1 }; // ✅ 触发更新
```

**shallowReactive：** 创建一个浅层响应式对象，只会使对象的最顶层属性变成响应式的。

```js
const myObj = shallowReactive({ nested: { count: 0 } });

myObj.nested = { count: 1 }; // ✅ 触发更新
myObj.nested.count++;        // ❌ 不触发更新
```

**适用场景：** 大型数据结构，避免对每一个内部属性做响应式带来的性能成本。

### readonly 与 shallowReadonly

> 参考：[readonly()](https://cn.vuejs.org/api/reactivity-core.html#readonly) / [shallowReadonly()](https://cn.vuejs.org/api/reactivity-advanced.html#shallowreadonly)

**readonly：** 创建一个对象的深只读副本。所有嵌套属性都将变为只读。

```js
const original = reactive({ nested: { count: 0 } });
const readOnlyCopy = readonly(original);

readOnlyCopy.nested.count++; // ⚠️ 警告，修改无效
```

**应用场景：** 创建不可变的状态快照；保护全局状态或配置不被修改。

**shallowReadonly：** 只将对象的顶层属性设置为只读，深层属性仍然可变。

```js
const shallowReadOnlyCopy = shallowReadonly(original);

shallowReadOnlyCopy.nested = {};       // ⚠️ 只读，不允许
shallowReadOnlyCopy.nested.count++;    // ✅ 深层可修改
```

### toRaw 与 markRaw

> 参考：[toRaw()](https://cn.vuejs.org/api/reactivity-advanced.html#toraw) / [markRaw()](https://cn.vuejs.org/api/reactivity-advanced.html#markraw)

**toRaw：** 获取一个响应式对象的原始对象，返回的对象不再是响应式的，不会触发视图更新。

```js
import { reactive, toRaw, markRaw, isReactive } from 'vue';

let person = reactive({ name: 'tony', age: 18 });
let rawPerson = toRaw(person);

console.log(isReactive(person));    // true
console.log(isReactive(rawPerson)); // false
```

> 何时使用？—— 在需要将响应式对象传递给非 Vue 的库或外部系统时，使用 `toRaw` 可以确保它们收到的是普通对象。

**markRaw：** 标记一个对象，使其**永远不会**变成响应式的。

```js
let citys = markRaw([
  { id: 'asdda01', name: '北京' },
  { id: 'asdda02', name: '上海' },
  { id: 'asdda03', name: '天津' },
  { id: 'asdda04', name: '重庆' }
]);

// 根据 citys 创建响应式对象 —— 创建失败，因为 citys 被 markRaw 标记了
let citys2 = reactive(citys);
console.log(isReactive(citys2)); // false
```

> 例如使用 `mockjs` 时，为了防止误把 `mockjs` 变为响应式对象，可以使用 `markRaw` 标记。

### customRef

> 参考：[customRef()](https://cn.vuejs.org/api/reactivity-advanced.html#customref)

创建一个自定义的 `ref`，并对其依赖项跟踪和更新触发进行逻辑控制。

**实现防抖效果：**

```ts
// hooks/useMsgRef.ts
import { customRef } from 'vue';

export default function (initValue: string, delay: number) {
  let msg = customRef((track, trigger) => {
    let timer: number;
    return {
      get() {
        track(); // 告诉 Vue 数据 msg 很重要，要对 msg 持续关注
        return initValue;
      },
      set(value) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          initValue = value;
          trigger(); // 通知 Vue 数据 msg 变化了
        }, delay);
      }
    };
  });
  return { msg };
}
```

---

### 自定义指令

> 参考：[自定义指令](https://cn.vuejs.org/guide/reusability/custom-directives.html)

在 Vue 3 中，自定义指令的钩子函数与组件生命周期保持一致：

| Vue 2 钩子 | Vue 3 钩子 | 说明 |
| --- | --- | --- |
| `bind` | **`created`** | 元素初始化 |
| `inserted` | **`mounted`** | 元素插入 DOM |
| `update` | - | 移除 |
| `componentUpdated` | **`updated`** | 元素/子元素更新完成 |
| `unbind` | **`unmounted`** | 元素卸载 |
| - | **`beforeMount`** | 新增 |
| - | **`beforeUpdate`** | 新增 |
| - | **`beforeUnmount`** | 新增 |

**全局注册：**

```ts
// main.ts
app.directive('focus', {
  mounted(el) {
    el.focus();
  }
});
```

**在 `<script setup>` 中局部注册：**

以 `v` 开头的驼峰命名变量会自动识别为自定义指令：

```vue
<script setup>
// vFocus → v-focus
const vFocus = {
  mounted: (el) => el.focus()
};
</script>

<template>
  <input v-focus />
</template>
```

**简写形式（仅需 `mounted` 和 `updated` 相同逻辑时）：**

```vue
<script setup>
const vColor = (el, binding) => {
  el.style.color = binding.value;
};
</script>

<template>
  <p v-color="'red'">红色文字</p>
</template>
```

---

## Vue 3 新组件

### Teleport

> 参考：[Teleport](https://cn.vuejs.org/guide/built-ins/teleport.html)

Teleport 能够将组件的 HTML 结构移动到指定位置（脱离组件层级）。

```html
<teleport to="body">
  <div class="modal" v-show="isShow">
    <h2>我是一个弹窗</h2>
    <p>我是弹窗中的一些内容</p>
    <button @click="isShow = false">关闭弹窗</button>
  </div>
</teleport>
```

**常见用途：** 模态框、通知、Tooltip 等需要脱离父元素层叠上下文的场景。

### Suspense

> 参考：[Suspense](https://cn.vuejs.org/guide/built-ins/suspense.html)（实验性功能）

等待异步组件时渲染一些额外内容，让应用有更好的用户体验。

```tsx
import { defineAsyncComponent, Suspense } from 'vue';
const Child = defineAsyncComponent(() => import('./Child.vue'));
```

```vue
<template>
  <div class="app">
    <h3>我是 App 组件</h3>
    <Suspense>
      <template v-slot:default>
        <Child />
      </template>
      <template v-slot:fallback>
        <h3>加载中.......</h3>
      </template>
    </Suspense>
  </div>
</template>
```

### 全局 API 转移到应用对象

| Vue 2 全局 API | Vue 3 替代 |
| --- | --- |
| `Vue.component()` | `app.component()` |
| `Vue.config` | `app.config` |
| `Vue.directive()` | `app.directive()` |
| `Vue.mixin()` | `app.mixin()`（不推荐） |
| `Vue.use()` | `app.use()` |
| `Vue.prototype.$xxx` | `app.config.globalProperties.$xxx` |
| `Vue.nextTick()` | `import { nextTick } from 'vue'` |

### 其他变化

- 过渡类名 `v-enter` 修改为 `v-enter-from`、`v-leave` 修改为 `v-leave-from`
- `keyCode` 作为 `v-on` 修饰符的支持被移除
- `v-model` 指令在组件上的使用已经被重新设计，替换掉了 `v-bind.sync`
- `v-if` 和 `v-for` 在同一个元素身上使用时的优先级发生了变化（Vue 3 中 `v-if` 优先于 `v-for`）
- 移除了 `$on`、`$off` 和 `$once` 实例方法
- 移除了过滤器 `filter`
- 移除了 `$children` 实例属性
