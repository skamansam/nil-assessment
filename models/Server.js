'use strict';

const https = require('https');
const fs = require('fs');

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
    }, this.handleRequest).listen(this.port);
    this.server.on('error', (err) => console.error(err));
  }

  stop() {
    this.server.close()
  }
  
  handleRequest(request, response) {
    response.setHeader('Content-Type', 'application/json')
    // response.writeHead(200);
    response.end('It Works!');
    console.info('IT WORKS!')
  }
  
}

module.exports = Server;