import { initState } from "./state"

export function initMixin(Kami){//给Kami增加一个init方法
  Kami.prototype._init = function(options){//用于初始化操作
    const km = this
    km.$options = options//将用户配置绑定到Kami实列上
    initState(km)//初始化状态
  }
}

