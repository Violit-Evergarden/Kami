import { compileToFunction } from "./compiler/index"
import { initState } from "./state"

export function initMixin(Kami){//给Kami增加一个init方法
  Kami.prototype._init = function(options){//用于初始化操作
    const km = this
    km.$options = options//将用户配置绑定到Kami实列上
    initState(km)//初始化状态
    if(options.el){
      km.$mount(options.el)//实现数据的挂载
    }
  }
  Kami.prototype.$mount = function(el){
    const km = this
    el = document.querySelector(el)
    let opts = km.$options
    if(!opts.render){
      let template
      if(!opts.template && el){
        //没用写模板但是写了el
        template = el.outerHTML
      }else{
        if(el){
          template = opts.template
        }
      }
      if(template){//对模板进行编译
        const render = compileToFunction(template)
        opts.render = render
      }
    }
    opts.render
  }
}



