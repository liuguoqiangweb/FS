'use strict'
const path = require('path')
const UglifyPlugin = require('uglifyjs-webpack-plugin')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title // 页面标题
const port = 9528 // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  // 基本路径(相对于服务器根目录   静态资源的相对路径)
  publicPath: '/',

  // 输出文件目录
  outputDir: 'dist',

  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
  assetsDir: 'static',
  lintOnSave: false,

  // 打包时不要map文件
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/api': {
        target: 'https://oas.chinaole.cc:823/api',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        },
        secure: false
      }
    }
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }

  },
  chainWebpack(config) {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test

    // 设置 svg-sprite-loader ICON雪碧图
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // 设置 preserveWhitespace  去掉空白
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
    // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map')
      )

    config
      .when(process.env.NODE_ENV === 'production',
        config => {
          // 设置 script-ext-html-webpack-plugin 用于对 <script> 标签添加 async，defer,module 属性，或者内联这些属性
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime`必须与runtimeChunk名称相同。 默认是`runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()

          // 设置 webpack-bundle-analyzer 展示打包信息
          config
            .plugin('webpack-bundle-analyzer')
            .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
            .end()

          // 拆分依赖，打包成独立的JS
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // 仅包括最初依赖的第三方
                },
                elementUI: {
                  name: 'chunk-elementUI', // 将elementUI拆分为单个包
                  priority: 20, // 文件大小需要大于libs和app，否则它将被打包到libs或app中
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // 适应cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })

          // 优化持久化缓存
          config.optimization.runtimeChunk('single')

          // 清除打印信息console
          config.optimization.minimizer([new UglifyPlugin({
            uglifyOptions: {
              warnings: false,
              compress: {
                drop_console: true,
                drop_debugger: true,
                pure_funcs: ['console.log']
              },
              usedExports: true // 摇树
            }
          })])

          // DLL
          config
            .plugin('DllReferencePlugin')
            .use(require('webpack').DllReferencePlugin, [{
              context: process.cwd(),
              manifest: require('./public/vendor/vendor-manifest.json')
            }])
        }
      )
  }
}
