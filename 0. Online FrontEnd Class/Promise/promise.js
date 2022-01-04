 //jshint esversion:6

const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
_status = PENDING;


class MPromise {
  constructor(fn){
    this.value = null;
    this.reason =null;
    this.status= PENDING;

    try{
      fn(this.resolve.bind(this),this.reject.bind(this));
    }
    catch(e){
      this.reject(e);
    }
  }

  get status(){
    return  this._status;
  }
  set status(newStatus){
    this._status = newStatus;
    switch(newStatus){
      case FULFILLED:{
        break;
      }
      case REJECTED:{
        break;
      }
    }
  }

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

  then(onFulfilled, onRejected){
    const realOnFulfiled = this.isFunction(onFulfilled) ? onFulfilled: (value) => {
      return value;
    };

    const realOnRejected = this.isFunction(onRejected)? onRejected:(reason)=>{
      throw reason;
    };

    const promise2 = new MPromise((resolve,reject)=>{
      switch(this.status){
        case FULFILLED:{
          realOnFulfiled();
          break;
        }
        case REJECTED:{
          realOnRejected();
          break;

        }

      }
    });

  }

  isFunction(param){
    return typeof param ==='function';
  }
}
