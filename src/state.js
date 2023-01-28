import { observe } from "./observe/index"


export function initState(km){
  const opts = km.$options
  if(opts.data){
    initData(km)
  }
}

function initData(km){
  let data = km.$options.data // data可能是函数或对象
  data = typeof data === 'function'?data.call(km):data
  km._data = data//将用户设置的data绑定到km上
  //对数据进行劫持
  observe(data)
  
  //将km._data用km来代理，方便取值 km.name 而非km._data.name
  for(let key in data){
    proxy(km,key,'_data')
  }
}

function proxy(km,key,targetProp){
  Object.defineProperty(km,key,{
    get(){
      return km[targetProp][key]
    },
    set(newValue){
      km[targetProp][key] = newValue
    }
  })
}