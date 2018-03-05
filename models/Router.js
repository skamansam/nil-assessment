'use strict'

const Book = require('./Book')
const Auth = require('./Auth')
//const User = require('./User') // for accessing User resources
const URL = require('url')

/**
 * This is simple middleware for our application. It can determine what classes
 * need to be used to handle which route the user wants. Basic usage is:
 * 
 *  `new Router(request, response, sentData).render()`
 * 
 * This will give back some JSON string that represents the value of the returned data.
 * The status code for the request is automatically set according to which action
 * the request is trying to do, OR by the responding object's `statusCode` field.
 */
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

  /**
   * this is the only public interface method for this class. It returns a JSON string
   * that represents the output of the responding object's action.
   */
  render(){
    this._parseUrl()
    const actionMethod = this._determineActionMethod()
    const objectClass = this._determineObjectClass()
    const user = Auth.authorize(this.authInfo, this.objectClassName, actionMethod)
    if(!user){
      this.response.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"')
      this.response.statusCode = 401
      this.response.statusMessage = 'user not authorized'
      return JSON.stringify({error: 'not authorized'})
    }
    try {
      const respondingObject = (new objectClass)
      const renderedResponse = respondingObject[actionMethod](this.content, this.params, this.extraPathInfo) 
      this.response.statusCode = respondingObject.statusCode || this.successCode
      return renderedResponse
    } catch (e) {
      if(this.errorCode){
        this.response.statusCode = this.errorCode
      }
      console.error(e.stack || e) // eslint-disable-no-console
      return JSON.stringify({error: e.toString()})
    }
  }

  /**
   * Determine the method to call on the responding object. Values are
   * determined by the given verb. Verbs should be PUT, GET, POST, etc.
   * 
   * @param {String} verb the http verb 
   * @returns {String} the action to call on the responding object 
   */
  _determineActionMethod(verb = this.verb){
    switch (verb) {
    case 'GET':
      this.successCode = 200
      return 'read'
    case 'POST':
      this.successCode = 201
      return 'create'
    case 'PUT':
      this.successCode = 201
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

  /**
   * Parses the given URL and sets data accordingly.
   * @param {String} path
   */
  _parseUrl(path = this.path){
    const url = URL.parse(path, true)
    this.params = url.query
    this.extension = path.match(/\.\w+$/)[0]
    const pathWithoutExtension = path.replace(/\.\w+$/, '')
    // TODO: use this black to determine what format the sent data is in. assume sent data format is the same as expected receipt data
    if(this.content && (this.extension === '.js' || this.extension === '.json')){
      this.content = JSON.parse(this.content)
    }
    [, this.objectClassName, ...this.extraPathInfo] = pathWithoutExtension.split('/')
  }

  /**
   * determine the responding object's class.
   * @return {Function} class of object 
   * 
   */
  _determineObjectClass(){
    switch (this.objectClassName) {
    case 'books':
      return Book
    //case 'users': //TODO: user management!
    //  return User
    default:
      this.errorCode = 404
      throw new Error('Object Not Found')
    }
  }
}

module.exports = Router