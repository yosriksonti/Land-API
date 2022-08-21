const { makeUser } = require ('../user/index.js')
/**
 * Makes a Login User UC
 * @requires userService -User Service
 * @param {function} usersDb -Users Data-access
 * @exports makeLoginUser 
 * @returns {function}  - Login Community UC
 */
module.exports =  function makeLoginUser ({ usersDb }) {
  return async function loginUser (...userInfo) {
      const info = {action: "postLogin"}
    Object.assign(info,userInfo[0].userInfo)
    const user = makeUser(info)
      return usersDb.login({
        email: user.getEmail(),
        password: user.getPassword()
      })
    // }

    // const moderated = await handleModeration({ user })
    
  }
}
