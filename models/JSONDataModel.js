'use strict';

class JSONDataModel {
  constructor(props){
    this.data = {}
  }

  static all(){
    return this.data;
  }
  
  static find_by_id(id){
    this.data.find( item => {
      return item.id === id
    })
  }
}

module.exports = JSONDataModel;