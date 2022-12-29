const path = require('path')
const webpack = require('webpack')

module.exports = {
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist/client'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /[jt]sx?$/,
        use: [
          'babel-loader'
        ],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    modules: [path.resolve(__dirname, '../src'), 'node_modules'],
    extensions: ['.js', '.jsx', '.tsx', '.ts'],
    fallback: {"os": require.resolve("os-browserify/browser"), "assert": false}
  },
  externals: {
    './server-logger': 'serverLogger'
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser'
    })
  ],
}

