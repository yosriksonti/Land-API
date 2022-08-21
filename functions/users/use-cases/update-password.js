const { makeUser } = require ('../user/index.js')
/**
 * Makes a Update Password UC
 * @requires userService -User Service
 * @param {function} usersDb -Users Data-access
 * @exports makeUpdatePassword 
 * @returns {function}  - Update Password UC
 */
module.exports =  function makeUpdatePassword ({ usersDb }) {
  return async function updatePassword (...userInfo) {
    const info = {action: "putPassword"}
    Object.assign(info,userInfo[0].userInfo)
    const user = makeUser(info)
    // const moderated = await handleModeration({ user })
    return usersDb.updatePassword({
      id: user.getId(),
      email: user.getEmail(),
      password: user.getPassword(),
      newPassword: user.getNewPassword(),
      token: user.getToken()
    })
  }
}
