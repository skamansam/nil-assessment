const https = require('https');
const querystring = require('querystring')

// start the server for testing
const ServerClass = require('./models/Server');
const server = new ServerClass(3000)
server.start()

// we need to keep track of the times response has returned so we can 
// stop the server at the end of the tests
let apiTestCount = 0;

/**
 *  a simple https API test runner. include a body field to the serverOptions
 *  argument to send data. We have sensible defaults for the server options,
 * so you should just pass the `path`, `method`, and `body` properties for them.
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
  };
  apiTestCount += 1
  const agentOptions = Object.assign({}, defaultOptions, serverOptions)
  serverOptions.agent = new https.Agent(agentOptions);
  serverOptions.port = 3000

  const req = https.request(agentOptions, (response) => {
    
    response.on('data', (body) => {
      console.info(title)
      testCallback(response.statusCode, response.headers, body)
      process.stdout.write(body);
      apiTestCount -= 1
      if(apiTestCount < 1){
        server.stop()
      }
    });
  }).on('error', (e) => {
    console.error('FAILED');
    console.error(e);
  });

  if(serverOptions.body) {
    const content = querystring.stringify(serverOptions.body)
    req.write(content)
  }

  req.end();
}

console.info('Running Tests...')

testAPI(
  'Books POST should create a book',
  {
    path: '/books',
    method: 'POST',
    body: {msg: 'hello'}
  },
  (headers, body) => {
    console.log(body)
  }
)

testAPI(
  'Books GET should list all books',
  {
    path: '/books',
    method: 'GET',
    body: 'help!'
  },
  (headers, body) => {

  }
)


testAPI(
  'Books PATCH should update a book',
  {
    path: '/books',
    method: 'PATCH'
  },
  (headers, body) => {

  }
)
testAPI(
  'Books DELETE should create a book',
  {
    path: '/books',
    method: 'DELETE'
  },
  (headers, body) => {

  }
)
