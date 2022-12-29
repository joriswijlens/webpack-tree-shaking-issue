import Koa from 'koa'
import { doServerSetup } from './serverSetup'

const server: any = new Koa()
server.name = 'Basket'
server.port = process.env.PORT ?? 3000

doServerSetup(server)

export default server
