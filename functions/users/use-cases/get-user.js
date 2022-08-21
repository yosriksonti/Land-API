/**
 * Makes a Get User UC
 * @param {function} usersDb -Users Data-access
 * @exports makeGetUser 
 * @returns {function}  - Get Community UC
 */
module.exports =  function makeGetUser ({ usersDb }) {
    return async function getUser ({Id} = {}) {
      const user = await usersDb.findById({
          Id 
      })
      return user;
    }
  }
  