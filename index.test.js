/* eslint-disable no-console */
const https = require('https')
const querystring = require('querystring')
const Buffer = require('buffer').Buffer
const process = require('process')
const child_process = require('child_process')

// start the server for testing
const ServerClass = require('./models/Server')
const server = new ServerClass(3000)
server.start()

// we need to keep track of the times response has returned so we can 
// stop the server at the end of the tests
let apiTestCount = 0

/**
 *  a simple https API test runner. include a body field to the serverOptions
 *  argument to send data. We have sensible defaults for the server options,
 * so you should just pass the `path`, `method`, and `body` properties for them.
 * NOTE: The problem with using this to verify data is that the requests are not in sync. 
 * In the real world, we would use mocha/chai instead. Maybe use Postman or API
 * Blueprint for tests instead.
 * @param {String} title the name of the test 
 * @param {Object} serverOptions options for the https request() method
 * @param {Function} testCallback the callback to run when the server has responded
 */
function testAPI(title, serverOptions, testCallback){
  let defaultOptions = {
    'hostname': 'localhost',
    'port': 3000,
    'path': '/',
    'method': 'GET',
    'rejectUnauthorized': false,
    'headers': {
      'Authorization': 'Basic ' + new Buffer('sam:test123', 'utf8').toString('base64')
    }
  }
  apiTestCount += 1
  const agentOptions = Object.assign({}, defaultOptions, serverOptions)
  serverOptions.agent = new https.Agent(agentOptions)
  serverOptions.port = 3000

  const req = https.request(agentOptions, (response) => {
    
    response.on('data', (body) => {
      console.info(title)
      testCallback(response.statusCode, response.headers, JSON.parse(body.toString()))
      apiTestCount -= 1
      if(apiTestCount < 1){
        server.stop()
      }
    })
  }).on('error', (e) => {
    apiTestCount -= 1
    if (apiTestCount < 1) {
      server.stop()
    }
    console.info(title)
    console.error('FAILED')
    console.error(e)
  })

  if(serverOptions.body) {
    const content = JSON.stringify(serverOptions.body)
    req.write(content)
  }

  req.end()
}

console.info('Running Tests...')

testAPI(
  'should return 401 if user is not recognized for a restricted action',
  {
    path: '/books.json',
    method: 'POST',
    body: {
      title: 'First Book',
      author: 'First Author',
      created_by: 1
    },
    headers: {
      Authorization: 'Basic ' + new Buffer('unknown:unknown', 'utf8').toString('base64')
    }
  },
  (statusCode, headers, body) => {
    console.assert(statusCode === 401)
    console.assert(body.error === 'not authorized')
  }
)

testAPI(
  'should return OK if no user is given for an unrestricted action',
  {
    path: '/books.json',
    method: 'GET',
    headers: {
    }
  },
  (statusCode, headers, body) => {
    console.assert(statusCode === 200)
    console.assert(body[0].title == 'First Book')
  }
)


testAPI(
  'Books POST should create a book',
  {
    path: '/books.json',
    method: 'POST',
    body: {
      title: 'First Book',
      author: 'First Author',
      created_by: 1
    }
  },
  (statusCode, headers, body) => {
    console.assert(statusCode === 201)
    console.assert(body.id)
    console.assert(body.title === 'First Book')
    console.assert(body.author === 'First Author')
  }
)

testAPI(
  'Books GET should list all books',
  {
    path: '/books.json',
    method: 'GET'
  },
  (statusCode, headers, body) => {
    console.assert(Array.isArray(body))
    console.assert(body.length >= 1)
  }
)

testAPI(
  'Books GET with id should give the correct book',
  {
    path: '/books/1.json',
    method: 'GET'
  },
  (statusCode, headers, body) => {
    console.assert(statusCode === 200)
    console.assert(body.id === 1)
  }
)

testAPI(
  'Books PATCH should update a book',
  {
    path: '/books/1.json',
    method: 'PATCH',
    body: {
      title: 'new_title'
    }
  },
  (statusCode, headers, body) => {
    console.assert(statusCode === 200)
    console.assert(body.id === 1)
    console.assert(body.title === 'new_title')
    // TODO: verify change in another call, using curl
  }
)
testAPI(
  'Books DELETE should delete a book',
  {
    path: '/books/1.json',
    method: 'DELETE'
  },
  (statusCode, headers, body) => {
    console.assert(statusCode === 200)
    console.assert(body.id === 1)
    // TODO: verify the item doesn't exist
  }
)
