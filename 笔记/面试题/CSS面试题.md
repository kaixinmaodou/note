<!-- [toc] -->

---

# CSS & HTML 面试题

> 高频 CSS/HTML 面试题精选，涵盖盒模型、BFC、布局、选择器、渲染等核心知识点。

---

## 1. 盒模型

```css
/* 标准盒模型: width = 内容宽度 */
box-sizing: content-box;

/* IE盒模型: width = 内容 + padding + border */
box-sizing: border-box; /* 推荐 */
```

---

## 2. BFC（块级格式化上下文）

> BFC（Block Formatting Context）是页面中一块独立的渲染区域，内部元素的布局不会影响外部元素

### 触发 BFC 的条件

- 根元素 `<html>`
- `float` 不为 `none`
- `position` 为 `absolute` 或 `fixed`
- `overflow` 不为 `visible`（常用 `overflow: hidden`）
- `display` 为 `inline-block`、`flex`、`inline-flex`、`grid`、`table-cell`、`table-caption`

### BFC 的特性

1. **内部的块盒会在垂直方向上一个接一个放置**
2. **同一个 BFC 中相邻块盒的垂直外边距会折叠**
3. **BFC 区域不会与浮动元素重叠**
4. **BFC 是一个独立的容器，内外互不影响**
5. **计算 BFC 的高度时，浮动元素也参与计算**（清除浮动的原理）

### BFC 的应用场景

```css
/* 1. 清除浮动 —— 父元素塌陷 */
.clearfix {
  overflow: hidden; /* 触发 BFC */
}

/* 2. 防止外边距折叠 */
.wrapper {
  overflow: hidden; /* 创建新的 BFC */
}

/* 3. 自适应两栏布局 */
.left { float: left; width: 200px; }
.right { overflow: hidden; } /* BFC 不与浮动重叠，自动填充剩余空间 */
```

---

## 3. 水平垂直居中

```css
/* 1. flex（推荐） */
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 2. grid */
.parent {
  display: grid;
  place-items: center;
}

/* 3. 绝对定位 + transform */
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 4. 绝对定位 + margin（已知宽高） */
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 100px;
  margin-left: -100px;
  margin-top: -50px;
}

/* 5. 绝对定位 + margin: auto */
.child {
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
  margin: auto;
  width: 200px;
  height: 100px;
}

/* 6. line-height（单行文本垂直居中） */
.parent {
  height: 50px;
  line-height: 50px;
  text-align: center;
}

/* 7. table-cell */
.parent {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}
```

---

## 4. Flex 布局

> Flexbox 是一种一维布局模型，适合在一个方向上（行或列）对齐和分配空间

### 容器属性

```css
.container {
  display: flex;
  flex-direction: row | row-reverse | column | column-reverse;
  flex-wrap: nowrap | wrap | wrap-reverse;
  flex-flow: row wrap;
  justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly;
  align-items: stretch | flex-start | flex-end | center | baseline;
  align-content: stretch | flex-start | flex-end | center | space-between | space-around;
}
```

### 项目属性

```css
.item {
  order: 0;
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: auto;
  flex: 0 1 auto;
  flex: 1;       /* 等价于 flex: 1 1 0% —— 等分剩余空间 */
  flex: auto;    /* 等价于 flex: 1 1 auto */
  flex: none;    /* 等价于 flex: 0 0 auto —— 不伸缩 */
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```

### 经典布局

```css
/* 水平垂直居中 */
.center { display: flex; justify-content: center; align-items: center; }

/* 两端对齐，垂直居中 */
.between { display: flex; justify-content: space-between; align-items: center; }

/* 等分布局 */
.equal > .item { flex: 1; }

/* 圣杯布局 */
.holy-grail { display: flex; min-height: 100vh; flex-direction: column; }
.holy-grail .main { display: flex; flex: 1; }
.holy-grail .content { flex: 1; }
.holy-grail .left { width: 200px; order: -1; }
.holy-grail .right { width: 200px; }
```

---

## 5. Grid 布局

> Grid 是二维布局模型，可以同时控制行和列

### 容器属性

```css
.container {
  display: grid;
  grid-template-columns: 200px 1fr 200px;      /* 三列：固定-自适应-固定 */
  grid-template-columns: repeat(3, 1fr);        /* 三等分 */
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* 响应式 */
  grid-template-rows: 100px auto 100px;
  gap: 20px;
  justify-items: start | end | center | stretch;
  align-items: start | end | center | stretch;
  place-items: center;
  justify-content: start | end | center | stretch | space-between | space-around;
  align-content: start | end | center | stretch | space-between | space-around;
}
```

### 项目属性

```css
.item {
  grid-column: 1 / 3;     /* 从第1列线到第3列线（跨2列） */
  grid-row: 1 / 2;
  grid-area: 1 / 1 / 2 / 3;  /* row-start / col-start / row-end / col-end */
  justify-self: start | end | center | stretch;
  align-self: start | end | center | stretch;
}
```

---

## 6. CSS 选择器优先级

`!important > 内联(1000) > ID(100) > 类/伪类/属性(10) > 标签/伪元素(1) > 通配符(0)`

| 选择器 | 权重 |
| --- | --- |
| `!important` | 最高（慎用） |
| 内联样式 `style=""` | 1,0,0,0 |
| ID 选择器 `#id` | 0,1,0,0 |
| 类/伪类/属性选择器 `.class` `:hover` `[attr]` | 0,0,1,0 |
| 元素/伪元素选择器 `div` `::before` | 0,0,0,1 |
| 通配符 `*`、子代 `>`、相邻 `+` | 0,0,0,0 |
| 继承的样式 | 无权重 |

---

## 7. 回流（Reflow）与重绘（Repaint）

### 回流（Reflow / 重排）

