const path = require('path')
const webpack = require('webpack')

const commonConfig = require('./common.config')

const { isDev, ...config } = commonConfig
const { context } = config

module.exports = {
  ...config,
  entry: {
    vendor: [
      'animated',
      'react',
      'react-native',
      // 'react-scroll-paged-view',
      // './web_modules/node_modules/react-native-web',
    ],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
      },
    ],
  },
  output: {
    path: path.join(context, './build/dll'),
    filename: isDev ? '[name].dll.js' : '[name]-[chunkhash].dll.js',
    library: '[name]_library',       // vendor.dll.js中暴露出的全局变量名
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]_library',
      path: path.join(context, './build/dll/manifest.json'),
    }),
  ],
}

