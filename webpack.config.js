const path = require('path')
const UglifyPlugin = require('uglifyjs-webpack-plugin')

const srcPath = path.resolve(__dirname, 'src')

module.exports = (env, options) => {
  const isProduction = options.mode === 'production'
  let filename = 'react-tmap.js'
  if (isProduction) filename = 'react-tmap.min.js'
  const config = {
    entry: {
      entry: './src/index.js'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: filename,
      libraryTarget: 'umd',
      library: 'react-tmap'
    },
    module: {
      rules: [{
        test: /\.jsx?/,
        include: [
          srcPath
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react'
            ],
            plugins: [
              require('@babel/plugin-proposal-object-rest-spread'),
              require('@babel/plugin-proposal-class-properties')
            ]
          }
        }
      }]
    },
    devtool: 'source-map',
    // 代码模块解析路径配置
    resolve: {
      modules: [
        'node_modules',
        srcPath
      ],
      extensions: ['.jsx', '.js']
    },
    externals: {
      qq: 'window.qq',
      react: {
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'react',
        root: 'React'
      }
    },
    plugins: []
  }

  if (isProduction) {
    config.plugins.push(new UglifyPlugin())
  }
  return config
}
