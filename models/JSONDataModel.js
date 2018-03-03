'use strict'
const querystring = require('querystring')

class JSONDataModel {
  constructor(){
    this.dynamicData = []
  }

  static all(){
    return this._data()
  }

  static _data(){
    return this.dynamicData + []
  }
  
  static find_by_id(id){
    this._data().find( item => {
      return item.id === id
    })
  }

  create(data){
    data.id = this._data()[-1].id
    this.dynamicData.push(data)
  }

  createOrUpdate(objData){
    const oldObject = this.find_by_id(objData.id)
    if(oldObject){
      oldObject.update(objData)
    } else {
      this.create(objData)
    }
    this.dynamicData.push(objData)

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

  render(){
    return querystring.stringify({error: 'not implemented'})
  }

}

module.exports = JSONDataModel