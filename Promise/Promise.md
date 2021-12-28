1. 初始化class
    ```js
    class MPromise{
      constructor{}
    }
    ```
2. 定义三种状态
```js
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
```
   pending, fulfilled, REJECTED
3. 设置初始状态（在 constructor 里设置)
  this.value = null;
  this.reason =null;
  this.status= PENDING;

4. resolve/reject --> 只有这两个可以用来改变promise的状态
  1. 更改status PENDING -> FULFILLED/REJECTED
  2. 入参 value/reason

  ```js
  resolve(value){
    if(this.status ===PENDING){
      this.value = value;
      this.status = FULFILLED;
    }
  }

  reject(reason){
    if(this.status=== PENDING){
      this.reason = reason;
      this.status = REJECTED;
    }
  }
```

5. promise构造函数的【入参？】
1. 入参是一个函数，函数接受两个参数， resolve， reject
2. new promise的时候就要执行这个函数，并且有任何错误的时候都要被reject 出去
***面试题：同步异步任务***

  ···js
  new Promise((resolve, reject)=>{})
  ···


6. then 接受两个参数 onFulfilled，onRejected.

  根据参数类型做判断
  isFunction(){}