当元素的**几何属性**（尺寸、位置）发生变化时，浏览器需要重新计算布局

**触发回流的操作：**
- 添加/删除可见 DOM 元素
- 元素尺寸变化（width、height、padding、border、margin）
- 元素位置变化
- 页面首次渲染
- 浏览器窗口大小变化（resize）
- 读取某些属性：`offsetTop`、`scrollTop`、`clientTop`、`getComputedStyle()` 等

### 重绘（Repaint）

当元素的**外观属性**（颜色、背景、边框颜色等）发生变化，但不影响布局时

**仅触发重绘的操作：**
- 修改 `color`、`background-color`、`border-color`
- 修改 `visibility`
- 修改 `border-radius`、`box-shadow`
- 修改 `outline`

### 关系

**回流必定引起重绘，重绘不一定引起回流**

### 性能优化

```js
// ❌ 频繁读写，触发多次回流
for (let i = 0; i < 100; i++) {
  el.style.left = el.offsetLeft + 1 + 'px';
}

// ✅ 批量修改，只触发一次回流
el.style.cssText = 'left: 100px; top: 100px; width: 200px;';

// ✅ 使用文档片段
const frag = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
  const li = document.createElement('li');
  frag.appendChild(li);
}
ul.appendChild(frag);

// ✅ 使用 transform 代替 top/left（不触发回流和重绘，在合成线程完成）
el.style.transform = 'translateX(100px)';

// ✅ 使用 requestAnimationFrame 批量更新
requestAnimationFrame(() => {
  el.style.width = '100px';
  el.style.height = '100px';
});
```

---

## 8. position 的值

| 值 | 说明 |
| --- | --- |
| `static` | 默认，不定位 |
| `relative` | 相对自身原位置偏移 |
| `absolute` | 相对最近非 static 祖先定位 |
| `fixed` | 相对视口定位 |
| `sticky` | 滚动到阈值前为 relative，之后为 fixed |

---

## 9. 隐藏元素的方式

| 方式 | 是否占位 | 是否响应事件 | 是否触发回流 |
| --- | --- | --- | --- |
| `display: none` | 否 | 否 | 是 |
| `visibility: hidden` | 是 | 否 | 否（仅重绘） |
| `opacity: 0` | 是 | **是** | 否（仅重绘） |
| `position: absolute; left: -9999px` | 否 | 否 | 是 |
| `clip-path: circle(0)` | 是 | 否 | 否 |
| `transform: scale(0)` | 是 | 否 | 否 |

---

## 清除浮动

### 为什么要清除浮动？

浮动元素脱离文档流，导致父元素高度塌陷

### 清除浮动的方式

```css
/* 1. 额外标签法 */
.clear { clear: both; }

/* 2. 父元素触发 BFC */
.parent { overflow: hidden; }

/* 3. 伪元素清除（推荐） */
.clearfix::after {
  content: '';
  display: block;
  clear: both;
}

/* 4. 双伪元素法 */
.clearfix::before,
.clearfix::after {
  content: '';
  display: table;
}
.clearfix::after {
  clear: both;
}
```

---

## CSS3 新特性

### 过渡 transition

```css
.box {
  transition: property duration timing-function delay;
  transition: all 0.3s ease 0s;
  transition: width 0.3s ease, background-color 0.5s linear;
}
```

### 动画 animation

```css
@keyframes slide {
  from { transform: translateX(0); }
  to { transform: translateX(100px); }
}

@keyframes bounce {
  0% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0); }
}

.box {
  animation: slide 1s ease infinite alternate;
}
```

### 变换 transform

```css
.box {
  transform: translate(50px, 100px);  /* 平移 */
  transform: rotate(45deg);           /* 旋转 */
  transform: scale(1.5);              /* 缩放 */
  transform: skew(10deg, 20deg);      /* 倾斜 */
  transform: translate(50px) rotate(45deg) scale(1.5); /* 组合 */
  transform-origin: center center;    /* 变换原点 */
}
```

---

## HTML5 语义化标签

```html
<header>页头</header>
<nav>导航</nav>
<main>主要内容（页面唯一）</main>
<article>独立的文章内容</article>
<section>文档的一个区段</section>
<aside>侧边栏</aside>
<footer>页脚</footer>
<figure>
  <img src="..." alt="...">
  <figcaption>图片说明</figcaption>
</figure>
```

**语义化的好处：**
1. 代码可读性更好
2. 有利于 SEO（搜索引擎能识别语义标签）
3. 无障碍访问（屏幕阅读器能正确解读）
4. 方便团队开发维护

---

## 行内元素与块级元素

| 特性 | 块级元素 | 行内元素 | 行内块元素 |
| --- | --- | --- | --- |
| 独占一行 | 是 | 否 | 否 |
| 可设置宽高 | 是 | 否 | 是 |
| 默认宽度 | 父元素宽度 | 内容宽度 | 内容宽度 |
| padding/margin | 四个方向均有效 | 水平有效，垂直不占空间 | 四个方向均有效 |

**常见块级元素：** `div` `p` `h1~h6` `ul` `ol` `li` `table` `form` `header` `footer` `section`

**常见行内元素：** `span` `a` `strong` `em` `i` `img` `input` `button`

---

## CSS 画三角形

```css
/* 向上的三角形 */
.triangle-up {
  width: 0;
  height: 0;
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  border-bottom: 100px solid #00c8c8;
}

/* 向右的三角形 */
.triangle-right {
  width: 0;
  height: 0;
  border-top: 50px solid transparent;
  border-bottom: 50px solid transparent;
  border-left: 100px solid #00c8c8;
}
```

---

## 多行文本溢出省略

```css
/* 单行 */
.single-line {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 多行（WebKit 内核） */
.multi-line {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3; /* 最多显示3行 */
  overflow: hidden;
}
```
