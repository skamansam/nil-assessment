'use strict';
const ServerClass = require('./models/Server')

const server = new ServerClass(3000)
server.start()
