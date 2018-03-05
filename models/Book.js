'use strict'
const querystring = require('querystring')
const JSONDataModel = require('./JSONDataModel')
//const JSON = require('json')

const BookData = [
  {
    id: 1,
    title: '',
    author: '',
    created_by_id: 1
  }
]

class Book extends JSONDataModel {
  constructor(data){
    super(BookData)
    Object.assign(this, data)
  }

  static find_by_id(id) {
    return BookData.find(item => {
      return item.id === id
    })
  }

  create(data) {
    const new_data = data
    new_data.id = (BookData[BookData.length - 1].id || 0)+ 1
    BookData.push(data)
    return this.render(data)
  }

  render(obj) {
    return JSON.stringify(obj)
  }

  read(one, two, idString){
    const id = Number.parseInt(idString)
    if(id){
      return this.render(Book.find_by_id(id))
    } else {
      return this.render(BookData)
    }
  }
}

module.exports = Book