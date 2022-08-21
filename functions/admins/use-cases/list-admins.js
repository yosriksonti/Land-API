/**
 * Makes a Get Admin UC
 * @param {function} adminsDb -Admins Data-access
 * @exports makeListAdmins 
 * @returns {function}  - Get Community UC
 */
module.exports =  function makeListAdmins ({ adminsDb }) {
    return async function listAdmins () {
      const admin = await adminsDb.findAll({
           
      })
      return admin;
    }
  }
  