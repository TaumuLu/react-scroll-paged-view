const WebpackDevServer = require('webpack-dev-server')
const webpack = require('webpack')
const open = require('opn')
const config = require('./webpack.config')

const compiler = webpack(config)
const devServer = new WebpackDevServer(compiler, {
  disableHostCheck: true,
  compress: true,
  contentBase: './build',
  host: '0.0.0.0',
  historyApiFallback: true,
  inline: false,
  hot: false,
})

devServer.listen(9090, '0.0.0.0', (err) => {
  if (err) {
    console.log(err)
  } else {
    const uri = 'http://127.0.0.1:9090'
    console.log(`Starting the development server: ${uri}`)
    open(uri)
  }
})
