import babel from 'rollup-plugin-babel'
//rollup默认可以导出一个对象作为打包的配置文件
export default{
  input:'./src/index.js',
  output:{
    file:'./dist/Kami.js',
    name:'Kami', //global.Vue
    format:'umd',//esm es6 commonjs iife自执行函数 umd
    sourcemap:true
  },
  plugins:[
    babel({
      exclude:'node_modules/**'
    })
  ]
}