const JSONDataModel = require('./JSONDataModel')

let UserData = [
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
  constructor(userData){
    super()
    Object.assign(this, userData)
  }

  static find_by_login(login){
    const user_data = UserData.find(user => {
      return user.login === login
    })
    return new User(user_data)
  }
  
  has_password(pwd){
    return this.password === pwd 
  }
}

module.exports = User