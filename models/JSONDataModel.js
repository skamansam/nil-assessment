'use strict';

class JSONDataModel {
  constructor(){
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

  render(){
    return querystring.stringify({error: 'not implemented'})
  }

}

module.exports = JSONDataModel;