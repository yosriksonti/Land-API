const { makeUser } = require ('../user/index.js')
/**
 * Makes a Update User UC
 * @requires userService -User Service
 * @param {function} usersDb -Users Data-access
 * @exports makeUpdateUser 
 * @returns {function}  - Update User UC
 */
module.exports =  function makeUpdateUser ({ usersDb }) {
  return async function updateUser (...userInfo) {
    const info = {action: "putUser"}
    Object.assign(info,userInfo[0].userInfo)
    const user = makeUser(info)
    // const moderated = await handleModeration({ user })
    return usersDb.update({
      id: user.getId(),
      name: user.getName(),
      surname: user.getSurname(),
      modifiedOn: user.getModifiedOn(),
      image: user.getImage(),
      token: user.getToken()
    })
  }
}
