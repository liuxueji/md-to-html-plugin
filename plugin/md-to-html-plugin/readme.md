项目介绍 这是一款 markdown 转 html格式的 plugin插件
1. 创建项目 初始化 npm install -y
2. 安装webpack 这边安装的还是4的版本
```js
"dependencies": {
    "webpack":"^4.30.0",
    "webpack-cli":"^3.3.0",
    "webpack-dev-server":"^3.7.2"
  }
```
3. 之后开始配置 webpack.config.js

先创建plugin/md-to-html-plugin
```js
const resolve = require('path')
const MdToHtmlPlugin = require('./plugin/md-to-html-plugin')

module.exports = {
    mode: 'development',
    entry: resolve(__dirname, 'src/app.js'),
    output: {
        path: resolve(__dirname, 'dist'),
        filename:'app.js'
    }
}
```

1. 我们需要把一个text.md文档解析成一个text.html,因此配置plugin
```js
plugin: [
        new MdToHtmlPlugin({
            template: resolve(__dirname, 'text.md'),
            filename: 'text.html'
        })
    ]
```

# 这是一个h1的标题
- 这个一个ul 列表的第一项
- 这个一个ul 列表的第一项
- 这个一个ul 列表的第一项
- 这个一个ul 列表的第一项

## 这是一个h2的标题
1. 这个一个ol 列表的第一项
2. 这个一个ol 列表的第一项
3. 这个一个ol 列表的第一项
4. 这个一个ol 列表的第一项

2. md 的每一个标识会对应html 当解析完之后,再放到template.html进行展示

3. markdowm - html - html替换掉template.html 内部

4. webpack 打包

5. plugin 是以new的方式再webpack.config.js里面使用的,因此在index.js
```js
class MdToHtmlPlugin {

}

module.exports =  MdToHtmlPlugin
```
6. 使用MdToHtmlPlugin的时候传递了两个参数,一个是md,一个是输出的html文件,可以在构造函数中声明
```js
constructor({ template, filename }) {
        if (!template) {
            throw new Error('template 找不到')
        }
        this.template = template
        this.filename = filename ? filename : 'md.html'
    }
```

7. plugin 里面需要使用apply
```js
apply(compiler) {
        compiler.hooks.emit.tap('md-to-html-plugin', (compilation) => {
            const _assets = compilation.assets; 
            const _mdContent = readFileSync(this.template, 'utf8'); // 把template的东西取出来
            const _templateHtml = readFileSync(resolve(__dirname, 'template.html'), 'utf8') 
            const _mdContentArray = _mdContent.split('\n') // 按换行分组
            const _htmlStr = compileHTML(_mdContentArray) // compileHTML一个方法
            const _finalHTML = _templateHtml.replace(INNER_MARK,_htmlStr) // 把template.html里面的注释换成代码
            console.log(_mdContent)
            _assets[this.filename] = {
                source() {
                    return _finalHTML // 最终的html
                },
                size() {
                    return _finalHTML.length // 长度
                }
            }
           
        })
    }
```