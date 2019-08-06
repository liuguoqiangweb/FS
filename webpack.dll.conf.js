const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: {
    vendor: [
      'vue/dist/vue.runtime.esm.js',
      'vue-router',
      'js-cookie',
      'axios',
      'vuex'
    ]
  },
  output: {
    path: path.join(__dirname, 'public/vendor'),
    filename: '[name].dll.js',
    library: '[name]_[hash]'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, 'public/vendor', '[name]-manifest.json'),
      name: '[name]_[hash]',
      context: process.cwd()
    })
  ]
}
