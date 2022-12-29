import fs from 'fs'

import path from 'path'

const getFragments = (isDevelopment) => {
  const fragmentEntries = {}
  const fragmentsPath = path.join(process.cwd(), 'src/client/fragments')
  fs.readdirSync(fragmentsPath).forEach(function (file) {
    const fileName = file.split('.')
    if (!fileName.includes('register')) {
      const fragmentName = fileName[0]

      const fragmentPath = './src/client/fragments/' + fragmentName + '/client'

      const entries = [fragmentPath]
      fragmentEntries[`${fragmentName}-client`] = entries
    }
  })
  return fragmentEntries
}

module.exports = { getFragments }
