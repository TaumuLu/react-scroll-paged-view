const path = require('path')
const webpack = require('webpack')

module.exports = {
  name: 'vendor',
  entry: [
    'animated',
    'react',
    'react-native',
    // 'react-scroll-paged-view',
    // './web_modules/node_modules/react-native-web',
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, './build/dll'),
    filename: 'vendor.bundle.js',
    library: 'vendor_[hash]',
  },
  plugins: [
    new webpack.DllPlugin({
      name: 'vendor_[hash]',
      path: path.resolve(__dirname, './build/dll/manifest.json'),
    }),
  ],
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
    modules: [path.resolve(__dirname, 'web_modules/node_modules'), 'node_modules'],
    extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx'],
  },
}

