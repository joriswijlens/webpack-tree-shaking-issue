const {merge} = require('webpack-merge')

const common = require('./webpack.client.common')
const { getFragments } = require('../src/lib/ssr-webpack')

function getConfig() {
  const webpack = require('webpack')
  return merge(common, {
    mode: 'development',
    cache: true,
    devtool: 'inline-source-map',
    entry: getFragments(true),
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
    ]
  });
}

module.exports = getConfig()
