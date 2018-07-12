const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

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
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        // exclude: /node_modules/,
        // include: [
        //   path.resolve(__dirname, 'node_modules/react-scroll-paged-view'),
        // ],
      },
    ],
  },
  resolve: {
    alias: {
      'react-native': 'react-native-web',
      'react-scroll-paged-view': path.join(__dirname, './../src'),
      animated: path.join(__dirname, './node_modules/animated'),
      // 'react-native': path.join(__dirname, './web_modules/react-native'),
    },
    modules: [path.resolve(__dirname, 'web_modules/node_modules'), 'node_modules'],
    extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx'],
  },
  plugins: [
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, './build/dll/manifest.json'),
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './public/index.html',
      // filepath: require.resolve('./build/vendor.dll.js'),
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
