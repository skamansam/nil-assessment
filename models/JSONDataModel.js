'use strict'
const querystring = require('querystring')

class JSONDataModel { 
  constructor(seedData){
    this.data = seedData
  }

  static all(){
    return this._data()
  }
  
  static find_by_id(id){
    this._data().find( item => {
      return item.id === id
    })
  }

  create(user, data, params, pathInfo){
    const new_data = data
    new_data.id = this._data()[-1].id + 1
    this.data.push(data)
    return this.render(data)
  }

  createOrUpdate(objData){
    const oldObject = this.find_by_id(objData.id)
    if(oldObject){
      oldObject.update(objData)
    } else {
      this.create(objData)
    }
    this.data.push(objData)

    // throw new Error('cannot create or update data for JSONDataModel')
  }
  
  destroy(){
    //throw new Error('cannot destroy data for JSONDataModel')
  }
  
  update(){

    throw new Error('cannot update data for JSONDataModel')
  }

  /** 
   * this is really here
  */
  read(){
    return this.render()
  }

  render(obj){
    return JSON.stringify(obj)
  }

}

module.exports = JSONDataModel