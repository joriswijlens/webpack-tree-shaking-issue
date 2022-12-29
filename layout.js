const http = require('http')
const Tailor = require('node-tailor')

const tailor = new Tailor({
  filterResponseHeaders: (attributes, headers) => {
    const result = {}

    if (!attributes.public && headers['set-cookie']) {
      result['Set-Cookie'] = headers['set-cookie']
    }

    return result
  }
})

const requestHandler = async (req, res) => {
  try {
    await tailor.requestHandler(req, res)
  } catch (e) {
    console.log(`Error in layout serve ${JSON.stringify(e)}`)
  }
}

const server = http.createServer(requestHandler)

const port = 8080
server.listen(port)
console.log('listening on port ' + port)
