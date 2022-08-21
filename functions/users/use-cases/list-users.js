/**
 * Makes a Get User UC
 * @param {function} usersDb -Users Data-access
 * @exports makeListUsers 
 * @returns {function}  - Get Community UC
 */
module.exports =  function makeListUsers ({ usersDb }) {
    return async function listUsers () {
      const user = await usersDb.findAll({
           
      })
      return user;
    }
  }
  