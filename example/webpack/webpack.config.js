const path = require('path')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')

const commonConfig = require('./common.config')


const { isDev, ...config } = commonConfig
const { context } = config

// 从dll包的原始位置（webpack/build目录下）匹配要插入html的dll文件
const directoryToSearch = path.join(context, './build')
const globOptions = { cwd: directoryToSearch }
const vendorAssets = glob.sync('./dll/vendor*.dll.js', globOptions)

module.exports = {
  ...config,
  entry: './index.js',
  output: {
    path: path.join(context, './build'),
    filename: isDev ? 'assets/scripts/[name].js' : 'assets/scripts/[name]-[chunkhash].js',
    chunkFilename: isDev ? 'assets/scripts/[name].chunk.js' : 'assets/scripts/[name]-[chunkhash].chunk.js',
    publicPath: '/',
    // libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        // include: [
        //   path.join(context, 'node_modules/react-scroll-paged-view'),
        // ],
      },
    ],
  },
  plugins: [
    new webpack.DllReferencePlugin({
      // context: path.join(__dirname, './../build/dll'),
      // name: './../dll',
      manifest: path.join(context, './build/dll/manifest.json'),
      // sourceType: 'commonjs2',
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './public/index.html',
      // filepath: require.join('./build/vendor.dll.js'),
    }),
    new HtmlWebpackIncludeAssetsPlugin({
      assets: vendorAssets,
      append: false,
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
