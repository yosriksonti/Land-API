const {makeAdmin} = require('../admin/index.js')/**
 * Makes a Login Admin UC
 * @requires adminService -Admin Service
 * @param {function} adminsDb -Admins Data-access
 * @exports makeLoginAdmin 
 * @returns {function}  - Login Community UC
 */
module.exports =  function makeLoginAdmin ({ adminsDb }) {
  return async function loginAdmin (...adminInfo) {
      const info = {action: "postLogin"}
    Object.assign(info,adminInfo[0].adminInfo)
    const admin = makeAdmin(info)
      return adminsDb.login({
        mail: admin.getMail(),
        password: admin.getPassword()
      })
    // }

    // const moderated = await handleModeration({ admin })
    
  }
}
