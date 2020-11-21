// 项目根目录中创建了`vue.config.js`
// 导包
// 将css自动加上一个浏览器适配的前缀 -webkit
const autoprefixer = require('autoprefixer')
// 导包
const pxtorem = require('postcss-pxtorem')
const path = require('path')

// 暴露出去
module.exports = {
  // css属性如何处理
  css: {
    // 处理的选项
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer(),
          // 使用 pxtorem库进行转换
          pxtorem({
            rootValue: 37.5, // ******这里就是设计稿宽度的1/10，vant的设计稿宽度就是375px
            propList: ['*'] // 哪一些css需要转换
          })
        ]
      }
    }
  },
  // style-resources-loader插件配置 以实现全局使用less
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      // 参数
      patterns: [
        // 这个数组里面只能写绝对路径
        // 项目根路径下 /src/styles/ 的所有less文件
        // 指定某一个的话可以具体设置为某一个less文件
        path.resolve(__dirname, './src/style/*.less')
      ]
    }
  }
}
