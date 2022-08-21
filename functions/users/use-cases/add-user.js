const { makeUser } = require ('../user/index.js')
/**
 * Makes a Add User UC
 * @requires userService -User Service
 * @param {function} usersDb -Users Data-access
 * @param {function} addNotification -Add Notification UC
 * @exports makeAddUser 
 * @returns {function}  - Add User UC
 */
module.exports =  function makeAddUser ({ usersDb }) {
  return async function addUser (info) {
    const uInfo = {action: "postUser"}
    Object.assign(uInfo,info.user)
    const user = makeUser(uInfo)
    return usersDb.insert({
      name: user.getName(),
      surname: user.getSurname(),
      createdOn: user.getCreatedOn(),
      modifiedOn: user.getModifiedOn(),
      email: user.getEmail(),
      image: user.getImage(),
      password: user.getPassword(),
      phoneNumber: user.getPhoneNumber(),
      role: user.getRole(),
      active: user.getActive(),
      type: user.getType(),
    }).then((resp) => {
      return resp
    }).catch((error) => {
      throw new Error(error)
    })
  }
}
