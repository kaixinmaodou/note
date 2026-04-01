# JavaScript

## 数据的表达-标识符

和 HTML、CSS 不同, JS 是一门 _命令式编程语言_, 和其他命令式编程语言一样, 它的本质是 **处理数据**

JS 提供了三种方式来表达一个数据:

-   变量
-   字面量
-   表达式

程序中任何需要数据的地方, 都可以使用上面任意一种数据表达。

### 标识符

程序中有些可以自行命名的地方, 称之为**标识符**

> 常见的标识符有: 变量名、函数名、参数名

_js_ 的标识符必须符合以下规则:

-   允许数字、字母、下划线、\$符号
-   不得以数字开头
-   不能和关键字冲突
-   建议使用驼峰命名法

一个完整的程序中, 会涉及成百上千的标识符, 好的名称不仅可以减少名称冲突, 更有利于程序的阅读和维护。

名称要做到**望文知意**

### 转义符

| 转义符 | 含义           |
| ------ | -------------- |
| `\'`   | 普通英文单引号 |
| `\"`   | 普通英文双引号 |
| `\r`   | 回车           |
| `\n`   | 换行           |

> 小技巧: 常用`\r\n`表示换行 _具体原因追溯到打字机的 换行和回车是分开使用的_

## 数据类型

### 原始类型（基础类型）

#### boolean 

布尔类型用于表达真或假两种状态

-   true，表示真
-   false，表示假

#### string

-   在 JS 中，字符串可以使用单引号，也可以使用双引号，两者没有区别，你选择一种自己的风格
-   字符串实际上是无法修改的

> 了解:
> 数字类型可以加上前缀，来表示不同的进制
> 0: 表示 8 进制
> 0x: 表示 16 进制
> 0b: 表示 2 进制

#### **number**

-   在所有的语言（采用的是 IEE754 标准），浮点数是没有办法精确计算的（round-off error）

> 区分某些长数字和字符串: 如果按照数字的方式阅读，则使用数字类型；否则使用字符串类型

#### null

> 空，没有（null、nil、none）

#### undefined

> 有变量但是没有赋值

-   为什么搞两个？其实这是有历史原因
-   typeof null ---> object

#### symbol

> **symbol** 是一种基本数据类型（[primitive data type](https://developer.mozilla.org/zh-CN/docs/Glossary/Primitive)）。`Symbol()` 函数会返回 **symbol** 类型的值，该类型具有静态属性和静态方法。它的静态属性会暴露几个内建的成员对象；它的静态方法会暴露全局的 symbol 注册，且类似于内建对象类，但作为构造函数来说它并不完整，因为它不支持语法: "`new Symbol()`"。
>
> 每个从 `Symbol()` 返回的 symbol 值都是唯一的。一个 symbol 值能作为对象属性的标识符；这是该数据类型仅有的目的。更进一步的解析见—— [glossary entry for Symbol](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol)。

```js
var sym1 = Symbol();
var sym2 = Symbol('foo');
var sym3 = Symbol('foo');
Symbol('foo') === Symbol('foo'); // false
var sym = new Symbol(); // TypeError
```

符号设计的初衷，是为了给对象设置私有属性

-   私有属性: 只能在对象内部使用，外面无法使用

符号具有以下特点:

-   没有字面量

-   使用 typeof 得到的类型是 symbol

-   **每次调用 Symbol 函数得到的符号永远不相等，无论符号名是否相同**

-   符号可以作为对象的属性名存在，这种属性称之为 **符号属性** :

    ```js
    const syb1 = Symbol('这是用于对象的一个属性');
    const obj = {
    	a: 1,
    	b: 2,
    	[syb1]: 3, //符号属性
    };
    console.log(obj);
    // { a: 1, b: 2, [Symbol(这是用于对象的一个属性)]: 3 }
    ```

    -   开发者可以通过精心的设计，让这些属性无法通过常规方式被外界访问

        ```js
        const Hero = (() => {
        	const getRandom = Symbol();
        	return class {
        		constructor(attack, hp, defence) {
        			this.attack = attack;
        			this.hp = hp;
        			this.defence = defence;
        		}

        		gongji() {
        			//伤害: 攻击力*随机数（0.8~1.1)
        			const dmg = this.attack * this[getRandom](0.8, 1.1);
        			console.log(dmg);
        		}

        		[getRandom](min, max) {
        			//根据最小值和最大值产生一个随机数
        			return Math.random() * (max - min) + min;
        		}
        	};
        })();

        const h = new Hero(3, 6, 3);
        const sybs = Object.getOwnPropertySymbols(Hero.prototype);
        const prop = sybs[0];
        console.log(h[prop](3, 5));
        ```

    -   符号属性是**不能枚举**的，因此在 **for-in** 循环中无法读取到符号属性，**Object.keys** 方法也无法读取到符号属性

    -   **Object.getOwnPropertyNames** 尽管可以得到所有无法枚举的属性，但是仍然无法读取到符号属性

    -   ES6 新增 **Object.getOwnPropertySymbols** 方法，可以读取符号

        > [`Object.getOwnPropertySymbols()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols) 方法让你在查找一个给定对象的符号属性时返回一个 symbol 类型的数组。注意，每个初始化的对象都是没有自己的 symbol 属性的，因此这个数组可能为空，除非你已经在对象上设置了 symbol 属性。

-   符号无法被隐式转换，因此不能被用于数学运算、字符串拼接或其他隐式转换的场景，但符号可以显式的转换为字符串，通过 String 构造函数进行转换即可，==console.log 之所以可以输出符号，是它在内部进行了显式转换==

##### 全局共享的 Symbol

上面使用 `Symbol()` 函数的语法，不会在你的整个代码库中创建一个可用的全局的 symbol 类型。要创建跨文件可用的 symbol，甚至跨域（每个都有它自己的全局作用域），使用 [`Symbol.for()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for) 方法和 [`Symbol.keyFor()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/keyFor) 方法从全局的 symbol 注册表设置和取得 symbol。

-   [Symbol.for(key)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for)

> **`Symbol.for(key)`** 方法会根据给定的键 `key`，来从运行时的 symbol 注册表中找到对应的 symbol，如果找到了，则返回它，否则，新建一个与该键关联的 symbol，并放入全局 symbol 注册表中

```js
// 原理
const SymbolFor = (() => {
	const global = {}; //用于记录有哪些共享符号
	return function (name) {
		console.log(global);
		if (!global[name]) {
			global[name] = Symbol(name);
		}
		console.log(global);
		return global[name];
	};
})();
const syb1 = SymbolFor('abc');
const syb2 = SymbolFor('abc');
console.log(syb1 === syb2);
```

-   [Symbol.keyFor(sym)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/keyFor)

> **`Symbol.keyFor(sym)`** 方法用来获取全局 symbol 注册表中与某个 symbol 关联的键

```js
// 创建一个全局 Symbol
var globalSym = Symbol.for('foo');
Symbol.keyFor(globalSym); // "foo"

var localSym = Symbol();
Symbol.keyFor(localSym); // undefined，

// 以下 Symbol 不是保存在全局 Symbol 注册表中
Symbol.keyFor(Symbol.iterator); // undefined
```

##### 内置通用（well-known）symbol

> 知名符号是一些具有特殊含义的共享符号，通过 Symbol 的静态属性得到
>
> ==ES6 延续了 ES5 的思想: 减少魔法，暴露内部实现！==

除了自己创建的 symbol，**JavaScript 还内建了一些在 ECMAScript 5 之前没有暴露给开发者的 symbol，它们代表了内部语言行为。它们可以使用以下属性访问**:

-   迭代 symbols [==Symbol.iterator==](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator)

    一个返回一个对象默认迭代器的方法。被 [`for...of`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...of) 使用。

-   [`Symbol.asyncIterator`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/asyncIterator) 实验性

    一个返回对象默认的异步迭代器的方法。被 [`for await of`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for-await...of) 使用。

-   正则表达式 symbols [`Symbol.match`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/match)

    一个用于对字符串进行匹配的方法，也用于确定一个对象是否可以作为正则表达式使用。被 [`String.prototype.match()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/match) 使用。

-   [`Symbol.replace`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/replace)

    一个替换匹配字符串的子串的方法。被 [`String.prototype.replace()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replace) 使用。

-   [`Symbol.search`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/search)

    一个返回一个字符串中与正则表达式相匹配的索引的方法。被 [`String.prototype.search()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/search) 使用。

-   [`Symbol.split`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/split)

    一个在匹配正则表达式的索引处拆分一个字符串的方法.。被 [`String.prototype.split()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/split) 使用。

-   [`Symbol.hasInstance`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/hasInstance)

    一个确定一个构造器对象识别的对象是否为它的实例的方法。被 [`instanceof`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof) 使用。

    ```js
    function A() {}
    Object.defineProperty(A, Symbol.hasInstance, {
    	value: function (obj) {
    		return false;
    	},
    });
    const obj = new A();
    // 相当于A[Symbol.hasInstance](obj)
    console.log(obj instanceof A); // false
    ```

-   [`Symbol.isConcatSpreadable`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/isConcatSpreadable)

    一个布尔值，表明一个对象是否应该 flattened 为它的数组元素。被 [==Array.prototype.concat()==](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/concat) 使用。

    ```js
    const arr = [3];
    const arr2 = [5, 6, 7, 8];
    arr2[Symbol.isConcatSpreadable] = false;
    const result = arr.concat(56, arr2);
    //  [3, 56, [5,6,7,8]] [Symbol.isConcatSpreadable] = false
    //  [3, 56, 5, 6, 7, 8] [Symbol.isConcatSpreadable] = true
    console.log(result);

    const arr = [1];
    const obj = {
    	0: 3,
    	1: 4,
    	length: 2,
    	[Symbol.isConcatSpreadable]: true,
    };
    const result = arr.concat(2, obj);
    console.log(result); // [ 1, 2, 3, 4 ]
    ```

-   [==Symbol.toPrimitive==](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive)

    一个将对象转化为基本数据类型的方法。**(==隐式转换==)**

    ```
    class Temperature {
    	constructor(degree) {
    		this.degree = degree;
    	}
    	[Symbol.toPrimitive](type) {
    		if (type === 'default') {
    			return this.degree + '摄氏度';
    		} else if (type === 'number') {
    			return this.degree;
    		} else if (type === 'string') {
    			return this.degree + '℃';
    		}
    	}
    }
    const t = new Temperature(30);
    console.log(t + '!'); // 30摄氏度!
    console.log(t / 2); // 15
    console.log(String(t)); // 30℃
    ```

-   [`Symbol.toStringTag`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toStringTag)

    用于对象的默认描述的字符串值。被 [==Object.prototype.toString()==](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString) 使用。

    ```js
    class Person {
    	[Symbol.toStringTag] = 'Person1';
    }
    const p = new Person();
    const arr = [32424, 45654, 32];
    console.log(Object.prototype.toString.apply(p)); // [object Person1]
    console.log(Object.prototype.toString.apply(arr)); // [object Array]
    ```

-   [`Symbol.unscopables`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/unscopables)

    拥有和继承属性名的一个对象的值被排除在与环境绑定的相关对象外。

-   [`Symbol.species`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/species)

    一个用于创建派生对象的构造器函数。

#### bigint

-   为了表示 64 位整数，也是 ES6 新推出的数据类型
-   只要你在数字后面加一个 n 表示一个 bigint 类型

```js
1000n + 2000n; // 3000n
```

-   bigint 是不能够和常规 number 类型进行运算的

```js
1000n + 20; // error
```

-   但是比较是可以的

```js
1000n > 20;
```

### 引用类型（复杂类型）

-   object （包含普通对象、数组、函数）

#### 对象

对象的**所有属性名都是字符串**, 因此使用单引号或双引号包裹起来

```js
var obj = {
	name: '邓哥',
	age: 35,
	'graduate date': '2007-7-1',
	'home address': {
		province: '黑龙江',
		city: 'city',
	},
};
```

为了书写的方便, 当对象的属性名是**纯数字**或**符合标识符规范**时, 可以**省略引号**

> 小贴士
> 书写代码时我们无须关注这些规则, 直接按照简写方式书写属性, 若编辑器出现报错, 则使用引号包裹属性名即可

读取对象属性时, 使用`[]`, 把要读取的属性名传递到中括号中

```js
obj['name']; // 读取obj的name属性
obj['home address']; // 读取obj的home address属性
obj['home address']['province']; // 这是啥意思？
```

若属性**符合标识符规范**, 可以使用`.`符号连接属性名

```js
obj.name; // 读取obj的name属性
obj.age; // 读取obj的age属性
obj['home address'].province; // 请自行脑补
```

##### 删除属性

> **`delete`** 运算符用于删除对象的一个属性；如果该属性的值是一个对象，并且没有更多对该对象的引用，该属性所持有的对象最终会自动释放。

**返回值: Boolean**

但是，以下情况需要重点考虑:

-   如果你试图删除的属性不存在，那么 `delete` 将不会起任何作用，但仍会返回 `true`。

-   `delete` 只影响自身属性。如果对象的原型链上有一个与待删除属性同名的属性，那么删除属性之后，对象会使用原型链上的那个属性。

-   不可配置的属性不能被移除。这意味着像 [`Math`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math)、[`Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)、[`Object`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object) 这些内置对象的属性以及使用 [`Object.defineProperty()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) 方法设置为不可配置的属性不能被删除。

-   删除包括函数参数内的变量永远不会奏效。`delete variable` 会在严格模式下抛出 [`SyntaxError`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError) 错误，非严格模式下不会有任何效果。

    -   ==任何使用 [`var`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/var) 声明的属性不能从全局作用域或函数的作用域中删除==，因为即使它们可能附加到[全局对象](https://developer.mozilla.org/zh-CN/docs/Glossary/Global_object)上，它们也是不可配置的。

    -   ==任何使用 [`let`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/let) 或 [`const`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/const) 声明的属性不能够从它被声明的作用域中删除==，因为它们没有附加到任何对象上。

```js
delete object.property;
delete object[property];
```

##### 对象成员速写

在某些场景下，ES6 提供了一种更加简洁的方式书写对象成员

示例 1:

```js
const name = 'monica',
	age = 17;
const sayHello = function () {
	console.log(`my name is ${this.name}`);
};
// 过去的方式
const user = {
	name: name,
	age: age,
	sayHello: sayHello,
};
// 速写
const user = {
	name,
	age,
	sayHello,
};
// 过去的方式
const MyMath = {
	sum: function (a, b) {
		//...
	},
	random: function (min, max) {
		//...
	},
};
// 速写
const MyMath = {
	sum(a, b) {
		// ...
	},
	random(min, max) {
		// ...
	},
};
```

##### 解构

ES6 提供了一种特殊的语法，通过该语法，可以轻松的从数组或对象中取出想要的部分

示例：

```js
let a = 1,
	b = 2;
// 交换两个变量
[b, a] = [a, b];

const person = {
	age: 20,
	address: 'china',
};
let { age = 22, address: ads = '美国', parents = '默认值' } = person;
console.log(age); // 20
console.log(ads); // china
console.log(parents); // 默认值
console.log(aaddress); // aaddress is not defined
```

###### 绑定与赋值

> 解构与重命名

###### 默认值

> 每个解构属性都可以有一个*默认值*。**当属性不存在或值为 `undefined` 时，将使用默认值**。如果属性的值为 `null`，则不使用它

###### 剩余属性

> 你可以使用剩余属性（`...rest`）结束解构模式。此模式会将对象或数组的所有剩余属性存储到新的对象或数组中。

###### 在任何可迭代对象上使用数组解构

> 数组解构调用右侧的[迭代协议](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols)。因此，任何可迭代对象（不一定是数组）都可以解构。

```js
const [a, b] = new Map([
	[1, 2],
	[3, 4],
]);
console.log(a, b); // [1, 2] [3, 4]
```

不可迭代对象不能解构为数组。

```js
const [a, b] = { 0: 'a', 1: 'b', length: 2 }; // TypeError: obj is not iterable
```

只有在分配所有绑定之前，才会迭代可迭代对象。

```js
const obj = {
	*[Symbol.iterator]() {
		for (const v of [0, 1, 2, 3]) {
			console.log(v);
			yield v;
		}
	},
};
const [a, b] = obj; // Only logs 0 and 1
```

其余的绑定会提前求值并创建一个新数组，而不是使用旧的迭代器。

```js
const obj = {
	*[Symbol.iterator]() {
		for (const v of [0, 1, 2, 3]) {
			console.log(v);
			yield v;
		}
	},
};
const [a, b, ...rest] = obj; // Logs 0 1 2 3
console.log(rest); // [2, 3] (an array)
```

##### 展开运算符

示例 1:

```js
const arr = [3, 6, 1, 7, 2];
// 对数组的展开
Math.max(...arr); // 相当于:  Math.max(3, 6, 1, 7, 2)
```

##### 属性描述符

对于对象中的每个成员，JS 使用属性描述符来描述它们

```js
const user = {
	name: 'monica',
	age: 17,
};
```

上面的对象，在 JS 内部被描述为

```js
{
  // 属性 name 的描述符
  name: {
    value: 'monica',
    configurable: true, // 该属性的描述符是否可以被重新定义
    enumerable: true, // 该属性是否允许被遍历，会影响for-in循环
    writable: true // 该属性是否允许被修改
  },
  // 属性 age 的描述符
  age: {
    value: 'monica',
    configurable: true, // 该属性的描述符是否可以被重新定义
    enumerable: true, // 该属性是否允许被遍历，会影响for-in循环
    writable: true // 该属性是否允许被修改
  },
}
```

ES5 提供了一系列的 API，针对属性描述符进行操作

###### getOwnPropertyDescriptor

> **Object.getOwnPropertyDescriptor(obj, prop)**
>
> [**`Object.getOwnPropertyDescriptor()`** 方法返回指定对象上一个==自有属性==对应的属性描述符。（**自有属性指的是直接赋予该对象的属性，不需要从原型链上进行查找的属性**）](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor)

**`Object.getOwnPropertyDescriptors(obj)`** 某个对象所有自有属性的描述符

```js
const user = {
	name: 'monica',
	age: 17,
};

Object.getOwnPropertyDescriptor(user, 'name');
/*{
    value: 'monica',
    configurable: true, // 该属性的描述符是否可以被重新定义 默认值 false
    enumerable: true, // 该属性是否允许被遍历，会影响for-in循环 默认值 false
    writable: true // 该属性是否允许被修改 默认值false
}*/
```

###### defineProperty

> **Object.defineProperty(obj, prop, descriptor)**
>
> [**`Object.defineProperty()`** 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象。](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

描述：

> Object.defineProperty() 允许精确地添加或修改对象上的属性。通过[赋值(=)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Assignment)添加的普通属性会在枚举属性时（例如 [`for...in`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...in)、[`Object.keys()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/keys) 等）出现，它们的值可以被更改，也可以被[删除(delete)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/delete)。此方法允许更改这些额外细节，以使其不同于默认值。==默认情况下，使用 Object.defineProperty() **添加**的属性是**不可写、不可枚举和不可配置**的==。此外，`Object.defineProperty()` 使用 [`[[DefineOwnProperty\]]`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/defineProperty) 内部方法，而不是 [`[[Set\]]`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/set)，因此即使属性已经存在，它也不会调用 [setter](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/set)。

```js
const user = {
	name: 'monica',
	age: 17,
};

Object.defineProperty(obj, 'name', {
	value: '邓哥', // 将其值进行修改
	enumerable: false, // 让该属性不能被遍历 默认值 false
	writable: false, // 让该属性无法被重新赋值 默认值 false
	configurable: false, // 该属性的描述符是否可以被重新定义 默认值 false
});

var obj = {};
Object.defineProperties(obj, {
	property1: {
		value: true,
		writable: true,
	},
	property2: {
		value: 'Hello',
		writable: false,
	},
	// etc. etc.
});
```

###### getter和setter

> 属性描述符中有两个特殊的配置，分别为`get`和`set`，通过它们，可以把属性的取值和赋值变为方法调用
>
> **存取器属性最大的意义，在于可以控制属性的读取和赋值**。

`get`

属性的 getter 函数，如果没有 getter，则为 `undefined`。当访问该属性时，会调用此函数。执行时不传入任何参数，但是会传入 `this` 对象（由于继承关系，这里的`this`并不一定是定义该属性的对象）。该函数的返回值会被用作属性的值。 **默认为 [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)**。

`set`

属性的 setter 函数，如果没有 setter，则为 `undefined`。当属性值被修改时，会调用此函数。该方法接受一个参数（也就是被赋予的新值），会传入赋值时的 `this` 对象。 **默认为 [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)**。

```js
const obj = {};
Object.defineProperty(obj, 'a', {
	 Object.defineProperty(obj, "a", {
            get() {
                console.log("运行了属性a的get函数")
                return obj._a;
            },
            set(val){
                console.log("运行了属性a的set函数", val)
                obj._a = val;
            }
        })
});

console.log(obj.a); // 输出: 1
obj.a = 3; // 输出: 3
console.log(obj.a); // 输出: 1
```

###### 默认值

-   拥有布尔值的键 configurable 、enumerable 和 writable 的默认值都是 **false**。
-   属性值和函数的键 `value`、`get` 和 `set` 字段的默认值为 **undefined**。

##### 键值对

**`Object.keys(obj)`**: 获取对象的属性名组成的数组

**`Object.values(obj)`**: 获取对象的值组成的数组

**`Object.entries(obj)`**: 获取对象属性名和属性值组成的数组

**`Object.fromEntries(entries)`**: 将属性名和属性值的数组转换为对象

示例:

```js
const user = {
	name: 'monica',
	age: 17,
};
Object.keys(user); // ["name", "age"]
Object.values(user); // ["monica", 17]
Object.entries(user); // [ ["name", "monica"], ["age", 17] ]
Object.fromEntries([
	['name', 'monica'],
	['age', 17],
]); // {name:'monica', age:17}
```

###### Object.getOwnPropertyNames(obj)

> **`Object.getOwnPropertyNames()`** 方法返回一个由指定对象的所有自身属性的属性名（==包括不可枚举属性 但 **不包括 Symbol 值作为名称的属性**==）组成的数组。
>
> `Object.getOwnPropertyNames()` 返回一个数组，该数组对元素是 `obj`自身拥有的 **枚举或不可枚举属性名称字符串** 。数组中枚举属性的顺序与通过 [`for...in`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...in) 循环（或 [`Object.keys`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)）迭代该对象属性时一致。数组中不可枚举属性的顺序未定义。

Object.getOwnPropertyNames 方法之前就存在，只不过，官方没有明确要求，对属性的顺序如何排序，如何排序，完全由浏览器厂商决定。
ES6 规定了该方法返回的数组的排序方式如下:

-   先排**数字**，并按照**升序**排序

-   再排**其他**，按照**书写**顺序排序

##### 冻结

使用`Object.freeze(obj)`可以冻结一个对象，该对象的所有属性均不可更改

```js
const obj = {
	a: 1,
	b: {
		c: 3,
	},
};

Object.freeze(obj); //  冻结对象obj

obj.a = 2; // 不报错，代码无效
obj.k = 4; // 不报错，代码无效
delete obj.a; // 不报错，代码无效
obj.b = 5; // 不报错，代码无效

obj.b.c = 5; // b对象没有被冻结，有效

console.log(obj); // {a:1, b:{ c: 5 } }
```

可以使用`Object.isFrozen`来判断一个对象是否被冻结

##### Object.is

`Object.is`方法，可以判断两个值是否相同，它和`===`的功能基本一致

区别在于 **object.is** 认为:

-   ==NaN 和 NaN 相等==
-   ==+0 和-0 不相等==

```js
Object.is(1, 2); // false
Object.is('1', 1); // false
// 特别注意
Object.is(NaN, NaN); // true
Object.is(+0, -0); // false
console.log(NaN === NaN); // false
console.log(-0 === +0); // true
```

#### Set

> [一直以来，JS 只能使用数组和对象来保存多个数据，缺乏像其他语言那样拥有丰富的集合类型。因此，ES6 新增了两种集合类型（set 和 map），用于在不同的场景中发挥作用](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set)

**set 用于存放不重复的数据**

> 因为 Set 中的值总是唯一的，所以需要判断两个值是否相等。在 ECMAScript 规范的早期版本中，这不是基于和===操作符中使用的算法相同的算法。具体来说，对于 Set，+0（+0 严格相等于 -0）和 -0 是不同的值。然而，在 ECMAScript 2015 规范中这点已被更改。有关详细信息，请参阅[浏览器兼容性](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set#浏览器兼容性)表中的“_Key equality for -0 and 0_”。 
>
> 另外，`NaN` 和 `undefined` 都可以被存储在 Set 中，`NaN` 之间被视为相同的值（NaN 被认为是相同的，尽管 NaN !== NaN）。

创建 set 集合

```js
new Set(); //创建一个没有任何内容的set集合
new Set(iterable); //创建一个具有初始内容的set集合，内容来自于可迭代对象每一次迭代的结果
```

##### 方法

-   **add**(数据):

    > 添加一个数据到 set 集合末尾，如果数据已存在，则不进行任何操作

    -   ==set 使用 Object.is 的方式判断两个数据是否相同，但是，针对+ 0 和 -0，set 认为是相等==

-   **has**(数据):

    > 判断 set 中是否存在对应的数据

-   **delete**(数据):

    > 删除匹配的数据，返回是否删除成功

-   **clear**():

    > 清空整个 set 集合

-   **==size==**:

    > 获取 set 集合中的元素数量，只读属性，无法重新赋值

3. 如何与数组进行相互转换

```js
const s = new Set([x, x, x, x, x]);
// set本身也是一个可迭代对象，每次迭代的结果就是每一项的值
const arr = [...s];
```

4. 如何遍历

    1. 使用 for-of 循环
    2. 使用 set 中的实例方法 forEach

注意: **set 集合中不存在下标，因此 forEach 中的回调的第二个参数和第一个参数是一致的，均表示 set 中的每一项**

**应用**

```js
// 两个数组的并集、交集、差集 （不能出现重复项），得到的结果是一个新数组
const arr1 = [33, 22, 55, 33, 11, 33, 5];
const arr2 = [22, 55, 77, 88, 88, 99, 99];

//并集
// const result = [...new Set(arr1.concat(arr2))];
console.log('并集', [...new Set([...arr1, ...arr2])]);

//交集
const cross = [...new Set(arr1)].filter((item) => arr2.indexOf(item) >= 0);
console.log('交集', cross);

//差集
// console.log("差集", [...new Set([...arr1, ...arr2])].filter(item => arr1.indexOf(item) >= 0 && arr2.indexOf(item) < 0 || arr2.indexOf(item) >= 0 && arr1.indexOf(item) < 0))
console.log(
	'差集',
	[...new Set([...arr1, ...arr2])].filter((item) => cross.indexOf(item) < 0),
);
```

##### 手写 Set

```js
class MySet {
	constructor(iterator = []) {
		//验证是否是可迭代的对象
		if (typeof iterator[Symbol.iterator] !== 'function') {
			throw new TypeError(`你提供的${iterator}不是一个可迭代的对象`);
		}
		this._datas = [];
		for (const item of iterator) {
			this.add(item);
		}
	}

	get size() {
		return this._datas.length;
	}

	add(data) {
		if (!this.has(data)) {
			this._datas.push(data);
		}
	}

	has(data) {
		for (const item of this._datas) {
			if (this.isEqual(data, item)) {
				return true;
			}
		}
		return false;
	}

	delete(data) {
		for (let i = 0; i < this._datas.length; i++) {
			const element = this._datas[i];
			if (this.isEqual(element, data)) {
				//删除
				this._datas.splice(i, 1);
				return true;
			}
		}
		return false;
	}

	clear() {
		this._datas.length = 0;
	}

	*[Symbol.iterator]() {
		for (const item of this._datas) {
			yield item;
		}
	}

	forEach(callback) {
		for (const item of this._datas) {
			callback(item, item, this);
		}
	}

	/**
	 * 判断两个数据是否相等
	 * @param {*} data1
	 * @param {*} data2
	 */
	isEqual(data1, data2) {
		if (data1 === 0 && data2 === 0) {
			return true;
		}
		return Object.is(data1, data2);
	}
}
```

#### Map

> [ES6 新增了 Map 结构，用于保存键值对的映射，它和对象的最大区别在于: 对象的键只能是字符串，而 Map 的键可以是任何类型](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map)

**键值对（key value pair）数据集合的特点: 键不可重复**

map 集合专门用于存储多个键值对数据。

**使用对象存储有以下问题**:

1. 键名只能是字符串
2. 获取数据的数量不方便
3. 键名容易跟原型上的名称冲突

创建 map

```js
new Map(); //创建一个空的map
//创建一个具有初始内容的map，初始内容来自于可迭代对象每一次迭代的结果，但是，它要求每一次迭代的结果必须是一个长度为2的数组，数组第一项表示键，数组的第二项表示值
new Map(iterable);
```

##### `Map` 和 `Object` 重要的区别

|              | ==Map==                                                                                                                                                                                                                                                                                                                                              | Object                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| :----------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 意外的键     | `Map` 默认情况不包含任何键。只包含显式插入的键。                                                                                                                                                                                                                                                                                                     | 一个 `Object` 有一个原型，原型链上的键名有可能和你自己在对象上的设置的键名产生冲突。**备注：**虽然可以用 [`Object.create(null)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create) 来创建一个没有原型的对象，但是这种用法不太常见。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 键的类型     | 一个 `Map` 的键可以是**任意值**，包括函数、对象或任意基本类型。                                                                                                                                                                                                                                                                                      | 一个 `Object` 的键必须是一个 [`String`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String) 或是 [`Symbol`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol)。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| 键的顺序     | ==Map 中的键是有序的==。因此，当迭代的时候，一个 `Map` 对象以**==插入的顺序==**返回键值。                                                                                                                                                                                                                                                            | 虽然 `Object` 的键目前是有序的，但并不总是这样，而且这个顺序是复杂的。因此，最好不要依赖属性的顺序。自 ECMAScript 2015 规范以来，对象的属性被定义为是有序的；ECMAScript 2020 则额外定义了继承属性的顺序。参见 [OrdinaryOwnPropertyKeys](https://tc39.es/ecma262/#sec-ordinaryownpropertykeys) 和 [EnumerateObjectProperties](https://tc39.es/ecma262/#sec-enumerate-object-properties) 抽象规范说明。但是，请注意没有可以迭代对象所有属性的机制，每一种机制只包含了属性的不同子集。（[`for-in`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...in) 仅包含了以字符串为键的属性；[`Object.keys`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/keys) 仅包含了对象自身的、可枚举的、以字符串为键的属性；[`Object.getOwnPropertyNames`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames) 包含了所有以字符串为键的属性，即使是不可枚举的；[`Object.getOwnPropertySymbols`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols) 与前者类似，但其包含的是以 `Symbol` 为键的属性，等等。） |
| Size         | `Map` 的键值对个数可以轻易地通过 [`size`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map/size) 属性获取。                                                                                                                                                                                                      | `Object` 的键值对个数只能手动计算。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 迭代         | `Map` 是 [可迭代的](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols) 的，所以可以直接被迭代。                                                                                                                                                                                                                  | `Object` 没有实现 [迭代协议](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol)，所以使用 JavaSctipt 的 [for...of](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...of) 表达式并不能直接迭代对象。**备注：**对象可以实现迭代协议，或者你可以使用 [`Object.keys`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/keys) 或 [`Object.entries`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)。[for...in](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...in) 表达式允许你迭代一个对象的 **可枚举**==属性==。                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| 性能         | 在频繁增删键值对的场景下表现更好。                                                                                                                                                                                                                                                                                                                   | 在频繁添加和删除键值对的场景下未作出优化。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 序列化和解析 | 没有元素的序列化和解析的支持。（但是你可以使用携带 _replacer_ 参数的 [`JSON.stringify()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) 创建一个自己的对 `Map` 的序列化和解析支持。参见 Stack Overflow 上的提问：[How do you JSON.stringify an ES6 Map?](https://stackoverflow.com/q/29085197/)） | 原生的由 [`Object`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object) 到 JSON 的序列化支持，使用 [`JSON.stringify()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)。原生的由 JSON 到 [`Object`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object) 的解析支持，使用                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

##### 方法

-   **==size==**

    > 只读属性，获取当前 map 中键的数量

-   **set**(键, 值)

    > 设置一个键值对，键和值可以是任何类型

    -   如果键不存在，则添加一项

    -   如果键已存在，则修改它的值

    -   比较键的方式和 set 相同 **`Object.is()`**

-   **get**(键)

    > 根据一个键得到对应的值

-   **has**(键)

    > 判断某个键是否存在

-   **delete**(键)

    > 删除指定的键 返回 boolean

-   **clear**()

    > 清空 map

-   [Map.prototype.keys()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map/keys)

    > 返回一个新的迭代对象，其中包含 `Map` 对象中所有的键，并以插入 `Map` 对象的顺序排列。

-   [Map.prototype.values()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map/values)

    > 返回一个新的迭代对象，其中包含 `Map` 对象中所有的值，并以插入 `Map` 对象的顺序排列。

-   [Map.prototype.entries()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map/entries)

    > 返回一个新的迭代对象，其为一个包含 `Map` 对象中所有键值对的 `[key, value]` 数组，并以插入 `Map` 对象的顺序排列。

-   [Map.prototype.forEach()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map/forEach)

    > 以插入的顺序对 `Map` 对象中存在的键值对分别调用一次 `callbackFn`。如果给定了 `thisArg` 参数，这个参数将会是回调函数中 `this` 的值。

##### [Map 与数组的关系](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map#map_与数组的关系)

```js
const kvArray = [
	['key1', 'value1'],
	['key2', 'value2'],
];

// 使用常规的 Map 构造函数可以将一个二维键值对数组转换成一个 Map 对象
const myMap = new Map(kvArray);

console.log(myMap.get('key1')); // "value1"

// 使用 Array.from 函数可以将一个 Map 对象转换成一个二维键值对数组
console.log(Array.from(myMap)); // 输出和 kvArray 相同的数组

// 更简洁的方法来做如上同样的事情，使用展开运算符
console.log([...myMap]);

// 或者在键或者值的迭代器上使用 Array.from，进而得到只含有键或者值的数组
console.log(Array.from(myMap.keys())); // 输出 ["key1", "key2"]
```

##### 遍历

-   for-of，每次迭代得到的是一个长度为 2 的数组

-   forEach，通过回调函数遍历

    -   参数 1: 每一项的值
    -   参数 2: 每一项的键
    -   参数 3: map 本身

##### 手写 Map

```js
class MyMap {
	constructor(iterable = []) {
		//验证是否是可迭代的对象
		if (typeof iterable[Symbol.iterator] !== 'function') {
			throw new TypeError(`你提供的${iterable}不是一个可迭代的对象`);
		}
		this._datas = [];
		for (const item of iterable) {
			// item 也得是一个可迭代对象
			if (typeof item[Symbol.iterator] !== 'function') {
				throw new TypeError(`你提供的${item}不是一个可迭代的对象`);
			}
			const iterator = item[Symbol.iterator]();
			const key = iterator.next().value;
			const value = iterator.next().value;
			this.set(key, value);
		}
	}

	set(key, value) {
		const obj = this._getObj(key);
		if (obj) {
			//修改
			obj.value = value;
		} else {
			this._datas.push({
				key,
				value,
			});
		}
	}

	get(key) {
		const item = this._getObj(key);
		if (item) {
			return item.value;
		}
		return undefined;
	}

	get size() {
		return this._datas.length;
	}

	delete(key) {
		for (let i = 0; i < this._datas.length; i++) {
			const element = this._datas[i];
			if (this.isEqual(element.key, key)) {
				this._datas.splice(i, 1);
				return true;
			}
		}
		return false;
	}

	clear() {
		this._datas.length = 0;
	}

	/**
	 * 根据key值从内部数组中，找到对应的数组项
	 * @param {*} key
	 */
	_getObj(key) {
		for (const item of this._datas) {
			if (this.isEqual(item.key, key)) {
				return item;
			}
		}
	}

	has(key) {
		return this._getObj(key) !== undefined;
	}

	/**
	 * 判断两个数据是否相等
	 * @param {*} data1
	 * @param {*} data2
	 */
	isEqual(data1, data2) {
		if (data1 === 0 && data2 === 0) {
			return true;
		}
		return Object.is(data1, data2);
	}

	*[Symbol.iterator]() {
		for (const item of this._datas) {
			yield [item.key, item.value];
		}
	}

	forEach(callback) {
		for (const item of this._datas) {
			callback(item.value, item.key, this);
		}
	}
}
```

#### WeakSet 和 WeakMap

##### WeakSet

使用该集合，可以实现和 set 一样的功能，不同的是:

1. **它内部存储的对象地址不会影响垃圾回收**

```js
let obj = {
	name: 'yj',
	age: 18,
};
let obj2 = obj;
const weakSet = new WeakSet();
const set = new Set();
weakSet.add(obj);
set.add(obj);

obj = null;
obj2 = null;
console.log(weakSet); // WeakSet { <items unknown> }
console.log(set); // Set(1) { { name: 'yj', age: 18 } }
```

2. 只能添加对象
3. 不能遍历（不是可迭代的对象）、没有 size 属性、没有 forEach 方法

##### WeakMap

类似于 map 的集合，不同的是:

1. **它的键存储的地址不会影响垃圾回收**
2. 它的键只能是对象
3. 不能遍历（不是可迭代的对象）、没有 size 属性、没有 forEach 方法

### JavaScript 数组

#### [普通数组](#数组)

#### JavaScript 类型化数组

> 为了达到最大的灵活性和效率，JavaScript 类型化数组将实现拆分为**缓冲**和**视图**两部分。缓冲（由 [`ArrayBuffer`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 对象实现）描述的是一个数据分块。缓冲没有格式可言，并且不提供访问其内容的机制。为了访问在缓冲对象中包含的内存，你需要使用视图。视图提供了上下文——即数据类型、起始偏移量和元素数——将数据转换为实际有类型的数组。

##### ArrayBuffer

[`ArrayBuffer`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 是一种数据类型，用来表示一个通用的、固定长度的二进制数据缓冲区。你不能直接操作 ArrayBuffer 中的内容；你需要创建一个类型化数组的视图或一个描述缓冲数据格式的 [`DataView`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/DataView)，使用它们来读写缓冲区中的内容。

##### 类型化数组视图

类型化数组视图具有自描述性的名字和所有常用的数值类型像 `Int8`、`Uint32`、`Float64` 等等。

> 有一种特殊类型的数组 ==Uint8ClampedArray==。它仅操作 0 到 255 之间的数值。例如，这对于 [Canvas 数据处理](https://developer.mozilla.org/zh-CN/docs/Web/API/ImageData)非常有用。

| 类型                                                                                                                      | 值范围                                         | 字节数 | 描述                                                  | 对应的 Web IDL 类型   | 等效的 C 类型                   |
| :------------------------------------------------------------------------------------------------------------------------ | :--------------------------------------------- | :----- | :---------------------------------------------------- | :-------------------- | :------------------------------ |
| [`Int8Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Int8Array)                 | -128~127                                       | 1      | 8 位有符号整数（补码）                                | `byte`                | `int8_t`                        |
| [`Uint8Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)               | 0~255                                          | 1      | 8 位无符号整数                                        | `octet`               | `uint8_t`                       |
| [`Uint8ClampedArray`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray) | 0~255                                          | 1      | 8 位无符号整数（值会被裁剪）                          | `octet`               | `uint8_t`                       |
| [`Int16Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Int16Array)               | -32768~32767                                   | 2      | 16 位有符号整数（补码）                               | `short`               | `int16_t`                       |
| [`Uint16Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Uint16Array)             | 0~65535                                        | 2      | 16 位无符号整数                                       | `unsigned short`      | `uint16_t`                      |
| [`Int32Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Int32Array)               | -2147483648~2147483647                         | 4      | 32 位有符号整数（补码）                               | `long`                | `int32_t`                       |
| [`Uint32Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array)             | 0~4294967295                                   | 4      | 32 位无符号整数                                       | `unsigned long`       | `uint32_t`                      |
| [`Float32Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Float32Array)           | `-3.4E38`~`3.4E38` 以及 `1.2E-38`（最小正数）  | 4      | 32 位 IEEE 浮点数（7 位有效数字，例如 `1.123456`）    | `unrestricted float`  | `float`                         |
| [`Float64Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Float64Array)           | `-1.8E308`~`1.8E308` 以及 `5E-324`（最小正数） | 8      | 64 位 IEEE 浮点数（16 位有效数字，例如 `1.123...15`） | `unrestricted double` | `double`                        |
| [`BigInt64Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt64Array)         | -263~263 - 1                                   | 8      | 64 位有符号整数（补码）                               | `bigint`              | `int64_t (signed long long)`    |
| [`BigUint64Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigUint64Array)       | 0~264 - 1                                      | 8      | 64 位无符号整数                                       | `bigint`              | `uint64_t (unsigned long long)` |

##### DataView

[`DataView`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/DataView) 是一种底层接口，它提供有可以操作缓冲区中任意数据的访问器（getter/setter）API。这对操作不同类型数据的场景很有帮助，例如：类型化数组视图都是运行在本地字节序模式（参考[字节序](https://developer.mozilla.org/zh-CN/docs/Glossary/Endianness)），可以通过使用 `DataView` 来控制字节序。默认是大端字节序（Big-endian），但可以调用 getter/setter 方法改为小端字节序（Little-endian）。

### typeof

> [typeof 运算符 **返回一个字符串** , 表示操作数的类型](<(https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof)>)

| 类型                                                                                                                                                                                                                                                                                                                  | 结果                                                                                                                 |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------- |
| [Undefined](https://developer.mozilla.org/zh-CN/docs/Glossary/Undefined)                                                                                                                                                                                                                                              | `"undefined"`                                                                                                        |
| [Null](https://developer.mozilla.org/zh-CN/docs/Glossary/Null)                                                                                                                                                                                                                                                        | `"object"`（[原因](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof#typeof_null)） |
| [Boolean](https://developer.mozilla.org/zh-CN/docs/Glossary/Boolean)                                                                                                                                                                                                                                                  | `"boolean"`                                                                                                          |
| [Number](https://developer.mozilla.org/zh-CN/docs/Glossary/Number)                                                                                                                                                                                                                                                    | `"number"`                                                                                                           |
| [BigInt](https://developer.mozilla.org/zh-CN/docs/Glossary/BigInt)                                                                                                                                                                                                                                                    | `"bigint"`                                                                                                           |
| [String](https://developer.mozilla.org/zh-CN/docs/Glossary/String)                                                                                                                                                                                                                                                    | `"string"`                                                                                                           |
| [Symbol](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol)                                                                                                                                                                                                                     | `"symbol"`                                                                                                           |
| [Function](https://developer.mozilla.org/zh-CN/docs/Glossary/Function)（在 ECMA-262 中实现 [[Call]]；[classes](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/class)也是函数)                                                                                                           | `"function"`                                                                                                         |
| 其他任何对象                                                                                                                                                                                                                                                                                                          | `"object"`                                                                                                           |
| **注**: <br />在 JavaScript 最初的实现中，JavaScript 中的值是由一个表示类型的**标签**和**实际数据值**表示的。对象的类型标签是 0。由于 `null` 代表的是空指针（大多数平台下值为 0x00），因此，null 的类型标签是 0，`typeof null` 也因此返回 `"object"`。（[参考来源](https://www.2ality.com/2013/10/typeof-null.html)） |                                                                                                                      |

```js
console.log('typeof undefined ===>>>', typeof undefined); // undefined

console.log('typeof null ===>>>', typeof null); // object
// 在 JavaScript 最初的实现中，JavaScript 中的值是由一个表示类型的标签和实际数据值表示的。对象的类型标签是 0。由于 null 代表的是空指针（大多数平台下值为 0x00），因此，null 的类型标签是 0，typeof null 也因此返回 "object"。

console.log('typeof NAN ===>>>', typeof NAN); // undefined
console.log('typeof Function ===>>>', typeof Function); // function
console.log('typeof Object ===>>>', typeof Object); // function
console.log('typeof {} ===>>>', typeof {}); // object

console.log('Function instanceof Object ===>>>', Function instanceof Object); // true
console.log('Object instanceof Function ===>>>', Object instanceof Function); // true

/**
 * 当使用数学式或其他 比较方法 <  >  <=  >=  (比较不包含 == 和 === )时: 
null/undefined 会被转化为数字: 
null 被转化为 0, 
undefined 被转化为 NaN。
 */
console.log('42 > undefine ===>>>', 42 > undefined);
// false
console.log('42 < undefine ===>>>', 42 < undefined);
// false
console.log('42 > null ===>>>', 42 > null);
// true
console.log('42 < null ===>>>', 42 < null);
// false

console.log('null > 0 ===>>>', null > 0); // (1) false
console.log('null == 0 ===>>>', null == 0); // (2) false
console.log('null >= 0 ===>>>', null >= 0); // (3) true

console.log('undefined > 0 ===>>>', undefined > 0); // false (1)
console.log('undefined < 0 ===>>>', undefined < 0); // false (2)
console.log('undefined == 0 ===>>>', undefined == 0); // false (3)

console.log('null == undefined ===>>>', null == undefined); // true
console.log('null === undefined ===>>>', null === undefined); // false
```

## 数字的存储

**在对精度要求很高的系统中，或要对小数的运算结果进行比较时，需要特别谨慎**

### 问题

1. JS 中的小数运算是精确的吗？

不一定

2. JS 中的整数运算是精确的吗？

不一定

3. JS 中表示的整数是连续的吗？

不是，当 JS 的数字很大的时候，不再连续。

4. JS 中表示的最大数字是多少？

最大连续整数: 9007199254740991

5. JS 中能表示的数字的有效位数是多少？

16 ~ 17

### 二进制

现实世界中: 十进制，10 个数字，逢十进一

计算机世界中: 二进制，2 个数字，逢二进一

二进制 -> 十进制

1101 -> $1*2^3 + 1*2^2 + 0*2^1 + 1*2^0 = 13$

11.01 -> $1*2^1 + 1*2^0 + 0*2^{-1} + 1*2^{-2} = 3.25$

十进制 -> 二进制

13 -> 1101

```
13 / 2  商 6    余  1
6  / 2  商 3    余  0
3  / 2  商 1    余  1
1  / 2  商 0    余  1
余数从下往上看
```

3.25 -> 11.01

整数部分一样

小数部分

```
0.25 * 2    0.5     整数部分: 0
0.5  * 2    1.0     整数部分: 1
整数部分从上往下看
```

### 为什么 JS 的小数运算不精确

十进制的小数，转换为二进制后，可能是无限小数，但是计算机对数字的存储能力有限，因此会丢失一些数据。

十进制数 0.3 -> 0.010011001100110011001.....

```
0.3*2   0.6     0
0.6*2   1.2     1
0.2*2   0.4     0
0.4*2   0.8     0
0.8*2   1.6     1
0.6*2   1.2     1
0.2*2   0.4     0
......
整数部分从上往下看
```

### JS 如何存储数字

整数法、浮点法

JS 中，存储的所有数字，都按照**浮点法**存放。

浮点法存放的数字，叫做浮点数（float），浮点数分为单精度和双精度。

浮点数表示法可以用于表示整数和小数，目前分为两种标准：

-   32 位浮点数：又称为单精度浮点数，它用 1 位表示符号，8 位表示阶码，23 位表示尾数

-   64 位浮点数：又称为双精度浮点数，它用 1 位表示符号，11 位表示阶码，52 位表示尾数

JS 中 使用 **双精度存放浮点数 IEEE 754**。

**==存放方式==**

JS 在计算机中，给每个数字开辟一块内存空间，尺寸固定为 64 位

> 在计算机中，位（bit）是最小的存储单位，简称为 bit
> 1 byte = 8 bit
> 1 KB = 1024 byte
> 1 MB = 1024 KB
> 1 GB = 1024 MB

\[第 1 段] \[第 2 段] [第 3 段]

第 1 段: 1 位，表示符号位，如果为 1，是负数，如果为 0，是正数
第 2 段: 11 位，表示指数位，这里的指数是 2 为底的指数，而不是 10
第 3 段: 52 位，表示有效数字

举例

```
0     1000 0000 011    1111 0000 0000 0000....
```

相当于: $1.1111 \* 2 ^ {1027 - 1023} $

**特殊情况**

1. 指数为 0，尾数为 0，表示数字 0
2. 符号为 0，指数为 2047，尾数为 0，表示正无穷

```
Infinity: 0 11111111111 00000000000...
```

3. 符号为 1，指数为 2047，尾数为 0，表示负无穷

```
-Infinity: 1 11111111111 00000000000...
```

4. 指数为 2047，尾数不为 0，表示 NaN

```
NaN: 1 11111111111 01001010000...
```

**一个正常的数字，指数部分最多是 2046**

### 能表示的最大数字

```
0 11111111110 1111111111.........
```

相当于: $1.1111111111... \* 2 ^ 1023 $

### 能表示的最大的安全整数

安全数字: 从 1 开始到该数字，均是连续的整数，并且该数字的下一个整数是存在的。

```
0 xxxxx 1111111111....
```

相当于: $2^53 - 1$

下一位: $2^53$ `0  xxxxx  0000000000000`

## 变量

### 什么是变量

变量是一块内存空间，用于保存数据

> 计算机: CPU、内存、硬盘、输入输出设备
> 内存: 存取速度快，数据易丢失
> 硬盘: 存取速度慢，数据永久保存
> 计算机程序的运行，仅与内存打交道

### 如何使用变量

1. 声明（定义）变量

```js
var 变量名;
let 变量名;
const 变量名;
```

**var 变量声明后，它的值为 undefined**

2. 给变量赋值

向变量的内存空间中存放数据

-   变量的值是可变的

变量可以被重新赋值，新的值会覆盖原来的值

-   变量的名称

    > 在开发中，凡是需要自行命名的位置，叫做标识符

    -   标识符的规范:

        1. [必]只能以英文字母、下划线、$开头
        2. [必]其他位置可以出现数字、英文字母、下划线、$
        3. [必]不可以与关键字、保留词重复
        4. [选]标识符应该做到望文知义
        5. [选]如果有多个单词，使用驼峰命名法，单词首字母大写

        > 大驼峰: 每个单词首字母大写
        > 小驼峰: 除第一个单词外，首字母大写
        > 目前，使用的标识符都是小驼峰命名法。

        > 宽度: width，高度: height，区域: area

-   声明和赋值合并

    变量的声明和赋值可以一条语句书写。

    这是语法糖。

    语法糖仅仅是为了方便代码书写或记忆，并不会有实质性的改变。

-   多个变量可以合并声明并赋值

-   **任何可以书写数据的地方，都可以书写变量**

-   若使用一个未声明的变量，会导致错误

    **例外**: 使用 typeof 得到类型时，可以是未声明的变量，得到的结果是 undefined

-   **JS 中存在变量提升**

    ==所有变量的声明，会自动的提到代码块的最顶部==

    但是，这种提升，不会超越脚本块。

-   JS 中允许定义多个同名变量

    同名变量，提升后会变成一个。

### let, const 声明的实现原理

[参考](https://juejin.cn/post/6968848594459688967)

-   `var` 和 `let` 用以声明变量

    -   **var** 声明的变量, `变量提升`,不存在块级作用域
        > 即变量可以在声明之前使用, 值为 undefined。按正常逻辑, 变量应该在声明语句之后才可以使用

-   `const` 用于声明只读的常量

    -   let 和 const 声明的 只在它所在的代码块内有效（块级作用域）；

    -   let 和 const 不存在像 **变量提升** 现象, ==不会污染全局==

        > 所以 var 定义变量可以先使用, 后声明, 而 let 和 const 只可先声明, 后使用；

    -   let 不允许在相同作用域内, 重复声明同一个变量；

    -   let 声明的变量存在 **==暂时性死区==**

        -   变量具有 **==块级作用域==** ，在代码块之外不可使用
            > 用一对花括号（一个[代码块](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/block)）创建出来的作用域
            >
            > **即只要块级作用域中存在 let, 那么它所声明的变量就绑定了这个区域, 不再受外部的影响。**

        #### [暂时性死区](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/let#暂时性死区)

        > _~~let 存在变量提升，但是与 var 不同的是，var 的变量提升的同时会默认赋值为 undefined. 而 **let 仅仅发生了提升而已** ，并不会赋任何值给变量~~_，在显式赋值之前，==任何对变量的读写== 都会导致 ReferenceError 的报错。从代码块(block)起始到变量求值(包括赋值)以前的这块区域，称为该变量的暂时性死区。

        从 ==代码块的开始== 到 ==代码执行到声明变量（赋值）的行== 之前，**`let` 或 `const`** 声明的变量都处于 ==“暂时性死区”（Temporal dead zone，TDZ）== 中。

        <img src="./img/暂时性死区.png" alt=" 暂时性死区" style="zoom:50%;" />

        > 当变量处于暂时性死区之中时，**其尚未被初始化，尝试访问变量将抛出 [`ReferenceError`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError)**。当代码执行到声明变量所在的行时，变量被初始化为一个值。如果声明中未指定初始值，则变量将被初始化为 `undefined`。

        **在 let/const 变量被赋值(LexicalBinding)以前是不可以读写的。**

        > 与 [`var`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/var) 声明的变量不同，如果在声明前访问了变量，变量将会返回 `undefined`。以下代码演示了在使用 `let` 和 `var` 声明变量的行之前访问变量的不同结果。

        ```js
        {
        	// TDZ starts at beginning of scope
        	console.log(bar); // undefined
        	console.log(foo); // ReferenceError
        	var bar = 1;
        	let foo = 2; // End of TDZ (for foo)
        }
        ```

        使用术语“temporal”是因为区域取决于**==执行顺序==**（时间），而不是编写代码的顺序（位置）。

        例如，

        > 下面的代码会生效，是因为即使使用 `let` 变量的函数出现在变量声明之前，但函数的执行是在暂时性死区的外面。

        ```js
        {
        	// TDZ 作用域开始
        	const func = () => console.log(letVar); // OK

        	// Within the TDZ letVar access throws `ReferenceError`

        	let letVar = 3; // TDZ 结束（对于 letVar）
        	func(); // 在 TDZ 外调用！
        }
        // 输出 3
        ```

        注意，

        > 在 for 循环中使用 let 定义变量，变量所在的作用域是循环体，因此在循环外不能使用。另外，for 循环会对该变量做特殊处理，让每次循环使用的都是一个独立的循环变量，这可以解决 JS 由来已久的问题。

        ```js
        // 问题
        for(var i = 0; i < 3; i++){
            setTimeout(function(){
            console.log(i)
            }, 1000)
        }
        // 输出:  3 3 3

        // 过去的解决办法:  IIFE
        for(var i = 0; i < 3; i++){
            (function(i){
            setTimeout(function(){
                console.log(i)
            }, 1000)
            })(i)
        }
        // 输出:  0 1 2

        // 现在的做法
        for(let i = 0; i < 3; i++){
            setTimeout(function(){
            console.log(i)
            }, 1000)
        }
        // 输出:  0 1 2

        var tmp = 123
        if(true) {
            tmp = '123'
            let tmp
        }
        err: Uncaught ReferenceError: Cannot access 'tmp' before initializationat <anonymous>:4:9
        ```

    -   const 在声明时必须初始化赋值, 一旦声明, 其声明的值就不允许改变, 更不允许重复声明；

        > const 实际上保证的并不是变量的值不得改动, 而是变量指向的那个内存地址所保存的数据不得变动。

-   注意:

    -   对于简单类型数据,

        > 值就保存在变量指向的那个内存地址。

    -   对于引用类型,

        > 变量指向的内存地址, 保存的只是一个指向数据的指针, const 只能保证这个指针是固定的, 至于它指向的数据结构是不是可变的, 就控制不了了。

    例子:

    ```js
    const foo = {};
    // 为 foo 添加一个属性, 可以成功
    foo.prop = 123;
    foo.prop; // 123
    
    // 将 foo 指向另一个对象, 就会报错
    foo = {}; // TypeError: "foo" is read-only
    ```

然后是原理,(纯属个人愚见, 高手轻喷) :
变量与内存之间的关系, 主要由三个部分组成:

-   变量名

-   内存地址

-   内存空间

> JS 引擎在读取变量时, 先找到变量绑定的内存地址, 然后找到地址所指向的内存空间, 最后读取其中的内容。
> 当变量改变时, JS 引擎不会用新值覆盖之前旧值的内存空间 (虽然从写代码的角度来看, 确实像是被覆盖掉了) ,
> 而是重新分配一个新的内存空间来存储新值, 并将新的内存地址与变量进行绑定, JS 引擎会在合适的时机进行 GC, 回收旧的内存空间。

const 定义变量 (常量) 后, 变量名与内存地址之间建立了一种不可变的绑定关系, 阻隔变量地址被改变, 当 const 定义的变量进行重新赋值时, 根据前面的论述,
JS 引擎会尝试重新分配新的内存空间, 所以会被拒绝, 便会抛出异常。

-   **[作用域](#数据的作用域)**

    > 作用域是指在程序中定义变量的区域, 该位置决定了变量的生命周期。通俗的讲就是变量与函数的可访问范围, 即作用域控制着变量和函数的可见性和声明周期
    > 在 ES6 之前, 只有两种作用域:全局作用域和函数作用域

    -   没有块级作用域会导致很多问题:

        -   变量覆盖
        -   命名冲突
        -   变量提升
        -   内存泄漏

    -   块级作用域:

        > ES6 的块级作用域必须有大括号, 如果没有大括号, JavaScript 引擎就认为不存在块级作用域。

        ```js
        // 第一种写法, 报错
        if (true) let x = 1;
        
        // 第二种写法, 不报错
        if (true) {
            let x = 1;
        }
        ```

我们需要站在 **[执行上下文](#执行上下文)** 的角度来揭晓答案。
例子:

```js
function foo() {
	var a = 1;
	let b = 2;
	{
		let b = 3;
		var c = 4;
		let d = 5;
		console.log(a);
		console.log(b);
	}
	console.log(b);
	console.log(c);
	console.log(d);
}
foo();
// ReferenceError: d is not defined
```

## 数据的存储和传递

-   原始类型

    > **原始类型的变量，存放的具体的值**

-   引用类型（对象、函数）

    > **引用类型的变量，存放的是内存地址**

**凡是出现对象字面量的位置，都一定在内存出现一个新的对象**

-   **扩展知识**:

> JS 中的垃圾回收
> 垃圾回收器，会定期的发现内存中无法访问到的对象，该对象称之为垃圾，垃圾回收器会在合适的时间将其占用的内存释放。

> **面试题**:

-   1
    ```js
    // 下面代码输出什么？
    var foo = {
    	n: 0,
    	k: {
    		n: 0,
    	},
    };
    var bar = foo.k;
    bar.n++;
    bar = {
    	n: 10,
    };
    bar = foo;
    bar.n++;
    bar = foo.n;
    bar++;
    console.log(foo.n, foo.k.n);
    ```
-   2

    ```js
    // 下面的代码输出什么（京东）？
    var foo = {
    	n: 1,
    };

    var arr = [foo];

    function method1(arr) {
    	var bar = arr[0];
    	arr.push(bar);
    	bar.n++;
    	arr = [bar];
    	arr.push(bar);
    	arr[1].n++;
    }
    function method2(foo) {
    	foo.n++;
    }
    function method3(n) {
    	n++;
    }
    method1(arr);
    method2(foo);
    method3(foo.n);

    console.log(foo.n, arr.length);
    ```

-   3
    ```js
    // 下面的代码输出什么（字节）？
    var foo = { bar: 1 };
    var arr1 = [1, 2, foo];
    var arr2 = arr1.slice(1);
    arr2[0]++;
    arr2[1].bar++;
    foo.bar++;
    arr1[2].bar++;
    console.log(arr1[1] === arr2[0]); // false
    console.log(arr1[2] === arr2[1]); // true
    console.log(foo.bar); // 4
    ```
-   4
    ```js
    var x = 10;
    function fn() {
    	console.log(x);
    }
    function show(fn) {
    	var x = 20;
    	fn();
    }
    show(fn);
    // 10
    ```

## 数据的运算

### 运算符

#### 算术（数学）运算

支持: 加(+)、减(-)、乘(\*)、除(/)、求余(%)

值得注意的是, + 和 - 可以放到单个数据的前面, 表示正负。

算术运算的表达式一定返回数字, 可以利用其特点做类型转换, 参考[类型的隐式转换](#类型的隐式转换)

#### 自增自减表达式

一元运算符

++: 将某个变量的值自增 1

--: 将某个变量的值自减 1

-   细节:
    x++: 将变量 x 自增 1，得到的表达式的值是自增之前的值。
    ++x: 将变量 x 自增 1，得到的表达式的值是自增之后的值。
    x--: 将变量 x 自减 1，得到的表达式的值是自减之前的值。
    --x: 将变量 x 自减 1，得到的表达式的值是自减之后的值。

```js
var x = 0;
//输出表达式x++的返回值？
console.log(x--); // 0
console.log(x); // -1
```

#### 字符串拼接

当`+`的两端有一个是字符串时, 不再进行算术运算, 而变为字符串拼接

表达式一定返回 string, 可以利用其特点做类型转换, 参考[类型的隐式转换](#类型的隐式转换)

#### 赋值运算

涉及的运算符: `=` `+=` `*=` `/=` `-=` `%=`。

其中, `a += xxx`, 等效于`a = a + (xxx)`, 其他类似

-   小贴士
    > 赋值表达式始终返回赋值结果, 我们可以利用该特点完成连续赋值
    ```js
    // 将 3 同时赋值给 a、b
    a = b = 3;
    ```

#### 比较运算

大小比较: `>` `<` `>=` `<=`
相等比较: `==` `!=` `===` `!==`

**比较运算符的返回类型: boolean**

**算术运算符的优先级高于比较运算符**

-   **细节**

    1. 两个字符串比较大小，比较的是字符串的字符编码。

    2. 如果一个不是字符串，并且两个都是原始类型，将它们都转换为数字进行比较

        > '1' 转换为 1
        > '' 转换为 0
        > ' ' 转换为 0
        > ' a' 转换为 NaN
        > '3.14' 转换为 3.14

        NaN 与任何数字比较，得到的结果都是 false

        Infinity 比任何数字都大

        -Infinity 比任何数字都小

    3. 如果其中一个是对象，将对象转换为原始类型然后，按照规则 1 或规则 2 进行比较

    目前，对象转换为原始类型后，是字符串 "[object Object]"

-   **相等比较**

    -   == 和 != (相等比较 和 不相等比较)

        > ==: 比较两个数据是否相等
        > !=: 比较两个数据是否不相等

        **细节**

        -   两端的类型相同，直接比较两个数据本身是否相同（**两个对象比较的地址**）

        -   两端的类型不同:

            -   null 和 undefined， 它们之间相等， 和其他原始类型比较， 则不相等。

            -   其他原始类型，比较时**先转换为数字**，再进行比较

            -   **NaN 与任何数字比较，都是 false，包括自身**

            -   Infinity 和-Infinity，自能和自身相等

            -   对象比较时，要先转换为原始类型后，再进行比较

    **由于相等和不相等比较，对于不同类型的数据比较违反直觉，因此，通常我们不适用这种比较方式，而是使用更加接近直觉的严格相等和严格不相等比较**

    -   === 和 !== （严格相等 和 严格不相等）

        > === : 两端的数据和类型必须相同
        > !== : 两端的数据或类型不相同

        -   两端类型相同，规则和相等比较一致。
        -   两端类型不同，为 false。

        数字规则:

        -   NaN 与任何数字比较，都是 false，包括自身

        -   Infinity 和-Infinity，自能和自身相等

-   小贴士

    > 在实际开发中, 没有任何理由使用`==`和`!=`, 你可以当做这两个运算符并不存在。
    > 应该始终使用`===`和`!==`来比较相等和不相等

    ```js
    // 啰嗦的代码
    if (sex === '男') {
    	user.isMale = true;
    } else {
    	user.isMale = false;
    }
    
    // 简洁优雅的代码
    user.isMale = sex === '男';
    ```

#### 逻辑运算

逻辑运算会涉及到[布尔判定](#布尔判定)

-   运算符: **`!`**

    对后面的数据取反, 表达式一定返回 boolean。

    可以利用其特点做类型转换, 参考[类型的隐式转换](#类型的隐式转换)

-   运算符: **`&&`**

    并且, 真真为真, 其他为假, 具有短路规则。

    表达式返回**最后一个判定的数据**

    -   小贴士

        > 在实际的开发中, 我们可以利用短路规则简化代码

        ```js
        // 实现功能, 如果exp有值（判定为真）, 就输出 ok
        // 啰嗦的代码
        if (exp) {
        	console.log(exp);
        }
        
        // 简洁的代码
        exp && console.log(exp);
        ```

-   运算符: **`||`**

    > 或者, 假假为假, 其他为真, 具有短路规则。

    表达式返回**最后一个判定的数据**

    -   小贴士

        > 在实际的开发中, 我们可以利用短路规则简化代码

        ```js
        // 实现功能, 如果exp有值, 就把它的值赋值给n, 如果没有值, 就给n赋值为默认值 1
        // 啰嗦的代码
        if (exp) {
        	n = exp;
        } else {
        	n = 1;
        }
        
        // 简洁的代码
        n = exp || 1;
        ```

-   运算符: **`? :`**, 格式`a ? b : c`

    > 三目运算, 判定 a, 为真时表达式返回 b, 否则返回 c

    -   小贴士

        > 三目运算通常用于替代一些简单的 if 结构

        ```js
        // 如果exp为真, 则把1赋值给n, 否则, 把2赋值给n
        // 啰嗦的代码
        if (exp) {
        	n = 1;
        } else {
        	n = 2;
        }
        
        // 更简洁的代码
        n = exp ? 1 : 2;
        ```

### 布尔判定

所有需要判断真假的地方都会使用下面的规则

| 数据                                      | 判定  |
| ----------------------------------------- | ----- |
| `false` `null` `undefined` `0` `NaN` `''` | false |
| 剩余所有数据                              | true  |

### 类型的隐式转换

每个运算符都有自己期望的数据, 比如`*`期望两端都是数字

一旦数据不符合运算符的期望, js 就会悄悄的对数据进行类型转换, 把它转换成期望的值后进行运算。

值得注意的是, 这种转换是 _临时_ 的, 并不会对原数据造成影响

> 小贴士
> 在实际的开发中, 我们可以利用类型的隐式转换完成以下功能:

```js
var n = +a; // 不管a是啥, 都会被转换成数字, 保存到n中
var s = a + ''; // 不管a是啥, 都会被转换成字符串, 保存到s中
var b = !!a; // 不管a是啥, 都会被转换成boolean, 保存到b中
```

### 位运算

将一个整数的二进制格式进行运算

js 中，如果对一个数据进行位运算，它首先会将其转换为一个整数，并且按照 32 位的整数二进制排列

举例

```
2.7 -> 2 -> 0000 0000 0000 0000 0000 0000 0000 0010

NaN -> 0

Infinity -> 0

-Infinity -> 0
```

#### 与运算

符号: &

写法: 整数 1 & 整数 2

将两个整数每一位进行比较，如果都为 1，结果为 1，否则结果为 0.

#### 或运算

符号: |

写法: 整数 1 | 整数 2

将两个整数每一位进行比较，如果都为 0，结果为 0，否则结果为 1.

#### 否（非）运算

符号: ~

写法: ~整数

将该整数按位取反

**负数的存储方式**

-1

真码: 1000 0000 0000 0000 0000 0000 0000 0001
反码: 1111 1111 1111 1111 1111 1111 1111 1110 真码取反
补码: 1111 1111 1111 1111 1111 1111 1111 1111 反码加 1 最终的存储方案

取反的快速运算: -数字 - 1

JS 中最快速的取整的方式: `~~整数`

#### 异或运算

符号: ^

写法: 数字 1 ^ 数字 2

将数字 1 和数字 2 按位比较，不同取 1，相同取 0

#### 应用场景

位的叠加（开关）

#### 位移运算

左位移: <<

写法: 数字 1 << 数字 2 结果: 数字 1 \* 2 ^ 数字 2

将数字 1 的二进制（除符号之外，左移动数字 2 的次数）

右位移: >>

写法: 数字 1 >> 数字 2 结果: 整数(数字 1 / 2 ^ 数字 2)

全右位移: >>>

与右位移的区别，在于全右位移会导致符号位跟着位移。

## 循环

重复的运行一段代码

JS 支持 3 种循环结构: while 循环、do-while 循环、for 循环

### while 循环

```js
while(条件){
    代码块（循环体）
}
```

```mermaid
graph TD

st((开始))-->条件{条件}
条件--true-->代码块
代码块-->条件
条件--false-->ed((结束))
```

死循环: 条件永远满足，永远无法退出循环。

### do-while 循环

```js
do {
	循环体;
} while (条件);
```

```mermaid
graph TD

st((开始))-->代码块
代码块-->条件{条件}
条件--true-->代码块
条件--false-->ed((结束))
```

### for 循环

```js
for (初始化表达式; 条件; 条件改变表达式) {
	循环体;
}
```

```mermaid
graph TD

st((开始))-->初始化表达式
初始化表达式-->条件{条件}
条件--true-->循环体
循环体-->条件改变表达式
条件改变表达式-->条件
条件--false-->ed((结束))
```

#### for...in

> **for...in** 语句以 **任意顺序** 迭代一个对象的除 [Symbol](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol) 以外的 [可枚举](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Enumerability_and_ownership_of_properties) 属性，包括继承(**原型链**)的可枚举属性。

-   [为什么用 for ... in?](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...in#为什么用_for_..._in)

**for ... in** 是为遍历对象属性而构建的，不建议与数组一起使用，数组可以用 **Array.prototype.forEach()** 和 **for ... of** ，那么 **for ... in** 的到底有什么用呢？

> 它最常用的地方应该是用于调试，可以 **更方便的去检查对象属性**（通过输出到控制台或其他方式）。尽管对于处理存储数据，数组更实用些，但是你在处理有`key-value`数据（比如属性用作“键”），需要检查其中的任何键是否为某值的情况时，还是推荐用 `for ... in`。

#### for...of

> **for...of** 语句在 [可迭代对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols)（包括 [`Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)，[`Map`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map)，[`Set`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set)，[`String`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String)，[`TypedArray`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)，[arguments](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/arguments) 对象等等）上创建一个迭代循环，调用自定义迭代钩子，并为每个不同属性的值执行语句

##### for...of 与 for...in 的区别

> 无论是`for...in`还是`for...of`语句都是迭代一些东西。它们之间的主要区别在于它们的迭代方式。

-   [**for...in**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...in) 　语句以 **==任意顺序==** 迭代对象的 [**可枚举属性**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Enumerability_and_ownership_of_properties)。(==包括原型链==)

-   **for...of** 　语句遍历 [**可迭代对象**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Iterators_and_generators#可迭代对象) 定义要迭代的数据。

以下示例显示了与[`Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)一起使用时，`for...of`循环和`for...in`循环之间的区别。

```js
Object.prototype.objCustom = function () {};
Array.prototype.arrCustom = function () {};

let iterable = [3, 5, 7];
iterable.foo = 'hello';

for (let i in iterable) {
	console.log(i); // logs 0, 1, 2, "foo", "arrCustom", "objCustom"
}

for (let i in iterable) {
	if (iterable.hasOwnProperty(i)) {
		console.log(i); // logs 0, 1, 2, "foo"
	}
}

for (let i of iterable) {
	console.log(i); // logs 3, 5, 7
}
```

```js
Object.prototype.objCustom = function () {};
Array.prototype.arrCustom = function () {};

let iterable = [3, 5, 7];
iterable.foo = 'hello';
```

每个对象将继承`objCustom`属性，并且作为[`Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)的每个对象将继承`arrCustom`属性，因为将这些属性添加到[`Object.prototype` (en-US)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)和`Array.prototype`。由于[继承和原型链](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)，对象`iterable`继承属性`objCustom`和`arrCustom`。

```js
for (let i in iterable) {
	console.log(i); // logs 0, 1, 2, "foo", "arrCustom", "objCustom"
}
```

此循环仅以原始插入顺序记录`iterable` 对象的[可枚举属性](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Enumerability_and_ownership_of_properties)。它不记录数组**元素** `3`, `5`, `7` 或`hello`，因为这些**不是**枚举属性。但是它记录了数组**索引**以及`arrCustom`和`objCustom`。如果你不知道为什么这些属性被迭代，[`array iteration and for...in`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...in#array_iteration_and_for...in)中有更多解释。

```js
for (let i in iterable) {
	if (iterable.hasOwnProperty(i)) {
		console.log(i); // logs 0, 1, 2, "foo"
	}
}
```

这个循环类似于第一个，但是它使用[`hasOwnProperty()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty) 来检查，如果找到的枚举属性是对象自己的（不是继承的）。如果是，该属性被记录。记录的属性是`0`, `1`, `2`和`foo`，因为它们是自身的属性（**不是继承的**）。属性`arrCustom`和`objCustom`不会被记录，因为它们**是继承的**。

```js
for (let i of iterable) {
	console.log(i); // logs 3, 5, 7
}
```

该循环迭代并记录`iterable`作为[可迭代对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Iterators_and_generators#可迭代对象)定义的迭代值，这些是数组元素 `3`, `5`, `7`，而不是任何对象的**属性**。

### 循环中的关键字

循环控制语句

-   break; 跳出循环
-   continue; 停止当前循环体，进入下一次循环。

## 函数

使用函数切割流程, 不仅可以减少重复代码、还可以有效的降低整体复杂度

<img src="./img/函数的作用1.png" alt="函数的作用" style="zoom:50%;" />

### 函数三要素

<img src="./img/函数的作用2.png" alt="函数的作用2.png" style="zoom: 67%;" />

-   参数:

    > 表示完成流程所需的**必要信息**

-   返回值:

    > 表示完成流程后**产生的结果**

-   函数体:
    > 表示具体的流程

**函数的参数、返回值只取决于函数的作用, 与函数体无关**

**始终记住以下两点**:

1. 定义函数时, 只需要考虑这个函数如何实现即可, 完全不需要考虑其他无关的东西。
2. 调用函数时, 只需要考虑向其传递什么参数, 如何使用它的返回结果, 完全无需考虑函数的具体实现。

函数具有**三要素**: 函数名、参数、返回值

只要具备三要素, 就能书写函数体；只要具备三要素, 就能完成函数调用。

### new.target

> [new.target](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new.target) 属性允许你检测函数或构造方法是否是通过 [new](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new) 运算符被调用的。

#### 返回值

-   在通过[new](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new)运算符被初始化的函数或构造方法中，`new.target`返回一个**指向** **==构造方法或函数的引用==**。
-   在普通的函数调用中，`new.target` 的值是[`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)。

`new.target`语法由一个关键字"`new`"，一个点，和一个属性名"`target`"组成。

> 通常"`new.`"`的`作用是提供属性访问的上下文，但这里"`new.`"其实不是一个真正的对象。不过在构造方法调用中，`new.target`指向被`new`调用的构造函数，所以"`new.`"成为了一个虚拟上下文。

`new.target`属性适用于所有函数访问的元属性。在 [arrow functions](http://www.javascripttutorial.net/es6/javascript-arrow-function/) 中，`new.target` 指向最近的**外层函数**的`new.target`

#### 函数调用中

在普通的函数调用中（和作为构造函数来调用相对），`new.target`的值是[`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)。这使得你可以检测一个函数是否是作为构造函数通过[new](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new)被调用的。

```js
function Person(firstName, lastName) {
	//判断是否是使用new的方式来调用的函数
	// //过去的判断方式
	// if (!(this instanceof Person)) {
	//     throw new Error("该函数没有使用new来调用")
	// }
	if (new.target === undefined) {
		throw new Error('该函数没有使用new来调用');
	}
	this.firstName = firstName;
	this.lastName = lastName;
	this.fullName = `${firstName} ${lastName}`;
}

const p1 = new Person('袁', '进');
console.log(p1);

const p2 = Person('袁', '进');
console.log(p2);

const p3 = Person.call(p1, '袁', '进');
console.log(p3);
```

#### 构造方法中

在类的构造方法中，`new.target`指向直接被`new`执行的**构造函数**。并且当一个父类构造方法在子类构造方法中被调用时，情况与之相同。

```js
class A {
	constructor() {
		console.log(new.target.name);
	}
}
class B extends A {
	constructor() {
		super();
	}
}
var a = new A(); // logs "A"
var b = new B(); // logs "B"

class C {
	constructor() {
		console.log(new.target);
	}
}
class D extends C {
	constructor() {
		super();
	}
}
var c = new C(); // logs class C{constructor(){console.log(new.target);}}
var d = new D(); // logs class D extends C{constructor(){super();}}
```

从上面类 C 和 D 的例子可以看出来，new.target 指向的是初始化类的类定义。比如当 D 通过 new 初始化的时候，打印出了 D 的类定义，C 的例子与之类似，打印出的是 C 的类定义。

### 箭头函数

**[箭头函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions) 表达式**的语法比 [函数表达式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/function) 更简洁，并且没有自己的 [`this`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this)，[`arguments`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/arguments)，[`super`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/super)或[`new.target`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new.target)。

箭头函数表达式更适用于那些本来需要匿名函数的地方，并且它不能用作构造函数。

```js
// 箭头函数语法:
(param1, param2, …, paramN) => { statements }
(param1, param2, …, paramN) => expression
//相当于:  (param1, param2, …, paramN) =>{ return expression; }

// 当只有一个参数时，圆括号是可选的:
(singleParam) => { statements }
singleParam => { statements }

// 没有参数的函数应该写成一对圆括号。
() => { statements }

```

箭头函数有以下特点:

1. **==不能使用 new 调用==**

2. **==没有原型，即没有 prototype 属性==** **有隐式原型 \_\_proto\_\_**

3. **==没有 arugments==**

4. **==没有 [this](#this)==**

    > 有些教程中会说: 箭头函数的`this`永远指向箭头函数定义位置的`this`，因为箭头函数会绑定`this`。
    >
    > 这个说法没错，根本原因是它没有`this`，它里面的`this`使用的是外层的`this`

    ```js
    const counter = {
    	count: 0,
    	start: function () {
    		// 这里的 this 指向 counter
    		setInterval(() => {
    			// 这里的 this 实际上是 start 函数的 this
    			this.count++;
    		}, 1000);
    	},
    };
    ```

箭头函数的这些特点，都足以说明: **==箭头函数特别适用于那些临时需要函数的位置==**

-   **与以前对比**

```js
const obj = {
	count: 0,
	start: function () {
		setInterval(function () {
			// this ---> window
			console.log('start this:', this);
			this.count++;
		}, 1000);
	},
	regEvent: function () {
		window.onclick = function () {
			// this ---> window
			console.log('regEvent this:', this);
		};
	},
	print: function () {
		// this ---> obj
		console.log('print this:', this);
	},
};

obj.start();
obj.regEvent();
obj.print();
```

### 剩余参数

> [**剩余参数**语法允许我们将一个不定数量的参数表示为一个数组。](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/rest_parameters)

ES6 不建议再使用`arguments`来获取参数列表，它推荐使用剩余参数来收集未知数量的参数

**==剩余参数只能声明为最后一个参数==**

#### 和 arguments 的区别

剩余参数和 [`arguments`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/arguments)对象之间的区别主要有三个:

-   剩余参数只包含那些没有对应形参的实参，而 `arguments` 对象包含了传给函数的所有实参。

-   `arguments`对象不是一个真正的数组，而剩余参数是真正的 [`Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)实例，也就是说你能够在它上面直接使用所有的数组方法，比如 [`sort`](https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Global_Objects/Array/sort)，[`map`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map)，[`forEach`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)或[`pop`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/pop)。

-   `arguments`对象还有一些附加的属性（如`callee`属性）。

```js
// ...args为剩余参数
function method(a, b, ...args) {
	console.log(a, b, args);
}

method(1, 2, 3, 4, 5, 6, 7); // 1 2 [3, 4, 5, 6, 7]
method(1, 2); // 1 2 []
```

### 参数默认值

ES6 提供了参数默认值，当参数没有传递或传递为`undefined`时，会使用默认值

> 在书写形参时，直接给形参赋值（**字面量或者表达式均可**），附的值即为默认值

-   只要给函数加上参数默认值，该函数会自动变 **严格模式下** 的规则: **arguments 和形参脱离**

    ```js
    function test(a, b = 1) {
    	console.log('arugments', arguments[0], arguments[1]); // arugments 1 undefined
    	console.log('a:', a, 'b:', b); // a: 1 b: 1
    	a = 3;
    	console.log('arugments', arguments[0], arguments[1]); // arugments 1 undefined
    	console.log('a:', a, 'b:', b); // a: 3 b: 1
    }
    test(1);
    ```

-   形参和 ES6 中的 let 或 const 声明一样，具有作用域，并且根据参数的声明顺序，存在暂时性死区。

    ```js
    function test(a = b, b) {
    	console.log(a, b);
    }
    
    test(undefined, 2); // ReferenceError: Cannot access 'b' before initialization
    ```

### 函数柯里化

函数柯里化以 Haskell Brooks Curry 命名，**柯里化**是指将一个函数分解为一系列函数的过程，每个函数都只接收**一个参数**。（译注: 这些函数不会立即求值，而是通过闭包的方式把传入的参数保存起来，直到真正需要的时候才会求值）

#### 柯里化例子

以下是一个简单的柯里化例子。我们写一个接收三个数字并返回它们总和的函数`sum3`。

```js
function sum3(x, y, z) {
	return x + y + z;
}

console.log(sum3(1, 2, 3)); // 6
复制代码;
```

`sum3`的柯里化版本的结构不一样。它接收**一个参数**并返回一个函数。返回的函数。返回的函数中又接收一个参数，返回另一个仍然只接收一个参数的函数...（以此往复）

直到返回的函数接收到最后一个参数时，这个循环才结束。这个最后的函数将会返回数字的总和，如下所示。

```js
function sum(x) {
	return (y) => {
		return (z) => {
			return x + y + z;
		};
	};
}

console.log(sum(1)(2)(3)); // 6
复制代码;
```

以上的代码能跑起来，是因为 JavaScript 支持**闭包**

> 一个闭包是由函数和声明这个函数的词法环境组成的 -- [MDN](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FClosures)

注意函数链中的最后一个函数只接收一个`z`，但它同时也对外层的变量进行操作，在这个例子中，这些外层的变量对于最后一个函数来说类似于全局变量。实际上只是相当于不同函数下的局部变量

```js
// 相当于全局变量
let x = ...?
let y = ...?

// 只接收一个参数 z 但也操作 x 和 y
return function(z) {
  return x + y + z;
}

-------------------------------------------
function cal(a, b, c, d) {
        return a + b * c - d;
    }
//curry: 柯里化，用户固定某个函数的前面的参数，得到一个新的函数，新的函数调用时，接收剩余的参数
function curry(func, ...args) {
    return function(...subArgs) {
        const allArgs = [...args, ...subArgs];
        if (allArgs.length >= func.length) {
            //参数够了
            return func(...allArgs);
        } else {
            //参数不够，继续固定
            return curry(func, ...allArgs);
        }
    }
}
const newCal = curry(cal, 1, 2)
console.log(newCal(3, 4)) // 1+2*3-4
console.log(newCal(4, 5)) // 1+2*4-5
console.log(newCal(5, 6)) // 1+2*5-6
console.log(newCal(6, 7)) // 1+2*6-7

const newCal2 = newCal(8)
console.log(newCal2(9)); // 1+2*8-9
```

### 递归

函数直接或间接调用自身

避免无限递归，无限递归会导致执行栈溢出。

对比死循环

-   **==死循环==不会报错，也不会导致栈溢出**
-   **==无限递归==会导致栈溢出**

#### 执行栈

任何代码的执行都必须有一个执行环境，执行环境为代码的执行提供支持

执行环境是放到执行栈中的。

每个函数的调用，都需要创建一个函数的执行环境，函数调用结束，执行环境销毁。

执行栈有相对固定的大小，如果执行环境太多，执行栈无法容纳，会报错

#### 尾递归

如果一个函数最后一条语句是调用函数，并且调用函数不是表达式的一部分，则该语句称为尾调用，如果尾调用是调用自身函数，则称为尾递归。

某些语言或执行环境会对尾调用进行优化，它们会理解销毁当前函数，避免执行栈空间被占用。

在浏览器执行环境中，尾调用没有优化。但在 nodejs 环境中有优化

## 编译阶段

### 编译阶段

#### 编译原理

avaScript 是一门编译语言。与传统的编译语言不同的是，JavaScript 不是提前编译的，编译结果也不能在分布式系统中进行移植。 

在传统编译语言的流程中，程序中的一段源代码在执行之前会经历三个步骤，统称为 **编译**。

1. 分词 / 词法分析

	> **词法分析**（Tokenizing / Lexing）这个过程会将由字符组成的字符串分解成有意义的代码块（对编程语言来说），这些代码块被称为 **词法单元**（Token）。
	>
	> 🌰 **代码示例**：
	>
	> ```js
	> const a = 2;
	> ```
	>
	> 这段程序通常会被分解成为下列词法单元：`var`、`a`、`=`、`2`、`;`。
	>
	> 空格是否会被当作词法单元，取决于空格在这门语言中是否具有意义。
	>
	> 分词（Tokenizing）和词法分析（Lexing）之间的主要差异在于词法单元的识别是通过有状态还是无状态的方式进行的。简单来说，如果词法单元生成器在判断 `a` 是一个独立的词法单元还是其他词法单元的一部分时，调用的是 **有状态的解析规则**，那么这个过程就被称为 **词法分析**。

2. 解析 / 语法分析

	> **语法分析**（Parsing） 这个过程是将词法单元流转换成一个 **由元素逐级嵌套所组成** 的代表了程序语法结构的树。这个树被称为 [抽象语法树](https://zh.wikipedia.org/wiki/抽象語法樹)（Abstract Syntax Tree，AST 在各大框架及 [Babel](https://github.com/babel/babel) 中我们都会看到它的身影）。

3. 代码生成

	> 将 AST 转换为可执行代码的过程被称为 **代码生成**。这个过程与语言、目标平台等息息相关。 抛开具体细节，简单来说就是有某种方法可以将 `var a = 2;` 的 AST 转化为一组 **机器指令**：创建一个叫做 `a` 的变量（包括 **分配内存** 等），并将一个值存储在变量 `a` 中。
	>
	> 通过上述三个阶段，浏览器已经可以运行我们得到的 **可执行代码**，这三个阶段还有一个合称叫 **编译阶段**。我们把之后对可执行代码的执行称为 **运行阶段**。

#### 编译过程

编译过程中的关键角色：

- **引擎**：从头到尾负责整个 JavaScript 程序的编译及执行过程
- **编译器**：负责语法分析及代码生成等步骤
- **作用域**：==负责收集并维护由所有声明的标识符（变量）组成的一系列查询，并实施一套非常严格的规则，确定当前执行的代码对这些标识符的访问权限==

总结起来就是：

- 编译器在作用域声明变量（如果没有）
- 引擎在运行这些代码时查找该变量，如果作用域中有该变量则进行赋值

在上面的第二步中，引擎执行运行时所需的代码时，会通过查找变量 `a` 来判断它是否已经声明过。查找的过程由作用域进行协助，但是引擎执行怎么查找，会影响最终的查找结果。

> 那么描述的更准确的一点，RHS 查询与简单的查找某个变量的值毫无二致，而 LHS 查询则是试图找到变量的容器本身，从而可以对其赋值。

LHS 和 RHS 的含义是 **赋值操作的左侧或右侧** 并不一定意味着就是 `= 赋值操作符的左侧或右侧`。

赋值操作还有其他几种形式，因此在概念上最好将其理解 **赋值操作的目标是谁**（LHS） 以及 **谁是赋值操作的源头**（RHS）。当然上面的程序并不只有一个 LHS 和 RHS 引用：

> ```js
> function foo(a) {  
>   // 这里隐式的进行了对形参 a 的 LHS 引用。
>     
>   // 这里对 log() 方法进行了 RHS 引用，询问 console 对象上是否有 log() 方法。  
>   // 对 log(a) 方法内的 a 进行 RHS 引用，取到 a 的值。  
>   console.log(a);  
>   // 2
> }
> // 此处调用 foo() 方法，需要调用对 foo 的 RHS 引用。意味着"去找foo这个值，并把它给我"
>  foo(2);
> ```

需要注意的是：我们经常会将函数声明 `function foo(a) {...}` 转化为普通的变量赋值（函数表达式） `var foo = function(a) {…}`，这样去理解的话，这个函数是 LHS 查询。但是有一个细微的差别，编译器可以在代码生成的同时处理声明和值的定义，比如引擎执行代码时，并不会有线程专门用来将一个函数值"分配给" `foo`，因此，将函数声明理解成前面讨论的 LHS 查询和赋值的形式并不合适。

> 💡 综上所述，作用域是一套 **标识符的查询规则**（注意这里的用词是**规则**），JavaScript 编译引擎执行时根据查找的目的进行 LHS 与 RHS 查询。这套查询规则确定标识符在何处（当前作用域、上层作用域或全局作用域）以及如何查找（LHS、RHS）。

### 词法作用域

> 作用域就是变量（标识符）适用范围，控制着变量的可见性。

作用域共有两种主要的工作模式：

- 词法作用域/静态作用域
- 动态作用域

JavaScript 采用 **词法作用域**（Lexical Scope），也称为 **静态作用域**

#### 词法作用域/静态作用域

大部分标准语言编译器的第一个工作阶段叫作 **词法化**（也叫单词化）。词法化的过程会对源代码中的字符进行检查，如果是有状态的解析过程，还会赋予单词语义。

简单来说，词法作用域就是定义在词法阶段的作用域。换句话来说，词法作用域是由你在写代码时将变量和块作用域写在哪里来决定的，因此当词法分析器处理代码时会保持作用域不变（大部分情况下时这样的）。

<img src="./img/词法作用域.png" alt="词法作用域" style="zoom: 50%;" />

- 包含着整个全局作用域，其中只有一个标识符：`foo`
- 包含着 `foo` 所创建的作用域，其中有三个标识符：`a`、`bar` 和 `b`
- 包含着 `bar` 所创建的作用域，其中只有一个标识符：`c`

作用域气泡由其对应的作用域代码写在哪里决定，它们是 **逐级包含** 的。现在只需要假设每一个函数都会创建一个新的作用域气泡就好了。

`bar` 的气泡被完全包含在 `foo` 所创建的气泡中，唯一的原因是那里就是我们希望定义函数 `bar` 的位置。

##### 查找

作用域气泡的结构和互相之间的位置关系给引擎提供了足够的位置信息，引擎利用这些信息来查找标识符的位置。

在上个代码片段中，引擎执行 `console.log` 声明，并依次查找 `a`、`b` 和 `c` 三个变量的引用。

- 它首先从最内部的作用域，也就是 `bar` 函数的作用域气泡开始查找
- 引擎无法在这里找到 `a`，因此会去上一级到所嵌套的 `foo` 的作用域中继续查找。在这里找到了 `a`，因此引擎使用了这个引用
- 对 `b` 来讲也是一样的
- 而对 `c` 来说，引擎在 `bar` 中就找到了它

如果 `a`、`c` 都存在于 `bar` 和 `foo` 的内部，`console.log` 就可以直接使用 `bar` 中的变量，而无需到外面的 `foo` 中查找。

##### 遮蔽

**作用域查找会在找到第一个匹配的标识符时停止**。

在多层嵌套作用域中允许定义同名标识符，称为 **遮蔽效应**（内部的标识符遮蔽了外部的标识符）。

抛开遮蔽效应，作用域查找始终从运行时所处的最内部作用域开始，逐级向外或者说向上层作用域进行查询，直到遇见第一个匹配的标识符为止。

全局变量会自动成为全局对象的属性（比如浏览器中的 Window 对象），因此可以不直接使用全局对象的词法名称，而是间接地通过对全局对象属性的引用来对其进行访问。

🌰 **代码示例**：

```js
window.a;
```

通过这种技术可以访问那些被同名变量所遮蔽的全局变量。但非全局的变量如果被遮蔽了，无论如何都无法被访问到。

无论函数在哪里被调用，也无论它如何被调用，它的词法作用域都只由函数被声明时所处的位置决定。

词法作用域查找只会查找一级标识符，比如 `a`、`b` 和 `c`。如果代码中引用了 `foo.bar.baz`，词法作用域查找只会试图查找 `foo` 标识符，找到这个变量后，对象属性访问规则会分别接管对 `bar` 和 `baz` 属性的访问。

#### 动态作用域

词法作用域最重要的特征是它的定义过程发生在代码的书写阶段。

> 那为什么要介绍动态作用域呢？

实际上动态作用域是 JavaScript 另一个重要机制 [this](https://tsejx.github.io/javascript-guidebook/core-modules/executable-code-and-execution-contexts/execution/this) 的表亲。作用域混乱多数是因为词法作用域和 `this` 机制相混淆。

**动态作用域** 并不关心函数和作用域是如何声明以及在何处声明，它只关心它们从何处调用。

换句话说，[作用域链](https://tsejx.github.io/javascript-guidebook/core-modules/executable-code-and-execution-contexts/execution/scope-chain) 是基于 **调用栈** 的，而不是代码中的作用域嵌套。

```js
const a = 2;
function foo() {  
    console.log(a);
}
function bar() { 
    const a = 3;  
    foo();
}
bar();
```

- 如果处于词法作用域，变量 `a` 首先在 `foo` 函数中查找，没有找到。于是 **顺着作用域链到全局作用域** 中查找，找到并赋值为 `2`。所以控制台输出 `2`
- 如果处于动态作用域，同样地，变量 `a` 首先在 `foo` 中查找，没有找到。这里会 **顺着调用栈** 在调用 `foo` 函数的地方，也就是 `bar` 函数中查找，找到并赋值为 `3`。所以控制台输出 `3`

对于两种作用域的区别，简而言之，词法作用域是在 **定义** 时确定的，而动态作用域是在 **运行** 时确定的。

### 函数作用域

**函数作用域** 指属于这个函数的全部变量都可以在整个函数的范围内使用及复用（事实上在嵌套的作用域中也可以使用）。这种设计方案是非常有用的，能充分利用 JavaScript 变量可以根据需要改变值类型的动态特性

#### 隐藏内部实现

对函数的传统认知就是先声明一个函数，然后再向里面添加代码。但反过来想也可以带来一些启示：从所写的代码中挑选出一个任意的片段，然后用函数声明对它进行包装，实际上就是把这些代码隐藏起来。

实际的结果就是在这个代码片段的周围创建了一个作用域气泡，也就是说这段代码中的任何声明（变量或函数）都将绑定在这个新创建的包装函数的作用域中，而不是先前所在的作用域中。换句话说，可以把变量和函数包裹在一个函数的作用域中，然后用这个作用域来隐藏它们。

有很多原因促成了这种基于作用域的隐藏方法。它们大都是从 [最小权限原则](https://zh.wikipedia.org/wiki/最小权限原则) 中引申出来的。

这个原则是指在软件设计中，应该最小限度地暴露必要内容，而将其他内容都 **隐藏** 起来，比如某个模块或对象的 API 设计。这个原则可以延伸到如何选择作用域来包含变量和函数。如果所有变量和函数都在全局作用域中。当然可以在所有的内部嵌套作用域中访问到它们。但这样会破坏前面提到的最小权限原则，因为可能会暴露过多的变量或函数，而这些变量或函数本应该是私有的，正确的代码应该是 **可以阻止对这些变量或函数进行访问**。

🌰 **代码示例**：

```js
function doSomething(a) {  b = a + doSomethingElse(a * 2);
  console.log(b * 3);}
function doSomethingElse(a) {  return a - 1;}
var b;
doSomething(2);// 5
```

在这个代码片段中，变量 `b` 和函数 `doSomethingElse` 应该是 `doSomething` 内部具体实现的私有内容。给予外部作用域对 `b` 和 `doSomethingElse` 的访问权限不仅没有必要，而且可能是危险的，因为它们可能被有意或无意地以非预期的方式使用，从而导致超出了 `doSomething` 的适用条件。更使用的设计会将这些私有的具体内容隐藏在 `doSomething` 内部。

🌰 **代码示例**：

```js
function doSomething(a) { 
    function doSomethingElse(a) {    return a - 1;  }
  var b;
  b = a + doSomethingElse(a * 2);
  console.log(b * 3);}
doSomething(2); // 5
```

现在，`b` 和 `doSomethingElse` 都无法从外部被访问，而只能被 `doSomething` 所控制。功能性和最终效果都没有受影响，但是设计上将具体内容私有化了，设计良好的软件都会依次进行实现。

#### 规避命名冲突

隐藏作用域中的变量和函数可以避免同名标识符之间的冲突，两个标识符可能具有相同的名字但用途却不一样，无意间可能造成命名冲突。冲突会导致变量的值被意外覆盖。

🌰 **代码示例**：

```js
function foo() {  function bar(a) {    
    // 修改 for 循环所属作用域中的 i    
    i = 3;   
    console.log(a + i);  }
  for (var i = 0; i < 10; i++) {    
      // 糟糕，无限循环了！   
      bar(i * 2);  
  }
}
foo();
```

##### 全局命名空间

变量冲突的一个典型例子存在于全局作用域中。当程序中加载了多个第三方库时，如果它们没有妥善地将内部私有的函数或变量隐藏起来，就会很容易引发冲突。

这些库通常会在全局作用域中声明一个名字足够独特的变量，通常是一个对象。这个对象被用作库的命名空间，所有需要暴露给外界的功能都会成为这个对象（命名空间）的属性，而不是将自己的标识符暴露在顶级的词法作用域中。

```js
const MyReallyCoolLibrary = {
  awesome: 'stuff',
  doSomething: function () {
    // ...
  },
  doAnotherThing: function () {
    // ...
  },
};
```

##### 模块管理

另外一种避免冲突的办法和现代的模块机制很接近，就是众多模块管理器中挑选一个来使用。使用这些工具，任何库都无需将标识符加入到全局作用域中，而是通过依赖管理器的机制将库的标识符显式地导入到另外一个特定的作用域中。

显而易见，这些工具并没有能够违反词法作用域规则的功能。它们只是利用作用域的规则强制所有标识符都不能注入到共享作用域中，而是保持在私有、无冲突的作用域中，这样可以有效规避掉所有的意外冲突，

因此，只要你愿意，即使不使用任何依赖管理工具也可以实现规避冲突的功效。

在任意代码片段外部添加包装函数，可以将内部的变量和函数定义 **隐藏** 起来，外部作用域无法访问包装函数内部的任何内容。

```js
const a = 2;
function foo() {  // <-- 添加这一行  
    const a = 3;  console.log(a); // 3
} // <-- 以及这一行
foo(); // <-- 以及这一行
console.log(a); // 2
```

虽然这种技术可以解决一些问题，但是它并不理想，因为会导致一些额外的问题。首先，必须声明一个具名函数 `foo()` ，意味着 `foo` 这个名称本身"污染"了所在作用域（在这个例子中是全局作用域）。其次，必须显式地通过函数名`foo()`调用这个函数才能运行其中的代码。

如果函数不需要函数名（或者至少函数名可以不污染所在作用域），并且能够自动运行，这将会更加理想。

#### 匿名和具名函数表达式

无论是匿名还是具名，都是针对 **函数表达式** 的。函数声明必须有名称，否则报错。

```js
// 函数声明
function foo() {
  // do something
}
```

而函数表达式可以有名称也可以没有名称。

**匿名函数表达式：**

```js
let foo = function () {
  // do something
};
console.log(foo.name);
// foo
```

**具名函数表达式：**

```js
// 不要这样写
let bar = function foobar() {
  console.log(1)// do something
};
console.log(foo.name); // foo
bar() //1 
foobar() // foobar is not defined
```

对于函数表达式最熟悉的场景可能就是回调参数了。

```js
setTimeout(function () {
  console.log('I waited 1 second!');
}, 1000);
```

这叫 **匿名函数表达式**，因为 `function(){}` 是没有名称的标识符。

⚠️ **注意**：==函数表达式可以是匿名的，而 **函数声明** 是不可以省略函数名。==

匿名函数表达式的缺点：

- 匿名函数在栈追踪中不会显示出有意义的函数名，使得调试很困难
- 如果没有函数名，当函数需要引用自身时只能使用已经过期的 `arguments.callee` 引用。比如在递归中，另一个函数需要引用自身的例子，是在事件触发后事件监听器需要解绑自身
- 匿名函数省略了对于代码可读性 / 可理解性很重要的函数名。一个描述性的名称可以让代码不言自明

行内函数表达式非常强大且有用——匿名和具名之间的区别并不会对这点有任何影响。给函数表达式指定一个函数名可以有效解决以上问题。始终给函数表达式命名时一个最佳实践

#### 立即执行函数表达式

**立即执行函数表达式** 又称 **自执行函数**，社区给他规定了术语为 **IIFE**（Immediately Invoked Function Expression）。

🌰 **代码示例**：

```js
(function () {
  // do something
  console.log('IIFE');
})();
```

IIFE 的另一个非常普遍的进阶用法是把它们当作函数调用并传递参数进去。

```js
var a = 2;
(function IIFE(global) {
  var a = 3;
  console.log(a);  // 3
  console.log(global.a);  // 2
})(window);
console.log(a);// 2
```

### 块作用域

> 任何一对花括号中的语句集都属于一个块，在这之中定义的所有变量在代码块外都是不可见的，我们称之为 **块级作用域**。

尽管函数作用域是最常见的作用域单元，也是现行大多数 JavaScript 最普遍的设计方法，但其他类型的作用域单元也是存在的，并且通过使用其他类型的作用域单元甚至可以实现维护起来更加优秀、简洁的代码，比如块作用域。

#### 声明关键字

##### var

ES5 及之前是没有块级变量这个说法的，常规性是用 **闭包** 来防止内存泄漏。

如下所示为 ES5 中 `var` 声明的一些特点：

- 函数内的变量若是带 `var` 声明，则会覆盖外部的全局变量 **优先使用**
- 若是函数内部声明变量不带 `var` 声明，则直接 **覆盖同名的全局变量**
- 函数内存在 [声明提升](https://tsejx.github.io/javascript-guidebook/core-modules/executable-code-and-execution-contexts/compilation/hoisting) 的情况，可以先使用后声明
- `for` 循环中的 `var` 会污染全局（不局限于循环内）

🌰 **代码示例：优先使用**

```js
var foo = 5;
function bar() {
  var foo = 3;
  console.log(foo);
}
bar();// 3
```

🌰 **代码示例：变量提升**

```js
var foo = 5;
function bar() {
  console.log(foo);
  var foo = 3;
}
// JavaScript 允许不存在的变量先使用
// 默认会初始化为一个 undefined
bar();// undefined,
```

🌰 **代码示例：污染全局**

```js
for (var i = 0; i < 9; i++) {
  console.log('循环内部' + i);// 循环内部 0 ~ 9
}
console.log(i);// 9
console.log(i * 5);// 45
```

##### let

`let` 声明使用方法基本和 `var` 相同，而且声明的变量只在其块和子块中可用。 二者之间最主要的区别在于 `var` 声明的变量的作用域是整个封闭函数。

```js
function foo() {
  if(true) {
    var number = 5;
    console.log(number);
  }
  console.log(number);
}
function bar(） {
  if(true) {
    let number = 5;
    console.log(number);
  }
  console.log(number);
}
foo(); // 5 和 5
bar(); // 5 和 ReferenceError: number is not defined
```

`let` 声明的变量的作用域**只有外层块**，而不是整个外层函数。

我们可以利用这个特性来替代立即执行函数（IIFE）。

```js
/**
 * IIFE
 */
(function () {
  var number = 1;
  // do something
})();
/**
 * Block 块级
 */
{
  let number = 1;
  // do something
}
```

⚠️ **注意事项**：

- 不允许重新声明同名变量，会抛出异常，具有唯一性
- 不允许没声明就使用，会抛出异常，只有执行该声明的时候才能使用
- 有自己特色的闭包特性，比如在 `for` 循环的应用中

##### const

`const` 的用法跟 `let` 差不多，但是 `const` 一定要赋值，不赋值会报错。

```js
// 用法
const number = 4;
// 没有初始化报错
const t;
// SyntaxError: Missing initializer in const declaration
```

`const` 是块级作用域，`const` 跟 `let` 的语义相似，就是用来声明常量的，一旦声明了就不能更改。

⚠️ **注意**：值得注意的是 `const` 声明的变量记录的是 **指针**，不可更改的是 **指针**，如果 `const` 所声明的是对象，对象的内容还是可以修改的。

```js
// 重新赋值声明导致报错
const PI = 3.14;
PI = 3.1415926;
// TypeError: Assignment to constant variable.

// 给对象增加属性不会导致 foo 的指针变化，所以不会报错
const foo = { foo: 2 };
foo.bar = 3;
console.log(foo);
// {
//  foo: 2,
//  bar: 3
// }
```

⚠️ **注意事项**：

- 与 `let` 一样，具有唯一性，**不可重复声明**
- 可以将 `const` 声明的基本类型变量理解为只读变量，但是其声明的引用类型变量则是可修改的

##### 暂时性死区

使用 `let` 或 `const` 声明的变量，在声明赋值没有到达之前，访问该变量都会导致报错，就连一直以为安全的 `typeof` 也不再安全。

🌰 **代码示例**：

```js
// TDZ1
function foo() {
  // TDZ 开始
  console.log(typeof number);
  let number = 5; // TDZ 结束
}
foo();
// ReferenceError: number is not defined
```

报的错是 `ReferenceError`，如果使用 `var` 声明的话，`number` 输出应该是 `undefined`，从 `let` 声明的变量的块的第一行，到声明变量之间的这个区域被称作 **暂时性死区**（TDZ）。凡是在这个区域使用这些变量都会报错。

🌰 **代码示例**：

```js
// TDZ2
function bar() {
  console.log(typeof number);
}
bar();
// undefined
```

在函数里没有用 `let` 声明 `number` 的时候，`number` 是 `undefined`，讲道理在 `let` 声明前也应该是 `5`，然而 `foo` 函数却报了错，证明了就算是在未到达 `let` 声明的地方，但是在用 `let` 之前已经起到了作用。这是不是说明其实 `let` 也有提升（这个提升并不是 `var` 的那种提升，只是有影响），只是在 TDZ 使用的时候报错了，而不是 `undefined`。

事实上，当 JavaScript 引擎检视下面的代码块有变量声明时，对于 `var` 声明的变量，会将声明提升到函数或全局作用域的顶部，**==而对 let 或 const 的时候会将声明放在暂时性死区内==**。

⚠️ **注意**：**任何在暂时性死区内访问变量的企图都会导致 运行时错误（Runtime Error）。只有执行到变量的声明语句时，该变量才会从暂时性死区内被移除并可以安全使用。**

##### 显示块级作用域

在嵌套的作用域内使用 `let` 声明同一变量是被允许的。这个嵌套的作用域，在 ES6 中又称 **显式块级作用域**。

```js
var foo = 1;
{
  // 不会报错
  let = 2;
  // other code
}
```

同时因为是 `let` 和 `const` 是块级作用域，声明的变量在当前块使用完之后就会被释放，所以就算使用相同的标识符也不会覆盖外部作用域的变量, 而 `var` 是会覆盖外部作用域的变量的。

```js
function foo() {
  var bar = 1;
  {
    let bar = 2;
  }
  console.log(bar);
}
function zoo() {
  var bar = 1;
  {
    var bar = 2;
  }
  console.log(bar);
}
foo(); // 1
zoo(); // 2
```

在 ECMAScript 6 的发展阶段，被广泛认可的变量声明方式是：默认情况下应当使用 `let` 而不是 `var` 。

对于多数 JavaScript 开发者来说， `let` 的行为方式正是 `var` 本应有的方式，因此直接用 `let` 替代 `var` 更符合逻辑。在这种情况下，你应当对 **需要受到保护的变量** 使用 `const`。

在默认情况下使用 `const` ，而只在你知道变量值 **需要被更改** 的情况下才使用 `let` 。这在代码中能确保基本层次的不可变性，有助于防止某些类型的错误。

### 声明提升

JavaScript 程序的运行阶段分为 **预编译阶段** 和 **执行阶段**。

在预编译阶段，JavaScript 引擎会做一件事情，那就是读取 `变量的定义` 并 `确定其作用域` 即生效范围。

- 变量定义
	- 使用 `var` 或 `let` 关键字定义的变量，在未赋值的情况下，该变量的值是 `undefined`
	- 使用 `const` 关键字定义变量却不赋值，将会抛出错误
- 变量作用域
	- 全局变量的作用域遍布全局
	- 局部变量的作用域仅在于函数内部及其嵌套函数的作用域
	- 函数内部的同名变量或参数优先级高于全局同名变量

在 JavaScript 中，如果变量或函数没有声明就被使用，会引致错误的。

```js
console.log(a);
// Uncaught ReferenceError: a is not defined
```

**声明提升** 包括 **变量声明提升** 和 **函数声明提升**：

- **变量声明提升**：通过 `var`、`let` 和 `const` 声明的变量在代码执行之前被 JavaScript 引擎提升到==当前作用域的顶部==
- **函数声明提升**：通过函数声明的方式（非函数表达式）声明的函数在代码执行之前被 JavaScript 引擎提升了当前作用域的顶部，而且 **函数声明提升优先于变量声明提升**

JavaScript 的代码在生成前，会先对代码进行编译，编译的一部分工作就是找到所有的声明，然后建立作用域将其关联起来，因此，在 **当前作用域内** 包括变量和函数在内的所有声明都会在任何代码被执行前首先被处理。

注意这里是 ==**声明** 会被提前处理，**赋值** 并没有==， 定义声明是在编译阶段进行的，而赋值是在执行阶段进行的 。也就是说声明提升了，赋值还留着原地，等待执行。

#### 函数声明提升

函数的两种创建方式：

- 函数声明
- 函数表达式

🌰 **代码示例：函数声明**

```js
foo();// 输出 'bar'
function foo() {  console.log('bar');}
```

🌰 **代码示例：函数表达式**

```js
foo();// 报错：foo is not a function
var foo = function () {  console.log('bar');};
```

解析：同样地先执行函数，后创建函数，结果却是不一样。原因在于，通过函数声明的方式，该 **函数声明**（包括定义）会被提升至作用域的顶部，而表达式的创建方式则只提升了变量 `foo` 至作用域的顶部，此时的 `foo` 其值为`undefined`，调用 `foo` 自然报错：`foo` 不是一个方法。

再来看一个示例：

```js
var foo = function () {
  console.log('1');
};
function foo() {
  console.log('2');
}
foo();
// '1'
```

预编译阶段进行变量声明提升和函数声明提升后，上述代码执行效果等同于：

```js
// 变量声明提升
const foo;
// 函数声明提升
function foo(){
  console.log('2');
}
// 变量赋值保持原位执行，foo 函数被覆盖
foo = function(){
  console.log('1');
};
foo();
// '1'
```

总结：

- 函数声明提升，会将函数的声明和定义全都提升至作用域顶部
- 变量声明提升，只提升声明部分（未赋值状态），赋值部分保持原位置不动

#### 函数覆盖

函数声明和变量声明都会被提升。但是，**函数声明会覆盖变量声明**。

🌰 **代码示例**：

```js
var a;
function a() {}
console.log(a);// 'function a(){}'
```

但是，如果变量存在赋值操作，则最终的值为变量的值。

```js
var a = 1;
function a() {}
console.log(a);
// 'function a(){}'
var a;
function a() {}
console.log(a);
// 'function a(){}'
a = 1;
console.log(a);
// 1
```

**变量的重复声明是无用的**，但**函数的重复声明会覆盖前面的声明**（无论是变量还是函数声明）。

##### 重复声明无效

```js
var a = 1;
var a;
console.log(a);
```

输出结果为 1，以上代码等同于：

```js
// 此时 a 的默认值为 undefinedvar a;
a = 1;
console.log(a);// 1
```

##### 函数声明优先

由于函数声明提升优先于变量声明提升，所以变量的声明无效。

```js
var a;
function a() {  console.log(1);}
a();// 1
```

##### 函数声明覆盖

后面的函数声明会覆盖前面的函数声明。

```js
a();// 2
function a() {  console.log(1);}
function a() {  console.log(2);}
```

所以，应该避免在同一作用域中重复声明。

### 闭包

> 在了解闭包之前，先要熟悉以下几点：
>
> 1. 首先要理解执行环境（[执行上下文栈](https://tsejx.github.io/javascript-guidebook/core-modules/executable-code-and-execution-contexts/execution/execution-context-stack)），执行环境定义了变量或函数有权访问的其他数据。
> 2. 每个执行环境都有一个与之关联的 [变量对象](https://tsejx.github.io/javascript-guidebook/core-modules/executable-code-and-execution-contexts/execution/variable-object)，环境中定义的所有变量和函数都保存在这个对象中。
> 3. 每个函数都有自己的执行环境，当执行流进入一个函数时，函数的环境就会被推入到一个环境栈中。而在函数执行之后，栈将其环境弹出，把控制权返回给之前的执行环境。
> 4. 当某个函数被调用时，会创建一个执行环境及其相应的 **作用域链**。然后使用 `arguments` 和其他命名参数的值来初始化函数的活动对象。在函数中，活动对象作为变量对象使用（*作用域链是由每层的变量对象使用链结构链接起来的*）。
> 5. 在作用域链中，外部函数的活动对象始终处于第二位，外部函数的外部函数的活动对象处于第三位，直到作用域链终点即全局执行环境。
> 6. **作用域链的本质是一个指向变量对象的指针列表，它只引用但不实际包含变量对象。**

**闭包的定义**：指有权访问另一个函数作用域中的变量的函数，一般情况就是在一个函数中包含另一个函数。

**闭包的作用**：访问函数内部变量、保持函数在环境中一直存在，不会被垃圾回收机制处理

函数内部声明的变量是局部的，只能在函数内部访问到，但是函数外部的变量是对函数内部可见的。

子级可以向父级查找变量，逐级查找，直到找到为止或全局作用域查找完毕。

因此我们可以在函数内部再创建一个函数，这样对内部的函数来说，外层函数的变量都是可见的，然后我们就可以访问到他的变量了。

```js
function foo() {
  let value = 1;
  function bar() {
    console.log(value);
  }
  return bar();
}
const baz = foo();
// 这就是闭包的作用，调用 foo 函数，就会执行里面的 bar 函数，foo 函数这时就会访问函数外层的变量
baz();
```

`bar` 包含 `foo` 内部作用域的闭包，使得该作用域能够一直存活，不会被垃圾回收机制处理掉，这就是闭包的作用，以供 `bar` 在任何时间进行引用。

**应用场景**

闭包的常见应用场景：

- **函数嵌套**：函数里面的函数能够保证外面的函数的作用域不会被销毁，所以无论是在函数里面还是在外面调用函数里面的函数都可以访问到外层函数的作用域，具体做法可以将里面函数当做返回值返回后通过两次的括号调用
- **回调函数**：回调函数会保留当前外层的作用域，然后回调到另一个地方执行，执行的时候就是闭包
- **匿名函数自执行**：严格算也不是闭包，就是 `(function(){})()` 这种格式

```js
function hoc(a, b) {
  return function () {
    console.log(a, b);
  };
}
const fn = hoc(1, 2);
setTimeout(fn, 3000);
```

一般 `setTimeout` 的第一个参数是个函数，但是不能传值。如果想传值进去，可以调用一个函数返回一个内部函数的调用，将内部函数的调用传给 `setTimeout`。内部函数执行所需的参数，外部函数传给他，在 `setTimeout` 函数中也可以访问到外部函数。

**优缺点**

- 优点：能够让希望一个变量长期驻扎在内存之中成为可能，避免全局变量的污染，以及允许私有成员的存在
- 缺点：就是常驻内存会增大内存使用量，并且使用不当容易造成内存泄漏（指申请的内存执行完后没有及时的清理或者销毁，占用空闲内存，内存泄漏过多的话，就会导致后面的进程申请不到内存。因此内存泄漏会导致内部内存溢出。）

如果不是因为某些特殊任务而需要闭包，在没有必要的情况下，在其他函数中创建函数是不明智的，因为闭包对脚本性能具有负面影响，包括处理速度和内存消耗

### 作用域总结

JavaScript 的作用域分以下三种:

- 全局作用域: 脚本模式运行所有代码的默认作用域
- 模块作用域: 模块模式中运行代码的作用域
- 函数作用域: 由[函数](https://developer.mozilla.org/zh-CN/docs/Glossary/Function)创建的作用域

此外，用 [`let`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/let) 或 [`const`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/const) 声明的变量属于额外的作用域: 

- 块级作用域: 用一对花括号（一个[代码块](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/block)）创建出来的作用域

- 读取

	-   内部的作用域能访问外部, 反之不行。访问时**从内向外依次查找**。

	-   如果在内部的作用域中访问了外部, 则会产生**闭包**。

	-   ==内部作用域能访问的外部, **取决于函数定义的位置**, 和调用无关==

	```js
	// 下面的代码输出什么？(百度)
	var a = 1;
	function m1() {
		a++;
	}
	function m2() {
		var a = 3;
		m1();
		console.log(a);
	}
	m2();
	console.log(a);
	```

1. 作用域内定义的变量、函数**声明会提升**到作用域顶部

	```js
	console.log(a, b, m); // undefined undefined [Function: m]
	var a = 1;
	function m() {} // 函数声明
	var b = function () {}; // 函数表达式
	
	// 声明提升后如下
	var a;
	var b;
	function m() {}
	console.log(a, b, m);
	a = 1;
	b = function () {};
	```

> **面试题**:

```js
// 1.下面的代码输出什么

console.log(a, b, c);
var a = 1;
var b = function () {};
function c() {}
// undefined undefined ƒ c() {}
-------------------------------------
// 2.下面的代码输出什么
var a = 1,
	b = 2;
function m1() {
	console.log(a);
	var a = 3;
	function m2() {
		console.log(a, b);
	}
	m2();
}
m1();
// undefined  3  2
-------------------------------------
// 3.下面的代码输出什么？(百度)
var a = 2;
function m1() {
	a++;
}
function m2() {
	var a = 4;
	m1();
	console.log(a);
}
m2();
console.log(a);
// 4  3
```

## 执行阶段

### 执行上下文

![执行上下文生命周期](./img/执行上下文生命周期.jpg)

当 JavaScript 代码执行一段可执行代码(executable code)时, 会创建对应的执行上下文(execution context)。

执行上下文的生命周期包括三个阶段：创建阶段 → 执行阶段 → 回收阶段

**创建阶段**：在这个阶段中，执行上下文会分别进行以下操作

- 创建 [变量对象](#变量对象)
- 建立 [作用域链](作用域链)
- 确定 [this](#当前执行上下文this) 的指向

**代码执行阶段**：创建完成之后，就会开始执行代码，并依次完成以下步骤

- 变量赋值
- 函数引用
- 执行其他代码

![执行上下文-代码执行阶段](./img/执行上下文-代码执行阶段.jpg)

#### 可执行代码

每次当控制器转到可执行代码的时候，就会进入一个执行上下文。

执行上下文可以理解为当前代码的执行环境，它会形成一个作用域。

执行上下文的类型分为三种：

- **全局执行上下文**：只有一个，浏览器中的全局对象就是 `window`对象，`this` 指向这个全局对象
- **函数执行上下文**：存在无数个，只有在函数被调用的时候才会被创建，每次调用函数都会创建一个新的执行上下文
- **Eval 函数执行上下文**： 指的是运行在 `eval` 函数中的代码，很少用而且不建议使用

因此在一个 JavaScript 程序中，必定会产生多个执行上下文，而 JavaScript 引擎会以栈的方式来处理它们，这个栈，我们称其为 **函数调用栈（Call Stack）**。==栈底永远都是全局上下文，而栈顶就是当前执行的上下文。==

当代码在执行过程中，遇到以上三种情况，都会生成一个执行上下文，放入栈中，而处于栈顶的上下文执行完毕之后，就会自动出栈。

#### 栈堆实现分析

JavaScript 引擎通过创建  **执行上下文栈（Execution Context Stack，ECS）** 用于==管理执行上下文==。

🎯 为了模拟执行上下文栈的行为，让我们类比执行上下文栈是一个数组。

```js
ECStack = [];
```

试想当 JavaScript 开始要解释执行代码的时候，最先遇到的就是全局代码，所以初始化的时候首先就会向执行上下文栈压入一个全局执行上下文，我们用 `globalContext` 表示它，并且只有当整个应用程序结束的时候，ECStack 才会被清空，所以**程序结束之前**， ECStack 最底部永远有个 `globalContext`。

```js
ECStack = [globalContext];
```

现在 JavaScript 遇到下面的这段代码了：

```js
function fun3() {  console.log('fun3');}
function fun2() {  fun3();}
function fun1() {  fun2();}
fun1();
```

当执行一个函数的时候，就会创建一个执行上下文，并且压入执行上下文栈，当函数执行完毕的时候，就会将函数的执行上下文从栈中弹出。

知道了这样的工作原理，让我们来看看如何处理上面这段代码：

```js
// fun1()
ECStack.push(<fun1> functionContext);
// fun1 中竟然调用了 fun2，还要创建 fun2 的执行上下文
ECStack.push(<fun2> functionContext);
// 擦，fun2 还调用了 fun3！
ECStack.push(<fun3> functionContext);
// fun3 执行完毕
ECStack.pop();
// fun2 执行完毕
ECStack.pop();
// fun1 执行完毕
ECStack.pop();
// JavaScript 接着执行下面的代码，但是 ECStack 底层永远有个 globalContext
```

详细了解了这个过程之后，我们就可以对 **执行上下文栈** 总结一些结论了。

- JavaScript 引擎是单线程的
- 同步执行，只有栈顶的上下文处于执行中，其他上下文需要等待
- 全局上下文只有唯一的一个，它在浏览器关闭时出栈
- 函数的执行上下文的个数没有限制
- 每次某个函数被调用，就会有个新的执行上下文为其创建，即使是调用的自身函数，也是如此

### 变量对象

变量对象是与 [执行上下文](#执行上下文) 相关的数据作用域，==存储了在上下文中定义的 **变量** 和 **函数声明**。==

因为不同执行上下文中的变量对象稍有不同

#### 全局执行上下文

💡 **全局执行上下文中的变量对象就是全局对象**

**全局对象** 是预定义的对象，作为 JavaScript 的全局函数和全局属性的占位符。通过使用全局对象，可以访问所有其他所有预定义的对象、函数和属性。

在顶层 JavaScript 代码中，可以用关键字 `this` 引用全局对象。因为全局对象是作用域链的头，这意味着所有非限定性的变量和函数名都会作为该对象的属性来查询。

例如，当 JavaScript 代码引用 `parseInt` 函数时，它引用的是全局对象的 `parseInt` 属性，相当于 `window.parseInt`。全局对象是作用域链的头，还意味着在顶层 JavaScript 代码中声明的所有变量都将成为全局对象的属性。

如果看的不是很懂的话，容我再来介绍下全局对象:

1. 可以通过 `this` 引用，在 JavaScript 中，全局对象就是 Window 对象

```js
console.log(this);
// Window { ... }
```

2. 全局对象是由 Object 构造函数实例化的一个对象

```js
console.log(this instanceof Object);
// true
```

3. 预定义全局函数和全局属性，在任何地方均可调用

```js
console.log(Math.random === this.Math.random);// true
console.log(Math.PI === this.Math.PI);// true
```

4. 作为全局变量的宿主。

```js
const a = 'foo';
console.log(this.a);// foo
```

5. 在 JavaScript 中，全局对象有 Window 属性指向自身

```js
const a = 'foo';
console.log(window.a);// 'foo'
this.window.b = 'foo';
console.log(this.b);// 'foo'
```

#### 函数执行上下文

在函数执行上下文中，我们用 **活动对象**（Activation Object，AO）来表示变量对象。

**活动对象** 和 **变量对象** 其实是同一个东西，只是变量对象是规范上的或者说是引擎实现上的，不可在 JavaScript 环境中访问，只有到当进入一个执行上下文中，这个执行上下文的变量对象才会被激活，所以才叫 Activation Object ，而只有 **被激活** 的变量对象，也就是活动对象上的各种属性才能被访问。

活动对象是在进入函数执行上下文时刻被创建的，它通过函数的 `arguments` 属性初始化。

#### 执行过程

执行上下文的代码会分成两个阶段进行处理：

1. **分析**：进入执行上下文
2. **执行**：代码执行

##### 进入执行上下文阶段的变量对象

当进入执行上下文时，这时候还没有执行代码，变量对象的创建，依次经历了以下几个过程：

1. 函数的所有形参（如果是函数执行上下文）
	- **建立 Arguments 对象**
	- 检查当前上下文的参数，由名称和对应值组成的一个变量对象的属性被创建
	- 没有实参，属性值设为 `undefined`
2. 函数声明
	- 检查当前上下文的函数声明，也就是使用 `function` 关键字声明的函数
	- 在变量对象中以函数名建立一个属性，属性值为指向该函数所在内存地址的引用
	- 如果变量对象已经存在相同名称的属性，那么该属性将会被新的引用所覆盖
3. 变量声明
	- 检查当前上下文中的变量声明
	- 每找到一个变量声明，就在变量对象中以变量名建立一个属性，属性值为 `undefined`
	- 如果变量名称与已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性（亦可理解为为了防止同名的变量属性被修改为 `undefined`，则会直接跳过，原属性值不会被修改）

🌰 **代码示例**：

```js
function foo(a) {
  var b = 2;
  function c() {}
  var d = function() {};
  b = 3;
}
foo(1);
```

在进入执行上下文后，这时候的活动对象 AO 是：

```js
AO = {
  arguments: {
      0: 1,
      length: 1
  },
  a: 1,
  b: undefined,
  c: reference to function() {},
  d: undefined
}
```

##### 代码执行阶段的变量对象

在代码执行阶段，会根据代码，顺序执行代码，修改变量对象的值

还是上面的例子，当代码执行完后，这时候的 AO 是：

```js
AO = {
  arguments: {
    0: 1,
    length: 1
  },
  a: 1,
  b: 3,
  c: reference to function c(){},
  d: reference to FunctionExpression "d"
}
```

到这里变量对象的创建过程就介绍完了，让我们简洁的总结我们上述所说：

1. 全局执行上下文的变量对象初始化是全局对象
2. 函数执行上下文的变量对象初始化只包括 Arguments 对象
3. 在进入执行上下文时会给变量对象添加形参、函数声明、变量声明等初始的属性值
4. 在代码执行阶段，会再次修改变量对象的属性值

#### 变量对象和活动对象

> VO 和 AO 到底是什么关系？

未进入执行阶段之前，变量对象（VO：Variable Object）中的属性都不能访问。

但是进入执行阶段之后，活动对象（AO：Activation Object）被激活，里面的属性包括 VO、函数执行时传入的参数和 Arguments 对象都能被访问了，然后开始进行执行阶段的操作。

利用公式可以简单表述为:

```js
AO = VO + function parameters + arguments
```

#### 思考题

最后让我们看几个例子：

1.第一题

```js
function foo() {
    console.log(a);
    a = 1;
}
foo(); // ???
function bar() {
    a = 1;
    console.log(a);
}
bar(); // ???
```

第一段会报错：`Uncaught ReferenceError: a is not defined`。

第二段会打印：`1`。

这是因为函数中的 "a" 并没有通过 var 关键字声明，所有不会被存放在 AO 中。

第一段执行 console 的时候， AO 的值是：

```js
AO = {
    arguments: {
        length: 0
    }
}
```

没有 a 的值，然后就会到全局去找，全局也没有，所以会报错。

当第二段执行 console 的时候，全局对象已经被赋予了 a 属性，这时候就可以从全局找到 a 的值，所以会打印 1。

2.第二题

```js
console.log(foo);
function foo(){
    console.log("foo");
}
var foo = 1;
```

会打印函数，而不是 undefined 。

这是因为在进入执行上下文时，首先会处理函数声明，其次会处理变量声明，**如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性。**

### 作用域链

在 [变量对象](#变量对象) 中提及到，当查找变量的时候，会先从当前执行上下文的变量对象中查找，如果没有找到，就会从父级（词法层面上的父级）执行上下文的变量对象中查找，一直找到全局上下文的变量对象，也就是全局对象。这样由多个执行上下文的 **变量对象** 构成的链表就叫做作用域链。

下面，我们从一个函数的 **创建** 和 **激活** 两个阶段来剖析作用域链是如何创建和变化的。

#### 函数的创建

函数作用域在函数定义的时候就决定了。

这是因为函数有一个内部属性 `[[Scopes]]`，当函数创建的时候，就会保存所有父级作用域内的变量对象到其中，你可以理解 `[[Scopes]]` 就是所有父级作用域的变量对象的层级链，但是注意：`[[Scopes]]` 并不代表完整的作用域链。

🌰 **代码示例**：

```js
function foo() {
  function bar() {
    // do something
  }
}
```

函数创建时，各自的 `[[Scopes]]` 为：

```js
console.dir(foo);
// [[Scopes]]: Scopes[2]
// 0: Scripts {...}
// 1: Global {...}
foo.[[Scopes]] = [
  globalContext.VO
];
bar.[[Scopes]] = [
  fooContext.AO,
  globalContext.VO
];
```

#### 函数的激活

当函数激活（执行）时，进入函数上下文，创建 VO / AO 后，就会将 **活动对象** 添加到作用域链的前端。

这时候执行上下文的作用域链，我们命名为 Scopes：

```js
Scopes = [AO].concat([[Scopes]]);
```

至此，作用域链创建完毕。

#### 示例分析

以下面的例子为例，结合着之前讲的变量对象和执行上下文栈，我们来总结一下函数执行上下文中作用域链和变量对象的 **创建过程**：

```js
const scope = 'global scope';
function checkscope() {
  var scope2 = 'local scope';
  return scope2;
}
checkscope();
```

**执行过程** 如下：

1. `checkscope` 函数被创建，保存作用域链到内部属性 `[[Scopes]]`

```js
checkscope.[[Scopes]] = [
  globalContext.VO
];
```

1. 执行 `checkscope` 函数，创建 `checkscope` 函数执行上下文，`checkscope` 函数执行上下文被压入执行上下文栈

```js
ECStack = [checkscopeContext, globalContext];
```

1. `checkscope` 函数并不立刻执行，开始做准备工作，第一步：复制函数 `[[Scopes]]` 属性创建作用域链

```js
checkscopeContext = {
  Scopes: checkscope.[[Scopes]],
}
```

1. 用 `arguments` 创建活动对象，随后初始化活动对象，加入形参、函数声明、变量声明

```js
checkscopeContext = {
  AO: {
    arguments: {
      length: 0
    },
    scope2: undefined
  }，
  Scopes: checkscope.[[Scopes]],
}
```

1. 将活动对象压入 `checkscope` 作用域链顶端

```js
checkscopeContext = {
  AO: {
    arguments: {
      length: 0,
    },
    scope2: undefined,
  },
  Scopes: [AO, [[Scopes]]],
};
```

1. 准备工作做完，开始执行函数，随着函数的执行，修改 AO 的属性值

```js
checkscopeContext = {
  AO: {
    arguments: {
      length: 0,
    },
    scope2: 'local scope',
  },
  Scopes: [AO, [[Scopes]]],
};
```

1. 查找到 `scope2` 的值，返回后函数执行完毕，函数上下文从执行上下文栈中弹出

```js
ECStack = [globalContext];
```

### 当前执行上下文this

#### 调用位置

在理解 `this` 的绑定过程之前，首先要理解 `this` 的**调用位置**：调用位置就是函数在代码中被调用的位置（而不是声明的位置）。

#### 绑定规则

函数的执行过程中调用位置决定 `this` 的 **绑定对象**。

你必须找到调用位置，然后判断需要应用下面四条规则中的哪一条。我们首先会分别解释这四条规则，然后解释多条规则都可用时它们的优先级如何排列。

```js
(调用栈) => (调用位置) => (绑定规则) => 规则优先级;
```

##### 默认绑定

首先要介绍的是最常用的函数调用类型：**独立函数调用**。可以把这条规则看作是无法应用其他规则时的默认规则。

🌰 **代码示例**：

```js
function foo() {
  console.log(this.a);
}
// 声明在全局作用域中的变量就是全局对象的一个同名属性
// 相当于 window.a = 2
var a = 2;
// 调用 foo 函数时 this.a 被解析成了全局变量 a
// 因为在本例中，函数调用时应用了 this 的默认绑定
// 因此 this 指向全局对象 global objects 或 window objects
// 分析调用位置来获知 foo 是如何调用的
// foo 函数直接使用不带任何修饰的函数引用进行调用，因此只能使用默认绑定，无法应用其他规则
foo();
// 2
```

如果使用严格模式（Strict Mode），则不能将全局对象用于默认绑定，因此 `this` 会绑定到 `undefined`。

```js
function foo() {
  'use strict';
  console.log(this.a);
}
var a = 2;
foo();
// TypeError:this is undefined
```

这里有一个微妙但是非常重要的细节，虽然 `this` 的绑定规则完全取决于调用位置，但是只有 `foo()` 运行在非严格模式下时，默认绑定才能绑定到全局对象；在严格模式下调用 `foo` 则不受默认绑定影响。

```js
function foo() {
  console.log(this.a);
}
var a = 2;
(function foo() {
  'use strict';
  foo(); // 2
})();
```

⚠️ **注意**：通常来说你不应该在代码中混合使用严格模式和非严格模式。整个程序要么严格要么非严格。然而，有时候你可能会用到第三方库，其严格程度和你代码有所不同，因此一定要注意这类兼容性细节。

##### 隐式绑定

另一条需要考虑的规则是调用位置是否有**上下文对象**，或者说是否**被某个对象拥有或者包含**，不过这种说法可能会造成一些误导。

🌰 **代码示例**：

```js
function foo() {
  console.log(this.a);
}
const container = {
  a: 2,
  foo: foo,
};
container.foo(); // 2
```

首先需要注意的是 `foo` 的声明方式，及其之后是如何被当作引用属性添加到 `container` 中的。但是无论是直接在 `container` 中定义还是先定义再添加为引用属性，这个函数严格来说都不属于 `container` 对象。

然而，调用位置会使用 `container` 上下文来引用函数，因此你可以说函数被调用时 `container` 对象 **拥有** 或者 **包含** 它。

无论你如何称呼这个模式，当 `foo` 被调用时，它的前面确实加上了对 `container` 的引用。当函数引用有上下文时，隐式绑定规则会把函数调用中的 `this` 绑定到这个上下文对象。因为调用 `foo` 时 `this` 被绑定到 `container` 上，因此 `this.a` 和 `container.a` 是一样的。

💡 **对象属性引用链中只有上一层或最后一层在调用位置中起作用。**

```js
function foo() {
  console.log(this.a);
}
var obj2 = {
  a: 42,
  foo: foo,
};
var obj1 = {
  a: 2,
  obj2: obj2,
};
obj1.obj2.foo(); // 42
```

###### 隐式丢失

一个最常见的 `this` 绑定问题就是**被隐式绑定的函数会丢失绑定对象**，也就是说它会应用默认绑定，从而把 `this` 绑定到全局对象或者 `undefined` 上（这取决于是否是严格模式）。

🌰 **代码示例**：

```js
function foo() {
  console.log(this.a);
}
const container = {
  a: 2,
  foo: foo,
};
// 函数别名
const bar = container.foo;
// a 是全局对象的属性
const a = 'Hello world!';
bar();
// "Hello world!"
```

📍 虽然 `bar` 是 `container.foo` 的一个引用，但是实际上，它引用的是 `foo` 函数本身，因此此时的 `bar` 其实是一个不带任何修饰的函数调用，因此应用了默认绑定。

一种更微妙、更常见并且更出乎意料的情况发生在传入回调函数时。

🌰 **代码示例**：

```js
function foo() {
  console.log(this.a);
}
function bar(fn) {
  // fn 其实引用的是 foo
  fn(); // <--调用位置
}
var container = {
  a: 2,
  foo: foo,
};
// a 是全局对象的属性
var a = 'Hello world!';
bar(container.foo);
// "Hello world!"
```

参数传递其实是一种**隐式赋值**，因此我们传入函数时也会被隐式赋值，所以结果和上个示例一样。

如果把函数传入语言内置的函数而不是传入你自己声明的函数，结果是一样的，没有区别。

```js
function foo() {
  console.log(this.a);
}
const container = {
  a: 2,
  foo: foo,
};
// a 是全局对象的属性
var a = 'Hello world!';
setTimeout(container.foo, 100);
// 'Hello world!'
```

回调函数丢失 `this` 绑定是非常常见的。

除此之外，还有一种情况 `this` 的行为会出乎我们意料：调用回调函数的函数可能会修改 `this`。在一些流行的 JavaScript 库中事件处理器会把回调函数的 `this` 强制绑定到触发事件的 DOM 元素上。这在一些情况下可能很有用，但是有时它可能会让你感到非常郁闷。遗憾的是，这些工具通常无法选择是否启用这个行为。

无论是哪种情况，`this` 的改变都是意想不到的，实际上你无法控制回调函数的执行方式，因此就没有办法控制调用位置以得到期望的绑定。之后我们会介绍如何通过固定 `this` 来修复这个问题

##### 显示绑定

就像我们刚才看到的那样，在分析隐式绑定时，我们必须在一个对象内部包含一个指向函数的属性，并通过这个属性间接引用函数，从而把 `this` 隐式绑定到该对象上。

JavaScript 提供了 `apply`、`call` 和 `bind` 方法，为创建的所有函数 **绑定宿主环境**。通过这些方法绑定函数的 `this` 指向称为 **显式绑定**。

###### 硬绑定

硬绑定可以解决之前提出的丢失绑定的问题。

🌰 **代码示例**：

```js
function foo() {
  console.log(ths.a);
}
const container = {
  a: 2,
};
var bar = function () {
  foo.call(container);
};
bar();
// 2
setTimeout(bar, 100);
// 2
// 硬绑定的 bar 不可能再修改它的 this
bar.call(window);
// 2
```

我们创建了函数 `bar`，并在它的内部手动调用了 `foo.call(container)` ，因此强制把 `foo` 的 `this` 绑定到了 `container` 。无论之后如何调用函数 `bar`，它总会手动在 `container` 上调用 `foo`。这种绑定是一种显式（手动）的强制绑定，因此我们称之为**硬绑定**。

###### 内置函数

第三方库的许多函数，以及 JavaScript 语言和宿主环境中许多新的内置函数，都提供了一个可选的参数，通常被称为 **上下文（context）**，其作用和 `bind` 一样，确保你的回调函数使用指定的 `this` 。

```js
function foo(item) {
  console.log(this.title, item);
}

const columns = {
  title: 'No:',
}[
  // 调用 foo 时把 this 绑定到 columns
  (1, 2, 3)
].forEach(foo, columns);
// No:1 No:2 No:3
```

这些函数实际上就是通过 `call` 或者 `apply` 实现了显式绑定，这样代码会更加优雅。

##### 构造调用绑定

在 JavaScript 中，构造函数只是使用 `new` 操作符时被调用的函数。它们并不会属于某个类，也不会实例化一个类，实际上，它们甚至都不能说是一种特殊的函数类型，它们只是被 `new` 操作符调用的普通函数而已。

举例来说，思考一下 `Number()` 作为构造函数时的行为，ES5.1 中这样描述它：

> 15.7.2 Number 构造函数
>
> 当 Number 在 `new` 表达式中被调用时，它是一个构造函数：它会初始化新创建的对象。

所以，包括内置对象函数在内的所有函数都可以用 `new` 来调用，这种函数调用被称为 **构造函数调用**。这里有一个重要但是非常细微的区别：实际上并不存在所谓的构造函数，只是对于函数的 **构造调用**。

🎉 ==使用 new 来调用函数，或者说发生构造函数调用时，会自动执行下面的操作。==

1. 创建全新的空对象
2. 将新对象的隐式原型对象关联构造函数的显式原型对象
3. 执行对象类的构造函数，同时该实例的属性和方法被 `this` 所引用，即 `this` 指向新构造的实例
4. 如果构造函数执行后没有返回其他对象，那么 `new` 表达式中的函数调用会自动返回这个新对象

🎯 **模拟过程：**

```js
function objectFactory(constructor, ...rest) {
  // 创建空对象，空对象关联构造函数的原型对象
  const instance = Object.create(constructor.prototype);
  // 执行对象类的构造函数，同时该实例的属性和方法被 this 所引用，即 this 指向新构造的实例
  const result = constructor.apply(instance, rest);
  // 判断构造函数的运行结果是否对象类型
  if (result !== null && /^(object|function)$/.test(typeof result)) {
    return result;
  }
  return instance;
}
```

解剖内部操作后，我们能得出结论 `new` 操作符是为了实现该过程的一种**语法糖**。

#### 优先级

上文介绍了函数调用中 `this` 绑定的四条规则，你需要做的就是找到函数的调用位置并判断应用哪条规则。但是，如果某个调用位置应用多条规则，则必须给这些规则设定优先级。

毫无疑问，默认绑定的优先级是四条规则中最低的，所以我们先不考虑它。

```unknown
显式绑定 > 构造调用绑定 > 隐式绑定;
```

##### 隐式绑定和显示绑定

```js
function foo() {  console.log(this.a);}
const container1 = {  a: 1,  foo: foo,};
const container2 = {  a: 2,  foo: foo,};
container1.foo();// 1container2.foo();// 2
container1.foo.call(container2);// 2container2.foo.call(container1);// 1
```

可以看到，显式绑定优先级更高，也就是说在判断时应当先考虑是否可以存在显式绑定。

##### 构造调用绑定隐式绑定

```js
function foo(something) {
  this.a = something;
}
const container1 = {
  foo: foo,
};
const container2 = {};
container1.foo(2);
console.log(container1.a);
// 2
container1.foo.call(container2, 3);
console.log(container2.a);
// 3
var bar = new container1.foo(4);
console.log(container1.a);
// 2
console.log(bar.a);
// 4
```

可以看到 `new` 绑定比隐式绑定优先级高。但是 `new` 绑定和显式绑定谁的优先级更高呢？

`new` 和 `call/apply` 无法一起使用，因此无法通过 `new foo.call(obj1)` 来直接进行测试。但是我们可以使用硬绑定来测试他俩的优先级。

在看代码之前先回忆一下硬绑定是如何工作的。`Function.prototype.bind` 会创建一个新的包装函数，这个函数会忽略它当前的 `this` 绑定（无论绑定的对象是什么），并把我们提供的对象绑定到 `this` 上。

这样看起来硬绑定（也是显式绑定的一种）似乎比 `new` 绑定的优先级更高，无法使用 `new` 来控制 `this` 绑定。

```js
function foo(something) {
  this.a = something;
}
var container1 = {};
var bar = foo.bind(container1);
bar(2);
console.log(container1.a);
// 2
var baz = new bar(3);
console.log(container1.a);
// 2
console.log(baz.a);
// 3
```

#### 绑定例外

##### 忽略指向

**如果将 `null` 或 `undefined` 作为 `this` 的绑定对象传入 `call`、`apply` 或 `bind`，这些值在调用时会被忽略，实际应用的是默认绑定规则。**

```js
function foo() {  console.log(this.a);}
const a = 2;
foo.call(null);// 2
```

此类写法常用于 `apply` 来展开数组，并当作参数传入一个函数，类似地，`bind` 可以对参数进行柯里化（预先设置一些参数）。

```js
function foo(a, b) {
  console.log('a:' + a + ',b:' + b);
}
// 把数组展开成参数
foo.apply(null, [2, 3]);
// a:2, b:3
// 使用 bind 进行柯里化
var bar = foo.bind(null, 2);
bar(3);
// a:2, b:3
```

这两种方法都需要传入一个参数当作 `this` 的绑定对象。如果函数并不关心 `this` 的话，你 仍然需要传入一个占位值，这时 `null` 可能是一个不错的选择。

##### 软绑定

硬绑定这种方式可以把 `this` 强制绑定到指定的对象（除了使用 `new` 时），防止函数调用应用默认绑定规则。问题在于，硬绑定会大大降低函数的灵活性，使用硬绑定之后就无法使用隐式绑定或者显式绑定来修改 `this`。

如果可以给默认绑定指定一个全局对象和 `undefined` 以外的值，那就可以实现和硬绑定相同的效果，同时保留隐式绑定或者显式绑定修改 `this` 的能力。

```js
if (!Function.prototype.softBind) { Function.prototype.softBind = function(obj) {
var fn = this;
// 捕获所有 curried 参数
var curried = [].slice.call( arguments, 1 ); var bound = function() {
return fn.apply(
(!this || this === (window || global)) ?
obj : this
curried.concat.apply( curried, arguments )
); };
             bound.prototype = Object.create( fn.prototype );
return bound; };
}
```

##### 指向按变更

如下列出四种方法可以在编码中改变 `this` 指向。

- 使用 ES6 的箭头函数
- 在函数内部使用 `_this = this`
- 使用 `apply`、`call` 和 `bind`
- `new` 实例化一个对象

##### 箭头函数

箭头函数并不是使用 `function` 关键字定义的，而是使用被称为胖箭头的操作符 `=>` 定义的。箭头函数不使用 `this` 的四种标准规则，而是根据外层（函数或者全局）作用域来决定 `this` 的指向。并且，箭头函数拥有静态的上下文，即一次绑定之后，便不可再修改。

`this` 指向的固定化，并不是因为箭头函数内部有绑定 `this` 的机制，实际原因是箭头函数根本没有自己的 `this`，导致内部的 `this` 就是外层代码块的 `this`。正是因为它没有 `this`，所以也就不能用作构造函数。

```js
function foo() {
  // 返回一个箭头函数
  return (a) => {
    // this 继承自 foo()
    console.log(this.a);
  };
}
const container1 = { a: 1 };
const container2 = { a: 2 };
const bar = foo.call(container1);
bar.call(container2);
// 1
```

`foo` 内部创建的箭头函数会捕获调用时 `foo` 的 `this`。由于 `foo` 的 `this` 绑定到 `container1`，`bar`（引用箭头函数）的 `this` 也会绑定到 `container1`，箭头函数的绑定无法被修改。

箭头函数可以像 `bind` 一样确保函数的 `this` 被绑定到指定对象，此外，其重要性还体现在它用更常见的词法作用域取代了传统的 `this` 机制。实际上，在 ES6 之前我们就已经在使用一种几乎和箭头函数完全一样的模式。

虽然 `const self = this` 和箭头函数看起来都可以取代 `bind`，但是从本质上来说，它们想替代的是 `this` 机制。

如果你经常编写 `this` 风格的代码，但是绝大部分时候都会使用 `const self = this` 或者箭头函数来否定 `this` 机制，那你或许应当:

- 只使用词法作用域并完全抛弃错误 `this` 风格的代码
- 完全采用 `this` 风格，在必要时使用 `bind`，尽量避免使用 `const self = this` 和箭头函数

#### 应用场景

1. 函数的普通调用
2. 函数作为对象方法调用
3. 函数作为构造函数调用
4. 函数通过 `call`、`apply`、`bind` 间接调用
5. 箭头函数的调用

### 作用域 VS 执行上下文

我们讲过 JavaScript 中的**作用域是==词法作用域==，与在哪里==定义==有关**；而**执行上下文则和==调用==有关**，两者有关联但却是不同概念

#### 作用域

> 作用域与哪里定义有关，在引擎编译时就知道它在哪里定义

-   其中函数作用域最为重要，因为作用域中的变量，作用域外不能访问，这起到了保护变量的作用
-   无生命周期
-   它可以理解为是“静态”的（词法作用域）
-   共全局作用域、函数作用域、块级作用域、eval 作用域

#### 执行上下文

> 而执行上下文与调用有关

-   它表示一段代码执行时所带的所有信息
    -   包括 this、词法环境、变量环境（ES5 标准）
    -   结合之前 [this](#this) 所给的定义: **谁调用它，this 就指向谁** 就是和执行上下文相关。执行上下文也是如此，与调用者息息相关
-   生命周期为两个阶段
    -   1. 创建阶段
        -   确定 this 指，即我们熟知的 this 绑定
        -   创建变量环境
            -   环境记录器
                -   登记 var、function 等声明的变量
                -   此时会发生变量提升和函数提升
            -   对外部环境的引用（outer）
                -   指向父作用域（作用域在代码执行前就确定了）
        -   创建词法环境
            -   环境记录器
                -   登记 let、const 等声明的变量
                -   会发生变量提升（hoist），但是不会被初始化，所以提前使用会报 ReferenceError，如例 1 所示
            -   对外部环境的引用（outer）
                -   同样指向父作用域
    -   2. 执行阶段
        -   指向代码
        -   确定作用域链
-   它则是“动态”的（与调用方相关）
-   共 **全局执行上下文** 、**函数执行上下文** **、模块执行上下文** 、**eval 执行上下文**

例子 1:

```javascript
a; // undefined
b; // ReferenceError
c; // ReferenceError
d; // function d() {}

var a = 1;
let b = 2;
const c = 3;
function d() {}
```

var 声明变量会被初始化为 undefined，一般函数（函数声明式写法）定义会被初始化为 `function xx(){}` ，let、const 则不会被初始化，所以 var 定义的变量可以提前使用但指为 undefined，一般函数定义可以正常提前使用，let、const 提前使用则会报错

> PS，如果使用函数表达式写法使用函数，则跟变量，如 var e = function(){} 或者 let f = () => {}

## 内存管理

### 内存模型

JavaScript 中的内存分为**栈内存（Stack）**和**堆内存（Heap）**两种：

| 内存类型 | 存储内容                           | 特点                          |
| -------- | ---------------------------------- | ----------------------------- |
| 栈内存   | 基本类型值、引用类型的引用地址     | 空间小、存取速度快、自动分配和释放 |
| 堆内存   | 引用类型的实际数据（对象、数组等） | 空间大、存取速度相对较慢          |

```js
let a = 10; // 基本类型，值直接存储在栈中
let b = { name: 'Tom' }; // 引用类型，栈中存储引用地址，实际对象存储在堆中
let c = b; // c 复制了 b 的引用地址，两者指向同一个堆中的对象
```

### 内存周期

不管什么程序语言，内存生命周期基本是一致的：

1. **分配内存** —— 在声明变量、函数、对象时，系统会自动分配内存
2. **使用内存** —— 读写内存，即使用变量、函数等
3. **释放内存** —— 使用完毕，由垃圾回收机制自动回收不再使用的内存

```js
let name = 'Tom'; // 1. 分配内存
console.log(name); // 2. 使用内存
name = null; // 3. 不再需要时，释放内存（等待 GC 回收）
```

### 垃圾回收

JavaScript 是具有自动垃圾回收机制的语言，开发者不需要手动释放内存。垃圾回收器会周期性地找出不再继续使用的变量，然后释放其占用的内存。

#### 引用计数（Reference Counting）

最早期的垃圾回收算法。原理：跟踪记录每个值被引用的次数，当引用次数变为 0 时，就可以将其回收。

```js
let obj1 = { a: 1 }; // { a: 1 } 引用次数为 1
let obj2 = obj1; // { a: 1 } 引用次数为 2
obj1 = null; // { a: 1 } 引用次数为 1
obj2 = null; // { a: 1 } 引用次数为 0，可被回收
```

**缺陷：循环引用**

```js
function problem() {
	let objA = {};
	let objB = {};
	objA.ref = objB; // objB 引用次数 +1
	objB.ref = objA; // objA 引用次数 +1
	// 函数结束后，objA 和 objB 互相引用，引用次数都不为 0
	// 但它们已经无法被外部访问 → 内存泄漏
}
```

#### 标记清除（Mark-and-Sweep）

现代浏览器普遍采用的算法。原理：从根对象（全局对象）出发，标记所有能够被访问到的对象，未被标记的对象就会被回收。

1. 垃圾回收器从**根对象**（如 `window`）开始，遍历所有可达对象并**标记（mark）**
2. 遍历完成后，未被标记的对象就是不可达对象
3. **清除（sweep）**这些不可达的对象，释放内存

> 标记清除能够解决循环引用的问题，因为从根对象出发无法到达的循环引用对象，不会被标记，自然会被回收。

#### V8 引擎的分代回收

V8 引擎将堆内存分为**新生代**和**老生代**：

| 分区   | 特点                       | 回收算法                                               |
| ------ | -------------------------- | ------------------------------------------------------ |
| 新生代 | 存活时间短的对象，空间较小 | Scavenge（复制算法）：将存活对象复制到另一半空间，交换两个空间 |
| 老生代 | 存活时间长的对象，空间较大 | Mark-Sweep + Mark-Compact（标记整理，减少碎片）        |

当新生代中的对象经过多次回收仍然存活，会被**晋升（promotion）**到老生代。

#### 常见内存泄漏场景

1. **意外的全局变量**：未声明的变量会挂在全局对象上
2. **被遗忘的定时器**：`setInterval` 未清除，其回调引用的变量无法回收
3. **闭包**：闭包中引用的外部变量会一直保留在内存中
4. **脱离 DOM 的引用**：JS 中仍持有已从 DOM 树移除的元素引用

```js
// 1. 意外的全局变量
function foo() {
	bar = 'global'; // 没有用 let/const/var，成为 window.bar
}

// 2. 被遗忘的定时器
let data = fetchData();
setInterval(() => {
	render(data); // data 永远不会被回收
}, 1000);

// 3. 闭包
function outer() {
	let bigData = new Array(100000);
	return function inner() {
		console.log(bigData.length); // bigData 一直被引用
	};
}
const fn = outer(); // bigData 无法被回收

// 4. 脱离 DOM 的引用
let btn = document.getElementById('btn');
document.body.removeChild(btn); // DOM 中移除了
// 但 btn 变量仍引用该元素，无法被 GC 回收
btn = null; // 需要手动解除引用
```

## 并发模型

### 并发模型

JavaScript 采用**单线程**的执行模型，同一时间只能执行一个任务。为了处理异步操作（如网络请求、定时器、用户交互等），JavaScript 使用了基于**事件循环（Event Loop）**的并发模型。

这个模型由以下部分组成：

- **调用栈（Call Stack）**：执行同步代码，函数调用会依次入栈，执行完出栈
- **Web API / Node API**：浏览器或 Node.js 提供的异步接口（如 `setTimeout`、`fetch`、DOM 事件等）
- **任务队列（Task Queue）**：也叫宏任务队列，存放异步回调（如 `setTimeout` 回调、I/O 回调）
- **微任务队列（Microtask Queue）**：存放微任务回调（如 `Promise.then`、`MutationObserver`）

> 详细的事件循环机制参考 [事件循环 (浏览器、Node)](#事件循环-浏览器、node)

### 事件循环

事件循环是 JS 实现异步的核心机制，其基本流程：

1. 执行**调用栈**中的同步代码
2. 调用栈清空后，检查**微任务队列**，依次执行所有微任务
3. 微任务队列清空后，从**宏任务队列**中取出一个任务执行
4. 重复以上步骤

```
┌───────────────────────────┐
│        调用栈 (Call Stack)  │
│  同步代码在此执行            │
└─────────────┬─────────────┘
              │ 栈空时
              ▼
┌───────────────────────────┐
│   微任务队列 (Microtask)    │  Promise.then / MutationObserver
│   全部执行完                │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│   宏任务队列 (Macrotask)    │  setTimeout / setInterval / I/O
│   取一个执行                │
└─────────────┬─────────────┘
              │ 回到顶部
              ▼
```

**常见的宏任务和微任务：**

| 宏任务（Macrotask）     | 微任务（Microtask）               |
| ----------------------- | --------------------------------- |
| setTimeout / setInterval | Promise.then / catch / finally    |
| I/O 操作                | MutationObserver                  |
| UI 渲染                 | queueMicrotask()                  |
| requestAnimationFrame   | process.nextTick（Node.js）       |

> 更详细的内容参考 [事件循环 (浏览器、Node)](#事件循环-浏览器、node)

### 定时器机制

JavaScript 提供了两种定时器：

- **`setTimeout(callback, delay)`**：延迟 `delay` 毫秒后执行一次 `callback`
- **`setInterval(callback, delay)`**：每隔 `delay` 毫秒重复执行 `callback`

```js
// setTimeout
const timer1 = setTimeout(() => {
	console.log('1秒后执行');
}, 1000);
clearTimeout(timer1); // 取消定时器

// setInterval
const timer2 = setInterval(() => {
	console.log('每秒执行一次');
}, 1000);
clearInterval(timer2); // 取消定时器
```

**注意事项：**

1. 定时器的 `delay` 不是精确的执行时间，而是**最少等待时间**。回调会在 delay 后被放入宏任务队列，等待调用栈清空后才执行
2. `setTimeout(fn, 0)` 不是立即执行，而是在当前同步代码和微任务执行完后才执行
3. `setInterval` 可能存在任务堆积问题，可以用递归 `setTimeout` 代替：

```js
// 用递归 setTimeout 替代 setInterval
function loop() {
	console.log('执行任务');
	setTimeout(loop, 1000); // 确保本次任务完成后再安排下一次
}
loop();
```

## 严格模式

此为 ES5 新增语法

参考: https://www.runoob.com/js/js-strict.html

参考: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Strict_mode

## 全局对象

无论是浏览器环境, 还是 node 环境, 都会提供一个全局对象

-   浏览器环境:**window**
-   node 环境: **global**

全局对象有下面几个特点:

-   全局对象的属性可以被直接访问

-   给未声明的变量赋值, 实际就是给全局对象的属性赋值

    > 永远别这么干

-   所有的全局变量、全局函数都会附加到全局对象

    > 这称之为全局污染, 又称之为全局暴露, 或简称污染、暴露
    >
    > 如果要避免污染, 需要使用**立即执行函数**改变其作用域
    >
    > 立即执行函数又称之为 IIFE, 它的全称是 Immediately Invoked Function Expression
    >
    > **IIFE 通常用于强行改变作用域** (function(){})()

```js
var abc = (function () {
	var a = 1; // 不希望污染全局
	var b = 2; // 不希望污染全局

	function c() {
		console.log(a + b);
	}

	var d = 123;
	return {
		c: c,
		d: d,
	};
})();
// abc =  {d: 123, c: ƒ}
```

## 构造函数

> JS 所有的对象, 都是通过构造函数产生的

```js
// old constructor 面向对象中，将 下面对一个对象的所有成员的定义，统称为类
//构造函数  构造器
function Animal(type, name, age, sex) {
	this.type = type;
	this.name = name;
	this.age = age;
	this.sex = sex;
}
//定义实例方法（原型方法）公用方法
Animal.prototype.print = function () {
	console.log(`【种类】: ${this.type}`);
	console.log(`【名字】: ${this.name}`);
	console.log(`【年龄】: ${this.age}`);
	console.log(`【性别】: ${this.sex}`);
};
const a = new Animal('狗', '旺财', 3, '男');
a.print();
for (const prop in a) {
	console.log(prop);
}
// Class 语法
class Animal {
	constructor(type, name, age, sex) {
		this.type = type;
		this.name = name;
		this.age = age;
		this.sex = sex;
	}
	print() {
		console.log(`【种类】: ${this.type}`);
		console.log(`【名字】: ${this.name}`);
		console.log(`【年龄】: ${this.age}`);
		console.log(`【性别】: ${this.sex}`);
	}
}
const a = new Animal('狗', '旺财', 3, '男');
a.print();
for (const prop in a) {
	console.log(prop);
}
```

## 原型

### 原型要解决的问题

<img src="./img/原型1.png" alt="原型1.png" style="zoom:50%;" />

上图中, 通过构造函数可以创建一个用户对象

这种做法有一个严重的缺陷, 就是每个用户对象中都拥有一个`sayHi`方法, 对于每个用户而言, `sayHi`方法是完全一样的, 没必要为每个用户单独生成一个。

要解决这个问题, 必须学习原型

### 原型是如何解决的

<img src="./img/原型2.png" alt="原型2.png" style="zoom:50%;" />

1. **原型**

    每个 ==**函数**== 都会自动附带一个属性 ==**prototype**==, 这个属性的值是一个普通对象, 称之为原型对象

2. **实例**

    instance, 通过`new`产生的对象称之为实例。

    > 由于 JS 中所有对象都是通过`new`产生的, 因此, 严格来说, JS 中所有对象都称之为实例

3. **隐式原型**

    每个 ==**实例**== 都拥有一个特殊的属性 ==**\_\_proto\_\_**==, 称之为隐式原型, 它指向构造函数的原型(`prototype`)

这一切有何意义？

**当访问实例成员时, 先找自身, 如果不存在, 会自动从隐式原型中寻找**

**这样一来, 我们可以把那些公共成员, 放到函数的原型中, 即可被所有实例共享**

<img src="./img/原型3.png" alt="原型3.png" style="zoom:50%;" />

### obj.hasOwnProperty(keyName)

> 判断这个**属性是不是属于对象本身**, 而不是在隐式原型**(\_\_proto\_\_ == prototype)** 上

[`hasOwnProperty`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty) 是 JavaScript 中唯一一个处理属性并且**不会**遍历原型链的方法。（译者注: 原文如此。另一种这样的方法: [`Object.keys()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)）

==**注意:**==

**检查属性是否为 [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined) 是**不能够**检查其是否存在的。该属性可能已存在，但其值恰好被设置成了 `undefined`。**

### keyName in obj

> 判断 属性名 是否在对象自身及其隐式原型上

```js
Object.prototype.abc = 1;

var obj = {
	a: 1,
	b: 2,
};
// 判断这个属性是不是属于对象本身, 而不是在隐式原型上
console.log(obj.hasOwnProperty('abc')); // false
// 属性名 in 对象  ---> 判断 属性名 是否在对象自身及其隐式原型上
console.log('abc' in obj); // true

for (var key in obj) {
	if (obj.hasOwnProperty(key)) {
		console.log(key);
	}
}
```

## 原型链

### 什么是原型链

**所有的对象都是通过`new 函数`的方式创建的**

```js
var u1 = new User('邓', '旭明'); // 对象 u1 通过 new User 创建
var u2 = {
	// 对象 u2 通过 new Object 创建
	firstName: '莫',
	lastName: '妮卡',
};
// 等效于
var u2 = new Object();
u2.firstName = '莫';
u2.lastName = '妮卡';
```

上面的代码形成的原型图如下

<img src="./img/原型链1.png" alt="原型链1.png" style="zoom:50%;" />

原型对象本身也是一个对象, 默认情况下, 是通过`new Object`创建的, 因此, 上面的两幅原型图是可以发生关联的

<img src="./img/原型链2.png" alt="原型链2.png" style="zoom:50%;" />

> **`Object.prototype.__proto__`比较特殊, 它固定指向 null**

可以看出, u1 的隐式原型形成了一个链条, 称之为**原型链**

**当读取对象成员时, 会先看对象自身是否有该成员, 如果没有, 就依次在其原型链上查找**

### 完整的链条

<img src="./img/原型链3.png" alt="原型链3.png" style="zoom:50%;" />

更改构造函数的原型会对所有原型链上有该构造函数的原型的对象产生影响

#### instanceof 关键字

[instanceof 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof)

```js
object instanceof constructor;
```

> `instanceof` 运算符用来检测 `constructor.prototype` 是否存在于参数 `object` 的原型链上。

```js
// 判断object的原型链中, 是否存在constructor的原型(prototype)
object instanceof constructor;

var simpleStr = 'This is a simple string';
var myString = new String();
var newStr = new String('String created with constructor');
var myDate = new Date();
var myObj = {};
var myNonObj = Object.create(null);

simpleStr instanceof String; // 返回 false, 非对象实例, 因此返回 false
myString instanceof String; // 返回 true
newStr instanceof String; // 返回 true
myString instanceof Object; // 返回 true

myObj instanceof Object; // 返回 true, 尽管原型没有定义
({}) instanceof Object; // 返回 true, 同上
myNonObj instanceof Object; // 返回 false, 一种创建非 Object 实例的对象的方法

myString instanceof Date; //返回 false

myDate instanceof Date; // 返回 true
myDate instanceof Object; // 返回 true
myDate instanceof String; // 返回 false
```

#### Object.getPrototypeOf()【不常用】

> 返回 object 的隐式原型(**proto**)

```js
// 返回object的隐式原型(__proto__)
Object.getPrototypeOf(object);

let arr = [1, 2, 3];
console.log(Object.getPrototypeOf(arr) === Array.prototype); // true
```

#### 学会创建 _空原型_ 的对象

1. **[利用`Object.create()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)**

    > Object.create() 方法用于创建一个新对象, 使用现有的对象来作为新创建对象的原型(prototype)

    ```js
    // 返回一个新对象, 新对象以 target 作为隐式原型
    Object.create(target);

    let o;
    // create an object with null as prototype
    o = Object.create(null);

    o = {};
    // is equivalent to:  o.__proto__ === Object.prototype
    o = Object.create(Object.prototype);

    Object.setPrototypeOf(o, null);
    ```

2. 利用`Object.setPrototypeOf()`

    > 设置 obj 的隐式原型为 prototype

    ```js
    Object.setPrototypeOf(obj, prototype);
    ```

**练习**:

-   toString 方法属于 Object.prototype,

    > 答: 数组原型上覆写了 toString

    ```js
    Object.prototype.toString === Array.prototype.toString;
    // false

    // 数组使用 Object.prototype 的 toString
    var obj = [1, 2, 3];
    console.log(Object.prototype.toString.call(obj)); // [object Array]
    ```

-   如果自己的构造函数希望改变 toString, 如何改变

    > 答: 在原型上(prototype)修改

-   创建一个没有隐式原型的用户对象, 随意添加一些属性

    > 答:**let a = Object.create(null)**

    ```js
    let a = Object.create(null);
    console.log(a); // {}
    ```

    ```js
    let a = { a: 1, b: 2, c: 3 };
    a.__proto__ = null; // 不建议
    console.log(a);
    ```

    <img src="./img/原型链4.png" alt="原型链4" style="zoom:50%;" />

    ```js
    let a = { a: 1, b: 2, c: 3 };
    // a.__proto__ = null; // 不建议
    console.log(a);
    ```

    <img src="./img/原型链5.png" alt="原型链5" style="zoom:50%;" />

    > 打印出来 a 的隐式原型 指向 Object 的 \[[Prototype]]

> **面试题:**

-   1

    ```js
    // 下面的代码输出什么？
    function User() {}
    User.prototype.sayHello = function () {};
    var u1 = new User();
    var u2 = new User();

    console.log(u1.sayHello === u2.sayHello);
    // 我的: true, 答案: true
    console.log(User.prototype === Function.prototype);
    // 我的: false, 答案: false
    console.log(User.__proto__ === Function.prototype);
    // 我的: true, 答案: true
    console.log(User.__proto__ === Function.__proto__);
    // 我的: false, 答案: true
    console.log(u1.__proto__ === u2.__proto__);
    // 我的: true, 答案: true
    console.log(u1.__proto__ === User.__proto__);
    // 我的: false, 答案: false
    console.log(Function.__proto__ === Object.__proto__);
    // 我的: false, 答案: true
    console.log(Function.prototype.__proto__ === Object.prototype.__proto__);
    // 我的: false, 答案: false
    console.log(Function.prototype.__proto__ === Object.prototype);
    // 我的: true, 答案: true
    ```

-   2

    ```js
    // 下面的代码输出什么？（字节）
    console.log({} instanceof Object);
    // 我的: true, 答案: true
    console.log({}.toString instanceof Function);
    // 我的: true, 答案: true
    console.log(Object instanceof Function);
    // 我的: false, 答案: true
    console.log(Function instanceof Object);
    // 我的: true, 答案: true
    ```

-   3

    ```js
    // 下面的代码输出什么？（京东）
    Function.prototype.a = 1;
    Object.prototype.b = 2;
    function A() {}
    var a = new A();
    
    console.log(a.a, a.b);
    // undefined,2
    console.log(A.a, A.b);
    // 1,2
    ```

## 继承

### 会员系统

视频网站有两种会员:

-   普通会员
    -   属性: 用户名、密码
    -   方法: 观看免费视频
-   VIP 会员
    -   属性: 普通会员的所有属性、会员到期时间
    -   方法: 普通会员的所有方法、观看付费视频

如果我们需要使用构造函数来创建会员, 如何书写构造函数才能实现上面的需求？

```js
// 普通会员的构造函数
function User(username, password) {
	this.username = username;
	this.password = password;
}
User.prototype.playFreeVideo = function () {
	console.log('观看免费视频');
};

// VIP会员的构造函数
function VIPUser(username, password, expires) {
	this.username = username;
	this.password = password;
	this.expires = expires;
}
VIPUser.prototype.playFreeVideo = function () {
	console.log('观看免费视频');
};
VIPUser.prototype.playPayVideo = function () {
	console.log('观看付费视频');
};
```

上面的代码出现了两处重复代码:

1. VIPUser 的构造函数中包含重复代码

    ```js
    this.username = username;
    this.password = password;
    ```

    这段代码和 User 构造函数并没有区别, 可以想象得到, 将来也不会有区别, 即:**普通用户该有的属性, VIP 用户一定有**

2. VIPUser 的原型上包含了重复代码

    ```js
    VIPUser.prototype.playFreeVideo = function () {
    	console.log('观看免费视频');
    };
    ```

    这个方法和 User 上的同名方法逻辑完全一致, 可以想象得到, 将来也不会有区别, 即:**普通用户该有的方法, VIP 用户一定有**

> 如何解决上述两处重复？

### 构造器内部的重复

可以将 VIPUser 构造器改写为

```js
function VIPUser(username, password, expires) {
	User.call(this, username, password);
	this.expires = expires;
}
```

### 原型上的重复

只需要将原型链设置为下面的结构即可

<img src="./img/继承.png" alt="继承.png" style="zoom:50%;" />

仅需一句代码即可
**==Object.setPrototypeOf==(VIPUser.prototype, User.prototype)**

```js
Object.setPrototypeOf(VIPUser.prototype, User.prototype);
```

至此, 完美的解决了之前提到的两处重复代码的问题

### 继承

继承是面向对象的概念, 它描述了两个对象类型（类, 构造函数）之间的关系

如果在逻辑上可以描述为: A 不一定是 B, 但 B 一定是 A, 则: B 继承 A、A 派生 B、A 是 B 的父类、B 是 A 的子类

**子类的实例应该自动拥有父类的所有成员**

继承具有两个特性:

-   单根性: 子类最多只有一个父类
-   传递性: 间接父类的成员会传递到子类中

#### Object.setPrototypeOf()

```js
function inherit(Child, Parent) {
	// 在原型链上完成继承
	Object.setPrototypeOf(Child.prototype, Parent.prototype);
}
```

> 过去, 由于没有提供更改隐式原型的方法, 因此这一过程会比较复杂。那时候, 我们使用一种称之为**「圣杯模式」**([增加中间层](https://blog.csdn.net/weixin_42513339/article/details/106185947)) 的办法来达到相同的目的, 这里不做介绍。

## 类语法 - 构造函数的语法糖

过去，函数有着两种调用方式:

```js
function A() {}

A(); // 直接调用
new A(); // 作为构造函数调用
```

这种做法无法从定义上明确函数的用途，因此，ES6 推出了一种全新的语法来书写 **构造函数**

<img src="./img/类-构造函数的语法糖.png" alt="类-构造函数的语法糖" style="zoom:80%;" />

> class 会自动将实例方法挂到原型上

示例 1:

```js
// 旧的写法
function User(firstName, lastName) {
	this.firstName = firstName;
	this.lastName = lastName;
	this.fullName = `${firstName} ${lastName}`;
}
User.isUser = function (u) {
	return !!u && !!u.fullName;
};
User.prototype.sayHello = function () {
	console.log(`Hello, my name is ${this.fullName}`);
};

// 新的等效写法
class User {
	constructor(firstName, lastName) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.fullName = `${firstName} ${lastName}`;
	}
	// 静态方法
	static isUser(u) {
		return !!u && !!u.fullName;
	}
	// 实例方法
	sayHello() {
		console.log(`Hello, my name is ${this.fullName}`);
	}
}
```

示例 2:

```js
function Animal(type, name) {
	this.type = type;
	this.name = name;
}
Animal.prototype.intro = function () {
	console.log(`I am ${this.type}, my name is ${this.name}`);
};
function Dog(name) {
	Animal.call(this, '狗', name);
}
Dog.prototype = Object.create(Animal.prototype); // 设置继承关系

// 新的方式
class Animal {
	constructor(type, name) {
		this.type = type;
		this.name = name;
	}
	intro() {
		console.log(`I am ${this.type}, my name is ${this.name}`);
	}
}
class Dog extends Animal {
	constructor(name) {
		super('狗', name);
	}
}
```

### 传统的构造函数的问题

-   属性和原型方法定义分离，降低了可读性

-   原型成员可以被枚举

-   默认情况下，构造函数仍然可以被当作普通函数使用

### 类的特点

1. **类声明不会被提升，与 let 和 const 一样，==存在[暂时性死区](#暂时性死区)==**

2. **类中的所有代码均在严格模式下执行**

3. **类的所有方法都是不可枚举的(for-in)**
4. **类的所有方法都无法被当作构造函数使用**

5. **类的构造器必须使用 new 来调用**

### 类的其他书写方式

#### 可计算的成员名

> ` [memberName]`
>
> 例子可在 getter 和 setter 中查看 [printName]

#### **getter 和 setter**

> 以前使用 **Object.defineProperty** 定义某个对象成员属性的读取和设置

class 使用 getter 和 setter 控制的属性，不在原型上

```js
const printName = 'print';

class Animal {
	constructor(type, name, age, sex) {
		this.type = type;
		this.name = name;
		this.age = age;
		this.sex = sex;
	}
	//创建一个age属性，并给它加上getter，读取该属性时，会运行该函数
	get age() {
		return this._age + '岁';
	}
	//创建一个age属性，并给它加上setter，给该属性赋值时，会运行该函数
	set age(age) {
		if (typeof age !== 'number') {
			throw new TypeError('age property must be a number');
		}
		if (age < 0) {
			age = 0;
		} else if (age > 1000) {
			age = 1000;
		}
		this._age = age;
	}
	[printName]() {
		console.log(`【种类】: ${this.type}`);
		console.log(`【名字】: ${this.name}`);
		console.log(`【年龄】: ${this.age}`);
		console.log(`【性别】: ${this.sex}`);
	}
}

var a = new Animal('狗', '旺财', 3, '男');
```

##### 与 defineProperty

> 当使用 `get` 关键字时，它和[`Object.defineProperty()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) 有类似的效果

-   在[`classes`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes)中使用时，二者有细微的差别。

    -   当使用 `get` 关键字时，属性将被定义在**实例的原型**上

    -   当使用[`Object.defineProperty()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)时，属性将被定义在**实例自身**上。

<img src="./img/getVsdefineProperty.png" alt="getVsdefineProperty" style="zoom:80%;" />

```js
class Example {
	get hello() {
		return 'world';
	}
}

const obj = new Example();
console.log(obj.hello);
// "world"

console.log(Object.getOwnPropertyDescriptor(obj, 'hello'));
// undefined

console.log(Object.getOwnPropertyDescriptor(Object.getPrototypeOf(obj), 'hello'));
// { configurable: true, enumerable: false, get: function get hello() { return 'world'; }, set: undefined }
```

#### **静态成员**

构造函数本身的成员

使用 static 关键字定义的成员即静态成员

#### 字段初始化器（ES7）

> **语法糖，类中可直接书写 _属性名 ===== 属性值_ 相当于在构造函数(constructor) 里面定义属性**

注意:

-   使用 static 的字段初始化器，添加的是静态成员

-   没有使用 static 的字段初始化器，添加的成员位于对象上

-   箭头函数在字段初始化器位置上，指向当前对象

    > 浪费内存, 这样声明的函数不在原型上 但是绑定了 this

```js
class Test {
	b = 321;
	static c = 321;
	constructor() {
		this.a = 123;
		// this.print = () => {
		// 	console.log(this.a);
		// };
	}
	// 相当于在构造函数中声明 所以this绑定在当前对象 但是print没在原型上
	print = () => {
		console.log(this.a);
	};
}
const t1 = new Test();
const t2 = new Test();
let p = t1.print;
p(); // 123
console.log(t1.print === t2.print); // false - 没在原型上
console.log(t1); // Test { b: 321, print: [Function: print], a: 123 }
console.log(Test); // [class Test] { c: 321 }
```

#### 类表达式

```js
const A = class {
	//匿名类，类表达式
	a = 1;
	b = 2;
	static c = 3;
};
const a = new A();
console.log(a);
```

#### 装饰器（ES7）(Decorator)

横切关注点

装饰器的本质是一个函数

```js
class Test {
	@Obsolete
	print() {
		console.log('print方法');
	}
}
function Obsolete(target, methodName, descriptor) {
	// function Test
	// print
	// { value: function print(){}, ... }
	// console.log(target, methodName, descriptor);
	const oldFunc = descriptor.value;
	descriptor.value = function (...args) {
		console.warn(`${methodName}方法已过时`);
		oldFunc.apply(this, args);
	};
}
```

### 类的继承

关键字:

#### extends

> [**`extends`** ](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes/extends)关键字用于 [类声明](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/class)或者 [类表达式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/class)中，以创建一个类，该类是另一个类的子类(继承)。

`extends` 关键字用来创建一个普通类或者内建对象的子类。

继承的 `.prototype` 必须是一个 [`Object`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object) 或者 [`null`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/null)。

> // 在原型链上完成继承
> Object.setPrototypeOf(Child.prototype, Parent.prototype);

#### super

[`super`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/super)关键字用于访问对象字面量或类的原型（[[Prototype]]）上的属性，或调用父类的构造函数

```js
super([arguments]); // 调用父类的构造函数
super.propertyOnParent; // 属性查询
super[expression];
```

-   `super.prop` 和 `super[expr]` 表达式在 [类](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes) 和 [对象字面量](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Object_initializer) 任何 [方法定义](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Method_definitions) 中都是有效的。
    -   ==如果当作对象使用，则表示父类的原型==
-   `super(...args)` 表达式在类的构造函数中有效。

    -   ==直接当作函数调用，表示父类构造函数==

`super` 关键字有两种使用方式:

-   作为“函数调用”（`super(...args)`），
-   作为“属性查询”（`super.prop` 和 `super[expr]`）。

**备注:** `super` 是一个关键字，并且有一些特殊的语法结构。==super 不是一个指向原型对象的变量==。试图读取 `super` 本身会导致 [SyntaxError](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError)。

```js
const child = {
  myParent() {
    console.log(super); // SyntaxError: 'super' keyword unexpected here
  },
};
```

```js
class Animal {
	constructor(type, name) {
		this.type = type;
		this.name = name;
	}
	intro() {
		console.log(`I am ${this.type}, my name is ${this.name}`);
	}
}
class Dog extends Animal {
	constructor(name) {
		super('狗', name);
		// 子类特有属性
		this.nickName = 'aaa';
	}
}
```

注意:
ES6 要求:

> 如果定义了 ==constructor== ，并且该类是子类，则必须在 ==constructor 的第一行手动调用父类的构造函数==
>
> **==如果子类不写 constructor，则会有默认的构造器，该构造器需要的参数和父类一致，并且自动调用父类构造器==**

**冷知识**

-   用 JS 制作抽象类

    -   抽象类: 一般是父类，不能通过该类创建对象 ([new.target](#new.target))

    ```js
    class Animal {
    	constructor(type, name, age, sex) {
    		// console.log(new.target, new.target === Animal); // [class Animal] true
    		if (new.target === Animal) {
    			throw new TypeError('你不能直接创建Animal的对象，应该通过子类创建');
    		}
    		this.type = type;
    		this.name = name;
    		this.age = age;
    		this.sex = sex;
    	}
    	print() {
    		console.log(`【种类】: ${this.type}`);
    		console.log(`【名字】: ${this.name}`);
    		console.log(`【年龄】: ${this.age}`);
    		console.log(`【性别】: ${this.sex}`);
    	}

    	jiao() {
    		throw new Error('动物怎么叫的？');
    	}
    }

    class Dog extends Animal {
    	constructor(name, age, sex) {
    		super('犬类', name, age, sex);
    		// 子类特有的属性
    		this.loves = '吃骨头';
    	}
    	print() {
    		//调用父类的print
    		super.print();
    		//自己特有的代码
    		console.log(`【爱好】: ${this.loves}`);
    	}
    	//同名方法，会覆盖父类
    	jiao() {
    		console.log('旺旺！');
    	}
    }

    const a = new Dog('旺财', 3, '公');
    a.print();
    ```

-   正常情况下，this 的指向，this 始终指向具体的类的对象

## new 的原理

new 实际上是在堆内存中开辟一个空间。

① 创建一个空对象, 构造函数中的 this 指向这个空对象；
② 这个新对象被执行[ [ 原型 ] ]连接；
③ 执行构造函数方法, 属性和方法被添加到 this 引用的对象中；
④ 如果构造函数中没有返回其它对象, 那么返回 this, 即创建的这个的新对象, 否则, 返回构造函数中返回的对象。

-   手写 new

    ```js
    function _new() {
    	let target = {}; //创建的新对象
    	let [constructor, ...args] = [...arguments];
    	//执行[[原型]]连接,target是constructor的实例
    	target.__proto__ = constructor.prototype;
    	//执行构造函数,将属性或方法添加到创建的空对象上
    	let result = constructor.prototype;
    	if (result && (typeof result == 'object' || typeof result == 'function')) {
    		//如果构造函数执行的结构返回的是一个对象,那么返回这个对象
    		return result;
    	}
    	//如果构造函数返回的不是一个对象,返回创建的对象
    	return target;
    }
    ```

    ```js
    // 声明myNew函数
    let myNew = function (fun, ...args) {
    	// 1.创建一个新对象
    	let obj = {};
    
    	// 2.让this指向这个新对象,新对象的__proto__ = 构造函数的prototype
    	// 1.  obj.__proto__ =  fun.prototype 的方式, 不推荐
    	// 2.  .create()方法,使用现有对象的prototype来作为新创建对象的prototype
    	obj = Object.create(fun.prototype);
    
    	// 3.执行构造函数的代码, 将方法与属性添加到新对象中
    	let result = fun.call(obj, ...args);
    
    	// 4.返回执行完毕的新对象
    	return typeof result === 'object' || result instanceof Function ? result : obj;
    	//如果构造函数返回引用类型, 直接返回, 否则返回obj
    };
    ```

自己理解的 new:

new 实际上是在堆内存中开辟一个新的空间。

1. 首先创建一个空对象 obj,
2. 然后呢,把这个空对象的原型(**\_\_proto\_\_**)和构造函数的原型对象(**constructor.prototype**)连接(说白了就是等于)；
3. 然后执行函数中的代码, 就是为这个新对象添加属性和方法。
4. 最后进行判断其返回值, 如果构造函数返回的是一个对象,那就返回这个对象, 如果不是, 那就返回我们创建的对象。

## this

-   在全局代码中使用 this, 指代全局对象

    > 在真实的开发中, 很少在全局代码使用 this

-   **在 ==函数中== 使用 this, 它的指向完全取决于函数是如何被==调用的==**

    | 显、隐   | 调用方式                                                     | 示例                                                         | 函数中this指向 | 返回                                                         |
    | -------- | ------------------------------------------------------------ | ------------------------------------------------------------ | -------------- | ------------------------------------------------------------ |
    | new绑定  | **new调用**                                                  | `new method()`                                               | 新对象         |                                                              |
    | 隐式绑定 | **直接调用**                                                 | `method()`                                                   | 全局对象       |                                                              |
    |          | **对象调用**                                                 | `obj.method()`                                               | 前面的对象     |                                                              |
    | 显式绑定 | **call**                                                     | `method.call(thisArg, arg1, arg2, ...)`                      | 第一个参数     | 调用有指定 **`this`** 值和参数的函数的**结果**。\|undefined。 |
    |          | **apply**                                                    | `method.apply(thisArg)` <br/>`method.apply(thisArg, argsArray)` | 第一个参数     | 调用有指定 **`this`** 值和参数的函数的**结果**。             |
    |          | **[bind](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)** | `method.bind(thisArg[, arg1[, arg2[, ...]]])`                | 第一个参数     | **返回一个**原**函数**的拷贝，有指定的 **`this`** 值和初始参数。 |

### 关于普通函数和箭头函数的 this 指向问题详解

1. 普通函数 this 指向问题

    1. 总是代表着它的直接调用者, 如 obj.fn, fn 里的最外层 this 就是指向 obj

    2. 默认情况下, 没有直接调用者, this 指向 window

    3. 严格模式下 (设置了’use strict’) , this 为 undefined

    4. 当使用 call, apply, bind (ES5 新增) 绑定的, this 指向绑定对象
       **注释**:

        - **==call==** 方法第一个参数是 this 的指向, 后面传入的是一个**参数列表**。当第一个参数为 null、undefined 的时候, 默认指向 window。

            - 返回值
                > 使用调用者提供的 this 值和参数调用该函数的返回值。若该方法没有返回值，则返回 undefined
            - 描述
                > `call()` 允许为不同的对象分配和调用属于一个对象的函数/方法。
                > `call()` 提供新的 **this** 值给当前调用的函数/方法。你可以使用 `call` 来实现继承: 写一个方法，然后让另外一个新的对象来继承它（而不是在新对象中再写一次这个方法）。

        - **==apply==** 方法接受两个参数, 第一个参数是 this 的指向, 第二个参数是一个**参数数组**。当第一个参数为 null、undefined 的时候, 默认指向 window。

            - 返回值

                > 调用有指定 **`this`** 值和参数的函数的**结果**。

            - 描述
                > `apply` 与 [`call()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call) 非常相似，不同之处在于提供参数的方式。`apply` 使用参数数组而不是一组参数列表。`apply` 可以使用数组字面量（array literal），如 `fun.apply(this, ['eat', 'bananas'])`，或数组对象，如 `fun.apply(this, new Array('eat', 'bananas'))`。
                >
                > 你也可以使用 [`arguments`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/arguments) 对象作为 `argsArray` 参数。`arguments` 是一个函数的局部变量。它可以被用作被调用对象的所有未指定的参数。这样，你在使用 apply 函数的时候就不需要知道被调用对象的所有参数。你可以使用 arguments 来把所有的参数传递给被调用对象。被调用对象接下来就负责处理这些参数。
                >
                > 从 ECMAScript 第 5 版开始，可以使用任何种类的类数组对象，就是说只要有一个 `length` 属性和 `(0..length-1)` 范围的整数属性。例如现在可以使用 [`NodeList`](https://developer.mozilla.org/zh-CN/docs/Web/API/NodeList) 或一个自己定义的类似 `{'length': 2, '0': 'eat', '1': 'bananas'}` 形式的对象。

            ```js
            function m(a, b) {
            	console.log(this, a, b);
            }

            var arr = {};
            m.call(arr, 1, 2); // 调用m函数, 让它里面的this指向arr
            m.apply(arr, [1, 2]);
            ```

        - **==bind==** 方法和 call 方法很相似, 第一个参数是 this 的指向, 从第二个参数开始是接收的参数列表。==区别在于 bind 方法返回值是函数以及 bind 接收的参数列表的使用。== **低版本浏览器没有该方法, 需要自己手动实现**

            - 返回值

                > **返回一个**原**函数**的拷贝，并拥有指定的 **`this`** 值和初始参数。

            - 描述

                > `bind()` 函数创建一个新的*绑定函数（bound function）*。调用绑定函数通常会执行其所包装的函数，也称为*目标函数（target function）*。绑定函数将绑定时传入的参数（包括 `this` 的值和前几个参数）提前存储为其内部状态。而不是在实际调用时传入。通常情况下，你可以将 `const boundFn = fn.bind(thisArg, arg1, arg2)` 和 `const boundFn = (...restArgs) => fn.call(thisArg, arg1, arg2, ...restArgs)` 构建的绑定函数的调用效果视为等效（但就构建 `boundFn` 的过程而言，不是二者等效的）。
                >
                > ```js
                > 'use strict'; // 防止 `this` 被封装到到包装对象中
                >
                > function log(...args) {
                > 	console.log(this, ...args);
                > }
                > const boundLog = log.bind('this value', 1, 2);
                > const boundLog2 = boundLog.bind('new this value', 3, 4);
                > boundLog2(5, 6); // "this value", 1, 2, 3, 4, 5, 6 ???
                >
                > // 绑定函数可以通过调用 boundFn.bind(thisArg, /*more args*/) 进一步进行绑定，从而创建另一个绑定函数 boundFn2。新绑定的 thisArg 值会被忽略，因为 boundFn2 的目标函数是 boundFn，而 boundFn 已经有一个绑定的 this 值了。当调用 boundFn2 时，它会调用 boundFn，而 boundFn 又会调用 fn。fn 最终接收到的参数按顺序为：boundFn 绑定的参数、boundFn2 绑定的参数，以及 boundFn2 接收到的参数。
                > ```
                >
                > 如果目标函数是可构造的，绑定函数也可以使用 `new` 运算符进行构造。这样做的效果就好像目标函数本身被构造一样。前置的参数会像通常一样传递给目标函数，而提供的 `this` 值会被忽略（因为构造函数会准备自己的 `this`，如 [`Reflect.construct`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/construct) 的参数所示）。如果直接构造绑定函数，[`new.target`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new.target) 将指向目标函数（也就是说，绑定函数对 `new.target` 是透明的）。

            - 手写 bind

                ```js
                Function.prototype.myBind = function (context, ...args) {
                	// 调用 bind 的不是函数，需要抛出异常
                	if (typeof this !== 'function') {
                		throw new Error('Function.prototype.bind - what is trying to be bound is not callable');
                	}
                	context = context !== null && context !== undefined ? Object(context) : window;
                
                	context.fn = this; // 这一步不能放在返回的函数里面
                
                	// 返回一个函数
                	return function Fn(...args2) {
                		// 处理参数，调用函数，返回结果
                		const newArr = [...args, ...args2];
                		const result = context.fn(...newArr);
                		delete context.fn;
                		return result;
                	};
                };
                
                Function.prototype.mybind = function (context, ...args1) {
                	if (this === Function.prototype) {
                		throw new TypeError('Error');
                	}
                	const _this = this;
                	return function F(...args2) {
                		if (this instanceof F) {
                			return new _this(...args1, ...args2);
                		}
                		return _this.apply(context, args1.concat(args2));
                	};
                };
                ```

2. 箭头函数的 this 指向问题
    1. 默认指向定义它时, 所处上下文的对象的 this 指向。即 ES6 箭头函数里 this 的指向就是上下文里对象 this 指向, 偶尔没有上下文对象, this 就指向 window
    2. 即使是 call, apply, bind 等方法也不能改变箭头函数 this 的指向
3. 构造函数中的 this 指向 new 的对象

```js
function fn() {
	console.log(this);
}
const Fn = new fn();
console.log(Fn); // fn{}
```

## 标准库

### 包装类

如果尝试着把原始类型（number、string、boolean）当做对象使用, JS 会自动将其转换为对应包装类的实例

#### Number

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number

| API                                                                                                                                         | 含义                             | 备注                         |
| ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ---------------------------- |
| [Number.NaN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/NaN)                                   | 表示一个数学上并不存在的数字     | 可以直接书写为`NaN`          |
| [Number.isNaN()(**静态方法**)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN)               | 判断传入的值是否是 NaN           | 可以直接书写为`isNaN`        |
| [Number.isInteger()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger)                     | 判断传入的值是否是整数           |                              |
| [Number.parseInt()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/parseInt)                       | 把传入的值转换为整数形式返回     | 可以直接书写为`parseInt()`   |
| [Number.parseFloat()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/parseFloat)                   | 把传入的值转换为小数形式返回     | 可以直接书写为`parseFloat()` |
| [Number.prototype.toFixed()(**实例方法**)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed) | 将当前数字保留指定位数的小数返回 | 传入小数位数                 |
| [Number.prototype.toString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/tostring)             | 将当前数字转换为字符串返回       | 传入进制 2-36                |

#### String

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String

| API                                                                                                                                        | 含义                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 备注                                                                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [String.fromCharCode()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode)              | 根据编码值得到一个字符                                                                                                                                                                                                                                                                                                                                                                                                                               | 传入一个或多个编码值                                                                                                                                                                                                   |
| [String.prototype.length](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/length)                  | 得到字符串的长度                                                                                                                                                                                                                                                                                                                                                                                                                                     |                                                                                                                                                                                                                        |
| [String.prototype.charAt()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/charAt)                | 字符串中的字符从左向右索引，第一个字符的索引值为 0，最后一个字符（假设该字符位于字符串 stringName 中）的索引值为 `stringName.length - 1`。如果指定的 index 值超出了该范围，则返回一个空字符串。                                                                                                                                                                                                                                                      | 一个介于 0 和字符串长度减 1 之间的整数。(0~length-1) 如果没有提供索引，charAt() 将使用 0。                                                                                                                             |
| [String.prototype.charCodeAt()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt)        | 返回 `0` 到 `65535` 之间的整数，表示给定索引处的 UTF-16 代码单元 (下标位置的 ==码元==)<br />UTF-16 编码单元匹配能用一个 UTF-16 编码单元表示的 Unicode 码点。如果 Unicode 码点不能用一个 UTF-16 编码单元表示（因为它的值大于`0xFFFF`），则所返回的编码单元会是这个码点代理对的第一个编码单元) 。如果你想要整个码点的值，使用 [`codePointAt()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt)。 | 传入下标<br />一个大于等于 `0`，小于字符串长度的整数。如果不是一个数值，则默认为 `0`                                                                                                                                   |
| [==String.prototype.codePointAt ()==](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt) | 返回 一个 Unicode 编 码点 值的非负整数                                                                                                                                                                                                                                                                                                                                                                                                               | 这个字符串中需要转码的元素的位置                                                                                                                                                                                       |
| [==String.prototype.includes()==](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/includes)        | 判断当前字符串是否包含某个子串                                                                                                                                                                                                                                                                                                                                                                                                                       | 传入子串<br />**`includes(subStr)`** <br />**`includes(subStr, position)`**                                                                                                                                            |
| [String.prototype.indexOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf)              | 判断某个字符串在当前字符串中的第一个下标位置                                                                                                                                                                                                                                                                                                                                                                                                         | 如果没有，返回-1                                                                                                                                                                                                       |
| [String.prototype.lastIndexOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/lastIndexOf)      | 判断某个字符串在当前字符串中的最后一个下标位置                                                                                                                                                                                                                                                                                                                                                                                                       | 如果没有，返回-1                                                                                                                                                                                                       |
| [==String.prototype.endsWith()==](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith)        | 判断某个字符串是否以指定的字符串结束                                                                                                                                                                                                                                                                                                                                                                                                                 | 传入一个字符串                                                                                                                                                                                                         |
| [==String.prototype.startsWith()==](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith)    | 判断某个字符串是否以指定的字符串开始                                                                                                                                                                                                                                                                                                                                                                                                                 | 传入一个字符串                                                                                                                                                                                                         |
| [String.prototype.padStart()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/padStart)            | 将当前的字符串按照指定的字符在字符串开始位置填充到指定的位数，返回填充后的字符串                                                                                                                                                                                                                                                                                                                                                                     | 传入位数、填充字符<br />**`padStart(length)`** <br />**`padStart(length, padStr)`**                                                                                                                                    |
| [String.prototype.padEnd()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd)                | 将当前的字符串按照指定的字符在字符串结束位置填充到指定的位数，返回填充后的字符串                                                                                                                                                                                                                                                                                                                                                                     | 传入位数、填充字符<br />**`padEnd(length)`** <br />**`padEnd(length, padString)`**                                                                                                                                     |
| [String.prototype.split()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/split)                  | 把当前字符串按照某个字符串分割成一个字符串数组返回                                                                                                                                                                                                                                                                                                                                                                                                   | 传入分隔符                                                                                                                                                                                                             |
| [String.prototype.substring()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/substring)          | 返回一个字符串在开始索引到结束索引之间的一个子集, 或从开始索引直到字符串的末尾的一个子集                                                                                                                                                                                                                                                                                                                                                             | 传入开始字符、结束字符                                                                                                                                                                                                 |
| [String.prototype.trim()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/Trim)                    | 从字符串的两端删除空白字符，返回新字符串                                                                                                                                                                                                                                                                                                                                                                                                             | 无参数                                                                                                                                                                                                                 |
| [String.prototype.trimStart()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/trimStart)          | 从字符串的开头删除空白字符，返回新字符串                                                                                                                                                                                                                                                                                                                                                                                                             | 无参数                                                                                                                                                                                                                 |
| [String.prototype.trimEnd()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/trimEnd)              | 从字符串的末端删除空白字符，返回新字符串                                                                                                                                                                                                                                                                                                                                                                                                             | 无参数                                                                                                                                                                                                                 |
| [String.prototype.toUpperCase()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase)      | 将调用该方法的字符串转为大写形式并返回                                                                                                                                                                                                                                                                                                                                                                                                               | 无参数                                                                                                                                                                                                                 |
| [String.prototype.toLowerCase()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase)      | 将调用该方法的字符串转为小写形式并返回                                                                                                                                                                                                                                                                                                                                                                                                               | 无参数                                                                                                                                                                                                                 |
| [String.prototype.replace()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replace)              | 替换字符串中的第一个对应字符为新字 符                                                                                                                                                                                                                                                                                                                                                                                                                | **str.replace(reg\|substr, newSubStr\|fn)**                                                                                                                                                                            |
| [String.prototype.replaceAll()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replaceall)        | 替换字符串中的所有对应字符为新字符                                                                                                                                                                                                                                                                                                                                                                                                                   |                                                                                                                                                                                                                        |
| [String.prototype.repeat()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/repeat)                | **`repeat()`** 构造并返回一个新字符串，该字符串包含被连接在一起的指定数量的字符串的副本。                                                                                                                                                                                                                                                                                                                                                            | `str.repeat(count)`<br />介于 `0` 和 [`+Infinity`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/POSITIVE_INFINITY) 之间的整数。表示在新构造的字符串中重复了多少遍原字符串。 |

-   **练习**

    -   生成一个 a-z 的字符串

    ```js
    // 生成一个a-z的字符串
    let a = '';
    for (let i = 'a'.charCodeAt(0); i <= 'z'.charCodeAt(0); i++) {
    	a += String.fromCharCode(i);
    }
    console.log(a); // abcdefghijklmnopqrstuvwxyz
    ```

    -   将下面的字符串分割成一个单词数组, 同时去掉数组中每一项的,和.

    ```js
    // 将下面的字符串分割成一个单词数组, 同时去掉数组中每一项的,和.
    var str = 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Adipisci impedit voluptatem cupiditate, est corporis, quis sunt quod tempore officiis hic voluptates eaque commodi. Repudiandae provident animi quia qui harum quasi.';
    
    str = str.replaceAll(',', '').replaceAll('.', '').split(' ');
    console.log(str);
    ```

    -   得到下面字符串中第一个 i 和最后一个 i 之间的子串

    ```js
    // 得到下面字符串中第一个i和最后一个i之间的子串
    
    var str = 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Adipisci impedit voluptatem cupiditate, est corporis, quis sunt quod tempore officiis hic voluptates eaque commodi. Repudiandae provident animi quia qui harum quasi.';
    
    let startIdx = str.indexOf('i');
    let lastIdx = str.lastIndexOf('i');
    console.log(str.substring(startIdx + 1, lastIdx));
    ```

    -   将下面的 rgb 格式转换成为 HEX 格式

    ```js
    // 将下面的rgb格式转换成为HEX格式
    var rgb = 'rgb(255, 255, 255)';
    
    let arr = rgb.replace('rgb', '').replace('(', '').replace(')', '').split(',');
    let r = Number.parseInt(arr[0]).toString(16);
    let g = Number.parseInt(arr[1]).toString(16);
    let b = Number.parseInt(arr[2]).toString(16);
    let ret = '#' + r + g + b;
    console.log(ret);
    ```

    -   name 转换成驼峰命名

    ```js
    // name转换成驼峰命名
    var name2 = 'has own property'; // --> hasOwnProperty
    
    let arr = name2.split(' ');
    for (let i = 1; i < arr.length; i++) {
    	let e = arr[i];
    	arr[i] = e.replace(e[0], e[0].toUpperCase());
    	// console.log(e);
    }
    name2 = arr.join('');
    console.log(name2);
    ```

##### 字符编码问题

> 早期，由于存储空间宝贵，Unicode 使用 16 位二进制来存储文字。我们将一个 16 位的二进制编码叫做一个码元（Code Unit）。后来，由于技术的发展，Unicode 对文字编码进行了扩展，将某些文字扩展到了 32 位（占用两个码元），并且，将某个文字对应的二进制数字叫做码点（Code Point）。

事例:

```js
const text = '𠮷'; //占用了两个码元（32位）

console.log('字符串长度: ', text.length);
console.log('使用正则测试: ', /^.$/u.test(text));
console.log('得到第一个码元: ', text.charCodeAt(0));
console.log('得到第二个码元: ', text.charCodeAt(1));

//𠮷: \ud842\udfb7
console.log('得到第一个码点: ', text.codePointAt(0));
console.log('得到第二个码点: ', text.codePointAt(1));
```

ES6 为了解决这个困扰，为字符串提供了方法: codePointAt，根据字符串码元的位置得到其码点。

同时，ES6 为正则表达式添加了一个[ **flag: u**](#标识)，如果添加了该配置，则匹配时，使用码点匹配

```js
/**
 * 判断字符串char，是32位，还是16位
 * @param {*} char
 */
function is32bit(char, i) {
	//如果码点大于了16位二进制的最大值，则其是32位的
	return char.codePointAt(i) > 0xffff;
}

/**
 * 得到一个字符串码点的真实长度
 * @param {*} str
 */
function getLengthOfCodePoint(str) {
	var len = 0;
	for (let i = 0; i < str.length; i++) {
		//i在索引码元
		if (is32bit(str, i)) {
			//当前字符串，在i这个位置，占用了两个码元
			i++;
		}
		len++;
	}
	return len;
}

console.log('𠮷是否是32位的: ', is32bit('𠮷', 0));
console.log('ab𠮷ab的码点长度: ', getLengthOfCodePoint('ab𠮷ab'));
```

##### 模板字符串

> **模板字面量**是用反引号（```）分隔的字面量，允许[多行字符串](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Template_literals#多行字符串)、带嵌入表达式的[字符串插值](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Template_literals#字符串插值)和一种叫[带标签的模板](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Template_literals#带标签的模板)的特殊结构。

模板字面量有时被非正式地叫作*模板字符串*，因为它们最常被用作[字符串插值](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Template_literals#字符串插值)（通过替换占位符来创建字符串）。然而，带标签的模板字面量可能不会产生字符串——它可以与自定义[标签函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Template_literals#带标签的模板)一起使用，来对模板字面量的不同部分执行任何操作。

###### 语法

```js
`string text``string text line 1
 string text line 2``string text ${expression} string text`;

tagFunction`string text ${expression} string text`;
```

###### 参数

-   `string text`

    将成为模板字面量的一部分的字符串文本。几乎允许所有字符，包括[换行符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Lexical_grammar#行终止符)和其他[空白字符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Lexical_grammar#空白符)。但是，除非使用了[标签函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Template_literals#带标签的模版字面量及转义序列)，否则无效的转义序列将导致语法错误。

-   `expression`

    要插入当前位置的表达式，其值被转换为字符串或传递给 `tagFunction`。

-   `tagFunction`

    如果指定，将使用模板字符串数组和替换表达式调用它，返回值将成为模板字面量的值。见[带标签的模板](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Template_literals#带标签的模板)。

###### 描述

模板字面量用反引号（```）括起来，而不是双引号（`"`）或单引号（`'`）。 除了普通字符串外，模板字面量还可以包含*占位符*——一种由美元符号和大括号分隔的嵌入式表达式: `${expression}`。字符串和占位符被传递给一个函数（要么是默认函数，要么是自定义函数）。默认函数（当未提供自定义函数时）只执行[字符串插值](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Template_literals#字符串插值)来替换占位符，然后将这些部分拼接到一个字符串中。

若要提供自定义函数，需在模板字面量之前加上函数名（结果被称为[**带标签的模板**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Template_literals#带标签的模板)）。此时，模板字面量被传递给你的标签函数，然后就可以在那里对模板文本的不同部分执行任何操作。

若要转义模板字面量中的反引号（```），需在反引号之前加一个反斜杠（`\`）。

```js
`\`` === '`'; // true
```

美元符号 `$` 也可以被转义，来阻止插值。

```js
`\${1}` === '${1}'; // true
```

###### 带标签的模板

> *带标签的*模板是模板字面量的一种更高级的形式，它允许你使用函数解析模板字面量。标签函数的第一个参数包含一个字符串数组，其余的参数与表达式相关。你可以用标签函数对这些参数执行任何操作，并返回被操作过的字符串（或者，也可返回完全不同的内容，见下面的示例）。用作标签的函数名没有限制。

```js
var love1 = '秋葵';
var love2 = '香菜';

var text = myTag`邓哥喜欢${love1}，邓哥也喜欢${love2}。`;

//相当于:
// text = myTag(["邓哥喜欢", "，邓哥也喜欢", "。"], "秋葵", "香菜")

function myTag(parts) {
	const values = Array.prototype.slice.apply(arguments).slice(1);
	let str = '';
	for (let i = 0; i < values.length; i++) {
		str += `${parts[i]}: ${values[i]}`;
		if (i === values.length - 1) {
			str += parts[i + 1];
		}
	}
	return str;
}

console.log(text);
```

标签函数接收到的**第一个参数是一个字符串数组**。对于任何模板字面量，其长度等于替换次数（`${…}` 出现次数）加一，因此总是非空的。对于任何特定的带标签的模板字面量表达式，无论对字面量求值多少次，都将始终使用完全相同的字面量数组调用标签函数。

###### 原始字符串

> 在标签函数的第一个参数中，存在一个特殊的属性 `raw` ，我们可以通过它来访问模板字符串的原始字符串，而无需[转义特殊字符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Grammar_and_types#在字符串中使用的特殊字符)。

```js
function tag(strings) {
	console.log(strings.raw[0]);
}

tag`string text line 1 \n string text line 2`;
// logs "string text line 1 \n string text line 2" ,
// including the two characters '\' and 'n'
```

另外，使用 [`String.raw()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/raw) 方法创建原始字符串和使用默认模板函数和字符串连接创建是一样的。

```js
let str = String.raw`Hi\n${2+3}!`;
// "Hi\\n5!"

str.length;.
// 6

str.split('').join(',');.
// "H,i,\\,n,5,!"
```

如果字面量不包含任何转义序列，`String.raw` 函数就像一个“identity”标签。如果你想要一个始终像不带标签的字面量那样的实际标识标签，可以用自定义函数，将“cooked”（例如，经转义序列处理过的）字面量数组传递给 `String.raw`，将它们当成原始字符串。

```js
const identity = (strings, ...values) => String.raw({ raw: strings }, ...values);
console.log(identity`Hi\n${2 + 3}!`);
// Hi
// 5!
```

这对于许多工具来说很有用，它们要对以特定名称为标签的字面量作特殊处理。

```js
const html = (strings, ...values) => String.raw({ raw: strings }, ...values);
// 一些格式化程序会将此字面量的内容格式化为 HTML
const doc = html`<!DOCTYPE html>
	<html lang="en-US">
		<head>
			<title>Hello</title>
		</head>
		<body>
			<h1>Hello world!</h1>
		</body>
	</html>`;
```

### 数学

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math

| API                                                                                                           | 含义                        | 备注             |
| ------------------------------------------------------------------------------------------------------------- | --------------------------- | ---------------- |
| [Math.PI](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/PI)           | 得到圆周率 π                |                  |
| [Math.abs()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/abs)       | 求某个数绝对值              | 传入一个数       |
| [Math.ceil()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/ceil)     | 向上取整                    | 传入一个数       |
| [Math.floor()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/floor)   | 向下取整                    | 传入一个数       |
| [Math.max()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/max)       | 求一个数列中的最大值        | 把数列依次传入   |
| [Math.min()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/min)       | 求一个数列中的最小值        | 把数列依次传入   |
| [Math.random()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/random) | 得到一个 0-1 之间的随机小数 | 无参；无法取到 1 |
| [Math.round()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/round)   | 返回四舍五入的结果          | 传入一个数       |

-   小技巧
    Math.max()参数 0 个或多个数字, 将在其中选择, 并返回最大的值。如果数组选取最大数值 可以使用 apply

    ```js
    Math.max.apply(null, arr);
    ```

-   **练习**

    -   得到一个指定范围内的随机整数

    ```js
    /**
     * 得到一个指定范围内的随机整数
     * @param {number} min 范围的最小值
     * @param {number} max 范围的最大值（无法取到最大值）
     * @return {number} 范围内的随机整数
     */
    function getRandom(min, max) {
    	return Math.floor(Math.random() * (max - min) + min);
    }
    ```

    -   得到一个指定长度的随机字符串

    ```js
    /**
     * 得到一个指定长度的随机字符串
     * 字符串包含: 数字、字母
     * @param {number} length 字符串的长度
     * @return {number} 随机字符串
     */
    function getRandomString(length) {
    	return Math.random()
    		.toString(36) // 36进制
    		.substring(2, 2 + length);
    }
    console.log(getRandomString(11)); // hom5q0o91fs
    ```

### 日期

#### 时间基础知识

##### 单位

| 单位               | 名称 | 换算                  |
| ------------------ | ---- | --------------------- |
| hour               | 小时 | 1 day = 24 hours      |
| minute             | 分钟 | 1 hour = 60 minutes   |
| second             | 秒   | 1 minute = 60 seconds |
| millisecond （ms） | 毫秒 | 1 second = 1000 ms    |
| nanosecond （ns）  | 纳秒 | 1 ms = 1000 ns        |

##### GMT 和 UTC

世界划分为 24 个时区, 北京在东 8 区, 格林威治在 0 时区。

<img src="./img/世界时区划分.webp" alt="世界时区划分" style="zoom:50%;" />

**GMT**: Greenwish Mean Time 格林威治世界时。太阳时, 精确到毫秒。

**UTC**: Universal Time Coodinated 世界协调时。以原子时间为计时标准, 精确到纳秒。

> 国际标准中, 已全面使用 UTC 时间, 而不再使用 GMT 时间

GMT 和 UTC 时间在文本表示格式上是一致的, 均为`星期缩写, 日期 月份 年份 时间 GMT`, 例如:

```
Thu, 27 Aug 2020 08:01:44 GMT
```

另外, ISO 8601 标准规定, 建议使用以下方式表示时间:

```
YYYY-MM-DDTHH:mm:ss.msZ
例如:
2020-08-27T08:01:44.000Z
```

**GMT、UTC、ISO 8601 都表示的是零时区的时间**

##### Unix 时间戳

> Unix 时间戳（Unix Timestamp）是 Unix 系统最早提出的概念

它将 UTC 时间 1970 年 1 月 1 日凌晨作为起始时间, 到指定时间经过的秒数（毫秒数）

##### 程序中的时间处理

**程序对时间的计算、存储务必使用 UTC 时间, 或者时间戳**

**在和用户交互时, 将 UTC 时间或时间戳转换为更加友好的文本**

<img src="./img/UTCDate.png" alt="UTCDate.png" style="zoom:50%;" />

思考下面的问题:

1. 用户的生日是本地时间还是 UTC 时间？
2. 如果要比较两个日期的大小, 是比较本地时间还是比较 UTC 时间？
3. 如果要显示文章的发布日期, 是显示本地时间还是显示 UTC 时间？
4. `北京时间2020-8-28 10:00:00`和`格林威治2020-8-28 02:00:00`, 两个时间哪个大, 哪个小？
5. `北京的时间戳为0`和`格林威治的时间戳为0`, 它们的时间一样吗？
6. 一个中国用户注册时填写的生日是`1970-1-1`, 它出生的 UTC 时间是多少？时间戳是多少？

#### 日期 API

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date

构造函数:

```js
new Date(); // 得到一个当前日期对象
new Date(value); // 根据时间戳得到一个日期对象
new Date(dateString); // 根据一个标准日期字符串得到一个日期对象
new Date(year, monthIndex [, day [, hours [, minutes [, seconds [, milliseconds]]]]]); // 根据年、月、日、小时、分钟、秒、毫秒得到一个日期对象
```

| API                                                                                                                                       | 含义                   | 备注                      |
| ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ------------------------- |
| [Date.now()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/now)                                   | 得到当前时间戳         | 无参                      |
| [Date.prototype.getFullYear()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/getFullYear)         | 得到年                 | 无参；本地时间；          |
| [Date.prototype.getMonth()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/getMonth)               | 得到月                 | 无参；本地时间；范围 0-11 |
| [Date.prototype.getDate()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/getDate)                 | 得到日                 | 无参；本地时间；          |
| [Date.prototype.getHours()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/getHours)               | 得到小时               | 无参；本地时间；          |
| [Date.prototype.getMinutes()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/getMinutes)           | 得到分钟               | 无参；本地时间；          |
| [Date.prototype.getSeconds()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/getSeconds)           | 得到秒                 | 无参；本地时间；          |
| [Date.prototype.getMilliseconds()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/getMilliseconds) | 得到毫秒               | 无参；本地时间；          |
| [Date.prototype.toLocaleString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString)   | 得到日期本地的表示方式 |                           |

-   **练习**

    -   将日期格式化为字符串

    ```js
    /**
     * 将日期格式化为字符串
     * @param {Date} date 要格式化的日期对象
     * @param {string} format 格式化字符串 yyyy-年  MM-月  dd-日 HH-小时 mm-分钟 ss-秒 ms-毫秒
     * @return {string} 日期字符串
     */
    function formatDate(date, format) {
    	var year = date.getFullYear().toString().padStart(4, '0');
    	var month = (date.getMonth() + 1).toString().padStart(2, '0');
    	var day = date.getDate().toString().padStart(2, '0');
    
    	var hour = date.getHours().toString().padStart(2, '0');
    	var minute = date.getMinutes().toString().padStart(2, '0');
    	var second = date.getSeconds().toString().padStart(2, '0');
    	var millisecond = date.getMilliseconds();
    
    	return format.replace('yyyy', year).replace('MM', month).replace('dd', day).replace('HH', hour).replace('mm', minute).replace('ss', second).replace('ms', millisecond);
    }
    
    var d = new Date();
    console.log(formatDate(d, 'yyyy年MM月dd日 HH时mm分ss秒'));
    ```

### 对象

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object

| API                                                                                                                               | 含义                                                                                         | 备注         |
| --------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------ |
| [Object.assign()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)                 | 将多个对象的属性混合到一起 ==(改变第一个参数对象)==<br />`Object.assign({}}, obj1,obj2,...)` | 后面覆盖前面 |
| [Object.getPrototypeOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf) | 获取一个对象的隐式原型                                                                       |              |
| [Object.setPrototypeOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf) | 设置一个对象的隐式原型                                                                       |              |
| [Object.create()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)                 | 创建一个新对象, 同时设置新对象的隐式原型(\_\_proto\_\_)                                      |              |

### 数组

> https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array

-   **`Array()`** 构造函数用于创建 [`Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array) 对象。

```js
new Array(element0, element1, /* … ,*/ elementN);
new Array(arrayLength);

Array(element0, element1, /* … ,*/ elementN);
Array(arrayLength);
```

如果传递给 `Array` 构造函数的唯一参数是 0 到 232 - 1（包括）之间的整数，这将返回一个新的 JavaScript 数组，其 `length` 属性设置为该数字（注意: 这意味着一个 `arrayLength` **==空槽数组==**，而不是具有实际 `undefined` 值的槽——参见[稀疏数组](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Indexed_collections#稀疏数组)）。

| API                                                                                                                                                                                                                                                            | 含义                                                                                                                                                                        | 备注                                                                                                                                                                                              |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Array.prototype.concat()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)                                                                                                                                      | 把多个数组拼接成一个                                                                                                                                                        | ==返回新数组==                                                                                                                                                                                    |
| [Array.prototype.includes()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/includes)                                                                                                                                  | 判断数组中是否包含某个值                                                                                                                                                    |                                                                                                                                                                                                   |
| [Array.prototype.indexOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf)                                                                                                                                    | 得到数组中某个值的第一个下标                                                                                                                                                | 若不存在则返回-1                                                                                                                                                                                  |
| [Array.prototype.lastIndexOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf)                                                                                                                            | 得到数组中某个值的最后一个下标                                                                                                                                              | 若不存在则返回-1                                                                                                                                                                                  |
| [Array.prototype.join()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/join)                                                                                                                                          | 把数组中每一项使用某个字符连接起来, 形成一个字符串返回                                                                                                                      |                                                                                                                                                                                                   |
| [Array.prototype.push()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/push)                                                                                                                                          | 向数组的**末尾**添加一项                                                                                                                                                    | 返回该数组的**新长度**                                                                                                                                                                            |
| [Array.prototype.unshift()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift)                                                                                                                                    | 向数组的**开头**添加一项                                                                                                                                                    | 返回该数组的**新长度**                                                                                                                                                                            |
| [Array.prototype.pop()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/pop)                                                                                                                                            | 删除数组**最后**一项                                                                                                                                                        | 返回被删除的值                                                                                                                                                                                    |
| [Array.prototype.shift()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/shift)                                                                                                                                        | 删除数组**第一项**                                                                                                                                                          | 返回被删除的值                                                                                                                                                                                    |
| [Array.prototype.splice()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)                                                                                                                                      | 删除、修改、插入任何位置的值                                                                                                                                                | 以数组形式返回被修改的内容。此方法会==改变原数组==<br />splice(start)<br/>splice(start, deleteCount)<br/>splice(start, deleteCount, item1)<br/>splice(start, deleteCount, item1, item2, ...itemN) |
| [Array.prototype.reverse()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse)                                                                                                                                    | 将数组中的元素顺序颠倒                                                                                                                                                      | 返回该数组。数组的第一个元素会变成最后一个, 数组的最后一个元素变成第一个。该方法会==改变原数组==                                                                                                  |
| [Array.prototype.sort()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)                                                                                                                                          | 对数组进行排序                                                                                                                                                              | 传入比较函数: 0-位置不变, <0-前者在前, >0-前者在后                                                                                                                                                |
| [Array.prototype.slice()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)                                                                                                                                        | 对数组进行切割                                                                                                                                                              | ==返回新数组==<br />slice()<br/>slice(start)<br/>slice(start, end)                                                                                                                                |
| [Array.isArray(target)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray)                                                                                                                                        | 判断 target 是否为一个数组                                                                                                                                                  |                                                                                                                                                                                                   |
| [Array.from(arg)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/from)                                                                                                                                                 | 过给定的类数组 或 可迭代对象 创建一个新的数组                                                                                                                               |                                                                                                                                                                                                   |
| [Array.of(...args)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/of)                                                                                                                                                 | 通过可变数量的参数创建一个新的 `Array` 实例，而不考虑参数的数量或类型                                                                                                       |                                                                                                                                                                                                   |
| [Array.prototype.copyWithin()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin)                                                                                                                              | **`copyWithin()`** 方法**浅复制**数组的一部分到同一数组中的另一个位置，并返回它，不会改变原数组的长度                                                                       | copyWithin(target) <br />copyWithin(target, start) <br />copyWithin(target, start, end)                                                                                                           |
| [Array.prototype.fill(n)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/fill)                                                                                                                                         | 将数组的某些项设置为 n<br />==修改原数组== n<br />用来填充数组元素的值。**注意所有数组中的元素都将是这个确定的值：如果 value 是个对象，那么数组的每一项都会引用这个元素。** | <img src="./img/yuanjin/20210602165516.png" alt="image-20210602165515908" style="zoom:50%;" />                                                                                     |
| [Array.prototype.forEach(fn)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)                                                                                                                                  | 遍历数组，传入一个函数，每次遍历会运行该函数                                                                                                                                | <img src="./img/yuanjin/20210602165832.png" alt="image-20210602165832725" style="zoom:50%;" />                                                                                     |
| [Array.prototype.map(fn)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map)                                                                                                                                          | 数组映射，传入一个函数，映射数组中的每一项 <br />==返回新数组==                                                                                                             | <img src="./img/yuanjin/20210602170025.png" alt="image-20210602170025141" style="zoom:50%;" />                                                                                     |
| [Array.prototype.filter(fn)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)                                                                                                                                    | 数组筛选，传入一个函数，仅保留满足条件的项<br />==返回新数组==                                                                                                              | <img src="./img/yuanjin/20210602170149.png" alt="image-20210602170149489" style="zoom:50%;" />                                                                                     |
| [Array.prototype.reduce(fn)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)                                                                                                                                    | 数组聚合，传入一个函数，对数组每一项按照该函数的返回聚合                                                                                                                    | <img src="./img/yuanjin/20210602170451.png" alt="image-20210602170451299" style="zoom:50%;" />                                                                                     |
| [Array.prototype.some(fn)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/some)                                                                                                                                        | 传入一个函数，判断数组中是否有至少一个通过该函数测试的项<br />                                                                                                              | <img src="./img/yuanjin/20210602171403.png" alt="image-20210602171403455" style="zoom:50%;" />                                                                                     |
| [Array.prototype.every(fn)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/every)                                                                                                                                      | 传入一个函数，判断数组中是否所有项都能通过该函数的测试                                                                                                                      | <img src="./img/yuanjin/20210602171441.png" alt="image-20210602171441468" style="zoom:50%;" />                                                                                     |
| [Array.prototype.find(fn)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/find)<br />[Array.prototype.findIndex(fn)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex) | 传入一个函数，找到数组中第一个能通过该函数测试的项(索引)                                                                                                                    | <img src="./img/yuanjin/20210602171510.png" alt="image-20210602171510075" style="zoom:50%;" />                                                                                     |
| [Array.prototype.includes(item)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/includes)                                                                                                                              | 判断数组中是否存在 item，判定规则使用的是`Object.is`                                                                                                                        | <img src="./img/yuanjin/20210602170615.png" alt="image-20210602170615564" style="zoom:50%;" />                                                                                     |
| [Array.prototype.flat()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/flat)                                                                                                                                          | 方法创建一个新的数组，并根据指定深度递归地将所有子数组元素拼接到新的数组中                                                                                                  | flat()<br/>flat(depth)<br />`depth 指定要提取嵌套数组的结构深度，默认值为 1。`                                                                                                                    |

-   **练习**

    ```js
    // 1
    var arr = [5, 2, 7, 11, 1, 6];
    var newArr = arr.slice(0); // 数组克隆
    console.log(newArr === arr); // false
    
    var obj = {
    	0: 'a',
    	1: 'b',
    	length: 2,
    };
    var arr = Array.prototype.slice.call(obj);
    // var arr = [].slice.call(obj);
    console.log(arr instanceof Array); // true
    
    // 2
    var arr = [5, 2, 7, 11, 1, 6];
    // a、b 是数组的其中两项
    arr.sort(function (a, b) {
    	// 升序排序, a>b 就返回正数, 反之返回负数, 相等返回 0
    	return a - b;
    });
    // 随机排序
    arr.sort(function () {
    	return Math.random() - 0.5;
    });
    console.log(arr);
    ```

    -   随机排序

    ```js
    // 随机排序
    arr.sort(function () {
    	return Math.random() - 0.5;
    });
    console.log(arr);
    ```

    -   **数组去重**

    ```js
    // 数组去重
    var nums = [1, 1, '1', 'a', 'b', 'a', 3, 5, 3, 7];
    for (let i = 0; i < nums.length; i++) {
    	const e = nums[i];
    	// i 之后是否存在和e相等的项 有则删除
    	for (let j = i + 1; j < nums.length; j++) {
    		if (e === nums[j]) {
    			nums.splice(j, 1);
    			j--;
    		}
    	}
    }
    console.log(nums);
    ```

    -   将下面的伪数组转换为真数组

    ```js
    // 将下面的伪数组转换为真数组
    var fakeArr = {
    	0: 'a',
    	1: 'b',
    	2: 'c',
    	length: 3,
    };
    var arr = Array.prototype.slice.call(fakeArr);
    // var arr = [].slice.call(fakeArr);
    console.log(arr, arr instanceof Array); // [ 'a', 'b', 'c' ] true
    ```

### 函数

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function

| API                                                                                                                           | 含义                        | 备注                     |
| ----------------------------------------------------------------------------------------------------------------------------- | --------------------------- | ------------------------ |
| [Function.prototype.apply()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply) | 执行函数, 绑定 this         | 参数列表以数组的形式传递 |
| [Function.prototype.call()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call)   | 执行函数, 绑定 this         | 参数列表依次传递         |
| [Function.prototype.bind()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)   | 创建一个新的函数, 绑定 this | 参数列表依次传递         |

### 正则表达式

#### 创建正则对象

```js
// 构造函数
new RegExp('规则', '标识') /
	// 字面量书写
	规则 /
	标识;
// 例如:
/ab+c/i; //字面量形式
new RegExp('ab+c', 'i'); // 首个参数为字符串模式的构造函数
new RegExp(/ab+c/, 'i'); // 首个参数为常规字面量的构造函数
```

#### 正则常用方法

```js
// reg是正则对象
reg.test('字符串'); // 验证字符串是否满足规则
```

```js
// reg是正则对象, str是字符串
str.replace(reg, '替换目标'); // 将字符串中匹配正则的部分替换为目标

// 将字符串中匹配正则的部分传入到回调函数的参数中, 将函数的返回结果进行替换
str.replace(reg, function (s) {
	return '替换目标';
});
```

#### 标识

| 标识字符                                                                                                                         | 含义                                                                                                                                                                                                                                           |
| -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| i (ignore)                                                                                                                       | **不区分大小写**                                                                                                                                                                                                                               |
| g (global)                                                                                                                       | 全局匹配, 如果没有此标识, 只会匹配**第一个**                                                                                                                                                                                                   |
| [u(unicode)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicode)                    | 使用 "u" 标志，任何 Unicode 代码点的转义都会被解释 **匹配码点**                                                                                                                                                                                |
| [y(**`sticky`** )-**粘连标记** ](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/sticky) | **`sticky`** 属性反映了搜索是否具有粘性（仅从正则表达式的 [`lastIndex`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/lastIndex) 属性表示的索引处搜索）。<br />**`lastIndex` 默认值 0 可以手动更改** |
| m                                                                                                                                | 多行匹配                                                                                                                                                                                                                                       |

#### 规则

详见: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions

##### 字符匹配规则

| 规则书写               | 含义                                     |
| ---------------------- | ---------------------------------------- |
| `直接书写一个普通字符` | 匹配书写的字符                           |
| `[字符规则]`           | 匹配[]中出现的所有字符规则               |
| `[^字符串规则]`        | 匹配[]中**没有**出现的字符规则           |
| `.`                    | 匹配任意字符                             |
| `\d`                   | 匹配数字, 等价于 `[0-9]`                 |
| `\D`                   | 匹配非数字                               |
| `\s`                   | 匹配空白字符, 包括空格、回车、换行、制表 |
| `\S`                   | 匹配所有非空白字符                       |
| `\w`                   | 匹配单词字符, 等价于 `[A-Za-z0-9_]`      |
| `\W`                   | 匹配非单词字符, 等价于 `[^A-Za-z0-9_]`   |
| `^`                    | 匹配字符串开始, 写到规则开始位置         |
| `$`                    | 匹配字符串结束, 写到规则结束位置         |
| `\\`                   | 匹配`\`                                  |

##### 连续的规则

多个规则可以连续书写, 用以匹配多个字符, 例如:

```js
/\d[a-zA-Z]/; // 匹配以1个数字紧跟一个字母
```

若多个规则是一个或者的关系, 使用`|`分割

```js
/\d[a-zA-Z]|[a-zA-Z]\d/; // 匹配以1个数字紧跟一个字母, 或者一个字母紧跟一个数字
```

##### 规则的重复（量词）

一个或一段规则之后, 可以紧跟一个量词, 表示前面的规则出现的次数

```js
/[a-zA-Z]\d{3}/; // 匹配1个字母, 后面跟上连续的3个数字, {3}是量词, 应用的规则是\d

/([a-zA-Z]\d){3}/; // {3}是量词, 应用的规则是 [a-zA-Z]\d
```

| 量词     | 含义                           |
| -------- | ------------------------------ |
| `{n}`    | 出现 n 次                      |
| `{n, m}` | 出现 n-m 次                    |
| `{n,}`   | 至少出现 n 次                  |
| `*`      | 出现 0 次或多次, 等价于`{0,}`  |
| `?`      | 出现 0 次或一次, 等价于`{0,1}` |
| `+`      | 出现 1 次或多次, 等价于`{1,}`  |

练习:

```js
// 邮箱
if (!/^.+@[^\S\.]+(\.[^\s\.]{1,2}) /.test(value)) {
	return '请输入正确的邮箱格式';
}
// 正整数
if (!/^[1-9]\d*$/.test(value)) {
	return '请输入正确的库存格式';
}
// 价格 12或者12.00
let reg = /^[1-9]\d*(\.\d{2})?$/;
if (!reg.test(value)) {
	return '请输入正确的价格格式';
}
```

#### 捕获组

用小括号包裹的部分叫做捕获组，捕获组会出现在匹配结果中

捕获组可以命名，叫做具名捕获组

非捕获组

#### 反向引用

在正则表达式中，使用某个捕获组，`\捕获组编号`

#### 正向断言(预查)

检查某个字符后面的字符是否满足某个规则，该规则不成为匹配结果，并且不称为捕获组

#### 负向断言(预查)

检查某个字符后面的字符是否不满足某个规则，该规则不成为匹配结果，并且不称为捕获组

## WebAPI

和标准库不同, WebAPI 是**浏览器**提供的一套 API(Application Programming Interface), 用于操作浏览器窗口和界面

WebAPI 中包含两个部分:

-   **BOM**: Browser Object Model, 浏览器模型, 提供和浏览器相关的操作
-   **DOM**: Document Object Model, 文档模型, 提供和页面相关的操作

<img src="./img/WebAPI1.png" alt="WebAPI1" style="zoom:50%;" />

### BOM

BOM 提供了一系列的对象和函数, 提供和浏览器本身相关的操作

#### window

全局对象

https://developer.mozilla.org/zh-CN/docs/Web/API/Window/window

| API                                                                                          | 含义                                             | 备注                                                                                |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------- |
| [`open()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/open)                     | 打开一个新的浏览器窗口                           | 返回新窗口的 window 对象                                                            |
| [`close()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/close)                   | 关闭浏览器窗口                                   | 只能关闭使用 open 打开的浏览器窗口                                                  |
| [==setTimeout()==](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/setTimeout)       | 设置一个计时器<br />在一段时间后自动执行某个函数 | 参数 1: 函数, 无参, this 指向 window<br />参数 2: 时间, 毫秒<br />返回: 计时器的 ID |
| [==clearTimeout()==](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/clearTimeout)   | 清除指定 ID 的计时器                             | 传入计时器的 ID                                                                     |
| [==setInterval()==](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/setInterval)     | 设置一个计时器<br />每隔一段时间自动执行某个函数 | 参数 1: 函数, 无参, this 指向 window<br />参数 2: 时间, 毫秒<br />返回: 计时器的 ID |
| [==clearInterval()==](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/clearInterval) | 清除指定 ID 的计时器                             | 传入计时器的 ID                                                                     |
| [`alert()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/alert)                   | 弹出提示框                                       | 不同的操作系统外观有差异                                                            |
| [`confirm()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/confirm)               | 弹出确认框                                       | 不同的操作系统外观有差异                                                            |

-   拓展

    -   ==**定时器常用用法**==

    ```js
    // 定时器常用用法
    var timerId;
    
    // 开始（继续）
    function start() {
    	if (timerId) {
    		// 当前已经有计时器了
    		return;
    	}
    	timerId = setInterval(function () {
    		console.clear();
    		console.log(new Date().toLocaleString());
    	}, 1000);
    }
    
    // 停止
    function stop() {
    	clearInterval(timerId);
    	timerId = null;
    }
    ```

#### window.location

https://developer.mozilla.org/zh-CN/docs/Web/API/Location

提供地址栏的相关操作

| API                                                                                        | 含义                             | 备注                   |
| ------------------------------------------------------------------------------------------ | -------------------------------- | ---------------------- |
| [==Location.href==](https://developer.mozilla.org/zh-CN/docs/Web/API/Location/href)        | 获取或设置页面当前地址           | 设置地址会导致页面跳转 |
| [`Location.protocol`](https://developer.mozilla.org/en-US/docs/Web/API/Location/protocol)  | 获取或设置地址中的协议部分       |                        |
| [`Location.host`](https://developer.mozilla.org/zh-CN/docs/Web/API/Location/host)          | 获取或设置地址中的主机名和端口号 |                        |
| [`Location.hostname`](https://developer.mozilla.org/zh-CN/docs/Web/API/Location/hostname)  | 获取或设置地址中的主机名         |                        |
| [`Location.port` ](https://developer.mozilla.org/en-US/docs/Web/API/Location/port)         | 获取或设置地址中的端口号         |                        |
| [`Location.pathname` ](https://developer.mozilla.org/en-US/docs/Web/API/Location/pathname) | 获取或设置地址中的路径部分       |                        |
| [`Location.search`](https://developer.mozilla.org/zh-CN/docs/Web/API/Location/search)      | 获取或设置地址中的参数部分       |                        |
| [`Location.hash`](https://developer.mozilla.org/zh-CN/docs/Web/API/Location/hash)          | 获取或设置地址中的 hash 部分     |                        |
| [`Location.reload()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Location/reload)    | 刷新页面                         |                        |

#### window.history

https://developer.mozilla.org/zh-CN/docs/Web/API/History

提供当前窗口历史记录的操作

| API                                                                                               | 含义                                             | 备注       |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ---------- |
| [`History.back()`](https://developer.mozilla.org/zh-CN/docs/Web/API/History/back)                 | 后退                                             |            |
| [`History.forward()`](https://developer.mozilla.org/zh-CN/docs/Web/API/History/forward)           | 前进                                             |            |
| [`History.go()`](https://developer.mozilla.org/zh-CN/docs/Web/API/History/go)                     | 根据相对当前页面的偏移量, <br />进入指定的记录页 |            |
| [`History.pushState()`](https://developer.mozilla.org/zh-CN/docs/Web/API/History/pushState)       | 在历史记录中添加一条记录                         | 页面不刷新 |
| [`History.replaceState()`](https://developer.mozilla.org/zh-CN/docs/Web/API/History/replaceState) | 替换当前记录                                     | 页面不刷新 |

#### window.navigator

https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator

`Navigator` 接口表示用户代理的状态和标识。它允许脚本查询它和注册自己进行一些活动。

可以使用只读的 [`window.navigator`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/navigator) 属性检索 navigator 对象。

| API                   | 含义                       |
| --------------------- | -------------------------- |
| `navigator.userAgent` | 返回当前浏览器的用户代理。 |

### DOM

[DOM 是一个对象, 它对应到 HTML 中的节点](https://developer.mozilla.org/zh-CN/docs/Glossary/DOM)

> DOM（Document Object Model——文档对象模型）是用来呈现以及与任意 HTML 或 XML 文档交互的 API。DOM 是载入到浏览器中的文档模型, 以节点树的形式来表现文档, 每个节点代表文档的构成部分（例如: 页面元素、字符串或注释等等）。

<img src="./img/WebAPI2-DOM.png" alt="WebAPI2-DOM" style="zoom:50%;" />

#### 获取 dom

| API                                                                                                       | 含义                                                                                     | 备注                                                                                                 |
| --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| document.getElementById()                                                                                 | 根据元素 id 获取 dom                                                                     | 得到单个 dom                                                                                         |
| document.getElementsByTagName()<br />dom.getElementsByTagName()                                           | 根据元素名称获取 dom                                                                     | 得到 dom 的伪数组                                                                                    |
| document.getElementsByClassName()<br />dom.getElementsByClassName()                                       | 根据元素类样式获取 dom                                                                   | 得到 dom 的伪数组                                                                                    |
| ==document.querySelector()==<br />==dom.querySelector()==                                                 | 根据 CSS 选择器获取 dom                                                                  | 得到第一个匹配的 dom                                                                                 |
| ==document.querySelectorAll()==<br />==dom.querySelectorAll()==                                           | 根据 CSS 选择器获取 dom                                                                  | 得到所有匹配的 dom<br />伪数组                                                                       |
| ==[document.documentElement](https://developer.mozilla.org/en-US/docs/Web/API/Document/documentElement)== | 获取 html 元素                                                                           |                                                                                                      |
| document.body                                                                                             | 获取 body                                                                                |                                                                                                      |
| document.head                                                                                             | 获取 head                                                                                |                                                                                                      |
| ==dom.children==                                                                                          | 获取 dom 的子元素                                                                        | 得到 dom 的伪数组                                                                                    |
| dom.childNodes                                                                                            | 获取 dom 的子节点 节点有类型<br />元素类型是其中之一。元素在 HTML 文档中由一个标签表示。 | 得到 dom 节点的伪数组<br />关于[==节点对象==](https://developer.mozilla.org/zh-CN/docs/Web/API/Node) |
| dom.firstElementChild                                                                                     | 返回对象的第一个子 `元素`, 如果没有子元素, 则为 null                                     |                                                                                                      |
| dom.lastElementChild                                                                                      | 返回对象的最后一个子 `元素`, 如果没有子元素, 则为 null                                   |                                                                                                      |
| dom.previousElementSibling                                                                                | 得到 dom 前一个兄弟元素                                                                  |                                                                                                      |
| dom.nextElementSibling                                                                                    | 得到 dom 后一个兄弟元素                                                                  |                                                                                                      |
| ==dom.parentElement==                                                                                     | 得到 dom 的父元素                                                                        |                                                                                                      |

##### 节点对象

<img src=".\img\节点对象.awebp" alt="节点对象 " style="zoom:50%;" />

-   `document.getElementById()` 获取到的结果既是 Node 也是 Element。

-   Element 一定是 Node，但 Node 不一定是 Element，也可能是文本、空格和换行符。

-   NodeList 里的换行符是因为原始代码中， HTML 标签与标签、内容与标签之间换行而产生的。

-   单个的 HTML 标签算是一个单独的 Node。

-   针对非 HTML 标签（比如文本、空格等），从一个 HTML 标签开始，到碰到的第一个 HTML 标签为止，如果中间由内容（文本、空格等），那这部分内容算是一个 Node。

#### 创建 dom

| API                          | 含义                | 备注         |
| ---------------------------- | ------------------- | ------------ |
| ==document.createElement()== | 创建一个 dom 并返回 | 传入元素名称 |

#### 更改 dom 结构

这里是指更改文档树（DOM 树）

| API                                                                                                            | 含义                                                         | 备注                                                             |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------- |
| ==dom.remove()==                                                                                               | **`Element.remove()`** 方法，把对象从它所属的 DOM 树中删除。 | 不是删除对象                                                     |
| dom.removeChild()                                                                                              | 删除 dom 的某个子节点                                        | 传入 dom 对象                                                    |
| [dom.insertBefore(newNode, referenceNode)](https://developer.mozilla.org/zh-CN/docs/Web/API/Node/insertBefore) | 在 dom 的子节点中, 添加一个新节点到另一个节点之前            | 如果 referenceNode 为 null 则 newNode 将被插入到子节点的**末尾** |
| ==dom.appendChild()==                                                                                          | 添加一个新节点到 dom 的子节点末尾                            | 传入 dom 对象                                                    |
| ==cloneNode(deep)==                                                                                            | 返回调用该方法的节点的一个副本                               |                                                                  |

#### dom 属性

本节的「属性」, 是指 **HTML 元素的「属性」**

属性有两种:

-   标准属性: HTML 元素本身拥有的属性, 例如:
    -   a 元素的 href、title
    -   input 的 value
    -   img 的 src
    -   ......
-   自定义属性: HTML 元素标准中未定义的属性 (**==data-XXX==**)
    > HTML5 建议自定义属性使用 **data-** 作为前缀
    > 如果遵从 HTML5 自定义属性规范，可以使用 **==dom 对象.dataset.属性名==** 控制属性

**所有标准属性均可通过 `dom.属性名` 得到, 其中:**

-   布尔属性会被自动转换为 boolean

-   路径类的属性会被转换为绝对路径

-   标准属性始终都是存在的, 不管你是否有在元素中属性该属性

-   class 由于和关键字重名, 因此需要使用 className

**所有的自定义属性均可通过下面的方式操作:**

-   **dom.setAttribute(name, value)**

    > 设置属性键值对

-   **dom.getAttribute(name)**

    > 返回元素上一个指定的属性值。如果指定的属性不存在, 则返回 null 或 "" （空字符串）
    >
    > 因此, 如果一个属性可能不存在于指定的元素上, 在调用 `getAttribute()` 之前, 你应该使用 [`element.hasAttribute()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/hasAttribute)

-   **[`dom.removeAttribute()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/removeAttribute)**

    > 删除属性

-   **==dom 对象.dataset.属性名==**

    > 如果遵从 HTML5 自定义属性规范，可以使用 **==dom 对象.dataset.属性名==** 控制属性

==**自定义属性和元素源码书写是对应的**==, 可以尝试获取 a 元素的 href 属性对比标准属性, 看看有什么不同。
![getAttribute](./img/getAttribute.png)

#### dom 内容

| API                  | 含义                           | 备注                           | 补充                                                                   |
| :------------------- | ------------------------------ | ------------------------------ | ---------------------------------------------------------------------- |
| ==dom.innerText==    | 获取或设置元素文本内容         | 设置时会自动进行 HTML 实体编码 | 获取和设置元素内部的纯文本，仅得到**元素内部显示出来的文本**           |
| ==dom.innerHTML==    | 获取或设置元素的 HTML 内容     | W3C 标准(推荐使用)             | 获取和设置元素的内部 HTML 文本                                         |
| **Node.textContent** | 表示一个节点及其后代的文本内容 |                                | 获取和设置元素内部的纯文本，textContent 得到的是**内部源代码中的文本** |

**备注: ** `textContent` 和 [`HTMLElement.innerText`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/innerText) 容易混淆，但这两个属性在[重要方面有不同之处](https://developer.mozilla.org/zh-CN/docs/Web/API/Node/textContent#与_innerText_的区别) 。

##### [与 innerText 的区别](https://developer.mozilla.org/zh-CN/docs/Web/API/Node/textContent#与_innertext_的区别)

> 不要对 `Node.textContent` 和 [`HTMLElement.innerText`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/innerText) 之间的差异感到困惑。虽然名字看起来很相似，但有重要的不同之处:

-   `textContent` 会获取*所有*元素的内容，包括 [`<script>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/script) 和 [`<style>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/style) 元素，然而 `innerText` 只展示给人看的元素。

-   `textContent` 会返回节点中的每一个元素。相反，innerText 受 CSS 样式的影响，并且不会返回隐藏元素的文本，

    -   此外，由于 `innerText` 受 CSS 样式的影响，它会触发回流（ [reflow](https://developer.mozilla.org/zh-CN/docs/Glossary/Reflow) ）去确保是最新的计算样式。（回流在计算上可能会非常昂贵，因此应尽可能避免。）

-   与 `textContent` 不同的是，在 Internet Explorer (小于和等于 11 的版本) 中对 `innerText` 进行修改，不仅会移除当前元素的子节点，而且还会*永久性地破坏*所有后代文本节点。在之后不可能再次将节点再次插入到任何其他元素或同一元素中。

##### [与 innerHTML 的区别](https://developer.mozilla.org/zh-CN/docs/Web/API/Node/textContent#与_innerhtml_的区别)

> 正如其名称，[`Element.innerHTML`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/innerHTML) 返回 HTML。通常，为了在元素中检索或写入文本，人们使用 `innerHTML`。但是，`textContent` 通常具有更好的性能，因为文本不会被解析为 HTML。

此外，使用 `textContent` 可以防止 [XSS 攻击](https://developer.mozilla.org/zh-CN/docs/Glossary/Cross-site_scripting)。

#### dom 样式

在 JS 中, 有两种样式:

-   内联样式: 元素的 style 属性中书写的样式 (==行内样式==)
-   计算样式: 元素最终计算出来的样式 (==最终样式==)

**JS 可以获取内联样式和计算样式, 但只能设置内联样式**

下面罗列了样式的常见操作:

-   `dom.style`: 获取元素的内联样式, 得到样式对象
    -   对象中的所有样式属性均可以被赋值, 赋值后即可应用样式到元素的 style 中
-   `getComputedStyle(dom)`: 获取元素的计算样式, 得到一个样式对象
    -   该样式对象中的属性是只读的, 无法被重新赋值

关于**样式对象**, 注意:

-   当给样式赋值为空字符串时, 相当于删除内联样式
-   当给样式的赋值不合法时, 赋值语句无效, 不会报错
-   CSS 的短横线命名法, 在属性名中表现为驼峰命名法

| API                                                                                    | 含义                                                                                                                                                                                      | 备注                                                                                                         |
| -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **[dom.classLis](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/classList)** | **`Element.classList`** 是一个只读属性, 返回一个元素 `class` 属性的动态 [`DOMTokenList`](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMTokenList) 集合。这可以用于操作 class 集合。 | 如果 `class` 属性没有设置或者为空, 它将返回一个空的 `DOMTokenList`, 即 `length` 属性等于 0 的 `DOMTokenList` |
| dom.classList.add()                                                                    | 添加类样式                                                                                                                                                                                |                                                                                                              |
| dom.classList.contains()                                                               | 是否包含某个类样式                                                                                                                                                                        |                                                                                                              |
| dom.classList.remove()                                                                 | 移除类样式                                                                                                                                                                                |                                                                                                              |
| dom.classList.toggle()                                                                 | 切换类样式 有就 加 没有就 减                                                                                                                                                              |                                                                                                              |
| dom.style                                                                              | 获取元素的 v 样式, 得到样式对象                                                                                                                                                           | 对象中的所有样式属性均可以被赋值, 赋值后即可应用样式到元素的 style ==(内联)== 中                             |
| getComputedStyle(dom)                                                                  | 获取元素的计算样式, 得到一个样式对象                                                                                                                                                      | 该样式对象中的属性是只读的, 无法被重新赋值                                                                   |

```js
// 添加类样式
dom.classList.add('a'); // <div class="a"></div>
dom.classList.add('b'); // <div class="a b"></div>
dom.classList.add('c'); // <div class="a b c"></div>

// 是否包含某个类样式
dom.classList.contains('a'); // true

// 移除类样式
dom.classList.remove('a'); // <div class="b c"></div>

// 切换类样式 有就 加 没有就 减
dom.classList.toggle('a'); // <div class="a b c"></div>
dom.classList.toggle('a'); // <div class="b c"></div>
dom.classList.toggle('a'); // <div class="a b c"></div>
```

#### 监听 dom 事件

监听事件可以描述为一句话:

**某个 DOM**发生了**某件事**之后, 我需要做**某些处理**

-   某个 DOM: 监听谁？
-   某件事（事件类型）: 它发生了什么？
-   某些处理（处理函数）: 我要做什么？

下面是一段事件监听代码:

```js
// 为dom注册点击事件, 当被点击时, 自动运行事件处理函数
dom.onclick = function () {
	console.log('dom 被点击了');
};
```

##### 事件类型

https://developer.mozilla.org/zh-CN/docs/Web/Events

###### 表单类事件

| 事件名称   | 触发时机                                                                     | 备注                              |
| ---------- | ---------------------------------------------------------------------------- | --------------------------------- |
| ==submit== | 表单被提交时触发                                                             | 注册到 form 元素上                |
| ==input==  | 文本框改变后立即触发                                                         | 注册到 input、textarea 上         |
| ==change== | 文本框改变后、==失去焦点时触发==<br />下拉列表、多选框、单选框改变后立即触发 | 注册到 input、select、textarea 上 |
| reset      | 表单被重置时触发                                                             | 注册到 form 元素上                |
| focus      | 元素聚焦时触发                                                               |                                   |
| blur       | 元素失去焦点时触发                                                           |                                   |

###### 鼠标类事件

| 事件名称        | 触发时机                     | 备注 |
| --------------- | ---------------------------- | ---- |
| ==click==       | 鼠标按下抬起后触发           |      |
| **contextmenu** | 右键菜单显示前触发           |      |
| ==mousedown==   | 鼠标按下时触发               |      |
| ==mouseup==     | 鼠标抬起时触发               |      |
| ==mousemove==   | 鼠标在元素上移动时触发       |      |
| ==mouseenter==  | 鼠标进入元素时触发（不冒泡） |      |
| ==mouseleave==  | 鼠标离开元素时触发（不冒泡） |      |
| mouseover       | 鼠标进入元素时触发（冒泡）   |      |
| mouseout        | 鼠标离开元素时触发（冒泡）   |      |
| wheel           | 鼠标滚轮滚动时触发           |      |

###### 键盘事件

| 事件名称                                                                          | 触发时机                                               | 备注                                                                                                   |
| --------------------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| [keydown](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/keydown_event) | 某个键被按下时触发                                     |                                                                                                        |
| keyup                                                                             | 某个键被抬起时触发                                     |                                                                                                        |
| `keypress` 已弃用                                                                 | 当按下产生字符或符号值的键时, 将触发 `keypress` 事件。 | 产生字符值的键包括字母、数字和标点符号键。不产生字符值的键是修饰键, 例如 Alt、Shift、Ctrl 或 Meta 键。 |

-   总结:

    -   **keyup** 适用于文本框的**数据输入和同步, 以及数据的获取**

        > keyup 事件触发时全部键盘事件的操作已完成，获得的是触发键盘事件后的文本。

    -   **keydown** 与 keypress 更适用于通过键盘**控制页面功能的实现**(如回车事件)。

        > **keydown 事件触发在文字还没敲进文本框**，这时如果在 keydown 事件中输出文本框中的文本，得到的是触发键盘事件前的文本

    -   关于**输入框发生的事件流程**依次为

        > focus 、keydown 、input 、keyup 、change 、 blur。

        <img src="./img/WebAPI2-输入事件流.png" alt="WebAPI2-输入事件流.png"/>

##### 注册事件

JS 提供了三种方式注册事件

-   方式 1:
    将事件注册写到元素上, 这种方式基本被弃用

    ```html
    <button onclick="js代码">按钮</button>
    ```

-   方式 2:
    ==使用 dom 属性注册事件==

    属性名为`on+事件类型`

    ```js
    // 监听事件
    dom.onclick = function () {
    	// 处理函数
    };
    // 移除监听事件
    dom.onclick = null;
    ```

    这种方式的特点是:

    -   优点: 易于监听、覆盖、移除
    -   缺点: 只能注册一个处理函数
    -   缺点: 某些事件不支持用这种方式注册

-   方式 3:
    ==使用 [addEventListener](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener) 方法注册事件==

    -   语法

        ```js
        addEventListener(type, listener);
        preventDefault();
        addEventListener(type, listener, options);
        addEventListener(type, listener, useCapture);
        ```

    -   参数

        -   **type**

            > 表示监听[事件类型](https://developer.mozilla.org/zh-CN/docs/Web/Events)的大小写敏感的字符串。

        -   **listener**

            > 当所监听的事件类型触发时，会接收到一个事件通知（实现了 [`Event`](https://developer.mozilla.org/zh-CN/docs/Web/API/Event) 接口的对象）对象。`listener` 必须是一个实现了 [`EventListener`](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener) 接口的对象，或者是一个[函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Functions)。有关回调本身的详细信息，请参阅[事件监听回调](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener#事件监听回调)

        -   **options** 可选

            > 一个指定有关 `listener` 属性的可选参数对象。可用的选项如下: `capture` 可选一个布尔值，表示 `listener` 会在该类型的事件捕获阶段传播到该 `EventTarget` 时触发。`once` 可选一个布尔值，表示 `listener` 在添加之后最多只调用一次。如果为 `true`，`listener` 会在其被调用之后自动移除。`passive` 可选一个布尔值，设置为 `true` 时，表示 `listener` 永远不会调用 `preventDefault()`。如果 listener 仍然调用了这个函数，客户端将会忽略它并抛出一个控制台警告。查看[使用 passive 改善滚屏性能](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener#使用_passive_改善滚屏性能)以了解更多。`signal` 可选[`AbortSignal`](https://developer.mozilla.org/zh-CN/docs/Web/API/AbortSignal)，该 `AbortSignal` 的 [`abort()`](https://developer.mozilla.org/zh-CN/docs/Web/API/AbortController/abort) 方法被调用时，监听器会被移除。

        -   **useCapture** 可选 (是否捕获阶段)

            > 一个布尔值，表示在 DOM 树中注册了 `listener` 的元素，是否要先于它下面的 `EventTarget` 调用该 `listener`。当 useCapture（设为 true）时，沿着 DOM 树向上冒泡的事件不会触发 listener。当一个元素嵌套了另一个元素，并且两个元素都对同一事件注册了一个处理函数时，所发生的事件冒泡和事件捕获是两种不同的事件传播方式。事件传播模式决定了元素以哪个顺序接收事件。进一步的解释可以查看 [DOM Level 3 事件](https://www.w3.org/TR/DOM-Level-3-Events/#event-flow)及 [JavaScript 事件顺序](https://www.quirksmode.org/js/events_order.html#link4)文档。如果没有指定，`useCapture` 默认为 `false` (冒泡)。

        **备注:**

        > 对于事件目标上的事件监听器来说，事件会处于“目标阶段”，而不是冒泡阶段或者捕获阶段。捕获阶段的事件监听器会在任何非捕获阶段的事件监听器之前被调用。

###### [处理过程中 **this** 的值的问题](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener#处理过程中_this_的值的问题)

> 通常来说 [`this`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this) 的值是**==触发事件的元素的引用==**，这种特性在多个相似的元素使用同一个通用事件监听器时非常让人满意。

-   当使用 `addEventListener()` 为一个元素注册事件的时候，事件处理器里的 [`this`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this) 值是该元素的引用。其与传递给句柄的 event 参数的 `currentTarget` 属性的值一样。

    ```js
    my_element.addEventListener('click', function (e) {
    	console.log(this.className); // 输出 my_element 的 className
    	console.log(e.currentTarget === this); // 输出 `true`
    });
    ```

-   **需要注意的是，[箭头函数没有它自己的 `this` 上下文](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions#没有单独的this)。**

    ```js
    my_element.addEventListener('click', (e) => {
    	console.log(this.className); // 警告: `this` 并不指向 `my_element`
    	console.log(e.currentTarget === this); // 输出 `false`
    });
    ```

-   如果一个==事件的属性==（例如 [`onclick`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/click_event)）是 ==在 HTML 代码中指定 的，则这个属性中的 JavaScript 语句实际上会被包裹在一个处理函数中==，在这个处理函数中使用 `this` 的效果和使用 `addEventListener()` 来绑定事件的效果是一样的；`this` 的出现代表了元素的引用。

    ```html
    <table id="my_table" onclick="console.log(this.id);">
    	<!-- `this` 指向 table 元素；输出 'my_table' -->
    	…
    </table>
    ```

-   注意到在一个函数里 `this` 调用的效果和[标准规则](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this)里面是一样的。请看下面一个例子:

    ```html
    <script>
    	function logID() {
    		console.log(this.id);
    	}
    </script>
    <table id="my_table" onclick="logID();">
    	<!-- 被调用时，`this` 指向全局（window）对象 -->
    	…
    </table>
    ```

    > 这时，logID() 中的 this 的值会变成全局（[Window](https://developer.mozilla.org/zh-CN/docs/Web/API/Window)）对象的引用（在[严格模式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Strict_mode)中为 undefined）。
    > **addEventListener** 是 **最完美 ** 的 事件注册 方式。

    **移除**用这种方式注册的事件, 需要改写代码 **==removeEventListener==**

    ```js
    // 处理函数1
    function handler1() {}
    // 处理函数2
    function handler2() {}

    dom.addEventListener('click', handler1);
    dom.addEventListener('click', handler2);
    dom.removeEventListener('click', handler1); // 移除监听函数1
    ```

-   **==onclick 和 addEventListener 区别==**

    -   onclick 事件在同一时间只能指向唯一对象
    -   addEventListener 给一个事件注册多个 listener
    -   **addEventListener 对任何 DOM 都是有效的, 而 onclick 仅限于 HTML**
    -   addEventListener 可以控制 listener 的触发阶段, （捕获/冒泡）。对于多个相同的事件处理器, 不会重复触发, 不需要手动使用 removeEventListener 清除
    -   IE9 使用 attachEvent 和 detachEvent

##### 事件传播机制

> [事件冒泡和事件捕获分别由微软和网景公司提出，这两个概念都是为了解决页面中事件流（事件发生顺序）的问题。](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Building_blocks/Events#%E7%BB%93%E8%AE%BA)

-   捕获阶段（capture phase）: 事件从 Window 对象向下传递到目标元素。

-   目标阶段（target phase）: 事件到达目标元素。

-   冒泡阶段（bubbling phase）: 事件从目标元素上开始冒泡

<img src="./img/WebAPI2-事件流.png" alt="WebAPI2-事件流.png" style="zoom:50%;"/>

```js
// 在冒泡阶段触发
div.onclick = function () {};

// 在捕获阶段触发事件
div.addEventListener('click', function () {}, true);

// 在冒泡阶段触发事件（默认）
div.addEventListener('click', function () {}, false);
```

-   **[==event.stopPropagation()== (不会向上冒泡)](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/stopPropagation)**

    > [`Event`](https://developer.mozilla.org/zh-CN/docs/Web/API/Event) 接口的 **`stopPropagation()`** 方法阻止捕获和冒泡阶段中当前事件的进一步传播。但是，它不能防止任何默认行为的发生；例如，对链接的点击仍会被处理。如果要停止这些行为，请参见 [`preventDefault()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/preventDefault) 方法，它可以阻止事件触发后默认动作的发生。它也不能阻止附加到相同元素的相同事件类型的其他事件处理器，如果要阻止这些处理器的运行，请参见 [`stopImmediatePropagation()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/stopImmediatePropagation) 方法。

    ```js
    // 事件处理函数
    function handler(e) {
    	e.target; // 获取事件源（目标阶段的dom）
    	e.stopPropagation(); // 阻止事件继续冒泡
    }
    ```

-   **[event.target](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/target)** 获取事件源 (**目标阶段的 dom**)

    **触发事件的对象 === this** (某个 DOM 元素) 的引用。当事件处理程序在事件的冒泡或捕获阶段被调用时，它与[`event.currentTarget`](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/currentTarget)不同。

    > [`Event`](https://developer.mozilla.org/zh-CN/docs/Web/API/Event) 接口的只读属性 **currentTarget** 表示的，标识是当事件沿着 DOM 触发时事件的当前目标。
    >
    > **currentTarget**总是指向 ==事件绑定的元素 (**this**)==，
    >
    > [**Event.target**](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/target) 则是**==事件触发的元素==**。

    -   `event.target` 属性可以用来实现**事件委托** (**event delegation**)

-   **事件委托（event delegation）**

    > 事件委托，也称为事件代理，是指将本要添加在自身的事件，添加到别人身上。通过冒泡的原理，将事件添加到父级，触发执行效果。

    -   好处

        -   节省内存占用，减少事件注册
        -   新增子元素时，无需再对其进行事件绑定

    ```js
    // Get the parent DIV, add click listener...
    document.getElementById('myDiv').addEventListener('click', function (e) {
    	// e.target was the clicked element
    	if (e.target && e.target.matches('a.classA')) {
    		console.log('Anchor element clicked!');
    	}
    });
    ```

    -   拓展

        -   **[Element.matches()](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/matches)**

            > 如果元素被指定的==选择器字符串选择==，**`Element.matches()`** 方法返回 true; 否则返回 false。

##### 事件处理函数

> 当事件发生时, 会自动调用事件处理函数, 并向函数传递一个参数, 该参数称之为**事件对象**, 里面包含了事件发生的相关信息, 比如鼠标位置、键盘按键等等

常见的事件对象有: [鼠标事件对象](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent)、[键盘事件对象](https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/KeyboardEvent)

```js
dom.addEventListener('click', function (e) {
	console.log(e.clientX); //打印鼠标的横坐标
});
```

另外, 在==事件处理函数中, **this** 始终指向注册事件的 dom==

##### 事件默认行为

> 某些元素的某些事件, 浏览器会有自己的默认行为

比如:

-   a 元素的 click 事件, 浏览器会跳转页面
-   form 元素的 submit 事件, 浏览器会提交表单, 最终导致页面刷新
-   文本框的 keydown 事件, 浏览器会将按键文本显示到文本框中
-   ......

要阻止浏览器的默认行为

-   [==event.preventDefault()==](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/preventDefault)

    > [`Event`](https://developer.mozilla.org/zh-CN/docs/Web/API/Event) 接口的 **`preventDefault()`** 方法, 告诉[用户代理](https://developer.mozilla.org/zh-CN/docs/Glossary/User_agent): 如果此事件没有被显式处理, 它默认的动作也不应该照常执行。此事件还是继续传播, 除非碰到事件监听器调用 [`stopPropagation()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/stopPropagation) 或 [`stopImmediatePropagation()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/stopImmediatePropagation), 才停止传播。

    ```js
    // e为事件对象
    e.preventDefault();
    ```

#### 在 js 中使用 onerror 事件

javascript 给我们提供了一个 `onerror` 事件，img 标签支持该事件，当装载文档或者图像的过程中发生了错误，就会触发 onerror 事件。
我们可以在这个事件中，定义要替换加载不出来的原图的 broken 图片。

核心代码:

```html
// html
<img src="img.png" onerror="myfunction()" />

// javascript myfunction() { this.src="default.png" }
```

> 注意:  
> 如果 onerror 指定的图片也不存在的话，会出现无限==死循环 404==. 解决办法是在 js 中添加:
>
> ```js
> // javascript
> myfunction() {
> 	this.src="./default.png";
> 	this.onerror = null; // 添加这个防止默认图片也不存在而陷入死循环
> }
> ```

#### 番外

有时因为网络比较卡的原因需要多加载几次再判定为是否加载失败。
但是有时是因为网络连接断开而加载失败，需要在网络恢复连接时自动加载图片。
这是就需要知道，js 中怎么识别网络断开和连接的，有两个事件: `online` 和 `offline`。

```js
var isOnLine = true;
var eventList = {};
window.addEventListener('offline', function() {
	isOnLine = false;
})
window.addEventListener('online', function() {
	if(!isOnline) {
		isOnLine = true;
		reLine(); // 执行重连后要做的事情
	}
})
function reLine() {
	for(var key in eventList) {
		if(!eventList[key]) continue;
		var arg = eventList[key].arg;
		var thisOnFn = eventList[key].that;
		eventList[key].fun.apply(thisOnFn, arg);
		eventList[key] = null;
	}
}
function offLined(fun, arg, that) {
	if(!isOnLine) {
		var name = fun.name || '__new';
		eventList[name] = {};
		eventList[name].fun = fun;
		eventList[name].arg = [].slice.call(arg);
		eventList[name].that = that;
		return true;
	}
	return false;
}
---
// 重新定义myfunction
myfunction(imgObj, imgSrc, maxErrorNum) {
	if(offLined(restImgUrl, arguments, this)) return;
	if(maxErrorNum > 0) {
		imgObj.onerror = function () {
			myFunction(imgObj, imgSrc, maxErrorNum - 1)
		}
		setTimeout(function() {
			imgObj.src = imgSrc;
		}, 500)
	} else {
		imgObj.src = './default.png';
		this.onerror = null;
	}
}

// 调用
<img src="img.png" onerror="myfunction(this, this.src, 3)">
```

#### dom 尺寸和位置

<img src="./img/WebAPI2-DOM尺寸1.png" alt="WebAPI2-DOM尺寸1" style="zoom:50%;" />
<img src="./img/WebAPI2-DOM尺寸2.png" alt="WebAPI2-DOM尺寸2" style="zoom:50%;" />
<img src="./img/WebAPI2-DOM尺寸3.png" alt="WebAPI2-DOM尺寸3" style="zoom:50%;" />
<img src="./img/WebAPI2-DOM尺寸4.png" alt="WebAPI2-DOM尺寸4" style="zoom:50%;" />

> 调用 **==dom.scrollTo(x, y)==** 可以设置元素的滚动位置, x 和 y 分别表示 **==scrollLeft==** 和 **==scrollTop==**
>
> 该方法通用元素回到元素顶部`dom.scrollTo(0, 0)`
>
> 如果要监听元素的滚动, 可以监听事件类型: ==**scroll**==

-   [==**Element.getBoundingClientRect()**==](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect)

    > 返回值是一个 [`DOMRect`](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMRect) 对象，是包含整个元素的最小矩形（包括 `padding` 和 `border-width`）。该对象使用 `left`、`top`、`right`、`bottom`、`x`、`y`、`width` 和 `height` 这几个以像素为单位的只读属性描述整个矩形的位置和大小。除了 `width` 和 `height` 以外的属性是相对于**视图窗口**的左上角来计算的。

    <img src="./img/WebAPI2-DOM尺寸5.png" alt="WebAPI2-DOM尺寸5" style="zoom:50%;" />

    > 上图中的 top、left、right、bottom 均相对于**==视口==**

### Fetch API

Fetch API 提供了一个获取资源的接口（包括跨网络通信）。对于任何使用过 [`XMLHttpRequest`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest) 的人都能轻松上手，而且新的 API 提供了更强大和灵活的功能集。

**备注: ** 此特性在 [Web Worker](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API) 中可用

#### 基本使用

全局的 **`fetch()`** 方法用于发起获取资源的请求。它返回一个 promise，这个 promise 会在请求响应后被 resolve，并传回 [`Response`](https://developer.mozilla.org/zh-CN/docs/Web/API/Response) 对象。

##### 语法

```js
Promise<Response> fetch(input[, init]);
```

##### 参数

-   **input**

    定义要获取的资源。这可能是: 一个 [`USVString`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String) 字符串，包含要获取资源的 URL。一些浏览器会接受 `blob:` 和 `data:` 作为 schemes.一个 [`Request`](https://developer.mozilla.org/zh-CN/docs/Web/API/Request) 对象。

-   **init** 可选

    一个配置项对象，包括所有对请求的设置。可选的参数有:

    -   **method**: 请求使用的方法，如 `GET`、`POST`。

    -   **headers**: 请求的头信息，形式为 [`Headers`](https://developer.mozilla.org/zh-CN/docs/Web/API/Headers) 的对象或包含 [`ByteString`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String) 值的对象字面量。例: **"Content-Type" : "application/json"**

    -   **body**: 请求的 body 信息: 可能是一个 [`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)、`BufferSource`、[`FormData`](https://developer.mozilla.org/zh-CN/docs/Web/API/FormData)、[`URLSearchParams`](https://developer.mozilla.org/zh-CN/docs/Web/API/URLSearchParams) 或者 [`USVString`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String) 对象。注意 GET 或 HEAD 方法的请求不能包含 body 信息。**请求体的内容，必须匹配请求头中的 Content-Type**

    -   `mode`: 请求的模式，如 `cors`、`no-cors` 或者 `same-origin`。

        -   ==cors==: 默认值，配置为该值，会在请求头中加入 origin 和 referer

        -   no-cors: 配置为该值，不会在请求头中加入 origin 和 referer，跨域的时候可能会出现问题

        -   same-origin: 指示请求必须在同一个域中发生，如果请求其他域，则会报错

    -   `credentials`: 请求的 credentials，如 `omit`、`same-origin` 或者 `include`。为了在当前域名内 **自动发送 cookie**，必须提供这个选项，从 Chrome 50 开始，这个属性也可以接受 [`FederatedCredential` (en-US)](https://developer.mozilla.org/en-US/docs/Web/API/FederatedCredential) 实例或是一个 [`PasswordCredential` (en-US)](https://developer.mozilla.org/en-US/docs/Web/API/PasswordCredential) 实例。

        -   omit: 默认值，不携带 cookie

        -   same-origin: 请求同源地址时携带 cookie

        -   include: 请求任何地址都携带 cookie

    -   `cache`: 请求的 cache(缓存) 模式: `default`、 `no-store`、 `reload` 、 `no-cache`、 `force-cache` 或者 `only-if-cached`。

        -   default: 表示 fetch 请求之前将检查下 http 的缓存.

        -   no-store: 表示 fetch 请求将完全忽略 http 缓存的存在. 这意味着请求之前将不再检查下 http 的缓存, 拿到响应后, 它也不会更新 http 缓存.

        -   no-cache: 如果存在缓存, 那么 fetch 将发送一个条件查询 request 和一个正常的 request, 拿到响应后, 它会更新 http 缓存(**之前没有则不会更新缓存**).

        -   reload: 表示 fetch 请求之前将忽略 http 缓存的存在, 但是请求拿到响应后, 它将主动更新 http 缓存(**不论之前有没有都会更新缓存**).

        -   force-cache: 表示 fetch 请求不顾一切的依赖缓存, 即使缓存过期了, 它依然从缓存中读取. 除非没有任何缓存, 那么它将发送一个正常的 request.

        -   only-if-cached: 表示 fetch 请求不顾一切的依赖缓存, 即使缓存过期了, 它依然从缓存中读取. 如果没有缓存, 它将抛出网络错误(该设置只在 mode 为”same-origin”时有效).

    -   `redirect`: 可用的 redirect 模式: `follow` (自动重定向), `error` (如果产生重定向将自动终止并且抛出一个错误），或者 `manual` (手动处理重定向)。在 Chrome 中默认使用 `follow`（Chrome 47 之前的默认值是 `manual`）。

    -   `referrer`: 一个 [`USVString`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String) 可以是 `no-referrer`、`client` 或一个 URL。默认是 `client`。

    -   `referrerPolicy`: 指定了 HTTP 头部 referer 字段的值。可能为以下值之一: `no-referrer`、 `no-referrer-when-downgrade`、`origin`、`origin-when-cross-origin`、 `unsafe-url`。

    -   `integrity`: 包括请求的 [subresource integrity](https://developer.mozilla.org/zh-CN/docs/Web/Security/Subresource_Integrity) 值（例如: `sha256-BpfBw7ivV8q2jLiT13fxDYAe2tJllusRSZ273h2nFSE=`）。

##### 返回值

一个 [`Promise`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)，resolve 时回传 [`Response`](https://developer.mozilla.org/zh-CN/docs/Web/API/Response) 对象。

-   当收到服务器的返回结果后，Promise 进入 resolved 状态，状态数据为 Response 对象

-   当网络发生错误（或其他导致无法完成交互的错误）时，Promise 进入 rejected 状态，状态数据为错误信息

##### 例外

| 类型         | **描述**                                                                                                                                                                                                            |
| :----------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `AbortError` | 请求被[`AbortController.abort()`](https://developer.mozilla.org/zh-CN/docs/Web/API/AbortController/abort)终止。                                                                                                     |
| `TypeError`  | 从[Firefox 43 (en-US)](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/43)开始，如果`fetch()`接收到含有用户名和密码的 URL（例如`http://user:password@example.com`），它将会抛出一个`TypeError` 。 |

```js
async function getProvinces() {
	const url = 'http://study.yuanjin.tech/api/local';
	const resp = await fetch(url);
	const result = await resp.json();
	console.log(result);
}
```

##### Response 对象

-   ok: boolean，当响应消息码在 200~299 之间时为 true，其他为 false

-   status: number，响应的状态码

-   text(): 用于处理文本格式的 Ajax 响应。它从响应中获取文本流，将其读完，然后返回一个被解决为 string 对象的 Promise。

-   blob(): 用于处理二进制文件格式（比如图片或者电子表格）的 Ajax 响应。它读取文件的原始数据，一旦读取完整个文件，就返回一个被解决为 blob 对象的 Promise。

-   json(): 用于处理 JSON 格式的 Ajax 的响应。它将 JSON 数据流转换为一个被解决为 JavaScript 对象的 promise。

-   redirect(): 可以用于重定向到另一个 URL。它会创建一个新的 Promise，以解决来自重定向的 URL 的响应。

##### Request 对象

除了使用基本的 fetch 方法，还可以通过创建一个 Request 对象来完成请求（实际上，fetch 的内部会帮你创建一个 Request 对象）

```js
new Request(url地址, 配置);
```

-   **注意点**:

    > 尽量保证每次请求都是一个新的 Request 对象

##### Headers 对象

> 在 Request 和 Response 对象内部，会将传递的请求头对象，转换为 Headers

Headers 对象中的方法:

-   has(key): 检查请求头中是否存在指定的 key 值

-   get(key): 得到请求头中对应的 key 值

-   set(key, value): 修改对应的键值对

-   append(key, value): 添加对应的键值对

-   keys(): 得到所有的请求头键的集合

-   values(): 得到所有的请求头中的值的集合

-   entries(): 得到所有请求头中的键值对的集合

##### 文件上传

流程:

1. 客户端将文件数据发送给服务器
2. 服务器保存上传的文件数据到服务器端
3. 服务器响应给客户端一个文件访问地址

> 测试地址: http://study.yuanjin.tech/api/upload
> 键的名称（表单域名称）: imagefile

请求方法: POST
请求的表单格式: multipart/form-data
请求体中必须包含一个键值对，键的名称是服务器要求的名称，值是文件数据

> HTML5 中，JS 仍然无法随意的获取文件数据，但是可以获取到 input 元素中，被用户选中的文件数据
> 可以利用 HTML5 提供的 FormData 构造函数来创建请求体

```html
<body>
	<img src="" alt="" id="imgAvatar" />
	<input type="file" id="avatar" />
	<button>上传</button>
	<script>
		async function upload() {
			const inp = document.getElementById('avatar');
			if (inp.files.length === 0) {
				alert('请选择要上传的文件');
				return;
			}
			const formData = new FormData(); //构建请求体
			formData.append('imagefile', inp.files[0]);
			const url = 'http://study.yuanjin.tech/api/upload';
			const resp = await fetch(url, {
				method: 'POST',
				body: formData, //自动修改请求头
			});
			const result = await resp.json();
			return result;
		}

		document.querySelector('button').onclick = async function () {
			const result = await upload();
			const img = document.getElementById('imgAvatar');
			img.src = result.path;
		};
	</script>
</body>
```

## 防抖与节流

-   防抖:单位时间内，频繁触发事件，**只执行最后一次**

    > 典型场景:搜索框搜索输入

    代码思路是利用定时器，每次触发先清掉以前的定时器(从新开始)

```js
function debounce(fn, duration = 1000) {
	let timerId;
	// 返回函数 用于每次事件触发执行
	return (...args) => {
		// 剩余参数args[]
		clearTimeout(timerId);
		// 将该函数的参数全部传递给fn
		// let args = Array.prototype.slice.call(arguments, 0);
		timerId = setTimeout(() => {
			// 将该函数的this传递到fn
			fn.apply(this, args);
		}, duration);
	};
}
```

-   节流:单位时间内，频繁触发事件，**只执行一次**

    > 典型场景:高频事件快速点击、鼠标滑动、resize 事件、scroll 事件

    代码思路也是利用定时器，等定时器执行完毕，才开启定时器(不要打断)

    ```js
    function throttle(fn,delay){
      let timer = null
      retrun function(...args){
        // let args=arguments 也可以写成这种或...args也是代表我们传过来的实参
        if(!timer){
          timer=setTimeOut(()=>{
             fn.apply(this,args)
             timer = null
          }, dealy)
        }
        // 当我们第一次触发事件，定时器不存在时就执行函数，当我们再次点击时，因为定时器存在，
        // 所以无法再进入函数调用(无论事件如何执行),那么只能等定时器事件结束，
        // 我们让timer=null，回到第一次的状态,就又重新开始新的一轮
      }
    }
    ```

    lodash 库，利用里面的 debounce(防抖)和 throttle(节流)来做

## 事件循环 (浏览器、Node)

### 浏览器的进程模型

#### 何为进程？

程序运行需要有它自己专属的内存空间, 可以把这块内存空间简单的理解为进程

<img src="./img/yuanjin/202208092057573.png" alt="image-20220809205743532" style="zoom:50%;" />
每个应用至少有一个进程, 进程之间相互独立, 即使要通信, 也需要双方同意。

#### 何为线程？

有了进程后, 就可以运行程序的代码了。

运行代码的「人」称之为「线程」。

一个进程至少有一个线程, 所以在进程开启后会自动创建一个线程来运行代码, 该线程称之为主线程。

如果程序需要同时执行多块代码, 主线程就会启动更多的线程来执行代码, 所以一个进程中可以包含多个线程。

<img src="./img/yuanjin/202208092108499.png" alt="image-20220809210859457" style="zoom:50%;" />

#### 浏览器有哪些进程和线程？

**浏览器是一个多进程多线程的应用程序**

浏览器内部工作极其复杂。

为了避免相互影响, 为了减少连环崩溃的几率, 当启动浏览器后, 它会自动启动多个进程。

<img src="./img/yuanjin/202208092131410.png" alt="image-20220809213152371" style="zoom:50%;" />

> 可以在浏览器的任务管理器中查看当前的所有进程

其中, 最主要的进程有:

1. **浏览器进程**

    主要负责界面显示(浏览器的界面)、用户交互、子进程管理等。浏览器进程内部会启动多个线程处理不同的任务。

2. **网络进程**

    负责加载网络资源。网络进程内部会启动多个线程来处理不同的网络任务。

3. **渲染进程**

    渲染进程启动后, 会开启一个==**渲染主线程**, 主线程负责执行 HTML、CSS、JS 代码。==

    默认情况下, 浏览器会为每个标签页开启一个新的渲染进程, 以保证不同的标签页之间不相互影响。

    > 将来该默认模式可能会有所改变, 有兴趣的同学可参见[chrome 官方说明文档](https://chromium.googlesource.com/chromium/src/+/main/docs/process_model_and_site_isolation.md#Modes-and-Availability)
    >
    > _可能采取一个站点一个渲染进程_

### 渲染 _主线程_ 是如何工作的？

渲染主线程是浏览器中最繁忙的线程, 需要它处理的任务包括但不限于:

-   解析 HTML
-   解析 CSS
-   计算样式
-   布局
-   处理图层
-   每秒把页面画 60 次 `FPS`
-   执行全局 JS 代码
-   执行事件处理函数
-   执行计时器的回调函数
-   ......

> **思考题**: ==为什么渲染进程不适用多个线程来处理这些事情 ？==

要处理这么多的任务, 主线程遇到了一个前所未有的难题:如何调度任务？

比如:

-   我正在执行一个 JS 函数, 执行到一半的时候用户点击了按钮, 我该立即去执行点击事件的处理函数吗？
-   我正在执行一个 JS 函数, 执行到一半的时候某个计时器到达了时间, 我该立即去执行它的回调吗？
-   浏览器进程通知我“用户点击了按钮”, 与此同时, 某个计时器也到达了时间, 我应该处理哪一个呢？
-   ......

渲染主线程想出了一个绝妙的主意来处理这个问题: **排队**

<img src="./img/yuanjin/202208092230847.png" alt="渲染主线程想出了一个绝妙的主意来处理这个问题:排队" style="zoom: 50%;" />

1. 在最开始的时候, 渲染主线程会进入一个无限循环 `for(;;)`
2. 每一次循环会检查消息队列中是否有任务存在。如果有, 就取出第一个任务执行, 执行完一个后进入下一次循环；如果没有, 则进入休眠状态。
3. 其他所有线程 (包括其他进程的线程) 可以随时向消息队列添加任务。新任务会加到消息队列的末尾。在添加新任务时, 如果主线程是休眠状态, 则会将其唤醒以继续循环拿取任务

这样一来, 就可以让每个任务有条不紊的、持续的进行下去了。

**整个过程, 被称之为 事件循环(W3C) (谷歌浏览器: 消息循环/message-loop)**

#### 若干解释

##### 何为异步？

代码在执行过程中, 会遇到一些无法立即处理的任务, 比如:

-   计时完成后需要执行的任务 —— **`setTimeout`**、**`setInterval`**
-   网络通信完成后需要执行的任务 —— **`XHR`**、**`Fetch`**
-   用户操作后需要执行的任务 —— **`addEventListener`**

如果让渲染主线程等待这些任务的时机达到, 就会导致主线程长期处于「阻塞」的状态, 从而导致浏览器「卡死」

<img src="./img/yuanjin/202208101043348.png" alt="image-20220810104344296" style="zoom:50%;" />

**渲染主线程承担着极其重要的工作, 无论如何都不能阻塞！**

因此, 浏览器选择**异步**来解决这个问题

<img src="./img/yuanjin/202208101048899.png" alt="image-20220810104858857" style="zoom:50%;" />

使用异步的方式, **渲染主线程永不阻塞**

-   **面试题**: 如何理解 JS 的异步？

    > 参考答案:
    >
    > JS 是一门单线程的语言, 这是因为它运行在浏览器的渲染主线程中, 而渲染主线程只有一个。
    > 而渲染主线程承担着诸多的工作, 渲染页面、执行 JS 都在其中运行。
    >
    > ==如果使用同步的方式, 就极有可能导致主线程产生阻塞==, 从而导致消息队列中的很多其他任务无法得到执行。这样一来, 一方面会导致繁忙的主线程白白的消耗时间, 另一方面导致页面无法及时更新, 给用户造成卡死现象。
    >
    > 所以浏览器采用异步的方式来避免。具体做法是当某些任务发生时, 比如计时器、网络、事件监听, 主线程将任务交给其他线程去处理, 自身立即结束任务的执行, 转而执行后续代码。当其他线程完成时, ==将事先传递的回调函数包装成任务==, 加入到消息队列的末尾排队, 等待主线程调度执行。
    >
    > 在这种异步模式下, 浏览器永不阻塞, 从而最大限度的保证了单线程的流畅运行。

    -   **==单线程是异步产生的原因==**
    -   **==事件循环是异步实现的方式==**

##### JS 为何会阻碍渲染？

> js 和渲染 都在渲染主线程（单线程）

先看代码

```html
<h1>Mr.Yuan is awesome!</h1>
<button>change</button>
<script>
	var h1 = document.querySelector('h1');
	var btn = document.querySelector('button');

	// 死循环指定的时间
	function delay(duration) {
		var start = Date.now();
		while (Date.now() - start < duration) {}
	}

	btn.onclick = function () {
		h1.textContent = '袁老师很帅！';
		delay(3000);
	};
</script>
```

点击按钮后, 会发生什么呢？

**答案: 先延时 然后文本改变 (点击事件放入了交互队列)**

**代码明明是先改变的文本，再进入死循环，为何页面 3s 后才会改变？**

这是因为渲染主线程在执行完`h1.textContent = "袁老师很帅"`之后重新生成一个渲染任务加入到消息队列，而渲染主线程又去执行 delay(3000)，从而导致浏览器阻塞 3s，3s 之后，渲染主线程再去执行渲染任务，从而页面字段改变。

[<见具体演示>](./demo/事件循环.html)

##### 任务有优先级吗？

任务没有优先级, 在消息队列中先进先出, 但 **消息队列是有优先级** 的

根据 W3C 的最新解释:

-   每个任务都有一个任务类型, 同一个类型的任务必须在一个队列, 不同类型的任务可以分属于不同的队列。
    在一次事件循环中, 浏览器可以根据实际情况从不同的队列中取出任务执行。
-   [浏览器必须准备好一个微队列, 微队列中的任务优先所有其他任务执行](https://html.spec.whatwg.org/multipage/webappapis.html#perform-a-microtask-checkpoint)

随着浏览器的复杂度急剧提升, W3C 不再使用宏队列的说法

在目前 chrome 的实现中, 至少包含了下面的队列:

**延时队列**: ==用于存放计时器到达后的回调任务, 优先级「中」==

**交互队列**: ==用于存放用户操作后产生的事件处理任务, 优先级「高」==

**微队列**: ==用户存放需要最快执行的任务, 优先级「最高」==

> 添加任务到微队列的主要方式主要是使用 **==Promise==**、**==MutationObserver==**

-   process.nextTick(cb) (node 中)

-   Promise

-   Async/Await(实际就是 promise)

-   [MutationObserver()](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver/MutationObserver) (html5 新特性)

    > 监听一个 DOM 变动,当 DOM 对象树发生任何变动时，Mutation Observer 会得到通知
    >
    > ```js
    > var observer = new MutationObserver(cb);
    > ```

```js
// 立即把一个函数添加到 微队列
Promise.resolve().then(函数);
```

浏览器还有很多其他的队列, 由于和我们开发关系不大, 不作考虑

-   **面试题:阐述一下 JS 的事件循环**

    > 参考答案:
    >
    > 事件循环(event loop)又叫做消息循环(message loop), 是浏览器渲染主线程的工作方式。
    >
    > 在 Chrome 的源码中, 它开启一个不会结束的 for 循环 for(; ; ), 每次循环从消息队列中取出第一个任务执行, 而其他线程只需要在合适的时候将任务加入到队列末尾即可。
    >
    > 过去把消息队列简单分为宏队列和微队列, 这种说法目前已无法满足复杂的浏览器环境, 取而代之的是一种更加灵活多变的处理方式。
    >
    > 根据 W3C 官方的解释, 每个任务有不同的类型, 同类型的任务必须在同一个队列, 不同的任务可以属于不同的队列。不同任务队列有不同的优先级, 在一次事件循环中, 由浏览器自行决定取哪一个队列的任务。但浏览器必须有一个微队列, 微队列的任务一定具有最高的优先级, 必须优先调度执行。

-   **面试题:JS 中的计时器能做到精确计时吗？为什么？**
    > 参考答案:
    >
    > 不行, 因为:
    >
    > 1. 计算机硬件没有原子钟, 无法做到精确计时
    > 2. 操作系统的计时函数本身就有少量偏差, 由于 JS 的计时器最终调用的是操作系统的函数, 也就携带了这些偏差
    > 3. **按照 W3C 的标准, 浏览器实现计时器时, 如果嵌套层级超过 5 层, 则会带有 4 毫秒的最少时间,** 这样在计时时间少于 4 毫秒时又带来了偏差
    > 4. **受事件循环的影响, ==计时器的回调函数==只能在==主线程空闲时运行==, 因此又带来了偏差**

```js
// 例1
setTimeout(() => {
	// 延时队列
	console.log(1);
}, 0);
Promise.resolve().then(function () {
	// 微队列
	console.log(2);
});
console.log(3);
// 输出 3 2 1

// 例2
function a() {
	console.log(1);
	Promise.resolve().then(function () {
		console.log(2);
	});
}
setTimeout(() => {
	console.log(3);
	Promise.resolve().then(a);
}, 0);
Promise.resolve().then(function () {
	console.log(4);
});
console.log(5);
// 输出 5 4 3 1 2

// 例3
function a() {
	console.log(1);
	Promise.resolve().then(function () {
		console.log(2);
	});
}
setTimeout(() => {
	console.log(3);
}, 0);
Promise.resolve().then(a);
console.log(5);
// 输出 5 1 2 3

// 例4
console.log(1);
setTimeout(() => {
	console.log(2);
}, 0);
new Promise((resolve, reject) => {
	console.log(3);
	reject(); // !!!
	console.log(4);
})
	.then(
		() => {
			console.log(5);
		},
		() => {
			console.log(6);
		},
	)
	.finally(() => {
		console.log(7);
	});
console.log(8);
// 猜想 1 3 4 8 5 6 7 2

// 结果 1 3 4 8 6 7 2
```

解释:

-   p.then 官方解释 then() 方法返回一个 Promise (en-US)。它最多需要有两个参数:Promise 的成功和失败情况的回调函数

```js
p.then(onFulfilled[, onRejected]);
p.then(value => {
// fulfillment
}, reason => {
// rejection
});

两个捕获方法的比较;
// bad
promise.then(
	(data)=> {
	// success
	}, (err)=> {
	// error
});

// good
promise
.then(function (data) {
// cb
// success
})
.catch(function (err) {
// error
});
```

> 上面代码中, 第二种写法要好于第一种写法, 理由是第二种写法可以捕获前面 then 方法执行中的错误, 也更接近同步的写法 (try/catch) 。因此, 建议总是使用 catch 方法, 而不使用 then 方法的第二个参数。

## 浏览器渲染原理

> 当浏览器的网络线程收到 HTML 文档后，会产生一个渲染任务，并将其传递给渲染主线程的消息队列。
> 在事件循环机制的作用下，渲染主线程取出消息队列中的渲染任务，开启渲染流程。

<img src="./img/渲染时间点.png" alt="渲染时间点"  />

整个渲染流程分为多个阶段，分别是:**HTML 解析、样式计算、布局、分层、绘制、分块、光栅化、画**
每个阶段都有明确的输入输出，上一个阶段的输出会成为下一个阶段的输入。

这样，整个渲染流程就形成了一套组织严密的生产流水线。

<img src="./img/渲染流水线.png" alt="渲染流水线"  />

### 1.渲染的第一步是**解析 HTML-Parse HTML**

<img src="./img/解析HTML-1.png" alt="解析HTML-1" />

<img src="./img/解析HTML-2.png" alt="解析HTML-2" style="zoom:80%;" />

<img src="./img/解析HTML-3.png" alt="解析HTML-3" style="zoom:80%;" />

<img src="./img/解析HTML-4.png" alt="解析HTML-4" style="zoom:80%;" />

<img src="./img/解析HTML-5.png" alt="解析HTML-5" style="zoom:80%;" />

解析过程中遇到 CSS 解析 CSS，遇到 JS 执行 JS。为了提高解析效率，浏览器在开始解析前，会启动一个预解析的线程，率先下载 HTML 中的外部 CSS 文件和 外部的 JS 文件。

-   **CSS 不会阻塞 HTML 解析**
    如果主线程解析到`link`位置，此时外部的 CSS 文件还没有下载解析好，主线程不会等待，继续解析后续的 HTML。这是因为下载和解析 CSS 的工作是在预解析线程中进行的。

-   **JS 会阻塞 HTML 解析**
    如果主线程解析到`script`位置，会停止解析 HTML，转而等待 JS 文件下载好，并将全局代码解析执行完成后，才能继续解析 HTML。这是因为 JS 代码的执行过程可能会修改当前的 DOM 树，所以 DOM 树的生成必须暂停。

第一步完成后，会得到 DOM 树和 CSSOM 树，浏览器的默认样式、内部样式、外部样式、行内样式均会包含在 CSSOM 树中。

-   **[DOMContentLoaded](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/DOMContentLoaded_event)。**

> ==当初始的 HTML 文档被完全加载和解析完成之后，DOMContentLoaded 事件被触发==，而无需等待样式表、图像和子框架的完全加载

当 DOM 树完全生成好后，会触发`DOMContentLoaded`事件

```js
document.addEventListener('DOMContentLoaded', function () {
	console.log('DOM树已全部生成完毕');
});
```

-   **[load](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/load_event)**

> load 事件在整个页面及所有依赖资源如样式表和图片都已完成加载时触发。==它与 DOMContentLoaded 不同，后者只要页面 DOM 加载完成就触发，无需等待依赖资源的加载。==

当页面中的所有外部资源全部加载完毕后，会触发`load`事件

```js
window.onload = function () {
	console.log('所有资源已加载完成');
};
window.addEventListener('load', (event) => {
	console.log('page is fully loaded');
});
```

==load 事件也可以针对单个外部资源使用 (img) ，资源加载完成后触发==

### 2.渲染的下一步是**样式计算-Recalculate Style**

![样式计算](./img/样式计算.png)

主线程会遍历得到的 DOM 树，依次为树中的每个节点计算出它最终的样式，称之为 Computed Style。

在这一过程中，很多预设值会变成绝对值，比如`red`会变成`rgb(255,0,0)`；相对单位会变成绝对单位，比如`em`会变成`px`

这一步完成后，会得到一棵 **带有样式的 DOM 树**。

### 3.接下来是**布局-Layout**，布局完成后会得到布局树

这个步骤又称之为 reflow（回流、重排），是指浏览器一边生成渲染树，一边计算每个元素最终的尺寸和位置
<img src="./img/布局-1.png" alt="布局-1" style="zoom:80%;" />

<img src="./img/布局-2.png" alt="布局-2" style="zoom:80%;" />

<img src="./img/布局-3.png" alt="布局-3" style="zoom:80%;" />

<img src="./img/布局-4.png" alt="布局-4" style="zoom:80%;" />

布局阶段会依次遍历 DOM 树的每一个节点，**计算每个节点的几何信息** 。例如节点的宽高、相对包含块的位置。

大部分时候，**DOM 树和布局树并非一一对应**。
比如
`display:none`的节点没有几何信息，因此不会生成到布局树；
又比如使用了伪元素选择器，虽然 DOM 树中不存在这些伪元素节点，但它们拥有几何信息，所以会生成到布局树中。
还有匿名行盒、匿名块盒等等都会导致 DOM 树和布局树无法一一对应。

-   **匿名行盒、匿名块盒是为了满足:**
    -   **内容必须在行盒**
    -   **行盒和块盒不能相邻**

### 4.下一步是**分层-Layer**

<img src="./img/分层.png" alt="分层" style="zoom:80%;" />

主线程会使用一套复杂的策略对整个布局树中进行分层。

分层的好处在于，将来某一个层改变后，仅会对该层进行后续处理，从而提升效率。

滚动条、堆叠上下文、transform、opacity 等样式都会或多或少的影响分层结果，也可以通过`will-change` (告诉浏览器哪儿些 css 属性变动，至于能否独立分层看浏览器自己决策) 属性更大程度的影响分层结果。

### 5.再下一步是**绘制-Paint**

<img src="./img/绘制-1.png" alt="绘制-1" style="zoom:80%;" />

<img src="./img/绘制-2.png" alt="绘制-2" style="zoom:80%;" />

主线程会为每个层单独产生绘制指令集，用于描述这一层的内容该如何画出来。

### 6.**分块-Tiling**

<img src="./img/分块-1.png" alt="分块-1" style="zoom:80%;" />

<img src="./img/分块-2.png" alt="分块-2" style="zoom:80%;" />

完成绘制后，**主线程将每个图层的绘制信息提交给合成线程，剩余工作将由合成线程完成**。

合成线程首先对每个图层进行**分块**，将其划分为更多的小区域。

它会从线程池中拿取多个线程来完成分块工作。

### 7.分块完成后，进入**光栅化-Raster**阶段。

<img src="./img/光栅化-1.png" alt="光栅化-1" style="zoom:80%;" />

<img src="./img/光栅化-2.png" alt="光栅化-2" style="zoom:80%;" />

**合成线程会将块信息交给 GPU 进程，以极高的速度完成光栅化**。

GPU 进程会开启多个线程来完成光栅化，并且**优先处理靠近视口区域的块**。

光栅化的结果，就是一块一块的**位图**

### 8.最后一个阶段就是**画-Draw**了

<img src="./img/画.png" alt="画" style="zoom:80%;" />

**合成线程拿到每个层、每个块的位图后，生成一个个「指引 (quad) 」信息**。

指引会标识出每个位图应该画到屏幕的哪个位置，以及会考虑到旋转、缩放等变形。

==变形发生在合成线程，与渲染主线程无关，这就是 transform 效率高的本质原因。==

合成线程会把 quad 提交给 GPU 进程，由 GPU 进程产生系统调用，提交给 GPU 硬件，完成最终的屏幕成像。

<img src="./img/完整过程.png" alt="完整过程" style="zoom:80%;" />

### 什么是 reflow？ 回流(重排)

<img src="./img/reflow.png" alt="reflow" style="zoom:80%;" />

reflow 的本质就是重新计算 layout 树。

> 渲染树中的节点信息发生了大小、边距等问题，需要重新计算各节点和 css 具体的大小和位置

当进行了会影响布局树的操作后，需要重新计算布局树，会引发 layout。

为了避免连续的多次操作导致布局树反复计算，浏览器会合并这些操作，当 JS 代码全部完成后再进行统一计算。

**所以，改动属性造成的 reflow 是异步完成的。也同样因为如此，当 JS 获取布局属性时，就可能造成无法获取到最新的布局信息。
浏览器在反复权衡下，最终决定获取属性立即 reflow。**

容易造成回流的操作:

1. 布局流相关操作
   盒模型的相关操作会触发重新布局
   定位相关操作会触发重新布局
   浮动相关操作会触发重新布局

2. 改变节点内的内容
   改变节点的结构或其中的文本结构会触发重新布局

3. css:

```css
    width
    height
    padding
    border
    margin
    position
    top
    left
    bottom
    right
    float
    clear
    text-align
    vertical-align
    line-height
    font-weight
    font-size
    font-family
    overflow
    white-space
```

### 什么是 repaint？ 重绘

<img src="./img/repaint.png" alt="repaint" style="zoom:80%;" />

repaint 的本质就是重新根据分层信息计算了绘制指令。

> 节点的部分属性发生变化，但不影响布局，只需要重新计算节点在屏幕中的绝对位置并渲染的过程，就叫重绘。比如:改变元素的背景颜色、字体颜色等操作会造成重绘

当改动了可见样式后，就需要重新计算，会引发 repaint。

由于元素的布局信息也属于可见样式，所以 reflow 一定会引起 repaint。

> 回流的过程在重绘的过程前面，所以回流一定会重绘，但重绘不一定会引起回流。

容易造成重绘操作的 css:

```css
    color
    border-style
    border-radius
    text-decoration
    box-shadow
    outline
    background
```

减少回流和重绘

1. 合并样式修改
   减少造成回流的次数，如果要给一个节点操作多个 css 属性，而每一个都会造成回流的话，尽量将多次操作合并成一个
2. 批量操作 DOM
   当对 DOM 有多次操作的时候，需要使用一些特殊处理减少触发回流，其实就是对 DOM 的多次操作，在脱离标准流后，对元素进行的多次操作，不会触发回流，等操作完成后，再将元素放回标准流。
3. 避免多次触发布局
   对于页面中比较复杂的动画，尽量将元素设置为绝对定位，操作元素的定位属性，这样只有这一个元素会回流，如果不是定位的话，容易引起其父元素以及子元素的回流。

### 元素隐藏的影响

[参考](https://juejin.cn/post/7120293706384539679)

| **比较**   | **display:none**                     | **visibility:hidden**                        | **opacity:0**                                                               |
| :--------- | :----------------------------------- | :------------------------------------------- | :-------------------------------------------------------------------------- |
| DOM 结构   | **否**                               | **是**                                       | **是**                                                                      |
| 绑定事件   | **不响应**                           | **不响应**                                   | **能响应**                                                                  |
| 回流重绘   | **是**<br />**会引起重排**，性能较差 | **否**<br />**会引起重绘**，性能较高         | **否**<br /> **提升为合成层，不会触发重绘**，性能最高                       |
| 反继承     | **否**                               | **能**                                       | **否**                                                                      |
| 子代继承   | **不继承**                           | **继承**                                     | **继承**<br />会被子元素继承,且，**子元素并不能通过 opacity: 1 来取消隐藏** |
| transition | **无效**                             | **有效** visibility 会立即显示，隐藏时会延时 | **有效**                                                                    |

### 为什么 transform 的效率高？

<img src="./img/transform.png" alt="transform"  />

> 区分

因为 transform 既不会影响布局也不会影响绘制指令，它影响的只是渲染流程的最后一个「draw」阶段

> 由于 draw 阶段在合成线程中，所以 transform 的变化几乎不会影响渲染主线程。反之，渲染主线程无论如何忙碌，也不会影响 transform 的变化。

事例:

-   <a href="./demo/浏览器工作原理-动画.html" target="_blank">
    	transform动画在渲染最后阶段(draw) (在合成线程中) 所以主线程卡死不影响动画 
    </a>

-   <a href="./demo/浏览器工作原理-滚动.html" target="_blank">
    	浏览器滚动条滚动的时候 只影响相对视口位置  (在合成线程中)  所以主线程卡死不影响滚不动
    </a>

## js 监控浏览器行为

addEventListener()添加事件监听
addEventListener(event, function, useCapture)

> 参数 event 必填，表示监听的事件，例如 click, touchstart 等，不加前缀 on 的事件。
> 参数 function 必填，表示事件触发后调用的函数，可以是外部定义函数，也可以是匿名函数。不带参数
> 参数 useCapture 选填，填 true 或者 false，用于描述事件是冒泡还是捕获触发，true 表示捕获，默认 false 表示冒泡。

**W3C 规范中定义了 3 个事件阶段，依次是捕获阶段、目标阶段、冒泡阶段。**

```
window.addEventListener('resize', function() {
    console.log('resize')
}, false)
```

这里 function 参数传的不是匿名函数,可以用 removeEventListener 解除监听

```
function resizeFn(e) {
    console.log('resize')
    console.log(e)
}
window.addEventListener('resize', resizeFn, false)
// 解除上面绑定的事件监听
window.removeEventListener('resize', resizeFn, false)
```

监听用户的交互行为，我们会用 addEventListener 来监听 click、mousedown、keydown、input 等事件，但对于元素的变化、performance 的记录、浏览器干预行为这些不是用户交互的事件就要用 XxxObserver 的 api 了。
浏览器提供了这 5 种 Observer：

**==IntersectionObserver==**：监听元素可见性变化，常用来做元素显示的数据采集、图片的懒加载
**==MutationObserver==**：监听元素属性和子节点变化，比如可以用来做去不掉的水印
**==ResizeObserver==**：监听元素大小变化

还有两个与元素无关的：
**PerformanceObserver**：监听 performance 记录的行为，来上报数据
**ReportingObserver**：监听过时的 api、浏览器的一些干预行为的报告，可以让我们更全面的了解网页 app 的运行情况

这些 api 相比 addEventListener 添加的交互事件来说用的比较少，但是在特定场景下都是很有用的。

## Node.js 事件循环- 定时器 和 process.nextTick()

### 什么是事件循环？

事件循环是 Node.js 处理非阻塞 I/O 操作的机制——尽管 JavaScript 是单线程处理的——当有可能的时候，它们会把操作转移到系统内核中去。

因为目前大多数内核都是多线程的，所以它们可以在后台处理多种操作。当其中的一个操作完成的时候，内核通知 Node.js 将适合的回调函数添加到 _轮询_ 队列中等待时机执行。我们在本文后面会进行详细介绍。

### 事件循环机制解析

当 Node.js 启动后，它会初始化事件循环，处理已提供的输入脚本（或丢入 [REPL](https://nodejs.org/api/repl.html#repl_repl)，本文不涉及到），它可能会调用一些异步的 API、调度定时器，或者调用 `process.nextTick()`，然后开始处理事件循环。

下面的图表展示了事件循环操作顺序的简化概览。

```text
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

注意: 每个框被称为事件循环机制的一个阶段。

每个阶段都有一个 FIFO 队列来执行回调。虽然每个阶段都是特殊的，但通常情况下，当事件循环进入给定的阶段时，它将执行特定于该阶段的任何操作，然后执行该阶段队列中的回调，直到队列用尽或最大回调数已执行。当该队列已用尽或达到回调限制，事件循环将移动到下一阶段，等等。

由于这些操作中的任何一个都可能调度 _更多的_ 操作和由内核排列在**轮询**阶段被处理的新事件， 且在处理轮询中的事件时，轮询事件可以排队。因此，长时间运行的回调可以允许轮询阶段运行长于计时器的阈值时间。有关详细信息，请参阅 [**计时器**](https://nodejs.org/zh-cn/docs/guides/event-loop-timers-and-nexttick#timers) 和 [**轮询**](https://nodejs.org/zh-cn/docs/guides/event-loop-timers-and-nexttick#poll) 部分。

注意: 在 Windows 和 Unix/Linux 实现之间存在细微的差异，但这对演示来说并不重要。最重要的部分在这里。实际上有七或八个步骤，但我们关心的是 Node.js 实际上使用以上的某些步骤。

### 阶段概述

-   **定时器**: 此阶段执行由 `setTimeout()` 和 `setInterval()` 排序。
-   **待处理回调**: 执行 I/O 回调推迟到下一个循环 迭代。
-   **空闲, 准备**: 仅在内部使用。
-   **调查**: 检索新的 I/O 事件; 执行 I/O 相关回调(几乎 除了关闭回调，由计时器排定的回调 和 `setFidate()`); 节点将在适当时阻止此处。
-   **勾选**: `setEffite()` 回调在此处被调用。
-   **关闭的回调函数**: 一些关闭的回调函数，如: `socket.on('close', ...)`。

由于这些操作中的任何一个都可能调度 _更多的_ 操作并且在 **轮询（poll）** 阶段被处理的新事件会被内核排列， 并且在处理轮询中的事件时，轮询事件可以排队。因此，长时间运行的回调可以允许轮询阶段运行长于计时器的 **阈值（threshold）**。有关详细信息，请参阅 [**计时器**](https://nodejs.org/zh-cn/docs/guides/event-loop-timers-and-nexttick#timers) 和 [**轮询**](https://nodejs.org/zh-cn/docs/guides/event-loop-timers-and-nexttick#poll) 部分。

### 阶段的详细概述

#### 定时器

计时器指定 **阈值** _之后_ 一个提供的回调 _可以执行_ 而不是 **准确** 一个人 *想执行 的时间*计时器调用将尽早运行，因为它们可以在指定时间过后 排定； 然而，操作系统计划或运行其他回调可能会延迟。

从技术上讲， [**民意测验** 阶段](https://nodejs.org/zh-cn/docs/guides/event-loop-timers-and-nexttick#poll) 控制执行计时器的时间。

在每次运行的事件循环之间，Node.js 检查它是否在等待任何异步 I/O 或计时器，如果没有的话，则完全关闭。

```js
const fs = require('fs');

function someAsyncOperation(callback) {
	// Assume this takes 95ms to complete
	fs.readFile('/path/to/file', callback);
}

const timeoutScheduled = Date.now();

setTimeout(() => {
	const delay = Date.now() - timeoutScheduled;

	console.log(`${delay}ms have passed since I was scheduled`);
}, 100);

// do someAsyncOperation which takes 95 ms to complete
someAsyncOperation(() => {
	const startCallback = Date.now();

	// do something that will take 10ms...
	while (Date.now() - startCallback < 10) {
		// do nothing
	}
});
```

计时器可以 _在回调后面_ 指定 **阈值**，而不是用户希望回调执行的确切时间。因为在经过指定的一段时间间隔后， 计时器回调将被尽可能早地运行。但是，操作系统调度或其它正在运行的回调可能会延迟它们。

注意: 为了防止 **轮询** 阶段事件循环五十可干，[libuv](https://libuv.org/)（实现 Node.js 事件循环和平台的所有异步行为的 C 函数库），在停止轮询以获得更多事件之前，还有一个硬性最大值（依赖于系统）。

#### 挂起的回调函数

此阶段对某些系统操作（如 TCP 错误类型）执行回调。例如，如果 TCP 套接字在尝试连接时接收到 `ECONNREFUSED`，则某些 \*nix 的系统希望等待报告错误。这将被排队以在 **挂起的回调** 阶段执行。

#### 轮询

例如，您调度了一个在 100 毫秒后执行回调的定时器，并且您的脚本开始异步读取文件，这会耗费 95 毫秒:

1. 计算应该阻塞和轮询 I/O 的时间。
2. 然后，处理 **轮询** 队列里的事件。

当事件循环进入 **轮询（poll）** 阶段时，它有一个空队列（此时 `fs.readFile()` 尚未完成），因此它将等待剩下的毫秒数，直到达到最快的一个计时器阈值为止。当它等待 95 毫秒过后，`fs.readFile()` 完成读取文件，它的那个需要 10 毫秒才能完成的回调将被添加到 **轮询** 队列中并执行。当回调完成时，队列中不再有回调，此时事件循环机制将发现计时器最快的阈值（100ms）的已经达到，然后将回到 **计时器** 阶段，以执行定时器的回调。在本示例中，您将看到调度计时器到它的回调被执行之间的总延迟将为 105 毫秒。

-   \*如果 **轮询** 队列 **不是空的\*** ，事件循环将循环访问回调队列并同步执行它们，直到队列已用尽，或者达到了与系统相关的硬性限制。
-   \*如果 **轮询** 队列 **是空的\*** ，还有两件事发生:
    -   如果脚本被 `setImmediate()` 调度，则事件循环将结束 **轮询** 阶段，并继续 **检查** 阶段以执行那些被调度的脚本。
    -   如果脚本 **未被** `setImmediate()`调度，则事件循环将等待回调被添加到队列中，然后立即执行。

注意: 为了防止 **轮询** 阶段事件循环陷入吃不饱的状态，[libuv](https://libuv.org/)（实现 Node.js 事件循环和平台的所有异步行为的 C 函数库）在停止轮询以获得更多事件之前，还有一个硬性的最大值（依赖于系统）。

#### 检查阶段

此阶段对某些系统操作（如 TCP 错误类型）执行回调。例如，如果 TCP 套接字在尝试连接时接收到 `ECONNREFUSED`，则某些 \*nix 的系统希望等待报告错误。这将被排队以在 **挂起的回调** 阶段执行。

**轮询** 阶段有两个重要的功能:

当事件循环进入 **轮询** 阶段且 _没有被调度的计时器时_ ，将发生以下两种情况之一:

#### 关闭的回调函数

一旦 **轮询** 队列为空，事件循环将检查 _已达到时间阈值的计时器_。如果一个或多个计时器已准备就绪，则事件循环将绕回计时器阶段以执行这些计时器的回调。

### `setImmediate()` 对比 `setTimeout()`

此阶段允许人员在 **轮询** 阶段完成后立即执行回调。如果轮询阶段变为空闲状态，并且脚本使用 `setImmediate()` 后被排列在队列中，则事件循环可能继续到 **检查** 阶段而不是等待。

-   `setFidate()` 是为了在 当前 **所有检测** 阶段完成后执行脚本。
-   `setTimeout()` 安排一个脚本，在已过期的最小阈值后运行。

`setImmediate()` 实际上是一个在事件循环的单独阶段运行的特殊计时器。它使用一个 libuv API 来安排回调在 **轮询** 阶段完成后执行。

通常，在执行代码时，事件循环最终会进入轮询阶段，在该阶段它将等待传入连接、请求等。但是，如果回调已使用 `setImmediate()`调度过，并且轮询阶段变为空闲状态，则它将结束此阶段，并继续到检查阶段而不是继续等待轮询事件。

```js
// timeout_vs_immediate.js
setTimeout(() => {
  console.log('timeout');
}, 0);

setImmediate(() => {
  console.log('immediate');
});
$ node timeout_vs_immediate.js
timeout
immediate

$ node timeout_vs_immediate.js
immediate
timeout
```

如果套接字或处理函数突然关闭（例如 `socket.destroy()`），则`'close'` 事件将在这个阶段发出。否则它将通过 `process.nextTick()` 发出。

```js
// timeout_vs_immediate.js
const fs = require('fs');

fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('timeout');
  }, 0);
  setImmediate(() => {
    console.log('immediate');
  });
});
$ node timeout_vs_immediate.js
immediate
timeout

$ node timeout_vs_immediate.js
immediate
timeout
```

`setImmediate()` 和 `setTimeout()` 很类似，但是基于被调用的时机，他们也有不同表现。

### `process.nextTick()`

#### 理解 process.nextTick()

您可能已经注意到`process.nextTick()` 在图示中没有显示，即使它是异步 API 的一部分。这是因为 `process.nextTick()`从技术上讲不是事件循环的一部分。相反，它都将在当前操作完成后处理`nextTickQueue`， 而不管事件循环的当前阶段如何。这里所谓的 _操作_ 被定义为来自底层 C/C++ 处理器的转换，和需要处理的 JavaScript 代码的执行。

回顾我们的图示，任何时候在给定的阶段中调用 `process.nextTick()`，所有传递到 `process.nextTick()` 的回调将在事件循环继续之前解析。这可能会造成一些糟糕的情况，因为**它允许您通过递归 `process.nextTick()`调用来“饿死”您的 I/O**，阻止事件循环到达 **轮询** 阶段。

#### 为什么会允许这样？

为什么这样的事情会包含在 Node.js 中？一部分因为它是一个设计理念，即尽管不是必需的情况下， API 应该始终是异步的。以此代码段为例:

```js
function apiCall(arg, callback) {
	if (typeof arg !== 'string') return process.nextTick(callback, new TypeError('argument should be string'));
}
```

代码段进行参数检查。如果不正确，则会将错误传递给回调函数。最近对 API 进行了更新，允许传递参数给 `process.nextTick()`，这将允许它接受任何在回调函数位置之后的参数，并将参数传递给回调函数作为回调函数的参数，这样您就不必嵌套函数了。

我们正在做的是将错误传回给用户，但仅在执行用户的其余代码之后。通过使用`process.nextTick()`，我们保证 `apiCall()` 始终在用户代码的其余部分*之后*和在让事件循环继续进行*之前*，执行其回调函数。为了实现这一点，JS 调用栈被允许展开，然后立即执行提供的回调，允许进行递归调用 `process.nextTick()`，而不触碰 `RangeError: 超过 V8 的最大调用堆栈大小` 限制。

这种设计原理可能会导致一些潜在的问题。 以此代码段为例:

```js
let bar;

// this has an asynchronous signature, but calls callback synchronously
function someAsyncApiCall(callback) {
	callback();
}

// the callback is called before `someAsyncApiCall` completes.
someAsyncApiCall(() => {
	// since someAsyncApiCall has completed, bar hasn't been assigned any value
	console.log('bar', bar); // undefined
});

bar = 1;
```

用户将 `someAsyncApiCall()` 定义为具有异步签名，但实际上它是同步运行的。当调用它时，提供给 `someAsyncApiCall()` 的回调是在事件循环的同一阶段内被调用，因为 `someAsyncApiCall()` 实际上并没有异步执行任何事情。结果，回调函数在尝试引用 `bar`，但作用域中可能还没有该变量，因为脚本尚未运行完成。

通过将回调置于 `process.nextTick()` 中，脚本仍具有运行完成的能力，允许在调用回调之前初始化所有的变量、函数等。它还具有不让事件循环继续的优点，适用于让事件循环继续之前，警告用户发生错误的情况。下面是上一个使用 `process.nextTick()` 的示例:

```js
let bar;

function someAsyncApiCall(callback) {
	process.nextTick(callback);
}

someAsyncApiCall(() => {
	console.log('bar', bar); // 1
});

bar = 1;
```

这又是另外一个真实的例子:

```js
const server = net.createServer(() => {}).listen(8080);

server.on('listening', () => {});
```

这种设计原理可能会导致一些潜在的问题。 以此代码段为例:

为了绕过这个问题，`'listening'` 事件被排在 `nextTick()` 中，以允许脚本运行完成。这让用户设置所想设置的任何事件处理器。

### `process.nextTick()` 对比 `setImmediate()`

就用户而言，我们有两个类似的调用，但它们的名称令人费解。

-   `process.nextTick()` 在同一个阶段立即执行。
-   `setImmediate()` 在事件循环的接下来的迭代或 'tick' 上触发。

实质上，这两个名称应该交换，因为 `process.nextTick()` 比 `setImmediate()` 触发得更快，但这是过去遗留问题，因此不太可能改变。如果贸然进行名称交换，将破坏 npm 上的大部分软件包。每天都有更多新的模块在增加，这意味着我们要多等待每一天，则更多潜在破坏会发生。尽管这些名称使人感到困惑，但它们本身名字不会改变。

我们建议开发人员在所有情况下都使用 `setImmediate()`，因为它更容易理解。

### 为什么要使用 `process.nextTick()`？

只有传递端口时，端口才会立即被绑定。因此，可以立即调用 `'listening'` 回调。问题是 `.on('listening')` 的回调在那个时间点尚未被设置。

1. 允许用户处理错误，清理任何不需要的资源，或者在事件循环继续之前重试请求。
2. 有时有让回调在栈展开后，但在事件循环继续之前运行的必要。

为了绕过这个问题，`'listening'` 事件被排在 `nextTick()` 中，以允许脚本运行完成。这让用户设置所想设置的任何事件处理器。

```js
const server = net.createServer();
server.on('connection', (conn) => {});

server.listen(8080);
server.on('listening', () => {});
```

假设 `listen()` 在事件循环开始时运行，但监听的回调被放置在 `setImmediate()` 中。除非传递过主机名，才会立即绑定到端口。为使事件循环继续进行，它必须命中 **轮询** 阶段，这意味着有可能已经接收了一个连接，并在侦听事件之前触发了连接事件。

另一个例子是扩展 `EventEmitter`， 并在构造器内释放一个事件:

```js
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {
	constructor() {
		super();
		this.emit('event');
	}
}

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
	console.log('an event occurred!');
});
```

你不能立即从构造函数中触发事件，因为脚本尚未处理到用户为该事件分配回调函数的地方。因此，在构造函数本身中可以使用 `process.nextTick()` 来设置回调，以便在构造函数完成后发出该事件，这是预期的结果:

```js
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {
	constructor() {
		super();

		// use nextTick to emit the event once a handler is assigned
		process.nextTick(() => {
			this.emit('event');
		});
	}
}

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
	console.log('an event occurred!');
});
```

## 异常

> 重点是**异常的分类**
>
> 剩余两部分的知识，绝大部分情况下都用不到，除非你要写一些 _高端_ 的代码

![image-20211222175234095](./img/yuanjin/20211222175234.png)

**异常并非坏事，它可以让开发人员及时发现错误、定位错误，甚至在某些时候，我们还需要故意的抛出异常**

### 异常的分类

在 JS 中，异常表现为一个对象，不同的对象表达了不同的异常类型，不同类型的异常对应到不同的错误

| 异常类型           | 含义                                         |
| ------------------ | -------------------------------------------- |
| **SyntaxError**    | 语法错误                                     |
| **ReferenceError** | 引用错误，往往是使用了未定义的变量或函数     |
| **TypeError**      | 类型错误，往往是使用了一个对象中不存在的成员 |

**每个异常都是一个对象，通过对应的构造函数创建**

> 所有的异常构造器都继承自 Error，更多信息参见[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Error)

当代码运行过程中出现错误时，JS 会:

1. 自动创建对应的异常对象，抛出错误
2. 程序终止运行
3. 控制台中会显示异常对象

每个异常对象都至少记录了**两个关键信息**:

2. 调用堆栈信息: 描述异常出现的位置

### 捕获异常

捕获异常就是处理错误，当错误发生后，我们对错误进行相应的处理，让程序不至于终止

```js
try {
	// 代码1
} catch (err) {
	// 代码2: 当代码1出现异常后，会执行这里的代码，异常对象会传递给err
} finally {
	// 代码3: 可省略。无论是否有异常，都会执行
}

// 无异常的执行顺序: 代码1 --> 代码3
// 有异常的执行顺序: 代码1 --> 出现异常，中断代码1的执行 --> 代码2 --> 代码3
```

**在绝大部分时候，我们都无须捕获异常，除非满足以下要求: **

1. 我们能够预知某段代码会出现异常
2. 我们知道出现异常后要做什么

上面的条件任意一个不满足，都不应该处理异常

**永远不能为了不报错而捕获异常！**

下面是一段可能使用异常捕获的伪代码

```js
try {
	var heros = network.getHeros(); // 从网络获取王者荣耀英雄数据，得到英雄数组
	createHTML(heros); // 将数组生成HTML
} catch (err) {
	// 出现网络故障，给用户显示一个提示框
	showErrorDialog('网络故障，请检查您的网络是否连接正常。故障原因: ' + err.message);
}
```

### 手动抛出异常

不仅浏览器会自动给我们抛出异常，我们还可以手动的抛出异常

```js
throw 异常对象; // 当代码运行到这里，会终止执行，抛出异常对象，效果和浏览器抛出的错误完全一样
```

当编写函数时，如果满足下面三个条件，就可以选择抛出异常:

1. 预知执行过程中可能会出现某种错误
2. 浏览器不会抛出这个错误
3. 该函数无法处理这个错误

下面展现了一个需要抛出异常的例子

```js
/**
 * 得到两个数字之和
 * 若传递的不是数字，则会抛出TypeError
 * @param {number} a 数字1
 * @param {number} b 数字2
 * @return {number} 两数之和
 */
function sum(a, b) {
	if (typeof a !== 'number' || typeof b !== 'number') {
		throw new TypeError('必须传入两个数字才能求和');
	}
	return a + b;
}
```

**规范: 如果某个函数需要抛出异常，一定要在函数的文档注释中阐述清楚**

### 练习

说出下面的错误描述的含义，以及该错误发生的原因

![image-20211223103308973](./img/yuanjin/20211223103309.png)

![image-20211223103332002](./img/yuanjin/20211223103332.png)

<img src="./img/yuanjin/20211223103347.png" alt="image-20211223103347139" style="zoom:50%;" />

<img src="./img/yuanjin/20211223103450.png" alt="image-20211223103450241" style="zoom:50%;" />

---

<!-- # 难点 -->

---

## Promise

邓哥心中有很多女神，他今天下定决心，要向这些女神表白，他认为，只要女神够多，根据概率学原理，总有一个会接收他

稳妥起见，邓哥决定使用**串行**的方式进行表白: 先给第 1 位女神发送短信，然后等待女神的回应，如果成功了，就结束，如果失败了，则再给第 2 位女神发送短信，依次类推

<img src="./img/promise-女神.png" alt="promise-女神" style="zoom:50%;" />

邓哥的女神一共有 4 位，名字分别是: 李建国、王富贵、周聚财、刘人勇

```js
// 向某位女生发送一则表白短信
// name: 女神的姓名
// onFulffiled: 成功后的回调
// onRejected: 失败后的回调
function sendMessage(name, onFulffiled, onRejected) {
	// 模拟 发送表白短信
	console.log(`邓哥 -> ${name}:  最近有谣言说我喜欢你，我要澄清一下，那不是谣言😘`);
	console.log(`等待${name}回复......`);
	// 模拟 女神回复需要一段时间
	setTimeout(() => {
		// 模拟 有10%的几率成功
		if (Math.random() <= 0.1) {
			// 成功，调用 onFuffiled，并传递女神的回复
			onFulffiled(`${name} -> 邓哥:  我是九，你是三，除了你还是你😘`);
		} else {
			// 失败，调用 onRejected，并传递女神的回复
			onRejected(`${name} -> 邓哥:  你是个好人😜`);
		}
	}, 1000);
}
```

有了这个函数后，邓哥于是开始编写程序发送短信了

```js
// 首先向 李建国 发送消息
sendMessage(
	'李建国',
	(reply) => {
		// 如果成功了，输出回复的消息后，结束
		console.log(reply);
	},
	// 李建国失败 像后续女神发消息
	(reply) => {
		// 如果失败了，输出回复的消息后，向 王富贵 发送消息
		console.log(reply);
		sendMessage(
			'王富贵',
			(reply) => {
				// 如果成功了，输出回复的消息后，结束
				console.log(reply);
			},
			(reply) => {
				// 如果失败了，输出回复的消息后，向 周聚财 发送消息
				console.log(reply);
				sendMessage(
					'周聚财',
					(reply) => {
						// 如果成功了，输出回复的消息后，结束
						console.log(reply);
					},
					(reply) => {
						// 如果失败了，输出回复的消息后，向 刘人勇 发送消息
						console.log(reply);
						sendMessage(
							'刘人勇',
							(reply) => {
								// 如果成功了，输出回复的消息后，结束
								console.log(reply);
							},
							(reply) => {
								// 如果失败了，就彻底没戏了
								console.log(reply);
								console.log('邓哥命犯天煞孤星，注定孤独终老！！');
							},
						);
					},
				);
			},
		);
	},
);
```

这一层一层的回调嵌套，形成了传说中的「**回调地狱 callback hell**」

### Promise 规范

Promise 是一套专门处理异步场景的规范，它能有效的避免回调地狱的产生，使异步代码更加清晰、简洁、统一

这套规范最早诞生于前端社区，规范名称为 [Promise A+](https://promisesaplus.com/)

该规范出现后，立即得到了很多开发者的响应

Promise A+ 规定:

1. 所有的异步场景，都可以看作是一个异步任务，每个异步任务，在 JS 中应该表现为一个**对象**，该对象称之为**Promise 对象**，也叫做任务对象

 <img src="./img/promise-promise1.png" style="zoom:50%;" />

2. 每个任务对象，都应该有**==两个阶段==**、**==三个状态==**

    根据常理，它们之间存在以下逻辑:

    - 任务总是从 ==未决阶段== 变到 ==已决阶段==，无法逆行
    - 任务总是从挂起状态变到完成或失败状态，无法逆行
    - 时间不能倒流，历史不可改写，任务一旦完成或失败，状态就固定下来，永远无法改变

 <img src="./img/promise-promise对象1.png" style="zoom: 50%;" />

3. `挂起->完成`，称之为`resolve`；`挂起->失败`称之为`reject`。任务完成时，可能有一个 **相关数据**；任务失败时，可能有一个 **失败原因**。

 <img src="./img/promise-promise对象2.png" style="zoom: 50%;" />

4. 可以针对任务进行后续处理，针对完成状态的后续处理称之为 onFulfilled，针对失败的后续处理称之为 onRejected

 <img src="./img/promise-promise对象3.png" style="zoom: 50%;" />

### Promise API

[==ES6 提供了一套 API，实现了 Promise A+规范==](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)

基本使用如下:

```js
// 创建一个任务对象，该任务立即进入 pending 状态
const pro = new Promise((resolve, reject) => {
	// 任务的具体执行流程，该函数会立即被执行
	// 调用 resolve(data)，可将任务变为 fulfilled 状态， data 为需要传递的相关数据
	// 调用 reject(reason)，可将任务变为 rejected 状态，reason 为需要传递的失败原因
});
pro.then(
	(data) => {
		// onFulfilled 函数，当任务完成后，会自动运行该函数，data为任务完成的相关数据
	},
	(reason) => {
		// onRejected 函数，当任务失败后，会自动运行该函数，reason为任务失败的相关原因
	},
);
```

#### Promise.prototype.then()

> **`then()`** 方法返回一个 [`Promise` (en-US)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)。它最多需要有两个参数: Promise 的成功和失败情况的回调函数

-   语法

```js
then(onFulfilled);
then(onFulfilled, onRejected);
```

-   事例:

```js
const pro = new Promise((resolve, reject) => {
	console.log('开始百米短跑');
	const duration = Math.floor(Math.random() * 5000);
	setTimeout(() => {
		if (Math.random() < 0.5) {
			// 成功
			resolve(duration); // 将任务从挂起->完成
		} else {
			// 失败，脚扭伤了
			reject('脚扭伤了！');
		}
	}, duration);
});
//  后续处理
pro.then(
	(data) => {
		console.log('on yeah! 我跑了', data, '秒');
	},
	(reason) => {
		console.log('不好意思，', reason);
	},
);
```

-   **返回值**

> 当一个 [`Promise`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise) 完成（fulfilled）或者失败（rejected）时，返回函数将被异步调用（由当前的线程循环来调度完成）。具体的返回值依据以下规则返回。

如果 `then` 中的**回调函数**:

-   返回了一个值，那么 `then` 返回的 Promise 将会成为 **接受状态(已决)** ，并且将返回的值作为 **接受状态(已决)** 的回调函数的参数值。

-   没有返回任何值，那么 `then` 返回的 Promise 将会成为 **接受状态(已决)** ，并且该 **接受状态(已决)** 的回调函数的参数值为 `undefined`。

-   抛出一个错误，那么 `then` 返回的 Promise 将会成为 **拒绝状态(未决)** ，并且将抛出的错误作为 **拒绝状态(未决)** 的回调函数的参数值。

-   返回一个已经是 **接受状态(已决)** 的 Promise，那么 `then` 返回的 Promise 也会成为 **接受状态(已决)** ，并且将那个 Promise 的 **接受状态(已决)** 的回调函数的参数值作为该被返回的 Promise 的接受状态回调函数的参数值。

-   返回一个已经是 **拒绝状态(未决)** 的 Promise，那么 `then` 返回的 Promise 也会成为 **拒绝状态(未决)** ，并且将那个 Promise 的 **拒绝状态(未决)** 的回调函数的参数值作为该被返回的 Promise 的拒绝状态回调函数的参数值。

-   返回一个未定状态（`pending`）的 Promise，那么 `then` 返回 Promise 的状态也是未定的，并且它的终态与那个 Promise 的终态相同；同时，它变为终态时调用的回调函数参数与那个 Promise 变为终态时的回调函数的参数是相同的。

#### Promise.prototype.finally()

> **`finally()`** 方法返回一个 [`Promise`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)。在 promise 结束时，无论结果是 fulfilled 或者是 rejected，都会执行指定的回调函数。**==这为在 Promise 是否成功完成后都需要执行的代码提供了一种方式==**。这避免了同样的语句需要在 [`then()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/then) 和 [`catch()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch) 中各写一次的情况。

```js
p.finally(onFinally);
```

如果你想在 promise 执行完毕后无论其结果怎样都做一些处理或清理时，`finally()` 方法可能是有用的。

**`finally()` 虽然与 `then(onFulfilled, onRejected)` 类似**，它们不同的是:

-   调用内联函数时，不需要多次声明该函数或为该函数创建一个变量保存它。

-   由于无法知道 `promise` 的最终状态，所以 `finally` 的回调函数中**不接收任何参数**，它仅用于无论最终结果如何都要执行的情况。

-   与`Promise.resolve(2).then(() => {}, () => {})`（resolved 的结果为`undefined`）不同，`Promise.resolve(2).finally(() => {})` resolved 的结果为 `2`。

-   同样，`Promise.reject(3).then(() => {}, () => {})` (fulfilled 的结果为`undefined`), `Promise.reject(3).finally(() => {})` rejected 的结果为 `3`。

**备注: ** 在 `finally` 回调中 `throw`（或返回被拒绝的 promise）将以 `throw()` 指定的原因拒绝新的 promise.

```js
let isLoading = true;
fetch(myRequest)
	.then(function (response) {
		var contentType = response.headers.get('content-type');
		if (contentType && contentType.includes('application/json')) {
			return response.json();
		}
		throw new TypeError("Oops, we haven't got JSON!");
	})
	.then(function (json) {
		/* process your JSON further */
	})
	.catch(function (error) {
		console.log(error);
	})
	.finally(function () {
		isLoading = false;
	});
```

##### 邓哥的解决方案

学习了 ES6 的 Promise 后，邓哥决定对`sendMessage`函数进行改造，改造结果如下:

```js
// 向某位女生发送一则表白短信
// name: 女神的姓名
// 该函数返回一个任务对象
function sendMessage(name) {
	return new Promise((resolve, reject) => {
		// 模拟 发送表白短信
		console.log(`邓哥 -> ${name}:  最近有谣言说我喜欢你，我要澄清一下，那不是谣言😘`);
		console.log(`等待${name}回复......`);
		// 模拟 女神回复需要一段时间
		setTimeout(() => {
			// 模拟 有10%的几率成功
			if (Math.random() <= 0.1) {
				// 成功，调用 resolve，并传递女神的回复
				resolve(`${name} -> 邓哥:  我是九，你是三，除了你还是你😘`);
			} else {
				// 失败，调用 reject，并传递女神的回复
				reject(`${name} -> 邓哥:  你是个好人😜`);
			}
		}, 1000);
	});
}
```

之后，就可以使用该函数来发送消息了

```js
sendMessage('李建国').then(
	(reply) => {
		// 女神答应了，输出女神的回复
		console.log(reply);
	},
	(reason) => {
		// 女神拒绝了，输出女神的回复
		console.log(reason);
	},
);
```

> 至此，回调地狱的问题仍然没能解决

<img src="./img/promise-promise对象3.png" alt="promise-promise对象3" style="zoom: 50%;" />

#### catch 方法

==p.catch(onRejected)== 等同用于 ==p.then(null, onRejected)==

### 链式调用

<img src="./img/promise-promise链式调用.png" alt="promise-promise链式调用" style="zoom: 50%;" />

1. then 方法必定会返回一个新的 **Promise**

    > 可理解为 `后续处理也是一个任务`

2. **新任务的状态取决于 后续处理(==成功-onFulfilled、失败-onRejected==)**:

    - 若没有相关的 后续处理 ，新任务的状态和前任务一致，数据为前任务的数据

    - 若有 后续处理 但还未执行，新任务挂起。

    - 若 后续处理 执行了，则根据后续处理的情况确定新任务的状态

        - 后续处理 执行无错，新任务的状态为完成，数据为 后续处理 的返回值

        - 后续处理 执行有错，新任务的状态为失败，数据为异常对象

        - 后续执行 后返回的是一个任务对象，新任务的状态和数据与该任务对象一致

由于链式任务的存在，异步代码拥有了更强的表达力

```js
// 常见任务处理代码
/* 任务成功后，执行处理1，失败则执行处理2
 */
pro.then(处理1).catch(处理2);
/*
 * 任务成功后，依次执行处理1、处理2
 */
pro.then(处理1).then(处理2);
/* 任务成功后，依次执行处理1、处理2，若任务失败或前面的处理有错，执行处理3
 */
pro.then(处理1).then(处理2).catch(处理3);
```

#### 邓哥的解决方案

```js
// 向某位女生发送一则表白短信
// name: 女神的姓名
// onFulffiled: 成功后的回调
// onRejected: 失败后的回调
function sendMessage(name) {
	return new Promise((resolve, reject) => {
		// 模拟 发送表白短信
		console.log(`邓哥 -> ${name}:  最近有谣言说我喜欢你，我要澄清一下，那不是谣言😘`);
		console.log(`等待${name}回复......`);
		// 模拟 女神回复需要一段时间
		setTimeout(() => {
			// 模拟 有10%的几率成功
			if (Math.random() <= 0.1) {
				// 成功，调用 onFuffiled，并传递女神的回复
				resolve(`${name} -> 邓哥:  我是九，你是三，除了你还是你😘`);
			} else {
				// 失败，调用 onRejected，并传递女神的回复
				reject(`${name} -> 邓哥:  你是个好人😜`);
			}
		}, 1000);
	});
}
sendMessage('李建国')
	.catch((reply) => {
		// 失败，继续
		console.log(reply);
		return sendMessage('王富贵');
	})
	.catch((reply) => {
		// 失败，继续
		console.log(reply);
		return sendMessage('周聚财');
	})
	.catch((reply) => {
		// 失败，继续
		console.log(reply);
		return sendMessage('刘人勇');
	})
	.then(
		(reply) => {
			// 成功，结束
			console.log(reply);
			console.log('邓哥终于找到了自己的伴侣');
		},
		(reply) => {
			// 最后一个也失败了
			console.log(reply);
			console.log('邓哥命犯天煞孤星，无伴终老，孤独一生');
		},
	);
```

#### 邓哥的新问题

邓嫂出门时，给邓哥交待了几个任务:

1. 做饭

    可交给电饭煲完成

2. 洗衣服

    可交给洗衣机完成

3. 打扫卫生

    可交给扫地机器人完成

邓哥需要在所有任务结束后给邓嫂汇报工作，哪些成功了，哪些失败了

为了最大程度的节约时间，邓哥希望这些任务同时进行，最终汇总结果统一处理

<img src="./img/promise-家务.png" alt="image-20210621142519937" style="zoom:50%;" />

每个任务可以看做是一个返回 Promise 的函数

```js
// 做饭
function cook() {
	return new Promise((resolve, reject) => {
		console.log('邓哥打开了电饭煲');
		setTimeout(() => {
			if (Math.random() < 0.5) {
				resolve('饭已ok');
			} else {
				reject('做饭却忘了加水，米饭变成了爆米花');
			}
		}, 2000);
	});
}
// 洗衣服
function wash() {
	return new Promise((resolve, reject) => {
		console.log('邓哥打开了洗衣机');
		setTimeout(() => {
			if (Math.random() < 0.5) {
				resolve('衣服已经洗好');
			} else {
				reject('洗衣服时停水了，洗了个寂寞');
			}
		}, 2500);
	});
}
// 打扫卫生
function sweep() {
	return new Promise((resolve, reject) => {
		console.log('邓哥打开了扫地机器人');
		setTimeout(() => {
			if (Math.random() < 0.5) {
				resolve('地板扫的非常干净');
			} else {
				reject('扫地机器人被哈士奇一爪掀翻了');
			}
		}, 3000);
	});
}
```

如何利用这三个函数实现邓哥的要求呢？

### Promise 的静态方法

| 方法名                       | 含义                                                                              |
| ---------------------------- | --------------------------------------------------------------------------------- |
| Promise.resolve(data)        | 直接返回一个完成状态的任务                                                        |
| Promise.reject(reason)       | 直接返回一个拒绝状态的任务                                                        |
| Promise.all(任务数组)        | 返回一个任务<br />任务数组全部成功则成功<br />任何一个失败则失败                  |
| Promise.any(任务数组)        | 返回一个任务<br />任务数组**==任一成功==**则成功<br />任务全部失败则失败          |
| Promise.allSettled(任务数组) | 返回一个任务<br />任务数组全部 ==已决== 则成功<br />**该任务不会失败**            |
| Promise.race(任务数组)       | 返回一个任务<br />任务数组**==任一已决 (不关心成功、失败)==**则已决，状态和其一致 |
|                              |                                                                                   |

#### 邓哥的解决方案

```js
Promise.allSettled([cook(), wash(), sweep()]).then((result) => {
	// 处理汇总结果
	const report = result.map((r) => (r.status === 'fulfilled' ? r.value : r.reason)).join(';');
	console.log(report);
});
```

![promise-promise对象3](./img/promise-promise对象3.png)

### 消除回调

有了 Promise，异步任务就有了一种统一的处理方式

有了统一的处理方式，ES 官方就可以对其进一步优化

ES7 推出了两个关键字`async`和`await`，用于更加优雅的表达 Promise

#### async

> async 函数是使用`async`关键字声明的函数。async 函数是 [`AsyncFunction`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/AsyncFunction) 构造函数的实例，并且其中允许使用 `await` 关键字。`async` 和 `await` 关键字让我们可以用一种更简洁的方式写出基于 [`Promise`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise) 的异步行为，而无需刻意地链式调用 `promise`。

async 关键字用于修饰函数，被它修饰的函数，一定返回 Promise

```js
async function method1() {
	return 1; // 该函数的返回值是Promise完成后的数据
}
method1(); // Promise { 1 }
async function method2() {
	return Promise.resolve(1); // 若返回的是Promise，则method得到的Promise状态和其一致
}
method2(); // Promise { 1 }
async function method3() {
	throw new Error(1); // 若执行过程报错，则任务是rejected
}
method3(); // Promise { <rejected> Error(1) }
```

#### await

> `await` 操作符用于等待一个 [`Promise`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise) 兑现并获取它兑现之后的值。它只能在[异步函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function)或者[模块](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules)顶层中使用。

await 关键字表示等待某个 Promise 完成，**它必须用于`async`函数中**

> 简单的理解为 await 后面的语句是 Promise.then 中的回调

```js
async function method() {
	const n = await Promise.resolve(1);
	console.log(n); // 1
}
// 上面的函数等同于
function method() {
	return new Promise((resolve, reject) => {
		Promise.resolve(1).then((n) => {
			console.log(n);
			resolve(1);
		});
	});
}
```

`await`也可以等待其他数据

```js
async function method() {
	const n = await 1; // 等同于 await Promise.resolve(1)
}
```

如果需要针对失败的任务进行处理，可以使用`try-catch`语法

```js
async function method() {
	try {
		const n = await Promise.reject(123); // 这句代码将抛出异常
		console.log('成功', n);
	} catch (err) {
		console.log('失败', err);
	}
}
method(); // 输出:   失败 123
```

#### 邓哥表白的完美解决方案

```js
// 女神的名字数组
const beautyGirls = ['梁平', '邱杰', '王超', '冯秀兰', '赖军', '顾强', '戴敏', '吕涛', '冯静', '蔡明', '廖磊', '冯洋', '韩杰', '江涛', '文艳', '杜秀英', '丁艳', '邓静', '江刚', '乔刚', '史平', '康娜', '袁磊', '龙秀英', '姚静', '潘娜', '萧磊', '邵勇', '李芳', '谭芳', '夏秀英', '程娜', '武杰', '崔军', '廖勇', '崔强', '康秀英', '余磊', '邵勇', '贺涛'];
// 向某位女生发送一则表白短信
// name: 女神的姓名
function sendMessage(name) {
	return new Promise((resolve, reject) => {
		// 模拟 发送表白短信
		console.log(`邓哥 -> ${name}:  最近有谣言说我喜欢你，我要澄清一下，那不是谣言😘`);
		console.log(`等待${name}回复......`);
		// 模拟 女神回复需要一段时间
		setTimeout(() => {
			// 模拟 有10%的几率成功
			if (Math.random() <= 0.1) {
				// 成功，调用 onFuffiled，并传递女神的回复
				resolve(`${name} -> 邓哥:  我是九，你是三，除了你还是你😘`);
			} else {
				// 失败，调用 onRejected，并传递女神的回复
				reject(`${name} -> 邓哥:  你是个好人😜`);
			}
		}, 1000);
	});
}
// 批量表白的程序
async function proposal() {
	let isSuccess = false;
	for (const girl of beautyGirls) {
		try {
			const reply = await sendMessage(girl);
			console.log(reply);
			console.log('表白成功!');
			isSuccess = true;
			break;
		} catch (reply) {
			console.log(reply);
			console.log('表白失败');
		}
	}
	if (!isSuccess) {
		console.log('邓哥注定孤独一生');
	}
}
proposal();
```

### 面试题

[地址](./../practise/js/promise面试题.js)

1. 下面代码的输出结果是什么

    ```js
    const promise = new Promise((resolve, reject) => {
    	console.log(1);
    	resolve();
    	console.log(2);
    });

    promise.then(() => {
    	console.log(3);
    });

    console.log(4);
    ```

2. 下面代码的输出结果是什么

    ```js
    const promise = new Promise((resolve, reject) => {
    	console.log(1);
    	setTimeout(() => {
    		console.log(2);
    		resolve();
    		console.log(3);
    	});
    });

    promise.then(() => {
    	console.log(4);
    });

    console.log(5);
    ```

3. 下面代码的输出结果是什么

    ```js
    const promise1 = new Promise((resolve, reject) => {
    	setTimeout(() => {
    		resolve();
    	}, 1000);
    });
    const promise2 = promise1.catch(() => {
    	return 2;
    });

    console.log('promise1', promise1);
    console.log('promise2', promise2);

    setTimeout(() => {
    	console.log('promise1', promise1);
    	console.log('promise2', promise2);
    }, 2000);
    ```

4. 下面代码的输出结果是什么

    ```js
    async function m() {
    	const n = await 1;
    	console.log(n);
    }

    m();
    console.log(2);
    ```

5. 下面代码的输出结果是什么

    ```js
    async function m() {
    	const n = await 1;
    	console.log(n);
    }

    (async () => {
    	await m();
    	console.log(2);
    })();

    console.log(3);
    ```

6. 下面代码的输出结果是什么

    ```js
    async function m1() {
    	return 1;
    }

    async function m2() {
    	const n = await m1();
    	console.log(n);
    	return 2;
    }

    async function m3() {
    	const n = m2();
    	console.log(n);
    	return 3;
    }

    m3().then((n) => {
    	console.log(n);
    });

    m3();

    console.log(4);
    ```

7. 下面代码的输出结果是什么

    ```js
    Promise.resolve(1).then(2).then(Promise.resolve(3)).then(console.log);
    ```

8. 下面代码的输出结果是什么

    ```js
    var a;
    var b = new Promise((resolve, reject) => {
    	console.log('promise1');
    	setTimeout(() => {
    		resolve();
    	}, 1000);
    })
    	.then(() => {
    		console.log('promise2');
    	})
    	.then(() => {
    		console.log('promise3');
    	})
    	.then(() => {
    		console.log('promise4');
    	});

    a = new Promise(async (resolve, reject) => {
    	console.log(a);
    	await b;
    	console.log(a);
    	console.log('after1');
    	await a;
    	resolve(true);
    	console.log('after2');
    });

    console.log('end');
    ```

9. 下面代码的输出结果是什么

    ```js
    async function async1() {
    	console.log('async1 start');
    	await async2();
    	console.log('async1 end');
    }
    async function async2() {
    	console.log('async2');
    }
    
    console.log('script start');
    
    setTimeout(function () {
    	console.log('setTimeout');
    }, 0);
    
    async1();
    
    new Promise(function (resolve) {
    	console.log('promise1');
    	resolve();
    }).then(function () {
    	console.log('promise2');
    });
    console.log('script end');
    ```

-   根据目前所学，进入事件队列的函数有以下几种:

    -   setTimeout 的回调，宏任务（macro task）
    -   setInterval 的回调，宏任务（macro task）
    -   Promise 的 then 函数回调，微任务（micro task）
    -   requestAnimationFrame 的回调，宏任务（macro task）
    -   事件处理函数，宏任务(macro task)

### 手写 Promise

```js
// 创建一个微任务
const microTask = (cb) => {
	// 判断环境
	if (process && process.nextTick) {
		process.nextTick(cb);
	} else if (MutationObserver) {
		const p = document.createElement('p');
		const observer = new MutationObserver(cb); // 监听dom dom变化触发cb
		observer.observe(p, {
			childList: true, // 观察该元素内部的变化
		});
		p.innerHTML = '1';
	} else {
		setTimeout(cb, 0);
	}
};
// 判断是否符合 Promise A+ 规范
const isPromise = (obj) => {
	return !!(obj && typeof obj === 'object' && obj.then && typeof obj.then === 'function');
};
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
	constructor(exe) {
		// 初始化
		this._status = PENDING;
		this._value = undefined;
		this._reason = undefined; // ！！！
		this._handlers = [];
		try {
			/**
			 * exe 是 resolve、reject回调
			 * 绑定this (class中是严格模式 全局对象为undefined)
			 */
			exe(this._resolve.bind(this), this._reject.bind(this));
		} catch (err) {
			this._reject(err);
			console.error(err);
		}
	}
	_changeState(status, value) {
		if (this._status !== PENDING) {
			return;
		}
		this._status = status;
		this._value = value;
		this._runHandlers(); // 状态变化 执行队列
	}
	_resolve(value) {
		this._changeState(FULFILLED, value);
	}
	_reject(reason) {
		this._changeState(REJECTED, reason);
	}

	/**
	 * 向队列中添加
	 * @param {fn} exe 添加的函数
	 * @param {string} status
	 * @param {fn} resolve 让then返回的promise成功
	 * @param {fn} reject 让then返回的promise失败
	 */
	_pushHandler(exe, status, resolve, reject) {
		this._handlers.push({ exe, status, resolve, reject });
	}
	/**
	 *根据实际情况 循环执行队列
	 */
	_runHandlers() {
		// 挂起则不能执行
		if (this._status === PENDING) {
			return;
		}
		// 循环 每次取出第一个 ！！！
		while (this._handlers[0]) {
			this._runOneHandler(this._handlers[0]);
			this._handlers.shift(); // 处理完需要清除 ！！！
		}
	}
	_runOneHandler({ exe, status, resolve, reject }) {
		// then 中的方法需要放入微队列
		microTask(() => {
			// 状态不一致 then中的函数分别对应 onFulfilled onRejected
			if (status !== this._status) {
				return;
			}
			// then中传入的不是函数  promise穿透
			if (typeof exe !== 'function') {
				// 与当前保持一致 ！！！
				this._status === FULFILLED ? resolve(this._value) : reject(this._value);
				return;
			}
			try {
				const result = exe(this._value);
				// then 中是否返回 新的 promise
				if (isPromise(result)) {
					result.then(resolve, reject);
				} else {
					resolve(result);
				}
			} catch (err) {
				reject(err);
				console.error(err);
			}
		});
	}
	// then 中的方法需要放入队列 在对应的时间触发执行
	then(onFulfilled, onRejected) {
		// 成功则将 onFulfilled 放入 microTask 失败则将onRejected放入
		return new MyPromise((resolve, reject) => {
			this._pushHandler(onFulfilled, FULFILLED, resolve, reject);
			this._pushHandler(onRejected, REJECTED, resolve, reject);
			this._runHandlers(); // 调用then时执行队列
		});
	}
	// 以上是完整的promise A+ 规范的promise

	// catch
	catch(onRejected) {
		return this.then(null, onRejected);
	}
	// finally 无论成功与否都会执行
	finally(onSettled) {
		return this.then(
			(value) => {
				onSettled(); // finally 的回调函数接收不到promise的返回的参数
				return value;
			},
			(err) => {
				onSettled();
				throw err;
			},
		);
	}
	/**
	 * 返回一个已完成的 promise,特殊情况
	 * 1，传递的 value 本身就是 ES6 的 promise
	 * 2，传递的 value 是 PromiseLike(promise A+) 返回新的 promise  状态和其保持一致
	 * @param {any} value
	 */
	static resolve(value) {
		if (value instanceof MyPromise) {
			return value;
		}
		return new MyPromise((resolve, reject) => {
			if (isPromise(value)) {
				value.then(resolve, reject); // 同步
			} else {
				resolve(value);
			}
		});
	}
	// 得到一个被拒绝的 promise
	static reject(err) {
		return new MyPromise((resolve, reject) => {
			reject(err);
		});
	}
	/**
	 *
	 * @param {iterator} promises
	 */
	static all(promises) {
		return new MyPromise((resolve, reject) => {
			try {
				let count = 0; // promise 总数
				let result = [];
				let fulfilledCount = 0;
				for (const p of promises) {
					let i = count; // 记录当前完成的 promise 下标
					count++;
					// 包一层 必定是promise ！！！
					MyPromise.resolve(p).then((value) => {
						fulfilledCount++;
						result[i] = value;
						if (count === fulfilledCount) {
							// 当前最后一个 promise 完成
							resolve(result);
						}
					}, reject);
				}
				// 特殊情况
				if (count === 0) {
					resolve(result);
				}
			} catch (err) {
				reject(err);
				console.error(err);
			}
		});
	}
	//
	static allSettled(promises) {
		let ps = [];
		for (const p of promises) {
			ps.push(
				MyPromise.resolve(ps).then(
					(value) => ({
						status: FULFILLED, // 暂时不明白这里为什么是 status 和 value 、reason ！！！
						value: value,
					}),
					(err) => ({
						status: FULFILLED,
						reason: err,
					}),
				),
			);
		}
		return MyPromise.all(ps);
	}
	// 返回最先有结果的
	static race(promises) {
		return new MyPromise((resolve, reject) => {
			for (const p of promises) {
				MyPromise.resolve(p).then(resolve, reject);
			}
		});
	}
}

// ////////////////////////////////////////////////////////////////////////////////
// test Promise A+ 规范 可以互操作  MyPromise 与 Promise
const p1 = new MyPromise((resolve, reject) => {
	resolve(1);
});
const p2 = p1
	.then((value) => {
		console.log(value);
		return new Promise((resolve, reject) => {
			resolve(2);
		});
	})
	.then((value) => {
		console.log(value);
		return 3;
	});
setTimeout(() => {
	console.log(p2);
}, 20);

// test P.all
MyPromise.all([1]).then(
	(value) => {
		console.log('成功', value);
	},
	(err) => {
		console.log('失败', err);
	},
);

// 在手写的promiseXXX.js添加以下代码，其中改成自己定义promise.js名字
// MyPromise.defer = MyPromise.deferred = function () {
// 	let dfd = {};
// 	dfd.promise = new MyPromise((resolve, reject) => {
// 		dfd.resolve = resolve;
// 		dfd.reject = reject;
// 	});
// 	return dfd;
// };
// module.exports = MyPromise;
```

## 迭代器和生成器

### 迭代器 iterator

1.  什么是迭代？

    > 从一个数据集合中按照一定的顺序，不断取出数据的过程

2.  迭代和遍历的区别？

    > 迭代强调的是依次取数据，并不保证取多少，也不保证把所有的数据取完
    >
    > 遍历强调的是要把整个数据依次全部取出

3.  迭代器

    > 对迭代过程的封装，在不同的语言中有不同的表现形式，通常为对象

4.  迭代模式

    > 一种设计模式，用于统一迭代过程，并规范了迭代器规格:

-   迭代器应该具有得到下一个数据的能力
-   迭代器应该具有判断是否还有后续数据的能力

> JavaScript 中，**迭代器**是一个**对象**，它定义一个序列，并在终止时可能返回一个返回值。更具体地说，迭代器是通过使用 `next()` 方法实现 [Iterator protocol](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterator_protocol) 的任何一个对象，该方法返回具有两个属性的对象: `value`，这是序列中的 next 值；和 `done` ，如果已经迭代到序列中的最后一个值，则它为 `true` 。 如果 `value` 和 `done` 一起存在，则它是迭代器的返回值。

`next`: 一个无参数的或者可以接受一个参数的**函数**，返回一个应当拥有以下两个属性的对象:

-   `done`（boolean）:

    -   如果迭代器**可以产生序列中的下一个值**，则为 `false`。（这等价于没有指定 `done` 这个属性。）

    -   如果迭代器已将**序列迭代完毕**，则为 `true`。这种情况下，`value` 是可选的，如果它依然存在，即为迭代结束之后的默认返回值。

-   `value`: 迭代器返回的任何 JavaScript 值。done 为 true 时可省略。
-   `next()` 方法必须返回一个对象，该对象应当有两个属性: `done` 和 `value`
-   如果返回了一个非对象值（比如 `false` 或 `undefined`），则会抛出一个 `TypeError` 异常（"**iterator.next() returned a non-object value**"）。

#### 手写迭代器

```js
const arr1 = [1, 2, 3, 4, 5];
const arr2 = [6, 7, 8, 9];
//1 迭代器创建函数  iterator creator
function createIterator(arr) {
	let i = 0; //当前的数组下标
	return {
		next() {
			var result = {
				value: arr[i],
				done: i >= arr.length,
			};
			i++;
			return result;
		},
	};
}
const iter1 = createIterator(arr1);
const iter2 = createIterator(arr2);

//2 {value: 值, done: 是否迭代完成}
function makeRangeIterator(start = 0, end = Infinity, step = 1) {
	let nextIndex = start;
	let iterationCount = 0;

	const rangeIterator = {
		next: function () {
			let result;
			if (nextIndex < end) {
				result = { value: nextIndex, done: false };
				nextIndex += step;
				iterationCount++;
				return result;
			}
			return { value: iterationCount, done: true };
		},
	};
	return rangeIterator;
}

// 3
class Counter {
	constructor(limit) {
		this.limit = limit;
	}

	// 实现了[Symbol.iterator] 方法，Counter满足成为可迭代对象的条件
	[Symbol.iterator]() {
		let count = 1,
			limit = this.limit;
		return {
			// 实现了 next 方法，满足成为迭代器的条件，则该[Symbol.iterator]方法的返回值是一个迭代器
			next() {
				if (count <= limit) {
					// 返回值包含 done 和 value 两个属性
					return { done: false, value: count++ };
				} else {
					return { done: true, value: undefined };
				}
			},
		};
	}
}

let count = new Counter(3);
for (let i of count) {
	console.log(i); // 1 2 3
}
```

#### 可迭代协议

ES6 规定，如果一个对象具有知名符号属性 **==Symbol.iterator==**，并且属性值是一个迭代器创建函数，则该对象是可迭代的（iterable）

> 思考: 如何知晓一个对象是否是可迭代的？
>
> > 实现`@@iterator`方法的对象，可通过常量 `Symbol.iterator`访问该属性
>
> 思考: 如何遍历一个可迭代对象？
>
> > for...of

```js
const arr = [5, 7, 2, 3, 6];
// 具有知名符号属性 Symbol.iterator 并且属性值是一个迭代器创建函数 则arr可迭代
const iterator = arr[Symbol.iterator]();
let result = iterator.next(); // 数组自带的迭代器 调用next 依次输出数组每一项
// 遍历一个可迭代对象
while (!result.done) {
	const item = result.value; //取出数据
	console.log(item);
	//下一次迭代
	result = iterator.next();
}
```

[**==for-of==**](#for...of) 循环用于遍历 **可迭代对象**

```js
// 注意
let obj = {
	a: 1,
	b: 2,
};
for (const v of obj) {
	// TypeError: obj is not iterable
	console.log(v);
}
```

==展开运算符可以作用于可迭代对象，这样，就可以轻松的将可迭代对象转换为数组==。

```js
var obj = {
	a: 1,
	b: 2,
	[Symbol.iterator]() {
		const keys = Object.keys(this);
		let i = 0;
		return {
			next: () => {
				const propName = keys[i];
				const propValue = this[propName];
				const result = {
					value: { propName, propValue },
					done: i >= keys.length,
				};
				i++;
				return result;
			},
		};
	},
};
const arr = [...obj];
console.log(arr);

function test(a, b) {
	console.log(a, b);
}

test(...obj);
```

### 生成器 generator

> 虽然自定义的迭代器是一个有用的工具，但由于需要显式地维护其内部状态，因此需要谨慎地创建。生成器函数提供了一个强大的选择: 它允许你定义一个包含自有迭代算法的函数，同时它可以自动维护自己的状态。==生成器函数使用 [**`function*`**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/function*)语法编写（函数名之前要 加星号 \*）==。最初调用时，生成器函数不执行任何代码，而是返回一种称为 Generator 的迭代器。通过调用生成器的下一个方法消耗值时，Generator 函数将执行，直到遇到 yield 关键字。

可以根据需要多次调用该函数，并且每次都返回一个新的 Generator，但每个 Generator 只能迭代一次

```js
//这是一个生成器函数，该函数一定返回一个生成器
function* method() {}

function* makeRangeIterator(start = 0, end = Infinity, step = 1) {
	for (let i = start; i < end; i += step) {
		yield i;
	}
}
var a = makeRangeIterator(1, 10, 2);
```

生成器是一个通过构造函数 Generator 创建的对象 , 生成器的创建，必须使用生成器函数（Generator Function）

> **生成器既是一个迭代器，同时又是一个可迭代对象**

#### 生成器函数内部是如何执行

-   **生成器函数内部是为了给生成器的每次迭代提供的数据**

    调用一个**生成器函数**:

    -   首先并**不会马上执行它里面的语句**，而是返回一种称为`Generator`的 **迭代器** **（iterator）对象**。

    -   当这个迭代器的 `next() `方法被首次（后续）调用时，其内的语句会执行到第一个（后续）出现`yield`的位置为止，`yield` 后紧跟迭代器要返回的值。

    -   或者如果用的是 `yield*`（多了个星号），则表示将执行权移交给另一个生成器函数（当前生成器暂停执行），继续执行到另一个生成器函数出现`yield`的位置为止。

        -   **==任何数据结构只要有 Iterator 接口，就可以被 yield\*遍历==** 如果 yield\*后面跟着一个数组，由于数组原生支持遍历器，因此就会遍历数组成员

        ```js
        function* test() {
        	console.log('执行第1次');
        	yield 1;
        	console.log('执行第2次');
        	yield 2;
        	console.log('执行第3次');
        	yield 3;
        	console.log('执行第4次');
        	return 11;
        }
        const generator = test();
        console.log(generator.next()); // 第1次 { value: 1, done: false }
        console.log(generator.next()); // 第2次 { value: 2, done: false }
        console.log(generator.next()); // 第3次 { value: 3, done: false }
        console.log(generator.next()); // 第4次 { value: 11, done: true }
        console.log(generator.next()); // { value: undefined, done: true }  ！！！
        ```

-   ==每次调用生成器的 next 方法，将导致生成器函数运行到下一个 **yield **关键字位置 没有则执行完毕==

-   yield 是一个关键字，该关键字只能在生成器函数内部使用，表达 “产生” 一个迭代数据。

```js
//创建一个斐波拉契数列的迭代器
function* createFeiboIterator() {
	let prev1 = 1,
		prev2 = 1, //当前位置的前1位和前2位
		n = 1; //当前是第几位
	while (true) {
		if (n <= 2) {
			yield 1;
		} else {
			const newValue = prev1 + prev2;
			yield newValue;
			prev2 = prev1;
			prev1 = newValue;
		}
		n++;
	}
}
const iterator = createFeiboIterator();
```

#### 有哪些需要注意的细节

-   生成器函数可以有返回值，返回值出现在第一次 done 为 true 时的 value 属性中

-   调用生成器的 next 方法时，可以 **传递参数**，==传递的参数会交给 **yield 表达式的返回值**==

```js
function* test2() {
	console.log('函数开始');
	let info = yield 1;
	console.log(info);
	info = yield 2 + info;
	console.log(info);
}
const generator2 = test2();
console.log(generator2.next()); // 函数开始 { value: 1, done: false }
console.log(generator2.next(5)); // 5  { value: 7, done: false }
console.log(generator2.next()); // undefined { value: undefined, done: true }
```

-   **第一次调用 next 方法时，传参没有任何意义**

-   在生成器函数内部，可以调用其他生成器函数，但是要注意加上 \* 号

```js
function* t3() {
	yield 'a';
	yield 'b';
}
function* test3() {
	yield* t3();
	yield 1;
	yield 2;
}
const generator3 = test3();
console.log(generator3.next()); // { value: 'a', done: false }
console.log(generator3.next()); // { value: 'b', done: false }
console.log(generator3.next()); // { value: 1, done: false }
console.log(generator3.next()); // { value: 2, done: false }
```

#### 生成器的其他 API

-   return 方法: 调用该方法，可以提前结束生成器函数，从而提前让整个迭代过程结束

-   throw 方法: 调用该方法，可以在生成器中产生一个错误

### 小结

-   **什么是可迭代对象**: 实现`@@iterator`方法的对象，可通过常量 `Symbol.iterator`访问该属性
-   **什么是迭代器**: 本质上就是一个对象，且实现了一个拥有特定语义的`next()`方法
-   可以通过自定义`@@iterator`方法和`next()`方法自定义迭代器，并且可通过`return()`方法提前终止迭代器。
-   **什么是生成器**: 一个拥有在函数块内暂停和恢复代码执行能力的结构。通过`next()`恢复代码执行，遇到`yield`关键字暂停执行。
-   生成器执行过程中遇到`throw`和`return`会结束生成器，也可以调用生成器对象的`return()`函数提前结束生成器

### 应用-异步任务控制

```js
function* task() {
	const resp = yield fetch('http://101.132.72.36:5100/api/local');
	const result = yield resp.json();
	console.log(result);
}

run(task);

function run(generatorFunc) {
	const generator = generatorFunc();
	let result = generator.next(); //启动任务（开始迭代）, 得到迭代数据
	handleResult();
	//对result进行处理
	function handleResult() {
		if (result.done) {
			return; //迭代完成，不处理
		}
		//迭代没有完成，分为两种情况
		//1. 迭代的数据是一个Promise
		//2. 迭代的数据是其他数据
		if (typeof result.value.then === 'function') {
			//1. 迭代的数据是一个Promise
			//等待Promise完成后，再进行下一次迭代
			result.value.then(
				(data) => {
					result = generator.next(data);
				},
				(err) => {
					result = generator.throw(err);
				},
			);
		} else {
			//2. 迭代的数据是其他数据，直接进行下一次迭代
			result = generator.next(result.value);
		}
		handleResult();
	}
}
```

## 代理与反射

### 反射 Reflect

> 是一个内置的对象，它提供拦截 JavaScript 操作的方法。这些方法与 [proxy handler (en-US)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy) 的方法相同。`Reflect` 不是一个函数对象，因此它是不可构造的。
>
> ==ES6 延续了 ES5 的思想: 减少魔法，暴露内部实现！==

#### 描述

与大多数全局对象不同 `Reflect` 并非一个构造函数，所以不能通过 [new 运算符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new)对其进行调用，或者将 `Reflect` 对象作为一个函数来调用。`Reflect` 的所有属性和方法都是静态的（就像 [`Math`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math) 对象）。

`Reflect` 对象提供了以下静态方法，这些方法与 [proxy handler 方法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy)的命名相同。

#### Reflect 静态方法

-   [**Reflect.apply(target, thisArgument, argumentsList)**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/apply)

    > 对一个函数进行调用操作，同时可以传入一个数组作为调用参数。和 [**Function.prototype.apply()**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply) 功能类似。

-   [**Reflect.construct(target, argumentsList[, newTarget])**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/construct)

    > 对构造函数进行 [**new**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new) 操作，相当于执行 **new target(...args)**。

    `在新语法 Reflect`出现之前，是通过明确指定构造函数和原型对象（使用[`Object.create()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)）来创建一个对象的。

    虽然两种方式结果相同，但在创建对象过程中仍一点不同。

    -   当使用`Object.create()`和[`Function.prototype.apply()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)时，**如果不使用`new`操作符调用构造函数，构造函数内部的 [new.target](#new.target) 值会指向`undefined`**。

    -   当调用`Reflect.construct()`来创建对象，`new.target`值会自动指定到`target`（或者 newTarget，前提是 newTarget 指定了）。

-   [**Reflect.defineProperty(target, propertyKey, attributes)**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/defineProperty)

    > 和 [**Object.defineProperty()**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) 类似。如果设置成功就会返回 **true**

-   [**Reflect.deleteProperty(target, propertyKey)**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/deleteProperty)

    > 作为函数的[**delete**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/delete)操作符，相当于执行 **delete target[name]**。

-   [**Reflect.get(target, propertyKey[, receiver])**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/get)

    > 获取对象身上某个属性的值，类似于 **target[name]**。

-   [**Reflect.getOwnPropertyDescriptor(target, propertyKey)**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/getOwnPropertyDescriptor)

    > 类似于 [**Object.getOwnPropertyDescriptor()**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor)。如果对象中存在该属性，则返回对应的属性描述符，否则返回 [**undefined**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)。

-   [**Reflect.getPrototypeOf(target)**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/getPrototypeOf)

    > 类似于 [**Object.getPrototypeOf()**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf)。

-   [**Reflect.has(target, propertyKey)**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/has)

    > 判断一个对象是否存在某个属性，和 [**in** 运算符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/in) 的功能完全相同。

-   [**Reflect.isExtensible(target)**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/isExtensible)

    > 类似于 [**Object.isExtensible()**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isExtensible).

-   [**Reflect.ownKeys(target)**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/ownKeys)

    > 返回一个包含所有自身属性（不包含继承属性）的数组。(类似于 [**Object.keys()**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/keys), 但不会受**enumerable** 影响).

-   [**Reflect.preventExtensions(target)**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/preventExtensions)

    类似于 [**Object.preventExtensions()**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions)。返回一个[**Boolean**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Boolean)。

-   [**Reflect.set(target, propertyKey, value[, receiver])**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/set)

    > 将值分配给属性的函数。返回一个[**Boolean**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Boolean)，如果更新成功，则返回**true**。

-   [**Reflect.setPrototypeOf(target, prototype)**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/setPrototypeOf)

    > 设置对象原型的函数。返回一个 [**Boolean**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Boolean)，如果更新成功，则返回 **true**。

### 代理 Proxy

[**Proxy** 对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

> 代理：**提供了修改底层实现的方式**

#### 术语

-   [`handler` (en-US)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy)

    包含捕捉器（trap）的占位符对象，可译为处理器对象。

-   _traps_

    提供属性访问的方法。这类似于操作系统中捕获器的概念。

-   _target_

    被 Proxy 代理虚拟化的对象。它常被作为代理的存储后端。根据目标验证关于对象不可扩展性或不可配置属性的不变量（保持不变的语义）。

#### 语法

```js
const p = new Proxy(target, handler);
```

#### 方法

[Reflect 静态方法](#Reflect 静态方法)

#### 参数

-   `target`

    要使用 `Proxy` 包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）。

-   `handler`

    一个通常以函数作为属性的对象，各属性中的函数分别定义了在执行各种操作时代理 `p` 的行为。

```js
const obj = { a: 1, b: 2 };

const proxy = new Proxy(obj, {
	set(target, propertyKey, value) {
		console.log(target, propertyKey, value); // { a: 1, b: 2 }, a ,10
		// target[propertyKey] = value;
		Reflect.set(target, propertyKey, value);
	},
	get(target, propertyKey) {
		if (Reflect.has(target, propertyKey)) {
			return Reflect.get(target, propertyKey);
		} else {
			return -1;
		}
	},
	has(target, propertyKey) {
		return false;
	},
});
// console.log(proxy);
proxy.a = 10;
// console.log(proxy.a);

console.log(proxy.d); // -1
console.log('a' in proxy); // false
```

#### 应用

##### 观察者模式

> 有一个对象，是观察者，它用于观察另外一个对象的属性值变化，当属性值变化后会收到一个通知，可能会做一些事。

```js
/**
 * 老版观察者模式
 * 初始化只有两个属性 后续动态添加属性不会进入观察
 * 额外产生一个对象 浪费内存空间
 */
function observer(target) {
	const div = document.getElementById('container');
	const ob = {};
	for (const prop of Object.keys(target)) {
		Object.defineProperty(ob, prop, {
			get() {
				return target[prop];
			},
			set(val) {
				target[prop] = val;
				render();
			},
			enumerable: true, // 默认值 false
		});
	}
	render();
	function render() {
		let html = '';
		for (const prop of Object.keys(ob)) {
			html += `<p><span>${prop}：</span><span>${ob[prop]}</span></p>`;
		}
		div.innerHTML = html;
	}
	return ob;
}
const target = { a: 1, b: 2 };
const obj = observer(target);

// 使用代理Proxy 动态增删属性都可以监听到
function observer(target) {
	const div = document.getElementById('container');
	const proxy = new Proxy(target, {
		set(target, prop, value) {
			Reflect.set(target, prop, value);
			render();
		},
		get(target, prop) {
			return Reflect.get(target, prop);
		},
	});
	render();
	function render() {
		let html = '';
		for (const prop of Object.keys(target)) {
			html += `<p><span>${prop}：</span><span>${target[prop]}</span></p>`;
		}
		div.innerHTML = html;
	}
	return proxy;
}
const target = { a: 1, b: 2 };
const obj = observer(target);
```

##### 偷懒的构造函数

```js
function ConstructorProxy(Class, ...propNames) {
	return new Proxy(Class, {
		construct(target, argumentsList) {
			const obj = Reflect.construct(target, argumentsList);
			propNames.forEach((name, i) => {
				obj[name] = argumentsList[i];
			});
			return obj;
		},
	});
}
class User {}
const UserProxy = ConstructorProxy(User, 'firstName', 'lastName', 'age');
const obj = new UserProxy('袁', '进', 18);
console.log(obj); // User { firstName: '袁', lastName: '进', age: 18 }

class Monster {}
const MonsterProxy = ConstructorProxy(Monster, 'attack', 'defence', 'hp', 'rate', 'name');
const m = new MonsterProxy(10, 20, 100, 30, '怪物');
console.log(m); // Monster { attack: 10, defence: 20, hp: 100, rate: 30, name: '怪物' }
```

##### 可验证的函数

```js
function sum(a, b) {
	return a + b;
}

function validatorFunction(func, ...types) {
	const proxy = new Proxy(func, {
		apply(target, thisArgument, argumentsList) {
			types.forEach((t, i) => {
				const arg = argumentsList[i];
				if (typeof arg !== t) {
					throw new TypeError(`第${i + 1}个参数${argumentsList[i]}不满足类型${t}`);
				}
			});
			return Reflect.apply(target, thisArgument, argumentsList);
		},
	});
	return proxy;
}

const sumProxy = validatorFunction(sum, 'number', 'number');
console.log(sumProxy(1, 2));

// 以前的写法 额外产生一个新函数
function validatorFunction(func, ...types) {
	return function (...argumentsList) {
		types.forEach((t, i) => {
			const arg = argumentsList[i];
			if (typeof arg !== t) {
				throw new TypeError(`第${i + 1}个参数${argumentsList[i]}不满足类型${t}`);
			}
		});
		return func(...argumentsList);
	};
	return proxy;
}
```

## es6 Class 中的 super 关键字

> 详见 [super](#super)

## 面试题

### 继承方式,Class-寄生组合

- 原型链继承
- 构造函数继承（借助 call）
- 组合继承
- 原型式继承
- 寄生式继承
- 寄生  

### 原型链继承

原型链继承是比较常见的继承方式之一，其中涉及的构造函数、原型和实例，三者之间存在着一定的关系，即每一个构造函数都有一个原型对象，原型对象又包含一个指向构造函数的指针，而实例则包含一个原型对象的指针

举个例子

```js
 function Parent() {
    this.name = 'parent1';
    this.play = [1, 2, 3]
  }
  function Child() {
    this.name = 'child2';
  }
  Child1.prototype = new Parent();
  console.log(new Child())
```

上面代码看似没问题，实际存在潜在问题

```js
var s1 = new Child2();
var s2 = new Child2();
s1.play.push(4);
console.log(s1.play, s2.play); // [1,2,3,4]
```

改变`s1`的`play`属性，会发现`s2`也跟着发生变化了，这是因为两个实例使用的是同一个原型对象，内存空间是共享的

### 构造函数继承

借助 `call`调用`Parent`函数

```js
function Parent(){
    this.name = 'parent1';
}

Parent.prototype.getName = function () {
    return this.name;
}

function Child(){
    Parent1.call(this);
    this.name = 'child'
}

let child = new Child();
console.log(child);  // 没问题
console.log(child.getName());  // 会报错
```

可以看到，父类原型对象中一旦存在父类之前自己定义的方法，那么子类将无法继承这些方法

相比第一种原型链继承方式，**父类的引用属性不会被共享**，优化了第一种继承方式的弊端，**==但是只能继承父类的实例属性和方法，不能继承原型属性或者方法==**

### 组合继承

前面我们讲到两种继承方式，各有优缺点。组合继承则将前两种方式继承起来

```js
function Parent3 () {
    this.name = 'parent3';
    this.play = [1, 2, 3];
}

Parent3.prototype.getName = function () {
    return this.name;
}
function Child3() {
    // 第二次调用 Parent3()
    Parent3.call(this);
    this.name = 'child3';
}

// 第一次调用 Parent3()
Child3.prototype = new Parent3();
// 手动挂上构造器，指向自己的构造函数
Child3.prototype.constructor = Child3;
var s3 = new Child3();
var s4 = new Child3();
s3.play.push(4);
console.log(s3.play, s4.play);  // 不互相影响
console.log(s3.getName()); // 正常输出'parent3'
console.log(s4.getName()); // 正常输出'parent3'
```

这种方式看起来就没什么问题，方式一和方式二的问题都解决了，但是从上面代码我们也可以看到`Parent3` 执行了两次，**造成了多构造一次的性能开销**

### 原型式继承

这里主要借助**`Object.create`**方法实现普通对象的继承

同样举个例子

```js
let parent4 = {
    name: "parent4",
    friends: ["p1", "p2", "p3"],
    getName: function() {
      return this.name;
    }
  };

  let person4 = Object.create(parent4);
  person4.name = "tom";
  person4.friends.push("jerry");

  let person5 = Object.create(parent4);
  person5.friends.push("lucy");

  console.log(person4.name); // tom
  console.log(person4.name === person4.getName()); // true
  console.log(person5.name); // parent4
  console.log(person4.friends); // ["p1", "p2", "p3","jerry","lucy"]
  console.log(person5.friends); // ["p1", "p2", "p3","jerry","lucy"]
```

这种继承方式的缺点也很明显，因为`Object.create`方法实现的是浅拷贝，多个实例的引用类型属性指向相同的内存，存在篡改的可能

### 寄生式继承

寄生式继承在上面继承基础上进行优化，利用这个浅拷贝的能力再进行增强，添加一些方法

```js
let parent5 = {
    name: "parent5",
    friends: ["p1", "p2", "p3"],
    getName: function() {
        return this.name;
    }
};

function clone(original) {
    let clone = Object.create(original);
    clone.getFriends = function() {
        return this.friends;
    };
    return clone;
}

let person5 = clone(parent5);

console.log(person5.getName()); // parent5
console.log(person5.getFriends()); // ["p1", "p2", "p3"]
```

其优缺点也很明显，跟上面讲的原型式继承一样

### 寄生组合式继承

寄生组合式继承，借助解决普通对象的继承问题的`Object.create` 方法，在前面几种继承方式的优缺点基础上进行改造，这也是所有继承方式里面相对最优的继承方式

```js
function clone (parent, child) {
    // 这里改用 Object.create 就可以减少组合继承中多进行一次构造的过程
    child.prototype = Object.create(parent.prototype);
    child.prototype.constructor = child;
}

function Parent6() {
    this.name = 'parent6';
    this.play = [1, 2, 3];
}
Parent6.prototype.getName = function () {
    return this.name;
}
function Child6() {
    Parent6.call(this);
    this.friends = 'child5';
}

clone(Parent6, Child6);

Child6.prototype.getFriends = function () {
    return this.friends;
}

let person6 = new Child6();
console.log(person6); //{friends:"child5",name:"child5",play:[1,2,3],__proto__:Parent6}
console.log(person6.getName()); // parent6
console.log(person6.getFriends()); // child5
```

可以看到 person6 打印出来的结果，属性都得到了继承，方法也没问题

文章一开头，我们是使用`ES6` 中的`extends`关键字直接实现 `JavaScript`的继承

```js
class Person {
  constructor(name) {
    this.name = name
  }
  // 原型方法
  // 即 Person.prototype.getName = function() { }
  // 下面可以简写为 getName() {...}
  getName = function () {
    console.log('Person:', this.name)
  }
}
class Gamer extends Person {
  constructor(name, age) {
    // 子类中存在构造函数，则需要在使用“this”之前首先调用 super()。
    super(name)
    this.age = age
  }
}
const asuna = new Gamer('Asuna', 20)
asuna.getName() // 成功访问到父类的方法
```

利用`babel`工具进行转换，我们会发现`extends`实际采用的也是寄生组合继承方式，因此也证明了这种方式是较优的解决继承的方式

### 总结

下面以一张图作为总结：

![继承方式.png](./img/继承方式.png)

通过`Object.create` 来划分不同的继承方式，最后的寄生式组合继承方式是通过组合继承改造之后的最优继承方式，而 `extends` 的语法糖和寄生组合继承的方式基本类似

---
