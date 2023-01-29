const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const startTagClose = /^\s*(\/?)>/ //<br/>
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g //{{  name  }}

function parseHTML(html) {
  const ELEMENT_TYPE = 1;
  const TEXT_TYPE = 3;
  const stack = []//用于存储元素的
  let currentParent;//指向栈中最后一个
  let root;//根节点

  //最终需要抽象为一颗语法树
  function createASTElement(tag,attrs){
    return {
      tag,
      type:ELEMENT_TYPE,
      children:[],
      attrs,
      parent:null
    }
  }
  function start(tagName,attrs){
    let node = createASTElement(tagName,attrs)
    if(!root){
      root = node
    }
    if(currentParent){
      node.parent = currentParent
      currentParent.children.push(node)
    }
    stack.push(node)
    currentParent = node
  }
  function chars(text){
    text = text.replace(/\s/g,'')
    text && currentParent.children.push({
      type:TEXT_TYPE,
      text,
      parent:currentParent
    })
  }
  function end(tagName){
    let node = stack.pop()
    currentParent = stack[stack.length-1]
  }

  while (html) {
    let textEnd = html.indexOf('<')
    if (textEnd === 0) {
      const startTagMatch = parseStartTag()
      if(startTagMatch){
        start(startTagMatch.tagName,startTagMatch.attrs)
        continue
      }
      let endTagMatch = html.match(endTag)
      if(endTagMatch){
        end(endTagMatch[1])
        advance(endTagMatch[0].length)
        continue
      }
    }
    if(textEnd>0){
      let text = html.substring(0,textEnd)//文本内容
      if(text){
        chars(text)
        advance(text.length)
      }
    }
  }
  console.log(root);
  function parseStartTag() {
    const start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1], //标签名
        attrs: []
      }
      advance(start[0].length)
      let attr, end
      //如果不是开始标签的结束，就一直匹配下去
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        advance(attr[0].length)
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5] || true
        })
      }
      if (end) {
        advance(end[0].length)
      }
      return match
    }
    return false //不是开始标签
  }
  //html最开始一定是一个div
  function advance(n) {
    html = html.substring(n)
  }
}

export function compileToFunction(template) {
  let ast = parseHTML(template) //将template转为ast语法树
}
