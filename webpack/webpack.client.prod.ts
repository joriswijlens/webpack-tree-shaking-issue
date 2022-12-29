const {merge} = require('webpack-merge')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CompressionPlugin = require('compression-webpack-plugin')
const ChunksWebpackPlugin = require('chunks-webpack-plugin');

const common = require('./webpack.client.common')
const {getFragments} = require('../src/lib/ssr-webpack')

module.exports = merge(common, {
  mode: 'production',
  entry: getFragments(false),
  output: {
    filename: '[name]-[chunkhash].js'
  },
  optimization: {
    minimize: false,
    splitChunks: {
      hidePathInfo: true,
      chunks: 'all'
    }
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false
    }),
    new CompressionPlugin(),
    new ChunksWebpackPlugin({
      chunks(chunk: any) {
        return chunk.name !== 'react-dom' && chunk.name !== 'react-dom';
      },
      templateScript: '<script src="REPLACE_WITH_ASSET_PATH{{chunk}}"></script>'
    }),
  ],
  performance: {
    maxEntrypointSize: 300000,
  }
})
