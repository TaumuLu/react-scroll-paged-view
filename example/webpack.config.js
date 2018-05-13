const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const hasHash = process.env.NODE_ENV === 'production'

module.exports = {
  devtool: hasHash ? 'source-map' : 'false',
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: hasHash ? 'assets/scripts/[name]-[chunkhash].js' : 'assets/scripts/[name].js',
    chunkFilename: hasHash ? 'assets/scripts/[name]-[chunkhash].chunk.js' : 'assets/scripts/[name].chunk.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.jsx|\.js?$/,
        loader: 'babel-loader',
      },
    ],
  },
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
    modules: [path.resolve(__dirname, 'web_modules/node_modules'), 'node_modules'],
    extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './public/index.html',
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: 'common',
    },
    runtimeChunk: {
      name: 'runtime',
    },
  },
}
