const User = require('./User')
const Buffer = require('buffer').Buffer

/**
 * These are the roles we have for all users. The format is such:
 * 
 * {
 *   <Role Name>: {
 *     <Object Name (path)>: [<Allowed Action (object's method name)>, ...],
 *     ...
 *   }
 * }
 */
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

/**
 * Handle authorization of actions and authentication of users. To change these, 
 * modify the Roles object above.
 */
class Auth {

  /**
   * Build a new Auth object. Data is usually obtained from HTTP request

   * @param {String} authInfo basic http auth header, in the format: "Basic <base64encoded 'username:password'>" 
   * @param {String} object the name of the object we are trying to access. First dir in path. 
   * @param {String} action the name of the action we are trying to perfrom.
   */
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
 * @param {String} object the name of the object class the user is requesting
 * @param {String} action the action the user is trying to perform
 */
  static authorize(authInfo, object, action){
    const auth = new Auth(authInfo, object, action)
    auth._parseAuthInfo()
    if(auth.is_authentic() && auth.is_authorized()){
      return auth.user
    }
  }

  /**
   * extracts user information from a Basic request Auth header
   * must be in the form: "Basic <base64encoded 'username:password'>"
   */
  _parseAuthInfo(){
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
    // TODO: maintain log of user and actions
    // console.info(`authenticated as ${this.user.name}`)
  }

  /**
   * determine whether a user is authorized for the requested action
   */
  is_authorized(){
    const validActions = Roles[this.user.role][this.object]
    const validatedAction = validActions.find(action => {
      return action === this.action
    })
    // TODO: maintain log of user and actions
    // console.info(`${this.user.name} ${validatedAction ? 'is' : 'is not'} authorized to ${this.action} ${this.object}`)
    return validatedAction
  }

/**
 * ensure user is who they say they are. (verify password)
 */
  is_authentic(){
    if (this.user){
      return this.user.has_password(this.password)
    }
    return false
  }
}

module.exports = Auth