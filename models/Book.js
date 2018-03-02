'use strict';
const DataModel = require('./JSONDataModel')

const BookData = [
  {
   id: 1,
   title: '',
   author: '' 
  },{},{}
]

class Book extends DataModel {
  constructor(){
    super()
  }
}

module.exports = Book;