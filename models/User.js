const JSONDataModel = require('./JSONDataModel')

const USER_DATA = [
  {
    name: "Sammy T",
    roles: ['admin'],
    password: 'test123',
    login: 'sam'
  },
  {
    name: "Sarah",
    roles: [''],
    password: 'test987',
    login: 'sarah'
  }
]

class User extends JSONDataModel {
  constructor(props){
    var {id, name, password} = props
  }
}

module.exports = User