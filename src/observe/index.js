import { newArrayProto } from "./array"

class Observer{
  constructor(data){
    //为每一个需要监视的对象或数组添加__ob__属性，值设为this,方便判断数据是否已经被劫持，同时方便调用Observer的方法
    Object.defineProperty(data,'__ob__',{
      value:this,
      enumerable:false//将__ob__变成不可枚举，避免死循环
    })
    if(Array.isArray(data)){
      //给数组设置原型，原型中重写了部分数组方法
      Object.setPrototypeOf(data,newArrayProto)
      //观测一下数组初始元素，观测到对象就进行数据劫持
      this.observeArray(data)
    }else{
      this.walk(data)
    }
  }
  walk(data){//循环对象，对属性依次劫持
    //重新定义属性
    Object.keys(data).forEach(key=>defineReactive(data,key,data[key]))
  }
  observeArray(data){//观测数组
    data.forEach(item=>observe(item))//对数组里的对象元素进行数据劫持
  }
}

//Object.defineProperty只能劫持已经存在的数据(vue里为此单独写了一些api,$set,$delete)
export function defineReactive(target,key,value){
  observe(value) //对data里所有的对象属性进行劫持
  Object.defineProperty(target,key,{
    configurable:true,
    enumerable:true,
    get(){
      console.log('取')
      return value
    },
    set(newValue){
      console.log('设')
      if(newValue === value) return
      observe(newValue)//如果设置的值为一个对象，则对其也要进行数据劫持
      value = newValue
    }
  })
}

export function observe(data){
  //只对对象或数组进行劫持
  if(typeof data !== 'object' || data === null) return 
  //如果一个对象已经被劫持过了，就不需要再进行劫持了
  if(data.__ob__ instanceof Observer) return
  return new Observer(data)
}