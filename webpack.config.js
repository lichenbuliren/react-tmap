const path = require('path')
const UglifyPlugin = require('uglifyjs-webpack-plugin')

const srcPath = path.resolve(__dirname, 'src')

module.exports = {
  entry: {
    entry: '/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].mim.js'
  },
  module: {
    rules: [{
      test: /\.jsx?/,
      include: [
        srcPath
      ],
      use: 'babel-loader'
    }]
  },
  // 代码模块解析路径配置
  resolve: {
    modules: [
      'node_modules',
      srcPath
    ],
    extensions: ['.jsx']
  },
  plugins: [
    new UglifyPlugin()
  ]
}
