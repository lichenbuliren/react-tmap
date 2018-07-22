const path = require('path')
const UglifyPlugin = require('uglifyjs-webpack-plugin')

const srcPath = path.resolve(__dirname, 'src')

module.exports = {
  entry: {
    entry: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'qmap.min.js',
    libraryTarget: 'umd',
    library: 'qmap'
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
    extensions: ['.jsx', '.js']
  },
  externals: {
    qq: 'window.qq'
  },
  plugins: [
    new UglifyPlugin()
  ]
}
