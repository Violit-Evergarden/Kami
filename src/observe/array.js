//我们希望重写数组中的部分方法

const oldArrayProto = Array.prototype

//创建一个以Array.prototype为原型的对象,在这个对象里面重写部分方法，以免去覆盖数组本身的方法 
export const newArrayProto = Object.create(oldArrayProto)

const methods = [
  'push',
  'pop',
  'shift',
  'unshift',
  'reverse',
  'sort',
  'splice'
]

methods.forEach(method=>{
  newArrayProto[method] = function(...args){
    const result = oldArrayProto[method].apply(this,args)//在重写的方法内部调用数组原来的方法,函数的劫持
    let inserted//声明一个变量记录插入到数组的元素
    switch (method) {
      case 'push':
        inserted=args
        break;
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted=args[2]
      default:
        break;
    }
    if (inserted) {
      this.__ob__.observeArray(inserted)
    }
    return result
  }
})
