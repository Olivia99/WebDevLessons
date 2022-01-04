## JS模块化

### 1. 历史
#### 背景
JS本身是简单的页面设计： 页面动画+表单提交，并无模块化 or 命名空间的概念

> JS 的模块化需求日益增长

---

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

---
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

---
### 成熟期：
#### CJS - CommonJS
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


实际执行处理[^1]

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


#### AMD规范
>通过异步加载+允许制定回调函数
经典实现框架是：require.js

新增定义方式
```js
//通过define来定义一个模块，然后require进行加载
/*
define
params：模块名，依赖模块，工厂方法
*/

define(id,[depends],callback);
require([module],callback);

```

模块定义方式
```js
//确保当前模块是在dependecyModule 1&2（异步） 加载完后再进行
define('amdModule',['dependencyModule1',dependencyModule2],(dependencyModule1,dependencyModule2))=>{
  //业务逻辑

  //处理部分
  let count = 0 ;
  const increase()=> ++count;
  const reset()=>{
    count=0;
  }
  return {
    increase,reset
  }
}
```

引入模块：
```js
require(['amdModule'], amdModule=>{
  amdModule.increase();
})
```



**面试问题：如果在amdModle中想兼容已有代码，怎么办？**

```js
define(require=>{
  //引入
  const dep1= require(./dependencyModule1);
  const dep2 = require(./dependencyModule2)

  //处理部分
  let count = 0;
  const increase=()=> ++count;
  const reset = ()=>{
    count = 0;
  }

  return{
   increase,reset
  }
})
```
**面试问题：AMD中使用revealing**

```js
define(‘amdModule’,[],(require,export,module)=>{
  const dep1= require(./dependencyModule1);
  const dep2 = require(./dependencyModule2)

  //处理部分
  let count = 0;
  const increase=()=> ++count;
  const reset = ()=>{
    count = 0;
  }

export.increase = increase();
export.reset = reset();
});

define(require=>{
  const otherModule = require('amdModle');
  otherModule.increase();
  otherModule.reset();
})
```

**面试题：兼容AMD&CommonJS //如果判断是CJS/AMD**
umd 的出现 [^2]

```js
(define(‘amdModule’,[],(require,export,module)=>{
  const dep1= require(./dependencyModule1);
  const dep2 = require(./dependencyModule2)

  //处理部分
  let count = 0;
  const increase=()=> ++count;
  const reset = ()=>{
    count = 0;
  }

export.increase = increase();
export.reset = reset();
}))(
  //目标是一次性区分CommonJS or AMD
  typeof module ==='object' && module.exports &&typeof define !== 'function'
  ？ //是CommonJS
   factory =>module.exports = factory(require,exports,module)
   ://是AMD
   define
);

```
>* 优点： 适合在浏览器中加载异步模块，并可以加载多个模块、
* 缺点： 会有引入成本，不能按需加载


#### CMD规范
> 按需加载
主要应用的框架 sea.js

```js
define("module",(require,exports,module)=>{
  let $ = require('jquery');
  //jquery 相关逻辑

  let dependencyModule1 = require('dependecyModule1');
// dependencyModule1 相关逻辑
});
```
>* 优点：按需加载，依赖就近
* 缺点：依赖于打包，加载逻辑存在于每个模块中，会扩大模块的体积


**面试题：AMD&CMD的区别**
答：AMD依赖就近，按需加载。 CMD是一起加载

#### ES6模块化
>走向新时代

新增定义：
引入关键字： import
导出关键字： export

模块引入，导出和定义的地方：

```js
import dependecyModule1 from './dependecyModule1.js';
import dependecyModule2 from './dependecyModule2.js';

//处理部分
let count = 0;
const increase=()=> ++count;
const reset = ()=>{
  count = 0;
}

//导出区域
export default {
  increase, reset
}
```

模版引入地方：

```js
<script type='module' src='esModule.js'></script>
```

node 中：
```js
import {increase, reset} from './esModule.mjs'
increase();
reset();


import esModule from '.exModule.mjs';
esModule.increase();
esModule.rese();

```

**面试题：动态模块怎么办？**
考察： export promise

ES11原生解决方案：
```js
import('./esModule.js').then(dynamicEsModule =>{
  dynamicEsModule.increase();
})
```


> * 优点（重要性）： 通过一种最统一的形态整合了JS模块化
* 缺点（局限性）：本质上还是运行时的依赖分析

---
### 解决模块化的新思路 - 前端工程化

#### 出现的背景
之前的模块化的根本问题： 运行时进行依赖分析，导致前端的
> 前端的模块化依赖于运行时分析

解决方案：线下执行
grunt gulp webpack

```js
<!DOCTYPE HTML>
<script src='main.js'></script>
<script>
//给结构工具一个标识为
require.config(__FRAME_CONFIG__);
</script>
<script>
//给结构工具一个标识为
require(['a','d'],()=>{
  业务处理
})
</script>
</HTML>
```

```js
define('a', ()=>{
  let  b= require('b');
  let  c= require('c');

  export.run = (){
    //run
  }
})
```
#### 工程化实现过程
1. 扫描依赖关系表:
```js
{
  a:['b','c'],
  b: ['d'],
  e:[]
}
```

2. 重新生成依赖数据模版
```js
<!DOCTYPE HTML>
<script src='main.js'></script>
<script>
//构建工具生成数据
require.config('deps':{
  a:['b','c'],
  b: ['d'],
  e:[]
});
</script>
<script>
//给结构工具一个标识为
require(['a','d'],()=>{
  业务处理
})
</script>
</HTML>
```

3. 执行工具，采用模块化方案解决模块化处理依赖

  ```js
  define('a',['b','c'],()=>{
    //执行代码
    export.run=()=>{}
  })
  ```

> * 优点：
  1. 构建时生成配置，运行时执行
  2. 最终转化成执行处理依赖
  3. 可拓展
---
### 完全体 webpack 为核心的工程化 + mvvm框架组件化 + 设计模式



[^1]: 不是很理解是如何通过call来执行函数的
[^2]: 不是很懂是如何判断的
