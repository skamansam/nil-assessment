'use strict';

class JSONDataModel {
  static all(){
    return this._data();
  }

  static data(){
    return {}
  }
  
  static find_by_id(id){
    this._data().find( item => {
      return item.id === id
    })
  }

  render(){
    return querystring.stringify({error: 'not implemented'})
  }

}

module.exports = JSONDataModel;