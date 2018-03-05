const User = require('./User')
const Buffer = require('buffer').Buffer
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
    this.login = null
    this.password = null
    this.user = null
  }

/**
 * Authorize and authenticate user for actions on an object.
 * If a user attempts to authenticate as an unknown user, a guest user is used. 
 * Question: Should we disallow authentication instead?
 * 
 * @param {String} authInfo the info we want use to auth. onyl Basic auth string supported 
 * @param {String} object 
 * @param {String} action 
 */
  static authorize(authInfo, object, action){
    const auth = new Auth(authInfo, object, action)
    auth.parseAuthInfo()
    if(auth.is_authentic() && auth.is_authorized()){
      return auth.user
    }
  }

  parseAuthInfo(){
    if(this.authInfo){
      const authCode = this.authInfo.split(/\s+/)[1]
      const authDecode = new Buffer(authCode, 'base64').toString()
      const creds = authDecode.split(':')
      this.login = creds[0]
      this.password = creds[1]
      this.user = User.find_by_login(this.login)
    }
    if(!this.user){
      this.login = 'guest'
      this.password = ''
      this.user = User.find_by_login('guest')
    } 
    console.info(`authenticated as ${this.user.name}`)
  }

  is_authorized(){
    const validActions = Roles[this.user.role][this.object]
    const validatedAction = validActions.find(action => {
      return action === this.action
    })
    console.info(`${this.user.name} ${validatedAction ? 'is' : 'is not'} authorized to ${this.action} ${this.object}`)
    return validatedAction
  }

  is_authentic(){
    if (this.user){
      return this.user.has_password(this.password)
    }
    return false
  }
}

module.exports = Auth