'use strict';
const querystring = require('querystring')
const JSONDataModel = require('./JSONDataModel')

const BookData = [
  {
   id: 1,
   title: '',
   author: '' 
  },{},{}
]

class Book extends JSONDataModel {
  constructor(){
    super()
    this.data = BookData
  }
  render(){
    return querystring.stringify({error: 'not implemented'})
  }
}

module.exports = Book;