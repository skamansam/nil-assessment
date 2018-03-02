users = require('./User')

export default class Auth {
  constructor(){}

  static is_authorized(user, permission){
    return user.can(permission)
  }

  static is_authentic(user_data){
    const user = User.find_by_id(user_data.id)
    if (user)
      return user.has_password(user_data.password)
  }
}