# 变量，作用域和内存


## 什么是函数
一次封装（定义），四处使用（调用）

---
## 什么是变量
什么是数据：4， ‘str’ ， true ， {} []
保存数据的容器就是变量

变量基本类型：4 'str' true/false undefined null

引用类型：{} []

* 区别：
基本类型的值是不可修改的，引用类型的值是可以修改的

### 数据保存 -- 堆栈

栈内存是有序保存的，缺点是内存有限
堆内存是无序排列的，空间大小不固定

基本类型要保存在栈内存中
引用类型要保存在堆内存中

因为引用类型是无序的，所以我们需要知道地址。我们可以通过在栈内保存地址的方法去访问堆内存中的数据

### 变量是如何命名的
1. 可以用： 26个英文字母， 数字（数字不能开头）， $ ， _
2. 命名区分大小写
3. 不能使用关键字： if for
4. 不能使用保留字： class
5. 命名要有意义

### 如何使用变量
```js
//先声明，然后赋值
var score;
score =4;

//声明赋值一起
var score =4；

//同时声明多个值，用逗号隔开
var xhScore=4，
    xmScore=5；

```


### 变量作用域
1. 全局变量
2. 局部变量
* 在函数内部可以直接读取全局变量

```js
var n = 999;
function f1(){
  alert(n); //访问到全局n
}

function f2(){
  var x = 999; //函数内var 声明的变量是局部变量，省略var 是一个全局变量
}
alert(n)// n undefined
```


---
## 什么是闭包
闭包是一个拥有许多变量和绑定了这些变量的环境的表达式（通常是一个函数）
特点： 函数b 是在函数a内嵌套的，函数a 需要返回函数b
用途：
1.  读取函数内部变量

  ```js
  function a(){
    var i = 0;

    function b(){
      alert(++i);
    }

    return b;
  }

  var c = a(); // 1
  ```

2. 让i变量的值，保留在内部种

```js
function f1(){
  var n =999;
  nAdd = function(){
    n = n+1;
  }
  function f2(){
    alert (n);
  }
  return f2;
}

var rs = f1();
rs(); //999
nAdd(); //执行了
rs(); //1000
```

### 闭包的优缺点
* 优点：
  1. 有利于封装
  2. 可以访问变量

* 缺点：
  1. 内存占用浪费严重
  2. 有内存泄漏的风险（黑客主要攻击内存）


---
## 正则表达式[1^] Regular Expression

### 声明是正则表达式
正则表达式是由一下两周字符组成的文字模式
1. 普通字符（例如26个英文字母，数字等）
2. 特色字符（有特色含义的，比如 . \）

该模式描述在查找文字主体时待匹配的一个或多个字符串。正则表达式作为一个模版，将某个字符模式与所搜索的字符串进行匹配

### 为什么使用正则表达式
1. 帮助我们更好的查找
2. 在查找到的基础上，进行替换
3. 对用户输入的数据进行有效性验证

### 创建正则表达式的两种方式

1. 字面量或直接量

  ```js
  []//空的数组
  {}

  //正则是写在斜杠中间的
  /Coding/

  //匹配到的内容是字符串的内容（str）
  var str = "I Love Coding"；
  var pattern = /Coding/；

  ```

2. 构造函数 Regular Expression(正则)

  ```js
  new RegExp()
  ```
  优点：可以传递变量

  ```js
  var str= 'I love js';
  var unserInput = 'love';
  var pattern = new RegExp(unserInput, 'i');
  ```

### 正则匹配方式
1. test

```js
var str = "I Love Coding"；
var pattern = /Coding/；

//找到会返回true，找不到会返回false
//正则是区分大小写的
pattern.text(str);

```

2. exec
```js
var str = "I Love Coding"；
var pattern = /oding/；

//找到会返回数组，找不到会返回null
pattern.exec(str);

```
### 正则模式修饰符
1. i ignoreCase 忽略大小写
2. g global 全局匹配
3. m multiline 多行

```js
var str = "I Love Coding"；
var pattern = /coding/i；
var pattern = /coding/ig；
var pattern = /coding/img；

```

### 转义字符
// \

```js
var str ='//我是注释'；
var pattern = /\/\//;

\n 反斜杠n 是换行;
\t Tab


```

---
## JavaScript中的面向对象（oop）: 对代码的一种抽象，对外统一提供调用接口的编程思想
###  声明对象
  1. 字面式声明

  ```js

  var obj = {
    属性名称: 属性值，
    属性名称 : 属性值，
    属性名称 : 属性值，

    方法名称: function(){},
    方法名称: function(){},
  }
  ```

  2. New

  ```js
  //object 是所有对象的基类、根， 所有的JavaScript对象都是由Object 延伸的
  var obj = new Object();
  obj.属性 = 属性值；
  obj.属性 = 属性值；

  obj.方法 = function(str){
    方法代码
  }
  ```

  3. 构造方法声明

  ```js
  function test([参数列表]){
    this.属性 = 属性值；
    this.方法 = function(){
      方法代码
    }
  }

  var obj = new test(参数列表)；

  ```

  ```js
  function person(name, sex, age){
    this.name = name;
    this.sex = sex;
    this.age = age;
    this.show= function (){
      alert(this.name + this.sex +this.age);
    }
  }

  var obj1 = new person("Nathan", "Male", 26);
  //alert(obj1.sex);
  // obj1.show();
  ```
  4. 工厂方法声明

  ```js
  function createObj (name, age){
    var obj = new Object();

    obj.name = name;
    obj.age = age;

    obj.sayName = function(){
      console.log("the name is " + this.name);
    };

    obj.run = function(){
      console.log(this.name + '---'+ this.age );
    }

    return obj;
  }

  var person1 = createObj('Tom', 24);

  person1.run();

  ```
  构造函数和工厂模式对比
  * 构造： 不会显示创建对象， 用this 赋值，不需要return obj对象
  * 工厂： 在方法内部创建obj对象，需要返回obj对象


  5. 原型模式声明
  6. 混合模式声明
2. 封装·原型·原型链
3. 继承
  原型继承，构造函数继承， call()， apply()
4. 对象冒充


### js 面向对象的名次解释
属性： 事物的特性，事物自身拥有的东西
方法： 事物的功能
对象： 事物的一个实例
原型： js函数中由prototype属性引用了一个对象，即原型对象（原型）

### 什么是对象（object）
对象就是值（任何值）的集合 ： ‘123’, true, [], function

```js
{ }//这个是空的对象

//构成 名值对(name/value pair)/ 键值对(key/value pair)
// 一个名值对就是一个对象的属性，目前下面这个对象有两个属性

{
  'name':'Tom',
  'age':4
}；

//用var付值一个变量
var cat = {
  'name': 'Tom',
  'age': 4,
  'family':['dad','mom'], //数组
  'speak': function(){  //函数
    console.log('meow meow');
  },
  'friend': { //对象
    'name': 'Jerry',
    'age':4
  }
};

var name = 'Tom'// 尽量少用全局变量

```
#### 对象的创建方式
1. 通过构造函数生成对象
2. 字面方式：直接创建空的对象
3. ES5 提供的方式： Object.create()

#### 读取与赋值
```js
cat.name ='Tim'; //更改已有属性

cat.type='加菲猫'//创建新的值

delete cat.type; //删除
//没有值的数据是undefined，不会报错

// 用 in 来判断对象中是否有某属性 (ture/false)
console.log('name' in cat);

// for in 来判断对象中的每一个属性
for(var p in cat){
  console.log(p);
  console.log(cat[p]);
}

```


[1^] 匹配的视频录屏与音频不符合（步骤一·2-1H5验证～1.mp4）
