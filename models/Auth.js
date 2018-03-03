const User = require('./User');

const Roles = {
  'admin': {
    'books': ['create', 'read', 'update', 'createOrUpdate', 'destroy'],
    'users':  ['create', 'read', 'update', 'createOrUpdate', 'destroy']
  },
  'author':{
    'books': ['create','read'],
    'users': ['read']
  },
  'guest': {
    'books': ['read'],
    'users': ['read']
  }
}

class Auth {
  constructor(authInfo, object, action){
    [this.authInfo, this.object, this.action ] = [authInfo, object, action]
    this.login = null;
    this.password = null;
    this.user = null;
  }

  static authorize(authInfo, object, action){
    const auth = new Auth(authInfo, object, action)
    auth.parseAuthInfo()
    return auth.is_authentic() && auth.is_authorized()
  }

  parseAuthInfo(){
    const authCode = this.authInfo.split(' ')[1]
    const authDecode = new Buffer(authCode, 'base64').toString()
    const creds = authDecode.split(':')
    this.login = creds[0]
    this.password = creds[1]
    this.user = User.find_by_login(creds[0])
  }

  is_authorized(){
    const validActions = Roles[this.user.role][this.object]
    return validActions.find(action => {
      return action === this.action
    })
  }

  is_authentic(user_data){
    if (this.user){
      return this.user.has_password(this.password)
    }
    return false
  }
}

module.exports = Auth