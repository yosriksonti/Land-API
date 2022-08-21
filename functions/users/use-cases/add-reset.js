const { makeUser } = require ('../user/index.js')
/**
 * Makes a Add Reset UC
 * @requires userService -Reset Service
 * @param {function} usersDb -Users Data-access
 * @exports makeAddReset 
 * @returns {function}  - Add Reset UC
 */
module.exports =  function makeAddReset ({ usersDb }) {
  return async function addReset (...userInfo) {
    const info = {action: "postReset"}
    Object.assign(info,userInfo[0].userInfo)
    const user = makeUser(info)
    // const moderated = await handleModeration({ user })
    return usersDb.reset({
      email: user.getEmail()
    })
  }
}
