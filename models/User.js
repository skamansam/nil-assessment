
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

class User {
  constructor(userData){
    Object.assign(this, userData)
  }

  static find_by_login(login){
    const user = UserData.find(user => {
      return user.login === login
    })
    return new User(user)
  }
  
  has_password(pwd){
    return this.password === pwd 
  }
}

module.exports = User