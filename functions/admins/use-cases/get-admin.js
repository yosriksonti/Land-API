/**
 * Makes a Get Admin UC
 * @param {function} adminsDb -Admins Data-access
 * @exports makeGetAdmin 
 * @returns {function}  - Get Community UC
 */
module.exports =  function makeGetAdmin ({ adminsDb }) {
    return async function getAdmin ({Id} = {}) {
      const admin = await adminsDb.findById({
          Id 
      })
      return admin;
    }
  }
  