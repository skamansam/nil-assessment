'use strict'

let BookData = [
  {
    id: 1,
    title: 'First Book',
    author: 'First Author'
  }
]

/**
 * Holds data for author and title for a collection of books. Uses an array for storage, so it will reset each time the 
 * app is restarted. There was a base class, kind of like an ORM in an earlier iteration of this assignemtn, but 
 * it has been removed. You can look through the commit history for removal.
 */
class Book {
  constructor(data){
    Object.assign(this, data)
  }

  static find_by_id(id) {
    return BookData.find(item => {
      return item.id === id
    })
  }

  create(data, params, extraPath) {
    const newData = data
    newData.id = BookData.length < 1 ? 0 : BookData[BookData.length - 1 ].id
    BookData.push(data)
    this.statusCode = 201
    return this.render(data)
  }

  render(obj) {
    return JSON.stringify(obj)
  }

  read(content, params, extraPath){
    const id = Number.parseInt(extraPath)
    if(id){
      const curObject = this.constructor.find_by_id(id)
      if (!curObject) {
        this.statusCode = 404
        return this.render({ error: 'Book Not Found' })
      }
      return this.render(Book.find_by_id(id))
    } else {
      return this.render(BookData)
    }
  }

  createOrUpdate(content, params, extraPath) {
    const id = Number.parseInt(extraPath) || content.id
    if (id) {
      return this.update(content, params, extraPath)
    } else {
      this.statusCode = 201
      return this.create(content, params, extraPath)
    }
  }

  destroy(content, params, extraPath) {
    const id = Number.parseInt(extraPath) || content.id
    let deletedData;
    BookData = BookData.filter(bd => {
      if(bd.id == id){
        deletedData = bd
        return false
      } else {
        return true
      }
    })
    if(!deletedData){
      this.statusCode = 404
      return this.render({ error: 'Book Not Found' })
    }
    return this.render(deletedData)
  }

  update(content, params, extraPath){
    const id = Number.parseInt(extraPath) || content.id
    const curObject = this.constructor.find_by_id(id)
    if (!curObject) {
      this.statusCode = 404
      return this.render({ error: 'Book Not Found' })
    } else {
      const newData = Object.assign({}, curObject, content)
      this.destroy(content, params, extraPath)
      BookData.push(newData)
      return this.render(newData)
    }
  }
}

module.exports = Book