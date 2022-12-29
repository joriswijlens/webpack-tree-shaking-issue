module.exports = function (api) {
  api.cache(false)
  const presets = [
    '@babel/preset-react',
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      {
        targets: {
          esmodules: true,
          node: true
        }
      }
    ]
  ]

  const plugins = [['@babel/plugin-proposal-decorators', { legacy: true }]]

  if (process.env.BUILD !== 'CLIENT') {
    plugins.push(['@babel/plugin-transform-modules-commonjs'])
  }

  return {
    presets,
    plugins,
  }
}
