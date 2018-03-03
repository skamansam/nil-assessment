/* eslint-disable no-console */
'use strict'

const https = require('https')
const fs = require('fs')
const querystring = require('querystring')

const Router = require('./Router')

/** 
 * models a server
*/
class Server {
  constructor(port){
    this.serverKey = fs.readFileSync('secure/key.pem')
    this.serverCert = fs.readFileSync('secure/cert.pem')
    this.port = port
  }

  start() {
    this.server = https.createServer({
      key: this.serverKey,
      cert: this.serverCert
    }, this.handleRequest).listen(this.port)
    this.server.on('error', (err) => console.error(err))

  }

  stop() {
    this.server.close()
  }
  
  handleRequest(request, response) {
    response.setHeader('Content-Type', 'application/json')
    let content = ''
    request.on('data', (data) => {
      content += data
    })
    request.on('end', () => {
      const body = querystring.parse(content)
      console.info(body)
      response.end(new Router(request, response, body).render())
      console.info('IT WORKS!')
    })
  }
  
}

module.exports = Server