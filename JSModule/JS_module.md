## JS模块化

### 1. 历史
#### 背景
JS本身是简单的页面设计： 页面动画+表单提交，并无模块化 or 命名空间的概念

> JS 的模块化需求日益增长

#### 幼年期：无模块化
1. 开始需要在不同的页面中增加一些不同的JS： 动画，表格，格式化
2. 多种JS文件为了可读性或者可维护性，被分在不同的文件中
3. 不同层级的文件，又被同一个模版引用

  这会导致在单个HTML模版下会出现大量jquery.js，dependents

```js
<script src="jquery.js"></script>
<script src="main.js"></script>
<script src="dep1.js"></script>

```

这个在当时是被认可的，因为文件分离是最基础的模块化第一步

##### 问题出现：
* 污染全局作用域 ==> 不利于大型项目的开发以及多人团队的合作


#### 成长期：模块化的雏形- IIFE（语法测的优化）
##### 作用域的把控
例子：
```js
//定义一个全局变量
let count = 0；
//代码块1
const increase = ()=> ++count;
//代码块2
const reset = ()=> {
  count = 0;
}

increase();
reset();
```

利用函数块极作用域
```js
(()=>{
  let count = 0;
})
//仅定义了一个函数，并没有立即执行
```
如果立即执行：
```js
(()=>{
  let count = 0;
})();
//立刻执行函数
```
>通过利用函数块极作用域，初步实现了一个最简单的模块

尝试定义一个简单的模块
```js
const jsModule = (()=> {
  let count = 0;
  return {
    increase: ()=> ++count;
    reset: ()=> {count = 0;}
  }
})();

//如何使用
jsModule.increase();
jsModule.reset();
```

这么做的好处：
1. 对外暴露了increase，reset 的功能，同时又保留了count 这个变量，不会污染全局

**追问：有额外依赖时，如何优化相关代码**

> 优化1: 依赖其他模块的IIFE

```js

//通过传参解决多方依赖的问题
const jsModule = ((dependent1, dependent2)=> {
  let count = 0;
  return {
    increase: ()=> ++count;
    reset: ()=> {count = 0;}
  }
})(dependent1,dependent2);

//如何使用
jsModule.increase();
jsModule.reset();
```

**面试1: 了解早起jquery的依赖处理以及模块加载方案吗？/ 了解传统是如何解决多方依赖的问题？
答： IIFE 加传参调配**

实际上，jquery 等框架其实应用了revealing 的写法

```js

//通过传参解决多方依赖的问题
const jsModule = ((dependent1, dependent2)=> {
  let count = 0;

    const increase = ()=> ++count;
    const reset=()=> {count = 0;}
  return{increase,reset}
})(dependent1,dependent2);

//如何使用
jsModule.increase();
jsModule.reset();
```
用revealing写法的好处：
只是对外暴露了可被调用的接口/使用方式，并没有直接暴露算法。

#### 成熟期：
##### CJS - CommonJS
>node.js 制定的一套方案
特征：
* 通过module + exports 去对外暴露/提供接口
* 通过require 来调用其他模块（module）

模块组织方式：
```js

//引入
const dep1= require(./dependencyModule1);
const dep2 = require(./dependencyModule2)

//处理部分
let count = 0;
const increase=()=> ++count;
const reset = ()=>{
  count = 0;
}
//暴露接口部分
exports.increase =increase;
exports.reset = reset;

```
模块使用方式：
```js
const {increase,reset} = require('./main.js');

increase();
reset();
```

**可能被问到的问题**




<mark>实际执行处理</mark>

问题 [^1]



```js

（function (){
  const dep1= require(./dependencyModule1);
  const dep2 = require(./dependencyModule2)

  //业务逻辑...
}).call(thisValue,exports,require,module);
```

> CommonJS
* 优点：
  1. CommonJS率先在服务端实现了，从框架层面解决依赖，全局变量污染的问题。
* 缺点
  1. 主要针对了服务端的解决方案（对异步拉取依赖的处理整合不是那么友好）
* 新问题： -- 异步依赖问题



[^1]: 这是一个问题 
