const getAssetPrefix = (port) => {
  const assetPrefix = process.env.CDN_HOST ? `//${process.env.CDN_HOST}/assets/basket` : `http://localhost:${port}`
  return assetPrefix
}

module.exports = {
  getAssetPrefix
}
