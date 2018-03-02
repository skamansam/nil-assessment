'use strict';

const Book = require('./Book')
const Auth = require('./Auth')

class Router {
  constructor(request, response, content){
    this.path = request.url
    this.verb = request.method
    this.content = content
    this.authInfo = request.headers['authorization']
  }

  render(){
    this.parseUrl()
    const actionMethod = this.determineActionMethod()
    const objectClass = this.determineObjectClass()
    if(!Auth.is_authorized(this.authInfo, this.objectClassName, actionMethod)){
      response.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"')
      this.response.statusCode = 401
      this.response.statusMessage = 'user not authorized'
      return 'not authorized'
    }
    try {
      return this.determineObjectClass().call(determineActionMethod(), this.params, this.extraPathInfo)
    } catch (e) {
      console.error(e)
      return e
    }
  }

  determineActionMethod(verb = this.verb){
    switch (verb) {
      case 'GET':
        return 'read'
      case 'POST':
        return 'create'
      case 'PUT':
        return 'createOrUpdate'
      case 'PATCH':
        return 'update'
      case 'DELETE':
        return 'destroy'
      default:
        throw "method not"
        break;
    }
  }

  parseUrl(path = this.path){
    [,this.objectClassName, ...this.extraPathInfo] = path.split('/')
  }

  determineObjectClass(){
    switch (this.objectClassName) {
      case 'books':
        return Book
      case 'users':
        return User
      default:
        throw "Object Not Found"
        break;
    }
  }
}

module.exports = Router;