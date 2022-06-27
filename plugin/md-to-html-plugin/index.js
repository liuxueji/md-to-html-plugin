// readFileSync同步方式读取文件，只有它执行完，后面才能执行
const {
  readFileSync
} = require('fs')
const {
  resolve
} = require('path')
const {
  Compilation
} = require('webpack')
// 存储被插入的字符串
const INNER_MARK = '<!-- inner -->'
const {
  compileHTML
} = require('./compiler')
class MdToHtmlPlugin {
  // 将传入的对象解构出来，并赋值
  constructor({
    template,
    filename
  }) {
    // 必须要有解析的文件template，不然不知道打包谁
    if (!template) {
      throw new Error('template 找不到')
    }
    this.template = template
    this.filename = filename ? filename : 'md.html'
  }
  // webpack提供的方法apply()，我们在编译中都是在apply中做的，它会接受一个编译器compiler，compiler会有相应的钩子集合
  apply(compiler) {
    // 通过compiler.hooks.emit.tap这个传两个参数：插件名，回调函数。在回调函数中有一个参数compilation，内有一个assets，它会生成打包的资源
    compiler.hooks.emit.tap('md-to-html-plugin', (compilation) => {

      const _assets = compilation.assets;
      // 读取需要解析的md文件
      const _mdContent = readFileSync(this.template, 'utf8');
      // 读取需要被插入的html模板
      const _templateHtml = readFileSync(resolve(__dirname, 'template.html'), 'utf8')
      // 通过分隔换行，将需要解析的md文件由对象转为数组
      const _mdContentArray = _mdContent.split('\n')
      // compileHTML核心！通过compileHTML将md文件转为html
      const _htmlStr = compileHTML(_mdContentArray)
      // console.log(_htmlStr)
      // 将解析好的html，替换掉我们的 <!-- inner -->
      const _finalHTML = _templateHtml.replace(INNER_MARK, _htmlStr)
      // console.log(_mdContent,'1')
      _assets[this.filename] = {
        // sourse会将 _finalHTML 替换 this.filename 
        source() {
          return _finalHTML
        },
        // return 资源的长度
        size() {
          return _finalHTML.length
        }
      }

    })
  }
}


module.exports = MdToHtmlPlugin