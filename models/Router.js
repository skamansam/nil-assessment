'use strict'
const querystring = require('querystring')
const Book = require('./Book')
const Auth = require('./Auth')
const User = require('./User')
const URL = require('url')

class Router {
  constructor(request, response, content){
    this.response = response
    this.request = request
    this.path = request.url
    this.verb = request.method
    this.content = content
    this.authInfo = request.headers['authorization']
    this.params = null
  }

  render(){
    this.parseUrl()
    const actionMethod = this.determineActionMethod()
    const objectClass = this.determineObjectClass()
    const user = Auth.authorize(this.authInfo, this.objectClassName, actionMethod)
    if(!user){
      this.response.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"')
      this.response.statusCode = 401
      this.response.statusMessage = 'user not authorized'
      return JSON.stringify({error: 'not authorized'})
    }
    try {
      this.response.statusCode = this.successCode
      return (new objectClass)[actionMethod](this.content, this.params, this.extraPathInfo)
    } catch (e) {
      if(this.errorCode){
        this.response.statusCode = this.errorCode
      }
      console.error(e.stack || e) // eslint-disable-no-console
      return JSON.stringify({error: e.toString()})
    }
  }

  determineActionMethod(verb = this.verb){
    switch (verb) {
    case 'GET':
      this.successCode = 200
      return 'read'
    case 'POST':
      this.successCode = 201
      return 'create'
    case 'PUT':
      return 'createOrUpdate'
    case 'PATCH':
      this.successCode = 200
      return 'update'
    case 'DELETE':
      this.successCode = 200
      return 'destroy'
    default:
      this.errorCode = 405
      throw new Error('method not implemented')
    }
  }

  parseUrl(path = this.path){
    const url = URL.parse(path, true)
    this.params = url.query
    this.extension = path.match(/\.\w+$/)[0]
    const pathWithoutExtension = path.replace(/\.\w+$/, '')
    if(this.content && (this.extension === '.js' || this.extension === '.json')){
      this.content = JSON.parse(this.content)
    }
    [, this.objectClassName, ...this.extraPathInfo] = pathWithoutExtension.split('/')
  }

  determineObjectClass(){
    switch (this.objectClassName) {
    case 'books':
      return Book
    case 'users':
      return User
    default:
      this.errorCode = 404
      throw new Error('Object Not Found')
    }
  }
}

module.exports = Router