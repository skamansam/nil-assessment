'use strict';

const Book = require('./Book')

class Router {
  constructor(request, response, content){
    this.path = request.url
    this.action = request.method
    this.content = content
  }

  render(){
    try {
      return this.determineObjectClass().call(action, params)
    } catch (e) {
      console.error(e)
      return e
    }
  }

  determineActionMethod(action){

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