const User = require('./User');

const Roles = {
  'admin': {
    'book': ['create', 'read', 'update', 'createOrUpdate', 'destroy'],
    'user':  ['create', 'read', 'update', 'createOrUpdate', 'destroy']
  },
  'author':{
    'book': ['create','read'],
    'user': ['read']
  },
  'guest': {
    'book': ['read'],
    'user': ['read']
  }
}

class Auth {
  constructor(authInfo, object, action){
    var [ authInfo, object, action ] = [authInfo, object, action]
  }

  static authorize(authInfo, object, action){
    const auth = new Auth(authInfo, object, action)
    auth.parseAuthInfo()
    return auth.is_authentic() && auth.is_authorized()
  }

  is_authorized(){
    this.parseAuthInfo()
    return this.is_authentic() && this.is_authorized()
  }

  is_authentic(user_data){
    const user = User.find_by_id(user_data.id)
    if (user){
      return user.has_password(user_data.password)
    }
  }
}

module.exports = Auth