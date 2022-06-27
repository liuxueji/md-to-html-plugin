const {
  resolve
} = require('path')
const MdToHtmlPlugin = require('./plugin/md-to-html-plugin')

module.exports = {
  mode: 'development',
  entry: resolve(__dirname, 'src/app.js'),
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'app.js'
  },
  // 配置自己的插件，里面直接实例化我们的插件就行
  plugins: [
    new MdToHtmlPlugin({
      // 这是我们要解析的文件
      template: resolve(__dirname, 'text.md'),
      // 解析后的文件名，通过打包存储到dist目录下
      filename: 'text.html'
    }),
  ]
}