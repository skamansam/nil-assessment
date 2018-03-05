const JSONDataModel = require('./JSONDataModel')

const UserData = [
  {
    id: 0,
    name: 'Guest User',
    role: 'guest',
    password: '',
    login: 'guest'
  },
  {
    id: 1,
    name: 'Sammy T',
    role: 'admin',
    password: 'test123',
    login: 'sam'
  },
  {
    id: 2,
    name: 'Sarah',
    role: 'author',
    password: 'test987',
    login: 'sarah'
  }
]

class User extends JSONDataModel {
  constructor(user_data){
    super()
    Object.assign(this, user_data)
    // this.id = user_data.id
    // this.login = user_data.login
    // this.name = user_data.name
    // this.role = user_data.role
  }

  static _data(){
    return UserData
  }

  static find_by_login(login){
    const user_data = this._data().find(user => {
      return user.login === login
    })
    return new User(user_data)
  }
  
  has_password(pwd){
    return this.password === pwd 
  }
}

module.exports = User